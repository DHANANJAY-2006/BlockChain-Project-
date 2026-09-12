'use client';

import { useState, useEffect } from 'react';
import { Shield, Hash, Clock, User, ChevronRight, ArrowRight, Database, Cpu, Link } from 'lucide-react';
import { getBlockchain } from '@/lib/blockchain';
import { Block } from '@/lib/types';

export default function BlockchainSection() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    const bc = getBlockchain();
    setBlocks(bc.getChain().slice(0, 10));
    setIsValid(bc.validateChain());
    
    // Refresh every 10 seconds
    const interval = setInterval(() => {
      setBlocks(bc.getChain().slice(0, 10));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatHash = (hash: string) => `${hash.slice(0, 10)}...${hash.slice(-6)}`;
  
  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 24) return `${Math.floor(hours / 24)}d ago`;
    if (hours > 0) return `${hours}h ${mins}m ago`;
    if (mins > 0) return `${mins}m ago`;
    return 'Just now';
  };

  const getResultColor = (result: string) => {
    if (result === 'AUTHENTIC') return 'text-neon-green';
    if (result === 'DEEPFAKE') return 'text-red-400';
    return 'text-yellow-400';
  };

  const getResultBg = (result: string) => {
    if (result === 'AUTHENTIC') return 'status-verified';
    if (result === 'DEEPFAKE') return 'status-fake';
    return 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400';
  };

  return (
    <section id="blockchain" className="relative py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-bg to-dark-card/30" />

      {/* Blockchain chain scrolling decoration */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass neon-border-blue px-4 py-2 rounded-full text-sm mb-6">
            <Database className="w-4 h-4 text-neon-blue" />
            <span className="text-neon-blue font-mono">LIVE BLOCKCHAIN EXPLORER</span>
            <div className={`w-2 h-2 rounded-full animate-pulse ${isValid ? 'bg-neon-green' : 'bg-red-400'}`} />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            <span className="gradient-text-blue-purple">Immutable</span>
            <span className="text-white"> Ledger</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Every verification is permanently recorded on the blockchain. Tamper-proof, publicly auditable, and cryptographically linked.
          </p>
        </div>

        {/* Chain status banner */}
        <div className={`glass rounded-xl p-4 mb-8 flex items-center gap-3 ${isValid ? 'neon-border-green' : 'border border-red-500/40'}`}>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isValid ? 'bg-neon-green/10' : 'bg-red-500/10'}`}>
            <Shield className={`w-5 h-5 ${isValid ? 'text-neon-green' : 'text-red-400'}`} />
          </div>
          <div>
            <div className={`font-bold ${isValid ? 'text-neon-green' : 'text-red-400'}`}>
              Chain Integrity: {isValid ? '✓ VALID' : '✗ COMPROMISED'}
            </div>
            <div className="text-xs text-gray-500">
              {isValid ? 'All block hashes verified. Chain is intact and tamper-free.' : 'Chain integrity violation detected!'}
            </div>
          </div>
          <div className="ml-auto text-right text-xs font-mono text-gray-500">
            <div className="text-neon-blue">{blocks.length} blocks loaded</div>
            <div>Refreshes every 10s</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Block list */}
          <div className="lg:col-span-2 space-y-3">
            {blocks.map((block, idx) => (
              <div key={block.index} className="relative">
                {/* Chain connector */}
                {idx < blocks.length - 1 && (
                  <div className="absolute left-7 top-full w-px h-3 bg-gradient-to-b from-neon-blue/30 to-transparent z-10" />
                )}
                
                <div
                  className={`glass rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-[1.01] ${
                    selectedBlock?.index === block.index ? 'neon-border-blue shadow-lg shadow-neon-blue/10' : 'border border-dark-border hover:border-neon-blue/30'
                  }`}
                  onClick={() => setSelectedBlock(selectedBlock?.index === block.index ? null : block)}
                >
                  <div className="flex items-center gap-4">
                    {/* Block number */}
                    <div className="w-14 h-14 glass neon-border-blue rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                      <div className="text-xs text-gray-500 font-mono">BLK</div>
                      <div className="text-neon-blue font-bold font-mono text-sm">#{block.index}</div>
                    </div>
                    
                    {/* Block info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-gray-500">HASH:</span>
                        <span className="text-xs font-mono text-neon-blue">{formatHash(block.hash)}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-500 truncate">{block.data.fileName}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${getResultBg(block.data.analysisResult)}`}>
                          {block.data.analysisResult}
                        </span>
                        <span className="text-xs text-gray-500 font-mono">
                          {block.data.confidence.toFixed(1)}% confidence
                        </span>
                      </div>
                    </div>

                    {/* Time & validator */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs text-gray-500 mb-1">{formatTime(block.timestamp)}</div>
                      <div className="text-xs font-mono text-neon-purple">{block.validator}</div>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="status-verified px-2 py-0.5 rounded text-xs">SEALED</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded details */}
                  {selectedBlock?.index === block.index && (
                    <div className="mt-4 pt-4 border-t border-dark-border grid sm:grid-cols-2 gap-3">
                      {[
                        { label: 'Block Hash', value: block.hash.slice(0, 32) + '...', mono: true },
                        { label: 'Prev Hash', value: block.previousHash.slice(0, 32) + '...', mono: true },
                        { label: 'Media Hash', value: block.data.mediaHash.slice(0, 32) + '...', mono: true },
                        { label: 'Merkle Root', value: block.merkleRoot.slice(0, 32) + '...', mono: true },
                        { label: 'Nonce', value: block.nonce.toString(), mono: true },
                        { label: 'File Size', value: `${(block.data.fileSize / 1024 / 1024).toFixed(2)} MB`, mono: false },
                        { label: 'MIME Type', value: block.data.mimeType, mono: false },
                        { label: 'Submitter', value: block.data.submitterAddress, mono: true },
                      ].map(({ label, value, mono }) => (
                        <div key={label} className="bg-dark-border/30 rounded-lg p-2">
                          <div className="text-xs text-gray-500 mb-0.5">{label}</div>
                          <div className={`text-xs text-neon-blue break-all ${mono ? 'font-mono' : ''}`}>{value}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Chain stats sidebar */}
          <div className="space-y-4">
            {/* Chain visualization */}
            <div className="glass neon-border-blue rounded-xl p-5">
              <h3 className="text-sm font-bold text-neon-blue mb-4 flex items-center gap-2">
                <Link className="w-4 h-4" />
                CHAIN STRUCTURE
              </h3>
              <div className="space-y-1">
                {blocks.slice(0, 6).map((block, idx) => (
                  <div key={block.index} className="relative">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center text-xs font-mono text-neon-blue">
                        {block.index}
                      </div>
                      <div className="flex-1 h-6 bg-dark-border/50 rounded text-xs font-mono text-gray-500 flex items-center px-2 overflow-hidden">
                        {block.hash.slice(0, 12)}...
                      </div>
                      <ArrowRight className="w-3 h-3 text-gray-600" />
                    </div>
                    {idx < 5 && (
                      <div className="ml-3 w-px h-2 bg-neon-blue/20" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Analysis stats */}
            <div className="glass neon-border-purple rounded-xl p-5">
              <h3 className="text-sm font-bold text-neon-purple mb-4 flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                DETECTION STATS
              </h3>
              {(() => {
                const authentic = blocks.filter(b => b.data.analysisResult === 'AUTHENTIC').length;
                const deepfake = blocks.filter(b => b.data.analysisResult === 'DEEPFAKE').length;
                const suspicious = blocks.filter(b => b.data.analysisResult === 'SUSPICIOUS').length;
                const total = blocks.length;
                return (
                  <div className="space-y-3">
                    {[
                      { label: 'Authentic', count: authentic, color: 'bg-neon-green', textColor: 'text-neon-green' },
                      { label: 'Deepfake', count: deepfake, color: 'bg-red-500', textColor: 'text-red-400' },
                      { label: 'Suspicious', count: suspicious, color: 'bg-yellow-400', textColor: 'text-yellow-400' },
                    ].map(({ label, count, color, textColor }) => (
                      <div key={label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">{label}</span>
                          <span className={`font-bold font-mono ${textColor}`}>{count}/{total}</span>
                        </div>
                        <div className="w-full h-1.5 bg-dark-border rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${color}`} style={{ width: `${total ? (count / total) * 100 : 0}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Network info */}
            <div className="glass neon-border-green rounded-xl p-5">
              <h3 className="text-sm font-bold text-neon-green mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                NETWORK INFO
              </h3>
              <div className="space-y-2 text-xs font-mono">
                {[
                  { label: 'Network', value: 'ChainProof Mainnet' },
                  { label: 'Protocol', value: 'PoA v2.1' },
                  { label: 'Block Time', value: '~2.3 seconds' },
                  { label: 'Validators', value: '47 active' },
                  { label: 'Consensus', value: 'PBFT' },
                  { label: 'Hash Algo', value: 'SHA-256' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-gray-500">{label}</span>
                    <span className="text-gray-300">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
