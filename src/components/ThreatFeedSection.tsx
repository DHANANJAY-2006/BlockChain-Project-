'use client';

import { useEffect, useState } from 'react';
import {
  AlertTriangle, Radio, ExternalLink, Newspaper,
  Loader2, RefreshCw, Globe, Zap, CheckCircle, Eye, Wifi, WifiOff
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  source?: string;
  thumbnail?: string;
}

interface RSS2JSONResponse {
  status: string;
  source?: 'reddit' | 'hackernews';
  items: NewsItem[];
}

interface SimEvent {
  id: string;
  time: string;
  country: string;
  type: string;
  result: 'DEEPFAKE' | 'AUTHENTIC' | 'SUSPICIOUS';
  confidence: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const TYPES = ['Political Speech', 'Celebrity Video', 'News Broadcast', 'Social Media Clip', 'Product Ad', 'Interview', 'Documentary'];
const COUNTRIES = ['US', 'UK', 'IN', 'DE', 'BR', 'JP', 'FR', 'CA', 'AU', 'KR', 'CN', 'NG'];

function rndHex(n: number) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

function getDomain(url: string) {
  try { return new URL(url).hostname.replace('www.', ''); }
  catch { return 'news.source'; }
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3_600_000);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  return 'Just now';
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').slice(0, 120) + '...';
}

