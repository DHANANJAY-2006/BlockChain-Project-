'use client';

import { useEffect, useRef } from 'react';
import { Shield, Zap, Lock, ChevronDown } from 'lucide-react';

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Particle system
    const particles: { x: number; y: number; vx: number; vy: number; size: number; color: string; opacity: number }[] = [];
    const colors = ['#00d4ff', '#8b5cf6', '#00ff88', '#ff6b6b'];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.6 + 0.1,
      });
    }

    // Network connections
    function drawConnections() {
      if (!ctx || !canvas) return;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 212, 255, ${(1 - distance / 120) * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    let animationFrame: number;
    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      drawConnections();

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Glow effect
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        gradient.addColorStop(0, p.color + '40');
        gradient.addColorStop(1, p.color + '00');
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ background: 'radial-gradient(ellipse at center, #0f0f1a 0%, #0a0a0f 70%)' }}
      />

      {/* Radial gradient overlays */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-blue/3 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 glass neon-border-blue px-4 py-2 rounded-full text-sm mb-8">
          <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
          <span className="text-neon-blue font-mono">MAINNET LIVE</span>
          <span className="text-gray-500">|</span>
          <span className="text-gray-400">Block #</span>
          <span className="text-neon-blue font-mono">847,291</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black mb-6 leading-tight">
          <span className="gradient-text-blue-purple">Blockchain</span>
          <br />
          <span className="text-white">DeepFake</span>
          <br />
          <span className="gradient-text-green-blue">Proof System</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          Combat the deepfake epidemic with{' '}
          <span className="text-neon-blue font-semibold">military-grade AI analysis</span> and{' '}
          <span className="text-neon-purple font-semibold">immutable blockchain verification</span>.
          Every result is cryptographically sealed, publicly auditable, and tamper-proof.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="#verify"
            className="btn-primary px-8 py-4 rounded-xl text-lg font-bold flex items-center gap-3 shadow-2xl shadow-neon-blue/20"
          >
            <Shield className="w-5 h-5" />
            Verify Media Now
          </a>
          <a
            href="#how-it-works"
            className="btn-secondary px-8 py-4 rounded-xl text-lg font-bold flex items-center gap-3"
          >
            <Zap className="w-5 h-5" />
            How It Works
          </a>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16">
          {[
            { label: 'Media Verified', value: '2.4M+', color: 'text-neon-blue' },
            { label: 'Deepfakes Caught', value: '847K', color: 'text-red-400' },
            { label: 'Accuracy Rate', value: '99.7%', color: 'text-neon-green' },
            { label: 'Active Validators', value: '47', color: 'text-neon-purple' },
          ].map((stat) => (
            <div key={stat.label} className="glass neon-border-blue rounded-xl p-4">
              <div className={`text-2xl sm:text-3xl font-black ${stat.color} font-mono`}>{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Feature chips */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {[
            { icon: Lock, label: 'SHA-256 Encrypted', color: 'text-neon-blue' },
            { icon: Shield, label: 'AI-Powered Analysis', color: 'text-neon-purple' },
            { icon: Zap, label: 'Real-Time Verification', color: 'text-neon-green' },
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} className={`glass neon-border-blue flex items-center gap-2 px-4 py-2 rounded-full text-sm`}>
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-gray-300">{label}</span>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-gray-600 font-mono">SCROLL TO EXPLORE</span>
          <ChevronDown className="w-5 h-5 text-gray-600" />
        </div>
      </div>

      {/* Floating blockchain blocks decoration */}
      <div className="absolute left-8 top-1/3 hidden xl:block">
        <div className="space-y-2 opacity-20">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-16 h-6 glass neon-border-blue rounded flex items-center justify-center text-xs font-mono text-neon-blue"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              #{i + 847287}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute right-8 top-1/3 hidden xl:block">
        <div className="space-y-2 opacity-20">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-24 h-6 glass neon-border-purple rounded flex items-center justify-center text-xs font-mono text-neon-purple"
            >
              0x{Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0')}...
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
