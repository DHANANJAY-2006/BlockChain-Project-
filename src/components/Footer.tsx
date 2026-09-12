'use client';

import { Shield, Github, Twitter, ExternalLink, Heart, Lock, Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative border-t border-dark-border">
      <div className="absolute inset-0 cyber-grid-bg opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-blue/50 to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold gradient-text-blue-purple">ChainProof</span>
                <div className="text-xs text-gray-500 font-mono">v2.1.0 MAINNET</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed max-w-md">
              The world's first blockchain-secured deepfake detection system. Every analysis is cryptographically recorded, publicly verifiable, and permanently tamper-proof.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://github.com/DHANANJAY-2006/BlockChain-Project-" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 glass neon-border-blue rounded-lg flex items-center justify-center hover:bg-neon-blue/10 transition-colors">
                <Github className="w-4 h-4 text-neon-blue" />
              </a>
              <a href="#" className="w-9 h-9 glass neon-border-blue rounded-lg flex items-center justify-center hover:bg-neon-blue/10 transition-colors">
                <Twitter className="w-4 h-4 text-neon-blue" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">System</h3>
            <div className="space-y-2">
              {['Verify Media', 'Blockchain Explorer', 'Network Stats', 'How It Works', 'API Docs'].map(link => (
                <a key={link} href="#" className="block text-sm text-gray-500 hover:text-neon-blue transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white mb-4">Technology</h3>
            <div className="space-y-2">
              {[
                { label: 'SHA-256 Hashing', icon: Lock },
                { label: 'PoA Consensus', icon: Shield },
                { label: 'AI Neural Networks', icon: Zap },
                { label: 'PBFT Protocol', icon: Shield },
              ].map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-gray-500">
                  <Icon className="w-3 h-3 text-neon-blue/50" />
                  {label}
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <div className="glass neon-border-green rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-neon-green">NETWORK ACTIVE</span>
                </div>
                <div className="text-xs text-gray-500 font-mono">Block: #847,291</div>
                <div className="text-xs text-gray-500 font-mono">Validators: 47/47</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-dark-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600 text-center sm:text-left">
            © 2024 ChainProof. Built by{' '}
            <a
              href="https://github.com/DHANANJAY-2006"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-blue hover:underline"
            >
              DHANANJAY
            </a>
            . Open source on{' '}
            <a
              href="https://github.com/DHANANJAY-2006/BlockChain-Project-"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-blue hover:underline inline-flex items-center gap-1"
            >
              GitHub <ExternalLink className="w-3 h-3" />
            </a>
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-neon-green" />
              Privacy-First
            </span>
            <span>•</span>
            <span>Client-side Processing</span>
            <span>•</span>
            <span>Open Source</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
