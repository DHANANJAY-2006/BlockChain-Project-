import { NextResponse } from 'next/server';

// ── Hacker News Algolia Search API ──────────────────────────────────────────
// Completely FREE. No API key. No signup. No rate limits for normal usage.
// Docs: https://hn.algolia.com/api
// Returns real stories that people have submitted to Hacker News about deepfakes.

interface HNHit {
  title: string;
  url: string | null;
  created_at: string;
  author: string;
  points: number;
  objectID: string;
}

interface HNResponse {
  hits: HNHit[];
}

// Real verified incidents — used as final fallback if HN API also fails
const VERIFIED_INCIDENTS = [
  {
    title: 'Hong Kong firm loses $25 million in deepfake video call scam',
    link: 'https://www.theguardian.com/technology/2024/feb/04/hong-kong-deepfake-scam-25-million-dollar-fraud',
    pubDate: '2024-02-04T00:00:00Z',
    description: 'A finance worker was tricked into paying $25.6M after scammers used deepfake technology to impersonate the CFO in a video conference call with fake colleagues.',
    source: 'The Guardian',
  },
  {
    title: 'Taylor Swift explicit AI-generated deepfake images spread across social media',
    link: 'https://www.bbc.com/news/technology-68186290',
    pubDate: '2024-01-26T00:00:00Z',
    description: 'AI-generated explicit images of Taylor Swift went viral, sparking global debate about deepfake legislation and platform responsibility.',
    source: 'BBC News',
  },
  {
    title: 'Fake Biden robocall tells New Hampshire voters not to vote in primary',
    link: 'https://www.theguardian.com/us-news/2024/jan/22/fake-biden-robocall-new-hampshire',
    pubDate: '2024-01-22T00:00:00Z',
    description: 'An AI-generated fake audio of President Biden discouraged Democratic voters, raising alarms about election interference via deepfakes.',
    source: 'The Guardian',
  },
  {
    title: 'MrBeast deepfake scam promotes fake iPhone giveaway on TikTok',
    link: 'https://www.bbc.com/news/technology-67116876',
    pubDate: '2023-10-04T00:00:00Z',
    description: 'A deepfake video of YouTuber MrBeast circulated on TikTok, falsely claiming iPhones were being given away for $2, duping thousands of viewers.',
    source: 'BBC News',
  },
  {
    title: 'Zelensky deepfake video urges Ukrainian soldiers to surrender',
    link: 'https://www.reuters.com/world/europe/deepfake-video-zelenskiy-surrendering-circulates-social-media-meta-says-2022-03-16/',
    pubDate: '2022-03-16T00:00:00Z',
    description: 'A deepfake video of President Zelensky calling on soldiers to lay down arms circulated widely on social media during the Russia-Ukraine conflict.',
    source: 'Reuters',
  },
  {
    title: 'Indian election 2024: Politicians use AI deepfakes to target voters',
    link: 'https://www.bbc.com/news/world-asia-india-68385748',
    pubDate: '2024-03-15T00:00:00Z',
    description: 'During India\'s 2024 general election, political parties used deepfake videos of deceased leaders and opposition figures to influence voters.',
    source: 'BBC News',
  },
  {
    title: 'South Korea deepfake crisis: AI explicit images flood Telegram groups',
    link: 'https://www.theguardian.com/world/2024/aug/28/south-korea-deepfake-sexual-images-crisis',
    pubDate: '2024-08-28T00:00:00Z',
    description: 'A deepfake crisis erupted in South Korea with AI-generated explicit images of celebrities and ordinary women, prompting emergency legislation.',
    source: 'The Guardian',
  },
  {
    title: 'UK CEO voice cloned by AI — company loses £200,000 in fraud',
    link: 'https://www.wsj.com/articles/fraudsters-use-ai-to-mimic-ceos-voice-in-unusual-cybercrime-case-11567157402',
    pubDate: '2019-08-30T00:00:00Z',
    description: 'Fraudsters used AI voice cloning to impersonate a German CEO and convinced an employee to urgently wire £200,000 to a fraudulent account.',
    source: 'Wall Street Journal',
  },
  {
    title: 'Baltimore principal targeted by AI deepfake racist audio recording',
    link: 'https://www.npr.org/2024/04/27/1247719691/baltimore-school-principal-deepfake-ai-voice',
    pubDate: '2024-04-27T00:00:00Z',
    description: 'A staff member created a deepfake audio falsely depicting the school principal making racist remarks, spreading it to parents and students.',
    source: 'NPR',
  },
  {
    title: 'Pentagon AI-generated explosion photo causes stock market panic',
    link: 'https://www.bbc.com/news/world-us-canada-65639406',
    pubDate: '2023-05-22T00:00:00Z',
    description: 'An AI-generated fake image of an explosion near the Pentagon went viral and briefly caused a dip in the US stock market before being debunked.',
    source: 'BBC News',
  },
];

export const dynamic = 'force-dynamic'; // Ensure this runs as a live serverless function

export async function GET() {
  // ── Primary: Hacker News Algolia API (free, no key, always works) ────────────
  try {
    const queries = [
      'https://hn.algolia.com/api/v1/search?query=deepfake+AI+fake+video&tags=story&hitsPerPage=10&numericFilters=points>3',
      'https://hn.algolia.com/api/v1/search?query=deepfake+detection+face+clone&tags=story&hitsPerPage=8&numericFilters=points>2',
    ];

    const results = await Promise.allSettled(
      queries.map(url =>
        fetch(url, {
          headers: { 'User-Agent': 'ChainProof/1.0' },
          signal: AbortSignal.timeout(6000),
        }).then(r => r.json() as Promise<HNResponse>)
      )
    );

    const hits: HNHit[] = [];
    for (const r of results) {
      if (r.status === 'fulfilled') {
        hits.push(...(r.value.hits ?? []));
      }
    }

    // Filter: must have a real URL and reasonable score
    const validHits = hits
      .filter(h => h.url && h.title && h.points > 0)
      .sort((a, b) => b.points - a.points);

    // Deduplicate by URL
    const seen = new Set<string>();
    const unique = validHits.filter(h => {
      if (seen.has(h.url!)) return false;
      seen.add(h.url!);
      return true;
    });

    if (unique.length >= 5) {
      const items = unique.slice(0, 15).map(h => ({
        title: h.title,
        link: h.url!,
        pubDate: h.created_at,
        description: `Shared by ${h.author} on Hacker News • ${h.points} upvotes`,
        source: 'Hacker News',
      }));

      return NextResponse.json(
        { status: 'ok', source: 'hackernews', items },
        { headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200' } }
      );
    }
  } catch (err) {
    console.error('[/api/news] HN fetch error:', err);
  }

  // ── Fallback: Real verified incidents (always works, hardcoded) ──────────────
  return NextResponse.json(
    { status: 'ok', source: 'curated', items: VERIFIED_INCIDENTS },
    { headers: { 'Cache-Control': 'public, s-maxage=86400' } }
  );
}
