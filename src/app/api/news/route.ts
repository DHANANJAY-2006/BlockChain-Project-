import { NextResponse } from 'next/server';

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

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [r1, r2] = await Promise.allSettled([
      fetch(
        'https://hn.algolia.com/api/v1/search?query=deepfake+AI+fake+video&tags=story&hitsPerPage=12&numericFilters=points>2',
        { headers: { 'User-Agent': 'ChainProof/1.0' }, signal: AbortSignal.timeout(7000) }
      ),
      fetch(
        'https://hn.algolia.com/api/v1/search?query=deepfake+detection+face+clone&tags=story&hitsPerPage=8&numericFilters=points>1',
        { headers: { 'User-Agent': 'ChainProof/1.0' }, signal: AbortSignal.timeout(7000) }
      ),
    ]);

    const hits: HNHit[] = [];

    if (r1.status === 'fulfilled' && r1.value.ok) {
      const d: HNResponse = await r1.value.json();
      hits.push(...(d.hits ?? []));
    }
    if (r2.status === 'fulfilled' && r2.value.ok) {
      const d: HNResponse = await r2.value.json();
      hits.push(...(d.hits ?? []));
    }

    // Only include stories with a real external URL
    const valid = hits.filter(h => h.url && h.title && h.title.length > 5);

    // Deduplicate by URL
    const seen = new Set<string>();
    const unique = valid.filter(h => {
      if (seen.has(h.url!)) return false;
      seen.add(h.url!);
      return true;
    });

    // Sort by upvotes descending
    unique.sort((a, b) => b.points - a.points);

    if (unique.length === 0) {
      return NextResponse.json({ status: 'error', items: [] }, { status: 502 });
    }

    const items = unique.slice(0, 15).map(h => ({
      title: h.title,
      link: h.url!,
      pubDate: h.created_at,
      description: `Shared on Hacker News by ${h.author} • ${h.points} upvotes`,
      source: 'Hacker News',
    }));

    return NextResponse.json(
      { status: 'ok', source: 'hackernews', items },
      { headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200' } }
    );
  } catch (err) {
    console.error('[/api/news]', err);
    return NextResponse.json({ status: 'error', items: [] }, { status: 500 });
  }
}
