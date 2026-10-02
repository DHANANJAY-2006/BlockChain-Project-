import { NextResponse } from 'next/server';

// Reddit JSON API – no API key needed, no CORS, always free
// Fetches real posts about deepfakes from Reddit's public search
interface RedditChild {
  data: {
    title: string;
    url: string;
    permalink: string;
    created_utc: number;
    subreddit: string;
    selftext: string;
    score: number;
    is_self: boolean;
  };
}

interface RedditResponse {
  data: { children: RedditChild[] };
}

export async function GET() {
  try {
    // Two searches: one on Reddit search, one on a specific subreddit
    const [searchRes, mediaRes] = await Promise.allSettled([
      fetch(
        'https://www.reddit.com/search.json?q=deepfake+AI+fake+video+detected&sort=new&limit=12&t=month',
        {
          headers: { 'User-Agent': 'ChainProof/1.0 deepfake-news-bot' },
          next: { revalidate: 300 }, // Vercel caches this 5 minutes
        }
      ),
      fetch(
        'https://www.reddit.com/r/MediaSynthesis/new.json?limit=8',
        {
          headers: { 'User-Agent': 'ChainProof/1.0 deepfake-news-bot' },
          next: { revalidate: 300 },
        }
      ),
    ]);

    const items: Array<{
      title: string;
      link: string;
      pubDate: string;
      description: string;
      source: string;
    }> = [];

    const processReddit = (data: RedditResponse) => {
      for (const child of data.data.children) {
        const p = child.data;
        if (p.score < 0) continue; // skip downvoted
        items.push({
          title: p.title,
          link: `https://www.reddit.com${p.permalink}`,
          pubDate: new Date(p.created_utc * 1000).toISOString(),
          description: p.selftext
            ? p.selftext.slice(0, 160) + '...'
            : `Posted in r/${p.subreddit}`,
          source: `reddit.com/r/${p.subreddit}`,
        });
      }
    };

    if (searchRes.status === 'fulfilled' && searchRes.value.ok) {
      const d: RedditResponse = await searchRes.value.json();
      processReddit(d);
    }
    if (mediaRes.status === 'fulfilled' && mediaRes.value.ok) {
      const d: RedditResponse = await mediaRes.value.json();
      processReddit(d);
    }

    // Deduplicate by title, limit to 15
    const seen = new Set<string>();
    const unique = items.filter(it => {
      if (seen.has(it.title)) return false;
      seen.add(it.title);
      return true;
    }).slice(0, 15);

    if (unique.length === 0) {
      return NextResponse.json({ status: 'error', items: [] }, { status: 502 });
    }

    return NextResponse.json(
      { status: 'ok', items: unique },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } }
    );
  } catch (err) {
    console.error('[/api/news] fetch error:', err);
    return NextResponse.json({ status: 'error', items: [] }, { status: 500 });
  }
}
