'use client';

import { useState, useEffect } from 'react';
import { Shield, Hash, Clock, Database, Cpu, Link, ArrowRight, Info } from 'lucide-react';
import { getBlockchain } from '@/lib/blockchain';
import { Block } from '@/lib/types';

export default function BlockchainSection() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [isValid, setIsValid] = useState(true);
  const [totalBlocks, setTotalBlocks] = useState(0);

  const refresh = () => {
    const bc = getBlockchain();
    const chain = bc.getChain();
    setBlocks(chain);
    setTotalBlocks(chain.length);
    setIsValid(bc.validateChain());
  };

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatHash = (hash: string) => `${hash.slice(0, 12)}...${hash.slice(-8)}`;

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    const secs = Math.floor(diff / 1000);
    const mins = Math.floor(secs / 60);
    const hours = Math.floor(mins / 60);
    if (hours > 24) return `${Math.floor(hours / 24)}d ago`;
    if (hours > 0) return `${hours}h ${mins % 60}m ago`;
    if (mins > 0) return `${mins}m ago`;
    if (secs > 5) return `${secs}s ago`;
    return 'Just now';
  };

  const getResultStyle = (result: string) => {
    if (result === 'AUTHENTIC') return { badge: 'status-verified', dot: 'bg-neon-green', text: 'text-neon-green' };
    if (result === 'DEEPFAKE') return { badge: 'status-fake', dot: 'bg-red-400', text: 'text-red-400' };
    return { badge: 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400', dot: 'bg-yellow-400', text: 'text-yellow-400' };
  };

  // Blocks to show (all blocks except genesis for the main list, show genesis separately)
  const genesisBlock = blocks.find(b => b.index === 0);
  const userBlocks = blocks.filter(b => b.index > 0);

  return (
    <section id="blockchain" className="relative py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-bg to-dark-card/30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-blue/40 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
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
            Every verification you submit is permanently recorded here. Tamper-proof and cryptographically linked.
          </p>
        </div>

        {/* Chain status */}
        <div className={`glass rounded-xl p-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 ${isValid ? 'neon-border-green' : 'border border-red-500/40'}`}>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isValid ? 'bg-neon-green/10' : 'bg-red-500/10'}`}>
            <Shield className={`w-5 h-5 ${isValid ? 'text-neon-green' : 'text-red-400'}`} />
          </div>
          <div className="flex-1">
            <div className={`font-bold ${isValid ? 'text-neon-green' : 'text-red-400'}`}>
              Chain Integrity: {isValid ? '✓ VALID — All block hashes verified' : '✗ COMPROMISED'}
            </div>
            <div className="text-xs text-gray-500 font-mono mt-0.5">
              {totalBlocks} block{totalBlocks !== 1 ? 's' : ''} on chain • Consensus: Proof-of-Authority • Hash: SHA-256
            </div>
          </div>
          <button onClick={refresh} className="btn-secondary px-3 py-1.5 rounded-lg text-xs flex-shrink-0">
            Refresh
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main block list */}
          <div className="lg:col-span-2 space-y-3">

            {/* Empty state — no user verifications yet */}
            {userBlocks.length === 0 && (
              <div className="glass neon-border-blue rounded-2xl p-12 text-center">
                <div className="w-16 h-16 glass neon-border-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Database className="w-8 h-8 text-neon-blue/40" />
                </div>
                <h3 className="text-xl font-bold text-gray-400 mb-2">No Verifications Yet</h3>
                <p className="text-gray-600 text-sm mb-6 max-w-xs mx-auto">
                  Upload a media file in the Verify section above to add the first block to the chain.
                </p>
                <a href="#verify" className="btn-primary px-6 py-2.5 rounded-xl text-sm inline-flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Verify Your First File
                </a>
              </div>
            )}

            {/* User verification blocks */}
            {userBlocks.map((block, idx) => {
              const style = getResultStyle(block.data.analysisResult);
              const isSelected = selectedBlock?.index === block.index;
              return (
                <div key={block.index} className="relative">
                  {idx < userBlocks.length - 1 && (
                    <div className="absolute left-7 top-full w-px h-3 bg-gradient-to-b from-neon-blue/30 to-transparent z-10" />
                  )}
                  <div
                    className={`glass rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                      isSelected ? 'neon-border-blue shadow-lg shadow-neon-blue/10 scale-[1.01]' : 'border border-dark-border hover:border-neon-blue/30'
                    }`}
                    onClick={() => setSelectedBlock(isSelected ? null : block)}
                  >
                    <div className="flex items-center gap-4">
                      {/* Block number */}
                      <div className="w-14 h-14 glass neon-border-blue rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                        <div className="text-xs text-gray-500 font-mono">BLK</div>
                        <div className="text-neon-blue font-bold font-mono">#{block.index}</div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-gray-500">HASH:</span>
                          <span className="text-xs font-mono text-neon-blue truncate">{formatHash(block.hash)}</span>
                        </div>
                        <div className="text-xs text-gray-400 truncate mb-1.5" title={block.data.fileName}>
                          {block.data.fileName}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${style.badge}`}>
                            {block.data.analysisResult}
                          </span>
                          <span className="text-xs text-gray-500 font-mono">
                            {block.data.confidence.toFixed(2)}% confidence
                          </span>
                        </div>
                      </div>

                      {/* Time + status */}
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs text-gray-500">{formatTime(block.timestamp)}</div>
                        <div className="text-xs font-mono text-neon-purple mt-0.5">{block.validator}</div>
                        <span className="status-verified px-2 py-0.5 rounded text-xs mt-1 inline-block">SEALED</span>
                      </div>
                    </div>

                    {/* Expanded view */}
                    {isSelected && (
                      <div className="mt-4 pt-4 border-t border-dark-border grid sm:grid-cols-2 gap-2.5">
                        {[
                          { label: 'Block Hash', value: block.hash },
                          { label: 'Previous Hash', value: block.previousHash },
                          { label: 'Media SHA-256', value: block.data.mediaHash },
                          { label: 'Merkle Root', value: block.merkleRoot },
                          { label: 'Nonce', value: block.nonce.toString() },
                          { label: 'Validator', value: block.validator },
                          { label: 'File Size', value: block.data.fileSize > 0 ? `${(block.data.fileSize / 1024 / 1024).toFixed(3)} MB` : '—' },
                          { label: 'MIME Type', value: block.data.mimeType },
                        ].map(({ label, value }) => (
                          <div key={label} className="bg-dark-border/30 rounded-lg p-2.5">
                            <div className="text-xs text-gray-500 mb-0.5">{label}</div>
                            <div className="text-xs font-mono text-neon-blue break-all">{value}</div>
                          </div>
                        ))}

                        {/* Analysis detail bars */}
                        <div className="sm:col-span-2 bg-dark-border/30 rounded-lg p-2.5">
                          <div className="text-xs text-gray-500 mb-2">AI Analysis Breakdown</div>
                          <div className="grid sm:grid-cols-2 gap-2">
                            {Object.entries(block.data.analysisDetails).map(([key, val]) => {
                              const label = key.replace(/([A-Z])/g, ' $1').replace(' Score', '').trim();
                              const v = typeof val === 'number' ? val : 0;
                              return (
                                <div key={key}>
                                  <div className="flex justify-between text-xs mb-0.5">
                                    <span className="text-gray-400 capitalize">{label}</span>
                                    <span className={`font-mono font-bold ${v > 70 ? 'text-neon-green' : v > 45 ? 'text-yellow-400' : 'text-red-400'}`}>
                                      {v.toFixed(1)}%
                                    </span>
                                  </div>
                                  <div className="w-full h-1.5 bg-dark-border rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${v > 70 ? 'bg-neon-green' : v > 45 ? 'bg-yellow-400' : 'bg-red-500'}`}
                                      style={{ width: `${v}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Genesis block — always shown at bottom */}
            {genesisBlock && (
              <div className="relative">
                <div
                  className={`glass rounded-xl p-4 cursor-pointer border border-dark-border/50 opacity-60 hover:opacity-80 transition-all duration-200 ${
                    selectedBlock?.index === 0 ? 'neon-border-blue opacity-100' : ''
                  }`}
                  onClick={() => setSelectedBlock(selectedBlock?.index === 0 ? null : genesisBlock)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 glass neon-border-blue rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                      <div className="text-xs text-gray-500 font-mono">BLK</div>
                      <div className="text-neon-blue font-bold font-mono">#0</div>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-mono text-gray-500 mb-1">GENESIS BLOCK</div>
                      <div className="text-xs text-gray-500 font-mono">{formatHash(genesisBlock.hash)}</div>
                    </div>
                    <div className="text-xs text-gray-600 font-mono">Chain Origin</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Chain visualization */}
            <div className="glass neon-border-blue rounded-xl p-5">
              <h3 className="text-sm font-bold text-neon-blue mb-4 flex items-center gap-2">
                <Link className="w-4 h-4" />
                CHAIN STRUCTURE
              </h3>
              {blocks.length <= 1 ? (
                <div className="text-center py-4">
                  <div className="flex items-center gap-2 justify-center mb-2">
                    <div className="w-6 h-6 rounded bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center text-xs font-mono text-neon-blue">
                      0
                    </div>
                    <ArrowRight className="w-3 h-3 text-gray-600" />
                    <div className="text-xs font-mono text-gray-600">Genesis</div>
                  </div>
                  <p className="text-xs text-gray-600 mt-3">New blocks appear here after each verification</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {blocks.slice(0, 6).map((block, idx) => (
                    <div key={block.index} className="relative">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-mono flex-shrink-0 ${
                          block.index === 0 ? 'bg-gray-800 border border-gray-700 text-gray-500' : 'bg-neon-blue/10 border border-neon-blue/20 text-neon-blue'
                        }`}>
                          {block.index}
                        </div>
                        <div className="flex-1 h-6 bg-dark-border/50 rounded text-xs font-mono text-gray-500 flex items-center px-2 overflow-hidden">
                          {block.hash.slice(0, 10)}…
                        </div>
                      </div>
                      {idx < Math.min(blocks.length - 1, 5) && (
                        <div className="ml-3 w-px h-1.5 bg-neon-blue/20" />
                      )}
                    </div>
                  ))}
                  {blocks.length > 6 && (
                    <div className="text-xs text-gray-600 text-center pt-1">+{blocks.length - 6} more blocks</div>
                  )}
                </div>
              )}
            </div>

            {/* Detection stats */}
            <div className="glass neon-border-purple rounded-xl p-5">
              <h3 className="text-sm font-bold text-neon-purple mb-4 flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                DETECTION STATS
              </h3>
              {userBlocks.length === 0 ? (
                <div className="text-center py-3 text-xs text-gray-600">
                  <Info className="w-6 h-6 mx-auto mb-2 text-gray-700" />
                  No verifications yet.<br />Stats appear after analysis.
                </div>
              ) : (
                <div className="space-y-3">
                  {[
                    { label: 'Authentic', count: userBlocks.filter(b => b.data.analysisResult === 'AUTHENTIC').length, color: 'bg-neon-green', textColor: 'text-neon-green' },
                    { label: 'Deepfake', count: userBlocks.filter(b => b.data.analysisResult === 'DEEPFAKE').length, color: 'bg-red-500', textColor: 'text-red-400' },
                    { label: 'Suspicious', count: userBlocks.filter(b => b.data.analysisResult === 'SUSPICIOUS').length, color: 'bg-yellow-400', textColor: 'text-yellow-400' },
                  ].map(({ label, count, color, textColor }) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">{label}</span>
                        <span className={`font-bold font-mono ${textColor}`}>{count} / {userBlocks.length}</span>
                      </div>
                      <div className="w-full h-1.5 bg-dark-border rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${color} transition-all duration-700`}
                          style={{ width: `${userBlocks.length ? (count / userBlocks.length) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                  { label: 'Hash Algo', value: 'SHA-256 (WebCrypto)' },
                  { label: 'Total Blocks', value: totalBlocks.toString() },
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
