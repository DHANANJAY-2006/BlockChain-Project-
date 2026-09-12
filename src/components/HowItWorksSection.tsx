'use client';

import { Upload, Hash, Cpu, Shield, CheckCircle, ArrowDown } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    number: '01',
    title: 'Upload Media',
    description: 'Upload any video, image, or audio file. The file is processed locally — nothing is stored on our servers.',
    color: 'neon-blue',
    details: ['Supports MP4, AVI, MOV, JPG, PNG, WAV', 'Client-side processing for privacy', 'Up to 500MB file size'],
  },
  {
    icon: Hash,
    number: '02',
    title: 'SHA-256 Hashing',
    description: 'The file is cryptographically hashed using SHA-256, creating a unique 256-bit fingerprint that identifies the media.',
    color: 'neon-purple',
    details: ['Collision-resistant cryptographic hash', 'Content-based fingerprinting', 'Used for blockchain identification'],
  },
  {
    icon: Cpu,
    number: '03',
    title: 'AI Analysis',
    description: 'Multiple neural networks analyze facial consistency, temporal anomalies, artifact detection, lighting patterns, and metadata integrity.',
    color: 'neon-green',
    details: ['Face consistency neural network', 'Temporal flow analysis', 'Artifact & compression detection', 'Lighting & shadow verification'],
  },
  {
    icon: Shield,
    number: '04',
    title: 'Blockchain Recording',
    description: 'The result is written to an immutable block in the blockchain, cryptographically linked to the previous block with a verified hash.',
    color: 'neon-blue',
    details: ['Immutable permanent record', 'Cryptographic block linking', 'Validator node consensus', 'Publicly auditable result'],
  },
  {
    icon: CheckCircle,
    number: '05',
    title: 'Verified Certificate',
    description: 'Receive a cryptographic certificate of authenticity (or deepfake detection) with the full blockchain proof.',
    color: 'neon-purple',
    details: ['On-chain verification proof', 'Hash-linked certificate', 'Shareable verification link', 'Permanent audit trail'],
  },
];

const colorMap: Record<string, { text: string; border: string; bg: string; glow: string }> = {
  'neon-blue': {
    text: 'text-neon-blue',
    border: 'neon-border-blue',
    bg: 'bg-neon-blue/10',
    glow: 'shadow-neon-blue/20',
  },
  'neon-purple': {
    text: 'text-neon-purple',
    border: 'neon-border-purple',
    bg: 'bg-neon-purple/10',
    glow: 'shadow-neon-purple/20',
  },
  'neon-green': {
    text: 'text-neon-green',
    border: 'neon-border-green',
    bg: 'bg-neon-green/10',
    glow: 'shadow-neon-green/20',
  },
};

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-24 cyber-grid-bg">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-card/30 via-dark-bg to-dark-card/30" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 glass neon-border-blue px-4 py-2 rounded-full text-sm mb-6">
            <Cpu className="w-4 h-4 text-neon-blue" />
            <span className="text-neon-blue font-mono">SYSTEM ARCHITECTURE</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            <span className="text-white">How It</span>{' '}
            <span className="gradient-text-blue-purple">Works</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A five-step pipeline combining advanced AI analysis with immutable blockchain technology
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-neon-blue via-neon-purple to-neon-green opacity-20 -translate-x-1/2" />

          <div className="space-y-8">
            {steps.map((step, idx) => {
              const colors = colorMap[step.color];
              const Icon = step.icon;
              const isEven = idx % 2 === 0;

              return (
                <div key={step.number} className={`relative flex gap-6 sm:gap-0 ${isEven ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}>
                  {/* Left content (desktop) */}
                  <div className={`hidden sm:flex sm:w-[calc(50%-2rem)] ${isEven ? 'justify-end pr-8' : 'justify-start pl-8'}`}>
                    {isEven && (
                      <div className={`glass ${colors.border} rounded-2xl p-5 max-w-sm w-full hover:shadow-lg hover:${colors.glow} transition-all duration-300`}>
                        <div className="space-y-1.5">
                          {step.details.map((detail) => (
                            <div key={detail} className="flex items-center gap-2 text-sm text-gray-400">
                              <div className={`w-1.5 h-1.5 rounded-full ${colors.text.replace('text', 'bg')}`} />
                              {detail}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Center icon */}
                  <div className="relative z-10 flex-shrink-0 flex flex-col items-center">
                    <div className={`w-16 h-16 ${colors.bg} ${colors.border} glass rounded-2xl flex items-center justify-center shadow-lg`}>
                      <Icon className={`w-7 h-7 ${colors.text}`} />
                    </div>
                    <div className={`text-xs font-bold font-mono ${colors.text} mt-1`}>{step.number}</div>
                  </div>

                  {/* Right content */}
                  <div className={`flex-1 sm:w-[calc(50%-2rem)] ${isEven ? 'sm:pl-8' : 'sm:pr-8'} pb-8`}>
                    <div className={`glass border border-dark-border rounded-2xl p-5 hover:${colors.border} hover:shadow-lg transition-all duration-300`}>
                      <h3 className={`text-xl font-bold ${colors.text} mb-2`}>{step.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-3">{step.description}</p>
                      {/* Mobile details */}
                      <div className="sm:hidden space-y-1.5 pt-3 border-t border-dark-border">
                        {step.details.map((detail) => (
                          <div key={detail} className="flex items-center gap-2 text-xs text-gray-500">
                            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${colors.text.replace('text', 'bg')}`} />
                            {detail}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Odd desktop details */}
                    {!isEven && (
                      <div className={`hidden sm:block glass ${colors.border} rounded-2xl p-5 max-w-sm w-full mt-3 hover:shadow-lg transition-all duration-300`}>
                        <div className="space-y-1.5">
                          {step.details.map((detail) => (
                            <div key={detail} className="flex items-center gap-2 text-sm text-gray-400">
                              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${colors.text.replace('text', 'bg')}`} />
                              {detail}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <a href="#verify" className="btn-primary px-8 py-4 rounded-xl text-lg font-bold inline-flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Try It Now — Free
          </a>
          <p className="text-gray-600 text-sm mt-3">No account required • Client-side processing • Blockchain-verified</p>
        </div>
      </div>
    </section>
  );
}