function makeSimEvent(): SimEvent {
  const roll = Math.random();
  const result: SimEvent['result'] = roll < 0.45 ? 'DEEPFAKE' : roll < 0.78 ? 'AUTHENTIC' : 'SUSPICIOUS';
  return {
    id: rndHex(8),
    time: new Date().toLocaleTimeString('en-US', { hour12: false }),
    country: COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)],
    type: TYPES[Math.floor(Math.random() * TYPES.length)],
    result,
    confidence: result === 'DEEPFAKE'
      ? 74 + Math.random() * 24
      : result === 'AUTHENTIC'
      ? 79 + Math.random() * 19
      : 52 + Math.random() * 30,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ThreatFeedSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsOnline, setNewsOnline] = useState(false);
  const [newsSource, setNewsSource] = useState<'reddit' | 'hackernews' | null>(null);
  const [simEvents, setSimEvents] = useState<SimEvent[]>(() =>
    Array.from({ length: 10 }, makeSimEvent)
  );
  const [dfCount, setDfCount] = useState(0);
  const [totalCount, setTotalCount] = useState(10);

  // ── Fetch via server-side /api/news — always returns data (curated fallback) ──
  const fetchNews = async () => {
    setNewsLoading(true);
    try {
      const res = await fetch('/api/news', { cache: 'no-store' });
      const data: RSS2JSONResponse = await res.json();
      if (data.status === 'ok' && data.items?.length > 0) {
        setNews(data.items.slice(0, 15));
        setNewsOnline(true);
        setNewsSource(data.source ?? 'hackernews');
      } else {
        setNewsOnline(false);
        setNewsSource(null);
      }
    } catch {
      setNewsOnline(false);
      setNewsSource(null);
    } finally {
      setNewsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // ── Simulated live detection stream ──────────────────────────────────────────
  useEffect(() => {
    setDfCount(simEvents.filter(e => e.result === 'DEEPFAKE').length);

    const interval = setInterval(() => {
      const ev = makeSimEvent();
      setSimEvents(prev => [ev, ...prev.slice(0, 24)]);
      if (ev.result === 'DEEPFAKE') setDfCount(c => c + 1);
      setTotalCount(c => c + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line

  const getStyle = (r: SimEvent['result']) => {
    if (r === 'DEEPFAKE') return { dot: 'bg-red-400', text: 'text-red-400' };
    if (r === 'AUTHENTIC') return { dot: 'bg-neon-green', text: 'text-neon-green' };
    return { dot: 'bg-yellow-400', text: 'text-yellow-400' };
  };

  return (
    <section id="threat-feed" className="relative py-24 cyber-grid-bg">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-card/40 to-dark-bg" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-full text-sm mb-6">
            <Radio className="w-4 h-4 text-red-400 animate-pulse" />
            <span className="text-red-400 font-mono">GLOBAL THREAT INTELLIGENCE</span>
            <div className={`w-2 h-2 rounded-full animate-pulse ${newsOnline ? 'bg-neon-green' : 'bg-red-400'}`} />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            <span className="text-white">Real-World </span>
            <span className="text-red-400">Deepfake</span>
            <span className="text-white"> Incidents</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Real documented deepfake incidents from BBC, Reuters, The Guardian and more — plus a live simulated detection stream.
          </p>
        </div>

        {/* ── PART 1: REAL NEWS ──────────────────────────────────────────────── */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-neon-blue" />
              <h3 className="text-lg font-bold text-white">Real Deepfake Incidents</h3>
              {(newsSource === 'reddit' || newsSource === 'hackernews') && (
                <span className="text-xs font-mono px-2 py-0.5 rounded-full border flex items-center gap-1 text-neon-green border-neon-green/30 bg-neon-green/10">
                  <Wifi className="w-3 h-3" /> LIVE — {newsSource === 'hackernews' ? 'Hacker News' : 'Reddit'}
                </span>
              )}
              {!newsSource && !newsLoading && (
                <span className="text-xs font-mono px-2 py-0.5 rounded-full border flex items-center gap-1 text-red-400 border-red-500/30 bg-red-500/10">
                  <WifiOff className="w-3 h-3" /> OFFLINE
                </span>
              )}
            </div>
            <button
              onClick={fetchNews}
              disabled={newsLoading}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-neon-blue transition-colors glass neon-border-blue px-3 py-1.5 rounded-lg"
            >
              <RefreshCw className={`w-3 h-3 ${newsLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {newsLoading ? (
            <div className="glass neon-border-blue rounded-2xl p-12 text-center">
              <Loader2 className="w-10 h-10 text-neon-blue animate-spin mx-auto mb-3" />
              <p className="text-gray-400">Fetching live deepfake stories from Hacker News...</p>
              <p className="text-xs text-gray-600 mt-1 font-mono">hn.algolia.com/api/v1/search?query=deepfake</p>
            </div>
          ) : !newsOnline ? (
            <div className="glass border border-red-500/30 rounded-2xl p-8 text-center">
              <WifiOff className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <p className="text-gray-400 mb-2">Could not reach Hacker News API</p>
              <p className="text-xs text-gray-600">Check your connection and try again</p>
              <button onClick={fetchNews} className="mt-4 btn-secondary px-4 py-2 rounded-lg text-sm">
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {news.map((item, i) => (
                <a
                  key={i}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass neon-border-blue rounded-xl p-4 flex flex-col gap-2 hover:bg-neon-blue/5 transition-all hover:scale-[1.01] group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0 mt-1.5 animate-pulse" />
                    <p className="text-sm text-white font-medium leading-snug flex-1 group-hover:text-neon-blue transition-colors line-clamp-3">
                      {item.title}
                    </p>
                    <ExternalLink className="w-3 h-3 text-gray-600 flex-shrink-0 mt-0.5 group-hover:text-neon-blue transition-colors" />
                  </div>
                  {item.description && (
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {stripHtml(item.description)}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-auto pt-1 border-t border-dark-border">
                    <span className="text-xs text-gray-600 font-mono">{getDomain(item.link)}</span>
                    <span className="text-xs text-gray-600">{timeAgo(item.pubDate)}</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* ── PART 2: SIMULATED LIVE STREAM ─────────────────────────────────── */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              <h3 className="text-sm font-bold text-white font-mono">LIVE DETECTION SIMULATION</h3>
              <span className="text-xs text-gray-600 font-mono border border-dark-border px-2 py-0.5 rounded">
                Simulated — updates every 4s
              </span>
            </div>

            <div className="glass neon-border-blue rounded-2xl overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-5 gap-2 px-4 py-2.5 bg-dark-border/30 text-xs font-mono text-gray-500 border-b border-dark-border">
                <span>TIME</span>
                <span>REGION</span>
                <span>MEDIA TYPE</span>
                <span>VERDICT</span>
                <span>CONFIDENCE</span>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
                {simEvents.map((ev, idx) => {
                  const s = getStyle(ev.result);
                  return (
                    <div
                      key={ev.id + idx}
                      className={`grid grid-cols-5 gap-2 px-4 py-2.5 border-b border-dark-border/30 text-xs font-mono hover:bg-dark-border/20 transition-colors ${idx === 0 ? 'bg-neon-blue/5' : ''}`}
                    >
                      <span className="text-gray-500">{ev.time}</span>
                      <span className="text-gray-400 flex items-center gap-1">
                        <Globe className="w-3 h-3 text-gray-600" /> {ev.country}
                      </span>
                      <span className="text-gray-400 truncate">{ev.type}</span>
                      <span className={`flex items-center gap-1 font-bold ${s.text}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        {ev.result}
                      </span>
                      <span className={`font-bold ${s.text}`}>{ev.confidence.toFixed(1)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Stats sidebar */}
          <div className="space-y-4">
            {/* Session stats */}
            <div className="glass neon-border-blue rounded-2xl p-5">
              <h3 className="text-sm font-bold text-neon-blue mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4" /> SESSION STATS
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Total Events', value: totalCount, color: 'text-neon-blue' },
                  { label: 'Deepfakes', value: dfCount, color: 'text-red-400' },
                  { label: 'Detection Rate', value: totalCount > 0 ? `${Math.round((dfCount / totalCount) * 100)}%` : '0%', color: 'text-neon-purple' },
                  { label: 'Real News Stories', value: news.length, color: 'text-neon-green' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">{label}</span>
                    <span className={`text-sm font-black font-mono ${color}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Breakdown bars */}
            <div className="glass neon-border-purple rounded-2xl p-5">
              <h3 className="text-sm font-bold text-neon-purple mb-4">VERDICT BREAKDOWN</h3>
              <div className="space-y-3">
                {(['DEEPFAKE', 'AUTHENTIC', 'SUSPICIOUS'] as const).map(r => {
                  const count = simEvents.filter(e => e.result === r).length;
                  const pct = simEvents.length > 0 ? Math.round((count / simEvents.length) * 100) : 0;
                  const colors = { DEEPFAKE: { text: 'text-red-400', bar: 'bg-red-500' }, AUTHENTIC: { text: 'text-neon-green', bar: 'bg-neon-green' }, SUSPICIOUS: { text: 'text-yellow-400', bar: 'bg-yellow-400' } };
                  return (
                    <div key={r}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">{r}</span>
                        <span className={`font-bold font-mono ${colors[r].text}`}>{pct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-dark-border rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${colors[r].bar} transition-all duration-700`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Data source transparency */}
            <div className="glass neon-border-green rounded-2xl p-4">
              <h3 className="text-xs font-bold text-neon-green mb-2">DATA SOURCES</h3>
              <div className="space-y-1.5 text-xs text-gray-500">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 text-neon-green flex-shrink-0 mt-0.5" />
                  <span>Real news via Google News RSS + rss2json.com API</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-3 h-3 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>Detection stream is simulated (shows production-scale visualization)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
