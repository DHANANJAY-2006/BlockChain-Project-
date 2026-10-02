import { NextResponse } from 'next/server';

// ── Real documented deepfake incidents with verified news sources ──────────────
// These are actual events that were reported by major news outlets.
// Used as reliable fallback (or primary) data — never goes offline.
const REAL_INCIDENTS = [
  {
    title: 'Hong Kong firm loses $25 million in deepfake video call scam',
    link: 'https://www.theguardian.com/technology/2024/feb/04/hong-kong-deepfake-scam-25-million-dollar-fraud',
    pubDate: '2024-02-04T00:00:00Z',
    description: 'A finance worker was tricked into paying $25.6M after scammers used deepfake technology to impersonate the company\'s CFO in a video conference call.',
    source: 'The Guardian',
  },
  {
    title: 'Taylor Swift explicit AI-generated deepfake images spread on X (Twitter)',
    link: 'https://www.bbc.com/news/technology-68186290',
    pubDate: '2024-01-26T00:00:00Z',
    description: 'AI-generated explicit images of Taylor Swift went viral across social media, sparking global debate about deepfake laws and platform responsibility.',
    source: 'BBC News',
  },
  {
    title: 'Fake Biden robocall tells New Hampshire voters not to vote in primary',
    link: 'https://www.theguardian.com/us-news/2024/jan/22/fake-biden-robocall-new-hampshire',
    pubDate: '2024-01-22T00:00:00Z',
    description: 'An AI-generated fake audio of President Biden discouraged voters from voting in the Democratic primary, raising alarms about election interference via deepfakes.',
    source: 'The Guardian',
  },
  {
    title: 'MrBeast deepfake scam promotes fake iPhone giveaway on social media',
    link: 'https://www.bbc.com/news/technology-67116876',
    pubDate: '2023-10-04T00:00:00Z',
    description: 'A deepfake video of YouTuber MrBeast circulated on TikTok, falsely claiming iPhones were being given away for just $2, duping thousands of viewers.',
    source: 'BBC News',
  },
  {
    title: 'Tom Hanks warns of AI deepfake dental ad using his likeness without consent',
    link: 'https://www.bbc.com/news/entertainment-arts-67106274',
    pubDate: '2023-10-02T00:00:00Z',
    description: 'Actor Tom Hanks issued a warning after an AI-generated version of his likeness was used to promote a dental plan without his knowledge or consent.',
    source: 'BBC News',
  },
  {
    title: 'Indian election 2024: Politicians use AI deepfakes for campaigning',
    link: 'https://www.bbc.com/news/world-asia-india-68385748',
    pubDate: '2024-03-15T00:00:00Z',
    description: 'During India\'s 2024 general election, political parties used AI-generated deepfake videos of deceased leaders and opposition figures to target voters.',
    source: 'BBC News',
  },
  {
    title: 'Bollywood actress Rashmika Mandanna deepfake video goes viral in India',
    link: 'https://www.bbc.com/news/world-asia-india-67373247',
    pubDate: '2023-11-06T00:00:00Z',
    description: 'A deepfake video falsely showing actress Rashmika Mandanna went viral in India, prompting the government to issue urgent warnings and demand platform action.',
    source: 'BBC News',
  },
  {
    title: 'Baltimore school principal targeted by deepfake racist audio recording',
    link: 'https://www.npr.org/2024/04/27/1247719691/baltimore-school-principal-deepfake-ai-voice',
    pubDate: '2024-04-27T00:00:00Z',
    description: 'A deepfake audio clip falsely depicting a Baltimore school principal making racist and antisemitic remarks was created by a school staff member and spread widely.',
    source: 'NPR',
  },
  {
    title: 'Spanish school deepfake scandal: AI used to create fake nude images of students',
    link: 'https://www.theguardian.com/world/2023/sep/20/almendralejo-spain-ai-deepfake-nude-images-teenage-girls-school',
    pubDate: '2023-09-20T00:00:00Z',
    description: 'Teenage boys in Almendralejo, Spain used AI apps to generate fake nude images of female classmates, leading to police investigations and new legislation.',
    source: 'The Guardian',
  },
  {
    title: 'UK CEO voice deepfake used to steal £200,000 in first-of-its-kind fraud',
    link: 'https://www.wsj.com/articles/fraudsters-use-ai-to-mimic-ceos-voice-in-unusual-cybercrime-case-11567157402',
    pubDate: '2019-08-30T00:00:00Z',
    description: 'Fraudsters used AI to clone the voice of a German CEO and convinced a UK subsidiary employee to urgently wire £200,000 to a Hungarian bank account.',
    source: 'Wall Street Journal',
  },
  {
    title: 'Zelensky deepfake video urges Ukrainian soldiers to surrender',
    link: 'https://www.reuters.com/world/europe/deepfake-video-zelenskiy-surrendering-circulates-social-media-meta-says-2022-03-16/',
    pubDate: '2022-03-16T00:00:00Z',
    description: 'A deepfake video showing Ukrainian President Volodymyr Zelensky calling on soldiers to lay down arms circulated widely on social media during the Russia-Ukraine conflict.',
    source: 'Reuters',
  },
  {
    title: 'South Korea K-pop deepfake crisis: Celebrities face AI-generated explicit content',
    link: 'https://www.theguardian.com/world/2024/aug/28/south-korea-deepfake-sexual-images-crisis',
    pubDate: '2024-08-28T00:00:00Z',
    description: 'A deepfake crisis erupted in South Korea as AI-generated explicit images of K-pop celebrities and ordinary women flooded Telegram groups, prompting emergency legislation.',
    source: 'The Guardian',
  },
  {
    title: 'Scarlett Johansson sues AI app for unauthorized deepfake ad using her likeness',
    link: 'https://www.theguardian.com/film/2023/oct/21/scarlett-johansson-ai-app-lisa-ai',
    pubDate: '2023-10-21T00:00:00Z',
    description: 'Actress Scarlett Johansson took legal action after an AI app created and distributed an advertisement that used a deepfake version of her likeness without consent.',
    source: 'The Guardian',
  },
  {
    title: 'Pentagon deepfake explosion photo causes brief stock market panic',
    link: 'https://www.bbc.com/news/world-us-canada-65639406',
    pubDate: '2023-05-22T00:00:00Z',
    description: 'An AI-generated fake image of an explosion near the Pentagon briefly went viral and caused a small dip in the US stock market before being debunked.',
    source: 'BBC News',
  },
  {
    title: 'Mark Zuckerberg deepfake video claims he controls billions of stolen data',
    link: 'https://www.theguardian.com/technology/2019/jun/12/deepfake-zuckerberg-facebook-spectre',
    pubDate: '2019-06-12T00:00:00Z',
    description: 'Artists created a deepfake video of Facebook CEO Mark Zuckerberg to highlight the dangers of manipulated media and test the platform\'s own policies on deepfakes.',
    source: 'The Guardian',
  },
];

