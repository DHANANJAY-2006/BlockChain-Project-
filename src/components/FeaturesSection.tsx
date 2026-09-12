'use client';

import { Shield, Brain, Lock, Eye, Zap, Globe, Award, Users } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Multi-Model AI Detection',
    description: 'Six specialized neural networks analyze facial geometry, temporal consistency, GAN artifacts, compression patterns, lighting physics, and metadata integrity.',
    color: 'neon-blue',
    stats: '99.7% accuracy',
  },
  {
    icon: Shield,
    title: 'Immutable Blockchain Proof',
    description: 'Every verification result is cryptographically sealed in a block, linked to the previous block\'s hash, making tampering mathematically impossible.',
    color: 'neon-purple',
    stats: 'SHA-256 secured',
  },
  {
    icon: Lock,
    title: 'Zero-Knowledge Privacy',
    description: 'Media files are processed entirely in your browser. Only a SHA-256 fingerprint is submitted — your content never leaves your device.',
    color: 'neon-green',
    stats: '100% private',
  },
  {
    icon: Zap,
    title: 'Real-Time Analysis',
    description: 'Advanced GPU-accelerated inference delivers deepfake detection results in seconds, with immediate blockchain confirmation.',
    color: 'neon-blue',
    stats: '< 5 seconds',
  },
  {
    icon: Globe,
    title: 'Publicly Auditable',
    description: 'The entire verification ledger is publicly accessible. Anyone can independently verify any result by checking the cryptographic hash on-chain.',
    color: 'neon-purple',
    stats: 'Open ledger',
  },
  {
    icon: Eye,
    title: 'Multi-Format Support',
    description: 'Detect deepfakes in videos (MP4, AVI, MOV), images (JPG, PNG, WebP), and audio files (WAV, MP3) with equal precision.',
    color: 'neon-green',
    stats: '12+ formats',
  },
];

const colorMap: Record<string, { text: string; border: string; bg: string }> = {
  'neon-blue': { text: 'text-neon-blue', border: 'neon-border-blue', bg: 'bg-neon-blue/10' },
  'neon-purple': { text: 'text-neon-purple', border: 'neon-border-purple', bg: 'bg-neon-purple/10' },
  'neon-green': { text: 'text-neon-green', border: 'neon-border-green', bg: 'bg-neon-green/10' },
};

export default function FeaturesSection() {
  return (
    <section className="relative py-24 cyber-grid-bg">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-card/30 to-dark-bg" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass neon-border-blue px-4 py-2 rounded-full text-sm mb-6">
            <Award className="w-4 h-4 text-neon-blue" />
            <span className="text-neon-blue font-mono">CORE CAPABILITIES</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            <span className="text-white">Built for the</span>
            <br />
            <span className="gradient-text-blue-purple">Disinformation Age</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Advanced technology stack combining state-of-the-art AI with the immutability of blockchain
          </p>
        </div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature) => {
            const colors = colorMap[feature.color];
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="feature-card glass border border-dark-border rounded-2xl p-6 hover:border-opacity-100 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${colors.bg} ${colors.border} glass rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <span className={`text-xs font-mono font-bold ${colors.text} glass px-2 py-1 rounded-full ${colors.border}`}>
                    {feature.stats}
                  </span>
                </div>
                <h3 className={`text-lg font-bold text-white mb-2 group-hover:${colors.text} transition-colors`}>
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>


      </div>
    </section>
  );
}
