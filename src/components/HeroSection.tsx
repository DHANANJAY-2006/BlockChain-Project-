'use client';

import { useEffect, useRef, useState } from 'react';
import { Shield, Zap, Lock, ChevronDown } from 'lucide-react';
import { getBlockchain } from '@/lib/blockchain';

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [blockCount, setBlockCount] = useState(1); // starts with genesis

  useEffect(() => {
    const bc = getBlockchain();
    setBlockCount(bc.getBlockCount());
    const interval = setInterval(() => setBlockCount(bc.getBlockCount()), 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#00d4ff', '#8b5cf6', '#00ff88'];
    const particles: { x: number; y: number; vx: number; vy: number; size: number; color: string; opacity: number }[] = [];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    function drawConnections() {
      if (!ctx || !canvas) return;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,212,255,${(1 - d / 120) * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    let raf: number;
    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Grid
      ctx.strokeStyle = 'rgba(0,212,255,0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      drawConnections();

      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
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
      });

      raf = requestAnimationFrame(animate);
    }

    animate();

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ background: 'radial-gradient(ellipse at center, #0f0f1a 0%, #0a0a0f 70%)' }}
      />
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        {/* Live badge */}
        <div className="inline-flex items-center gap-2 glass neon-border-blue px-4 py-2 rounded-full text-sm mb-8">
          <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
          <span className="text-neon-blue font-mono">CHAIN ACTIVE</span>
          <span className="text-gray-500">|</span>
          <span className="text-gray-400 font-mono">{blockCount} block{blockCount !== 1 ? 's' : ''} on chain</span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black mb-6 leading-tight">
          <span className="gradient-text-blue-purple">Blockchain</span>
          <br />
          <span className="text-white">DeepFake</span>
          <br />
          <span className="gradient-text-green-blue">Proof System</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          Upload any video, image, or audio file. Our AI analyzes it for deepfake signatures and the
          result is{' '}
          <span className="text-neon-blue font-semibold">permanently sealed</span> on an{' '}
          <span className="text-neon-purple font-semibold">immutable blockchain</span> — tamper-proof and publicly verifiable.
        </p>

        {/* CTAs */}
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

        {/* Tech chips */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {[
            { icon: Lock, label: 'SHA-256 Cryptographic Hashing' },
            { icon: Shield, label: 'AI Neural Network Analysis' },
            { icon: Zap, label: 'Immutable Blockchain Record' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="glass neon-border-blue flex items-center gap-2 px-4 py-2 rounded-full text-sm">
              <Icon className="w-4 h-4 text-neon-blue" />
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
    </section>
  );
}
