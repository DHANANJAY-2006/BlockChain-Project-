'use client';

import { useEffect, useState, useRef } from 'react';
import { AlertTriangle, CheckCircle, Eye, Radio, Globe, Zap } from 'lucide-react';

interface ThreatEvent {
  id: string;
  time: string;
  country: string;
  result: 'DEEPFAKE' | 'AUTHENTIC' | 'SUSPICIOUS';
  confidence: number;
  type: string;
  hash: string;
}

const FILE_TYPES = ['Political Speech', 'Celebrity Video', 'News Broadcast', 'Social Media Clip', 'Product Ad', 'Interview', 'Documentary', 'Campaign Video'];
const COUNTRIES = ['United States', 'United Kingdom', 'India', 'Germany', 'Brazil', 'Japan', 'France', 'Canada', 'Australia', 'South Korea'];
const COUNTRY_CODES: Record<string, string> = {
  'United States': 'US', 'United Kingdom': 'GB', 'India': 'IN', 'Germany': 'DE',
  'Brazil': 'BR', 'Japan': 'JP', 'France': 'FR', 'Canada': 'CA', 'Australia': 'AU', 'South Korea': 'KR',
};

function randomHex(len: number) {
  return Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

function generateEvent(): ThreatEvent {
  const roll = Math.random();
  const result: ThreatEvent['result'] = roll < 0.42 ? 'DEEPFAKE' : roll < 0.75 ? 'AUTHENTIC' : 'SUSPICIOUS';
  const confidence = result === 'AUTHENTIC'
    ? 82 + Math.random() * 17
    : result === 'DEEPFAKE'
    ? 78 + Math.random() * 20
    : 50 + Math.random() * 25;
  const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
  const now = new Date();
  return {
    id: randomHex(8),
    time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    country,
    result,
    confidence: parseFloat(confidence.toFixed(2)),
    type: FILE_TYPES[Math.floor(Math.random() * FILE_TYPES.length)],
    hash: '0x' + randomHex(16),
  };
}

// Pre-generate initial events
const INITIAL_EVENTS: ThreatEvent[] = Array.from({ length: 12 }, generateEvent);

export default function ThreatFeedSection() {
  const [events, setEvents] = useState<ThreatEvent[]>(INITIAL_EVENTS);
  const [deepfakeCount, setDeepfakeCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Count initial deepfakes
    setDeepfakeCount(INITIAL_EVENTS.filter(e => e.result === 'DEEPFAKE').length);
    setTotalCount(INITIAL_EVENTS.length);

    // Stream in a new detection every 3–5 seconds
    const interval = setInterval(() => {
      const newEvent = generateEvent();
      setEvents(prev => [newEvent, ...prev.slice(0, 24)]);
      if (newEvent.result === 'DEEPFAKE') setDeepfakeCount(c => c + 1);
      setTotalCount(c => c + 1);
    }, 3500 + Math.random() * 1500);

    return () => clearInterval(interval);
  }, []);

  const getStyle = (result: ThreatEvent['result']) => {
    if (result === 'DEEPFAKE') return { dot: 'bg-red-400', text: 'text-red-400', badge: 'status-fake' };
    if (result === 'AUTHENTIC') return { dot: 'bg-neon-green', text: 'text-neon-green', badge: 'status-verified' };
    return { dot: 'bg-yellow-400', text: 'text-yellow-400', badge: 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400' };
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
            <span className="text-red-400 font-mono">LIVE GLOBAL THREAT INTELLIGENCE</span>
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            <span className="text-white">Real-Time </span>
            <span className="text-red-400">Deepfake</span>
            <span className="text-white"> Detections</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Simulated live feed of deepfake verifications happening across the network. Every detection is cryptographically recorded.
          </p>
        </div>

        {/* Live stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: Radio, label: 'Total Verified (Session)', value: totalCount, color: 'text-neon-blue', border: 'border-neon-blue/20' },
            { icon: AlertTriangle, label: 'Deepfakes Intercepted', value: deepfakeCount, color: 'text-red-400', border: 'border-red-500/20' },
            { icon: Zap, label: 'Detection Rate', value: totalCount > 0 ? `${Math.round((deepfakeCount / totalCount) * 100)}%` : '0%', color: 'text-neon-purple', border: 'border-neon-purple/20' },
          ].map(({ icon: Icon, label, value, color, border }) => (
            <div key={label} className={`glass border ${border} rounded-xl p-4 text-center`}>
              <Icon className={`w-5 h-5 ${color} mx-auto mb-1`} />
              <div className={`text-2xl font-black font-mono ${color}`}>{value}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Live Event Feed */}
          <div className="lg:col-span-2">
            <div className="glass neon-border-blue rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-dark-border">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                  <span className="text-sm font-bold text-white font-mono">LIVE DETECTION STREAM</span>
                </div>
                <span className="text-xs text-gray-500 font-mono">AUTO-REFRESHING</span>
              </div>

              {/* Table header */}
              <div className="grid grid-cols-5 gap-2 px-4 py-2 bg-dark-border/30 text-xs font-mono text-gray-500">
                <span>TIME</span>
                <span>COUNTRY</span>
                <span>MEDIA TYPE</span>
                <span>RESULT</span>
                <span>CONFIDENCE</span>
              </div>

              <div ref={feedRef} className="overflow-y-auto" style={{ maxHeight: '480px' }}>
                {events.map((ev, idx) => {
                  const style = getStyle(ev.result);
                  return (
                    <div
                      key={ev.id + idx}
                      className={`grid grid-cols-5 gap-2 px-4 py-2.5 border-b border-dark-border/40 hover:bg-dark-border/20 transition-colors text-xs font-mono ${idx === 0 ? 'bg-neon-blue/5 animate-pulse-slow' : ''}`}
                    >
                      <span className="text-gray-400">{ev.time}</span>
                      <span className="text-gray-300 flex items-center gap-1">
                        <Globe className="w-3 h-3 text-gray-500 flex-shrink-0" />
                        {COUNTRY_CODES[ev.country]}
                      </span>
                      <span className="text-gray-400 truncate">{ev.type}</span>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${style.dot}`} />
                        <span className={`font-bold ${style.text}`}>{ev.result}</span>
                      </div>
                      <span className={`font-bold ${style.text}`}>{ev.confidence.toFixed(1)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar: threat breakdown */}
          <div className="space-y-4">
            {/* Map placeholder */}
            <div className="glass neon-border-blue rounded-2xl p-5">
              <h3 className="text-sm font-bold text-neon-blue mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                GEOGRAPHIC SPREAD
              </h3>
              <div className="space-y-2">
                {COUNTRIES.slice(0, 6).map(country => {
                  const countryEvents = events.filter(e => e.country === country);
                  const pct = events.length > 0 ? Math.round((countryEvents.length / events.length) * 100) : 0;
                  const deepfakes = countryEvents.filter(e => e.result === 'DEEPFAKE').length;
                  return (
                    <div key={country}>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-gray-400">{COUNTRY_CODES[country]} — {country.split(' ')[0]}</span>
                        <span className="text-gray-500 font-mono">{deepfakes} threats</span>
                      </div>
                      <div className="w-full h-1.5 bg-dark-border rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-neon-blue to-red-500 rounded-full transition-all duration-700"
                          style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Latest deepfake alert */}
            {events.find(e => e.result === 'DEEPFAKE') && (
              <div className="glass border border-red-500/40 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  LATEST THREAT
                </h3>
                {(() => {
                  const latest = events.find(e => e.result === 'DEEPFAKE')!;
                  return (
                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex justify-between"><span className="text-gray-500">Type</span><span className="text-red-400">{latest.type}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Origin</span><span className="text-gray-300">{latest.country}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Confidence</span><span className="text-red-400 font-bold">{latest.confidence.toFixed(2)}%</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">TX Hash</span><span className="text-gray-400 truncate ml-2">{latest.hash}</span></div>
                      <div className="mt-2 p-2 bg-red-500/5 border border-red-500/20 rounded-lg">
                        <span className="text-red-400 font-bold">⚠ CONFIRMED DEEPFAKE</span>
                        <p className="text-gray-500 mt-1">Record sealed on blockchain.</p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Accuracy stats */}
            <div className="glass neon-border-green rounded-2xl p-5">
              <h3 className="text-sm font-bold text-neon-green mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                SESSION ACCURACY
              </h3>
              <div className="space-y-2 text-xs font-mono">
                {(['DEEPFAKE', 'AUTHENTIC', 'SUSPICIOUS'] as const).map(r => {
                  const count = events.filter(e => e.result === r).length;
                  const pct = events.length > 0 ? Math.round((count / events.length) * 100) : 0;
                  const colors = { DEEPFAKE: 'text-red-400', AUTHENTIC: 'text-neon-green', SUSPICIOUS: 'text-yellow-400' };
                  const bars = { DEEPFAKE: 'bg-red-500', AUTHENTIC: 'bg-neon-green', SUSPICIOUS: 'bg-yellow-400' };
                  return (
                    <div key={r}>
                      <div className="flex justify-between mb-0.5">
                        <span className="text-gray-500">{r}</span>
                        <span className={`font-bold ${colors[r]}`}>{pct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-dark-border rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${bars[r]} transition-all duration-700`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
