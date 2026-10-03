'use client';

import { useEffect, useState } from 'react';
import {
  AlertTriangle, Radio, Globe, Zap
} from 'lucide-react';



// ─── Component ────────────────────────────────────────────────────────────────
import { getBlockchain } from '@/lib/blockchain';
import { Transaction } from '@/lib/types';

export default function ThreatFeedSection() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dfCount, setDfCount] = useState(0);

  useEffect(() => {
    // Poll the genuine local blockchain for new transactions
    const refresh = () => {
      const bc = getBlockchain();
      const txs = bc.getTransactions();
      setTransactions(txs);
      setDfCount(txs.filter(t => t.result === 'DEEPFAKE').length);
    };

    refresh();
    const interval = setInterval(refresh, 2000);
    return () => clearInterval(interval);
  }, []);

  const getStyle = (r: Transaction['result']) => {
    if (r === 'DEEPFAKE') return { dot: 'bg-red-400', text: 'text-red-400' };
    if (r === 'AUTHENTIC') return { dot: 'bg-neon-green', text: 'text-neon-green' };
    return { dot: 'bg-yellow-400', text: 'text-yellow-400' };
  };

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString('en-US', { hour12: false });
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
            <div className="w-2 h-2 rounded-full animate-pulse bg-red-400" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            <span className="text-white">Real-World </span>
            <span className="text-red-400">Deepfake</span>
            <span className="text-white"> Incidents</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Simulated global threat intelligence stream showing deepfake detections in real-time across the network.
          </p>
        </div>

        {/* ── PART 2: SIMULATED LIVE STREAM ─────────────────────────────────── */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              <h3 className="text-sm font-bold text-white font-mono">GLOBAL NETWORK FEED</h3>
              <span className="text-xs text-gray-600 font-mono border border-dark-border px-2 py-0.5 rounded">
                Live blockchain verifications
              </span>
            </div>

            <div className="glass neon-border-blue rounded-2xl overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-5 gap-2 px-4 py-2.5 bg-dark-border/30 text-xs font-mono text-gray-500 border-b border-dark-border">
                <span>TIME</span>
                <span>TX HASH</span>
                <span>FILE NAME</span>
                <span>VERDICT</span>
                <span>CONFIDENCE</span>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
                {transactions.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 font-mono text-sm">
                    Awaiting network activity. Verify a file to add it to the ledger.
                  </div>
                ) : (
                  transactions.map((tx, idx) => {
                    const s = getStyle(tx.result);
                    return (
                      <div
                        key={tx.id + idx}
                        className={`grid grid-cols-5 gap-2 px-4 py-2.5 border-b border-dark-border/30 text-xs font-mono hover:bg-dark-border/20 transition-colors ${idx === 0 ? 'bg-neon-blue/5' : ''}`}
                      >
                        <span className="text-gray-500">{formatTime(tx.timestamp)}</span>
                        <span className="text-gray-400 flex items-center gap-1 truncate" title={tx.id}>
                          <Globe className="w-3 h-3 text-gray-600" /> {tx.id.substring(0, 10)}...
                        </span>
                        <span className="text-gray-400 truncate" title={tx.fileName}>{tx.fileName}</span>
                        <span className={`flex items-center gap-1 font-bold ${s.text}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                          {tx.result}
                        </span>
                        <span className={`font-bold ${s.text}`}>{tx.confidence.toFixed(1)}%</span>
                      </div>
                    );
                  })
                )}
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
                  { label: 'Total Events', value: transactions.length, color: 'text-neon-blue' },
                  { label: 'Deepfakes', value: dfCount, color: 'text-red-400' },
                  { label: 'Detection Rate', value: transactions.length > 0 ? `${Math.round((dfCount / transactions.length) * 100)}%` : '0%', color: 'text-neon-purple' },
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
                  const count = transactions.filter(e => e.result === r).length;
                  const pct = transactions.length > 0 ? Math.round((count / transactions.length) * 100) : 0;
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
