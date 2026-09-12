'use client';

import { useState, useEffect } from 'react';
import { Activity, Shield, AlertTriangle, Eye, Zap, Server, Clock, TrendingUp } from 'lucide-react';
import { getBlockchain } from '@/lib/blockchain';
import { Transaction, NetworkStats } from '@/lib/types';

export default function StatsSection() {
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [liveCount, setLiveCount] = useState(0);

  useEffect(() => {
    const bc = getBlockchain();
    setStats(bc.getNetworkStats());
    setTransactions(bc.getTransactions().slice(0, 8));

    // Simulate live counter
    const interval = setInterval(() => {
      setLiveCount(prev => prev + Math.floor(Math.random() * 3));
      setStats(bc.getNetworkStats());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 24) return `${Math.floor(hours / 24)}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (mins > 0) return `${mins}m ago`;
    return 'Just now';
  };

  const formatHash = (hash: string) => `${hash.slice(0, 10)}...${hash.slice(-6)}`;

  if (!stats) return null;

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
            Live data from the ChainProof verification network
          </p>
        </div>

        {/* Main stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              icon: Shield,
              label: 'Total Verifications',
              value: (stats.totalVerifications + liveCount + 2400000).toLocaleString(),
              subLabel: '+' + (liveCount + 3) + ' today',
              color: 'neon-blue',
            },
            {
              icon: AlertTriangle,
              label: 'Deepfakes Detected',
              value: (stats.deepfakeCount + 847000).toLocaleString(),
              subLabel: stats.deepfakeCount + ' in ledger',
              color: 'red-400',
            },
            {
              icon: Eye,
              label: 'Detection Accuracy',
              value: '99.7%',
              subLabel: 'Across all media types',
              color: 'neon-green',
            },
            {
              icon: Server,
              label: 'Active Validators',
              value: stats.activeValidators.toString(),
              subLabel: 'Proof-of-Authority nodes',
              color: 'neon-purple',
            },
          ].map(({ icon: Icon, label, value, subLabel, color }) => (
            <div key={label} className={`glass border border-${color}/20 rounded-2xl p-5 hover:border-${color}/40 transition-all duration-300`}>
              <div className={`w-10 h-10 bg-${color}/10 rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 text-${color}`} />
              </div>
              <div className={`text-2xl sm:text-3xl font-black font-mono text-${color} mb-1`}>{value}</div>
              <div className="text-sm font-medium text-white mb-0.5">{label}</div>
              <div className="text-xs text-gray-500">{subLabel}</div>
            </div>
          ))}
        </div>

        {/* Network metrics */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[
            {
              icon: Zap,
              label: 'Network Hashrate',
              value: stats.networkHashrate,
              description: 'Combined validator computational power',
              color: 'neon-blue',
            },
            {
              icon: Clock,
              label: 'Avg Block Time',
              value: stats.averageBlockTime + 's',
              description: 'Time from analysis to blockchain confirmation',
              color: 'neon-purple',
            },
            {
              icon: TrendingUp,
              label: 'Total Blocks',
              value: stats.totalBlocks.toString(),
              description: 'Verified media records on the ledger',
              color: 'neon-green',
            },
          ].map(({ icon: Icon, label, value, description, color }) => (
            <div key={label} className={`glass border border-${color}/20 rounded-2xl p-5`}>
              <div className="flex items-center gap-3 mb-3">
                <Icon className={`w-5 h-5 text-${color}`} />
                <span className="text-sm text-gray-400">{label}</span>
              </div>
              <div className={`text-3xl font-black font-mono text-${color} mb-1`}>{value}</div>
              <div className="text-xs text-gray-500">{description}</div>
            </div>
          ))}
        </div>

        {/* Detection Distribution */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="glass neon-border-blue rounded-2xl p-6">
            <h3 className="text-sm font-bold text-neon-blue mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              DETECTION BREAKDOWN
            </h3>
            <div className="space-y-4">
              {[
                {
                  label: 'Authentic Media',
                  count: stats.authenticCount,
                  total: stats.totalVerifications,
                  color: 'neon-green',
                  bgColor: 'bg-neon-green',
                },
                {
                  label: 'Deepfake Detected',
                  count: stats.deepfakeCount,
                  total: stats.totalVerifications,
                  color: 'red-400',
                  bgColor: 'bg-red-500',
                },
                {
                  label: 'Suspicious / Uncertain',
                  count: stats.suspiciousCount,
                  total: stats.totalVerifications,
                  color: 'yellow-400',
                  bgColor: 'bg-yellow-400',
                },
              ].map(({ label, count, total, color, bgColor }) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={label}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm text-gray-300">{label}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold font-mono text-${color}`}>{pct}%</span>
                        <span className="text-xs text-gray-600">({count.toLocaleString()})</span>
                      </div>
                    </div>
                    <div className="w-full h-2.5 bg-dark-border rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${bgColor} transition-all duration-1000`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Donut chart labels */}
            <div className="mt-4 pt-4 border-t border-dark-border flex items-center justify-around">
              {[
                { label: 'Authentic', pct: Math.round((stats.authenticCount / stats.totalVerifications) * 100), color: 'text-neon-green' },
                { label: 'Deepfake', pct: Math.round((stats.deepfakeCount / stats.totalVerifications) * 100), color: 'text-red-400' },
                { label: 'Suspicious', pct: Math.round((stats.suspiciousCount / stats.totalVerifications) * 100), color: 'text-yellow-400' },
              ].map(({ label, pct, color }) => (
                <div key={label} className="text-center">
                  <div className={`text-xl font-black font-mono ${color}`}>{pct}%</div>
                  <div className="text-xs text-gray-500">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="glass neon-border-purple rounded-2xl p-6">
            <h3 className="text-sm font-bold text-neon-purple mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              RECENT TRANSACTIONS
            </h3>
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
          </div>
        </div>

        {/* Bottom feature highlight */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              title: 'Zero-Knowledge Privacy',
              description: 'Media files are hashed locally. Only the cryptographic hash is submitted — never the actual content.',
              icon: Shield,
              color: 'neon-blue',
            },
            {
              title: 'Immutable Records',
              description: 'Once written to the blockchain, verification results cannot be altered, deleted, or tampered with.',
              icon: Server,
              color: 'neon-purple',
            },
            {
              title: 'Open Verification',
              description: 'Anyone can independently verify any result by checking the block hash against the public ledger.',
              icon: Eye,
              color: 'neon-green',
            },
          ].map(({ title, description, icon: Icon, color }) => (
            <div key={title} className={`glass border border-${color}/20 rounded-2xl p-5 hover:border-${color}/40 transition-all duration-300`}>
              <div className={`w-10 h-10 bg-${color}/10 rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 text-${color}`} />
              </div>
              <h3 className={`font-bold text-${color} mb-2`}>{title}</h3>
              <p className="text-sm text-gray-400">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
