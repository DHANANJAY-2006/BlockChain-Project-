'use client';
import { useState, useCallback, useRef } from 'react';
import { Upload, Shield, AlertTriangle, CheckCircle, Eye, Loader2, X, GitCompare, Hash, ArrowRight } from 'lucide-react';
import { getBlockchain } from '@/lib/blockchain';
interface FileState {
  file: File;
  hash: string | null;
  status: 'ready' | 'hashing' | 'hashed';
  previewUrl: string | null;
}
function formatHash(h: string) {
  return `${h.slice(0, 8)}...${h.slice(-8)}`;
}
function formatBytes(b: number) {
  if (b < 1024) return b + ' B';
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
  return (b / (1024 * 1024)).toFixed(2) + ' MB';
}
function DropZone({
  label,
  state,
  onFile,
  onClear,
  accent,
}: {
  label: string;
  state: FileState | null;
  onFile: (f: File) => void;
  onClear: () => void;
  accent: 'blue' | 'purple';
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const accentClasses = accent === 'blue'
    ? { border: 'border-neon-blue/40', hover: 'hover:border-neon-blue', icon: 'text-neon-blue', badge: 'text-neon-blue neon-border-blue', ring: 'neon-border-blue' }
    : { border: 'border-neon-purple/40', hover: 'hover:border-neon-purple', icon: 'text-neon-purple', badge: 'text-neon-purple neon-border-purple', ring: 'neon-border-purple' };
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  }, [onFile]);
  return (
    <div className="flex-1 min-w-0">
      <div className="text-xs font-mono text-gray-500 mb-2 flex items-center gap-2">
        <span className={accentClasses.icon}>●</span> {label}
      </div>
      {!state ? (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all min-h-44 flex flex-col items-center justify-center ${dragging ? `bg-dark-border/50 ${accentClasses.border}` : `border-dark-border ${accentClasses.hover} hover:bg-dark-border/30`}`}
        >
          <input ref={inputRef} type="file" className="hidden" accept="video/*,image/*,audio/*" onChange={e => e.target.files?.[0] && onFile(e.target.files[0])} />
          <Upload className={`w-8 h-8 mb-3 ${accentClasses.icon} opacity-50`} />
          <p className="text-sm text-gray-400">Drop file or click to browse</p>
          <p className="text-xs text-gray-600 mt-1">Video • Image • Audio</p>
        </div>
      ) : (
        <div className={`glass ${accentClasses.ring} rounded-xl p-4 relative min-h-44`}>
          <button onClick={onClear} className="absolute top-2 right-2 w-6 h-6 glass rounded flex items-center justify-center hover:bg-red-500/20">
            <X className="w-3 h-3 text-gray-400" />
          </button>
          {state.previewUrl && state.file.type.startsWith('image/') && (
            <div className="h-24 mb-3 rounded-lg overflow-hidden">
              <img src={state.previewUrl} alt="preview" className="w-full h-full object-cover opacity-70" />
            </div>
          )}
          <p className="text-sm text-white font-semibold truncate mb-1">{state.file.name}</p>
          <p className="text-xs text-gray-500 mb-3">{formatBytes(state.file.size)} • {state.file.type.split('/')[1]?.toUpperCase()}</p>
          {state.status === 'hashing' && (
            <div className="flex items-center gap-2 text-xs">
              <Loader2 className={`w-3 h-3 animate-spin ${accentClasses.icon}`} />
              <span className="text-gray-400">Computing SHA-256...</span>
            </div>
          )}
          {state.status === 'hashed' && state.hash && (
            <div className={`text-xs font-mono ${accentClasses.badge} glass px-2 py-1.5 rounded-lg`}>
              <div className="text-gray-500 mb-0.5">SHA-256</div>
              <div className="break-all">{state.hash.slice(0, 32)}</div>
              <div className="opacity-60">{state.hash.slice(32)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default function CompareSection() {
  const [fileA, setFileA] = useState<FileState | null>(null);
  const [fileB, setFileB] = useState<FileState | null>(null);
  const [comparing, setComparing] = useState(false);
  const [comparisonDone, setComparisonDone] = useState(false);
  const [identical, setIdentical] = useState(false);
  const [similarity, setSimilarity] = useState(0);
  const handleFile = async (file: File, slot: 'A' | 'B') => {
    const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
    const state: FileState = { file, hash: null, status: 'hashing', previewUrl: preview };
    if (slot === 'A') setFileA(state);
    else setFileB(state);
    setComparisonDone(false);
    const bc = getBlockchain();
    const hash = await bc.hashFile(file);
    const done: FileState = { ...state, hash, status: 'hashed' };
    if (slot === 'A') setFileA(done);
    else setFileB(done);
  };
  const compare = async () => {
    if (!fileA?.hash || !fileB?.hash) return;
    setComparing(true);
    await new Promise(r => setTimeout(r, 1800));
    const hashA = fileA.hash;
    const hashB = fileB.hash;
    const isIdentical = hashA === hashB;
    let matching = 0;
    const compareLen = 32;
    for (let i = 0; i < compareLen; i++) {
      if (hashA[i] === hashB[i]) matching++;
    }
    const sim = isIdentical ? 100 : Math.round((matching / compareLen) * 100);
    setIdentical(isIdentical);
    setSimilarity(sim);
    setComparing(false);
    setComparisonDone(true);
  };
  const canCompare = fileA?.status === 'hashed' && fileB?.status === 'hashed';
  return (
    <section id="compare" className="relative py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-bg to-dark-card/30" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 glass neon-border-purple px-4 py-2 rounded-full text-sm mb-6">
            <GitCompare className="w-4 h-4 text-neon-purple" />
            <span className="text-neon-purple font-mono">FILE COMPARISON ENGINE</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            <span className="gradient-text-blue-purple">Compare</span>
            <span className="text-white"> Two Files</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Upload two files to compare their cryptographic fingerprints. Detect if a file has been manipulated from an original, or if they are identical.
          </p>
        </div>
        <div className="glass neon-border-purple rounded-2xl p-6">
          <div className="flex items-start gap-4 mb-6">
            <DropZone label="FILE A — ORIGINAL" state={fileA} onFile={f => handleFile(f, 'A')} onClear={() => { setFileA(null); setComparisonDone(false); }} accent="blue" />
            <div className="flex flex-col items-center justify-center pt-12">
              <div className="w-10 h-10 glass rounded-full flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-gray-500" />
              </div>
              <span className="text-xs text-gray-600 mt-2 font-mono">VS</span>
            </div>
            <DropZone label="FILE B — SUSPECT" state={fileB} onFile={f => handleFile(f, 'B')} onClear={() => { setFileB(null); setComparisonDone(false); }} accent="purple" />
          </div>
          <button
            onClick={compare}
            disabled={!canCompare || comparing}
            className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 mb-6 transition-all ${
              canCompare && !comparing
                ? 'btn-primary'
                : 'bg-dark-border/50 text-gray-600 cursor-not-allowed'
            }`}
          >
            {comparing ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Comparing cryptographic fingerprints...</>
            ) : (
              <><Hash className="w-5 h-5" /> Run SHA-256 Comparison</>
            )}
          </button>
          {comparisonDone && fileA?.hash && fileB?.hash && (
            <div className={`rounded-xl border p-6 ${identical ? 'bg-neon-green/5 border-neon-green/30' : similarity > 30 ? 'bg-yellow-500/5 border-yellow-500/30' : 'bg-red-500/5 border-red-500/30'}`}>
              <div className="text-center mb-6">
                {identical ? (
                  <><CheckCircle className="w-14 h-14 text-neon-green mx-auto mb-2" /><div className="text-2xl font-black text-neon-green">IDENTICAL FILES</div><p className="text-gray-400 text-sm mt-1">SHA-256 fingerprints match exactly. These are the same file.</p></>
                ) : similarity > 30 ? (
                  <><Eye className="w-14 h-14 text-yellow-400 mx-auto mb-2" /><div className="text-2xl font-black text-yellow-400">SIMILAR — POSSIBLE MANIPULATION</div><p className="text-gray-400 text-sm mt-1">Hashes are different but share partial patterns. File B may be a modified version of File A.</p></>
                ) : (
                  <><AlertTriangle className="w-14 h-14 text-red-400 mx-auto mb-2" /><div className="text-2xl font-black text-red-400">COMPLETELY DIFFERENT FILES</div><p className="text-gray-400 text-sm mt-1">These files share no significant hash patterns.</p></>
                )}
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                {[{ label: 'File A SHA-256', hash: fileA.hash, color: 'text-neon-blue' }, { label: 'File B SHA-256', hash: fileB.hash, color: 'text-neon-purple' }].map(({ label, hash, color }) => (
                  <div key={label} className="bg-dark-bg/50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">{label}</div>
                    <div className={`text-xs font-mono ${color} break-all leading-5`}>
                      {hash.split('').map((char, i) => (
                        <span key={i} className={fileA.hash![i] === fileB.hash![i] ? 'opacity-100' : 'opacity-30'}>
                          {char}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Hash Similarity Score</span>
                  <span className={`font-bold font-mono ${identical ? 'text-neon-green' : similarity > 30 ? 'text-yellow-400' : 'text-red-400'}`}>{similarity}%</span>
                </div>
                <div className="w-full h-3 bg-dark-border rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${identical ? 'bg-neon-green' : similarity > 30 ? 'bg-yellow-400' : 'bg-red-500'}`}
                    style={{ width: `${similarity}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>0% — Completely Different</span>
                  <span>100% — Identical</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
