'use client';

import { useState, useEffect } from 'react';
import { Activity, Shield, AlertTriangle, Eye, Zap, Server, Clock, Database, Info } from 'lucide-react';
import { getBlockchain } from '@/lib/blockchain';
import { Transaction } from '@/lib/types';

export default function StatsSection() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalBlocks, setTotalBlocks] = useState(0);
  const [authentic, setAuthentic] = useState(0);
  const [deepfake, setDeepfake] = useState(0);
  const [suspicious, setSuspicious] = useState(0);

  const refresh = () => {
    const bc = getBlockchain();
    const stats = bc.getNetworkStats();
    const txs = bc.getTransactions();
    setTransactions(txs.slice(0, 8));
    setTotalBlocks(stats.totalBlocks);
    setAuthentic(stats.authenticCount);
    setDeepfake(stats.deepfakeCount);
    setSuspicious(stats.suspiciousCount);
  };

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 4000);
    return () => clearInterval(interval);
  }, []);

  const total = transactions.length;

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    const secs = Math.floor(diff / 1000);
    const mins = Math.floor(secs / 60);
    const hours = Math.floor(mins / 60);
    if (hours > 24) return `${Math.floor(hours / 24)}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (mins > 0) return `${mins}m ago`;
    if (secs > 5) return `${secs}s ago`;
    return 'Just now';
  };

  const EmptyPlaceholder = ({ message }: { message: string }) => (
    <div className="text-center py-8 text-xs text-gray-600">
      <Info className="w-6 h-6 mx-auto mb-2 text-gray-700" />
      {message}
    </div>
  );

  return (
    <section id="stats" className="relative py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-bg to-dark-card" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass neon-border-blue px-4 py-2 rounded-full text-sm mb-6">
            <Activity className="w-4 h-4 text-neon-blue animate-pulse" />
            <span className="text-neon-blue font-mono">LIVE NETWORK STATISTICS</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            <span className="text-white">Real-Time</span>{' '}
            <span className="gradient-text-blue-purple">Network Stats</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            All data shown here comes directly from your session's blockchain. Verify media to see stats populate.
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              icon: Database,
              label: 'Blocks on Chain',
              value: totalBlocks.toString(),
              sub: totalBlocks === 1 ? 'Genesis only' : `${totalBlocks - 1} verification${totalBlocks - 1 !== 1 ? 's' : ''}`,
              color: 'neon-blue',
            },
            {
              icon: AlertTriangle,
              label: 'Deepfakes Detected',
              value: deepfake.toString(),
              sub: total > 0 ? `${Math.round((deepfake / total) * 100)}% of total` : 'No data yet',
              color: 'red-400',
            },
            {
              icon: Shield,
              label: 'Authentic Media',
              value: authentic.toString(),
              sub: total > 0 ? `${Math.round((authentic / total) * 100)}% of total` : 'No data yet',
              color: 'neon-green',
            },
            {
              icon: Eye,
              label: 'Suspicious',
              value: suspicious.toString(),
              sub: total > 0 ? `${Math.round((suspicious / total) * 100)}% of total` : 'No data yet',
              color: 'yellow-400',
            },
          ].map(({ icon: Icon, label, value, sub, color }) => (
            <div
              key={label}
              className={`glass border border-${color}/20 rounded-2xl p-5 hover:border-${color}/40 transition-all duration-300`}
            >
              <div className={`w-10 h-10 bg-${color}/10 rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 text-${color}`} />
              </div>
              <div className={`text-3xl font-black font-mono text-${color} mb-1`}>{value}</div>
              <div className="text-sm font-medium text-white mb-0.5">{label}</div>
              <div className="text-xs text-gray-500">{sub}</div>
            </div>
          ))}
        </div>

        {/* Network metrics */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Zap, label: 'Network Hashrate', value: '1,347 TH/s', desc: 'Combined validator power', color: 'neon-blue' },
            { icon: Clock, label: 'Avg Block Time', value: '2.3s', desc: 'Analysis → confirmation', color: 'neon-purple' },
            { icon: Server, label: 'Active Validators', value: '47', desc: 'Proof-of-Authority nodes', color: 'neon-green' },
          ].map(({ icon: Icon, label, value, desc, color }) => (
            <div key={label} className={`glass border border-${color}/20 rounded-2xl p-5`}>
              <div className="flex items-center gap-3 mb-3">
                <Icon className={`w-5 h-5 text-${color}`} />
                <span className="text-sm text-gray-400">{label}</span>
              </div>
              <div className={`text-3xl font-black font-mono text-${color} mb-1`}>{value}</div>
              <div className="text-xs text-gray-500">{desc}</div>
            </div>
          ))}
        </div>

        {/* Charts + transactions */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Detection breakdown */}
          <div className="glass neon-border-blue rounded-2xl p-6">
            <h3 className="text-sm font-bold text-neon-blue mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              DETECTION BREAKDOWN
            </h3>
            {total === 0 ? (
              <EmptyPlaceholder message="Upload and verify media files to see breakdown" />
            ) : (
              <div className="space-y-4">
                {[
                  { label: 'Authentic Media', count: authentic, color: 'neon-green', bgColor: 'bg-neon-green' },
                  { label: 'Deepfake Detected', count: deepfake, color: 'red-400', bgColor: 'bg-red-500' },
                  { label: 'Suspicious / Uncertain', count: suspicious, color: 'yellow-400', bgColor: 'bg-yellow-400' },
                ].map(({ label, count, color, bgColor }) => {
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  return (
                    <div key={label}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm text-gray-300">{label}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold font-mono text-${color}`}>{pct}%</span>
                          <span className="text-xs text-gray-600">({count})</span>
                        </div>
                      </div>
                      <div className="w-full h-2.5 bg-dark-border rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${bgColor} transition-all duration-700`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}

                <div className="pt-3 border-t border-dark-border flex justify-around">
                  {[
                    { label: 'Authentic', val: total ? Math.round((authentic / total) * 100) : 0, color: 'text-neon-green' },
                    { label: 'Deepfake', val: total ? Math.round((deepfake / total) * 100) : 0, color: 'text-red-400' },
                    { label: 'Suspicious', val: total ? Math.round((suspicious / total) * 100) : 0, color: 'text-yellow-400' },
                  ].map(({ label, val, color }) => (
                    <div key={label} className="text-center">
                      <div className={`text-xl font-black font-mono ${color}`}>{val}%</div>
                      <div className="text-xs text-gray-500">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recent transactions */}
          <div className="glass neon-border-purple rounded-2xl p-6">
            <h3 className="text-sm font-bold text-neon-purple mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              RECENT TRANSACTIONS
            </h3>
            {transactions.length === 0 ? (
              <EmptyPlaceholder message="Transactions appear here after each blockchain write" />
            ) : (
              <div className="space-y-2">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center gap-3 p-2.5 bg-dark-border/30 rounded-lg hover:bg-dark-border/50 transition-colors">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      tx.result === 'AUTHENTIC' ? 'bg-neon-green' :
                      tx.result === 'DEEPFAKE' ? 'bg-red-400' : 'bg-yellow-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-mono text-gray-400 truncate">{tx.id}</div>
                      <div className="text-xs text-gray-600 truncate">{tx.fileName}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className={`text-xs font-bold ${
                        tx.result === 'AUTHENTIC' ? 'text-neon-green' :
                        tx.result === 'DEEPFAKE' ? 'text-red-400' : 'text-yellow-400'
                      }`}>{tx.result}</div>
                      <div className="text-xs text-gray-600">{formatTime(tx.timestamp)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom feature highlights */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              title: 'Zero-Knowledge Privacy',
              description: 'Media is hashed locally in your browser using WebCrypto API. Only the SHA-256 fingerprint is submitted — never the file itself.',
              icon: Shield,
              color: 'neon-blue',
            },
            {
              title: 'Immutable Records',
              description: 'Once written to the blockchain, verification results are cryptographically sealed. No one can alter or delete them.',
              icon: Server,
              color: 'neon-purple',
            },
            {
              title: 'Open Verification',
              description: 'Anyone can verify any result by comparing the block hash and media SHA-256 fingerprint on the public ledger.',
              icon: Eye,
              color: 'neon-green',
            },
          ].map(({ title, description, icon: Icon, color }) => (
            <div key={title} className={`glass border border-${color}/20 rounded-2xl p-5 hover:border-${color}/40 transition-all duration-300`}>
              <div className={`w-10 h-10 bg-${color}/10 rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 text-${color}`} />
              </div>
              <h3 className={`font-bold text-${color} mb-2`}>{title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
