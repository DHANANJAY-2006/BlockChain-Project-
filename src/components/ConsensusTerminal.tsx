'use client';

import { useEffect, useState, useRef } from 'react';
import { Terminal, Activity, Cpu, Network, Database, Lock } from 'lucide-react';

export default function ConsensusTerminal() {
  const [logs, setLogs] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Generate realistic looking cryptographic logs
  useEffect(() => {
    const operations = [
      'Validating zk-SNARK proof for transaction payload...',
      'Executing Smart Contract 0x8F9d...a1C on EVM...',
      'Calculating Merkle Root hash...',
      'Broadcasting Block Candidate to Peer Network...',
      'Synchronizing mempool with Node US-East (Latency: 12ms)...',
      'Synchronizing mempool with Node EU-West (Latency: 45ms)...',
      'Synchronizing mempool with Node AP-South (Latency: 110ms)...',
      'Verifying ECDSA signature for public key 0x4B2...',
      'Performing Fourier Transform on media frequency domain...',
      'Extracting PRNU (Photo Response Non-Uniformity) noise pattern...',
      'Cross-referencing media fingerprint with global decentralized registry...',
      'Consensus Reached: 98.4% Validator agreement.',
      'Mining block: Solving PoW cryptographic puzzle (Difficulty: 4.2M)...',
      'Nonce found! Hash: 0000a4b7f...',
      'Appending Block to Main Chain...',
      'State Root updated. Triggering contract event MediaVerified().'
    ];

    const generateLog = () => {
      const timestamp = new Date().toISOString().substring(11, 23);
      const randomOp = operations[Math.floor(Math.random() * operations.length)];
      const randomHex = Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      return `[${timestamp}] [SYS-${randomHex}] ${randomOp}`;
    };

    // Pre-fill some logs
    setLogs(Array.from({ length: 8 }, generateLog));

    const interval = setInterval(() => {
      setLogs((prev) => {
        const newLogs = [...prev, generateLog()];
        if (newLogs.length > 50) return newLogs.slice(newLogs.length - 50);
        return newLogs;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="glass neon-border-purple rounded-2xl overflow-hidden flex flex-col h-[400px]">
      {/* Terminal Header */}
      <div className="bg-dark-border/50 px-4 py-3 border-b border-dark-border flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-neon-purple" />
          <span className="text-xs font-bold text-white font-mono tracking-wider">NETWORK CONSENSUS & FORENSIC LOGS</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-neon-green/50" />
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-4 flex-1 overflow-y-auto bg-black/40 font-mono text-xs leading-relaxed font-medium">
        {logs.map((log, i) => {
          let colorClass = 'text-gray-400';
          if (log.includes('Consensus Reached')) colorClass = 'text-neon-green font-bold';
          if (log.includes('Mining block')) colorClass = 'text-yellow-400';
          if (log.includes('Smart Contract')) colorClass = 'text-neon-purple';
          if (log.includes('zk-SNARK')) colorClass = 'text-neon-blue';
          
          return (
            <div key={i} className={`mb-1.5 ${colorClass}`}>
              <span className="text-gray-600 mr-2">{log.split('] ')[0]}]</span>
              <span className="text-gray-500 mr-2">{log.split('] ')[1]}]</span>
              {log.split('] ')[2]}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Network Metrics Footer */}
      <div className="bg-dark-card border-t border-dark-border p-3 grid grid-cols-4 gap-4 divide-x divide-dark-border">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-1.5 text-gray-500 mb-1">
            <Activity className="w-3 h-3" />
            <span className="text-[10px] font-bold">NETWORK HASH RATE</span>
          </div>
          <span className="text-sm font-mono text-white">42.8 EH/s</span>
        </div>
        <div className="flex flex-col items-center justify-center pl-4">
          <div className="flex items-center gap-1.5 text-gray-500 mb-1">
            <Database className="w-3 h-3" />
            <span className="text-[10px] font-bold">ACTIVE NODES</span>
          </div>
          <span className="text-sm font-mono text-neon-blue">12,408</span>
        </div>
        <div className="flex flex-col items-center justify-center pl-4">
          <div className="flex items-center gap-1.5 text-gray-500 mb-1">
            <Lock className="w-3 h-3" />
            <span className="text-[10px] font-bold">ENCRYPTION</span>
          </div>
          <span className="text-sm font-mono text-neon-green">AES-256 / SHA-256</span>
        </div>
        <div className="flex flex-col items-center justify-center pl-4">
          <div className="flex items-center gap-1.5 text-gray-500 mb-1">
            <Network className="w-3 h-3" />
            <span className="text-[10px] font-bold">AVG LATENCY</span>
          </div>
          <span className="text-sm font-mono text-yellow-400">24ms</span>
        </div>
      </div>
    </div>
  );
}