export async function GET() {
  // Try live Reddit fetch first — fall back to real curated incidents
  try {
    const res = await fetch(
      'https://www.reddit.com/search.json?q=deepfake+AI+fake+video+detected&sort=new&limit=15&t=month',
      {
        headers: { 'User-Agent': 'ChainProof/1.0' },
        signal: AbortSignal.timeout(5000), // 5 second timeout
        next: { revalidate: 300 },
      }
    );

    if (res.ok) {
      const data = await res.json();
      const items = (data?.data?.children ?? [])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((c: any) => ({
          title: c.data.title,
          link: `https://www.reddit.com${c.data.permalink}`,
          pubDate: new Date(c.data.created_utc * 1000).toISOString(),
          description: c.data.selftext?.slice(0, 180) || `Posted in r/${c.data.subreddit}`,
          source: `reddit.com/r/${c.data.subreddit}`,
        }))
        .filter((i: { title: string }) => i.title.length > 5)
        .slice(0, 15);

      if (items.length >= 5) {
        return NextResponse.json(
          { status: 'ok', source: 'reddit', items },
          { headers: { 'Cache-Control': 'public, s-maxage=300' } }
        );
      }
    }
  } catch {
    // Reddit unavailable — fall through to curated list
  }

  // Always-available fallback: real documented incidents
  return NextResponse.json(
    { status: 'ok', source: 'curated', items: REAL_INCIDENTS },
    { headers: { 'Cache-Control': 'public, s-maxage=3600' } }
  );
}
