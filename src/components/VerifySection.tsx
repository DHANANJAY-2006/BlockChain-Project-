'use client';
import { useState, useCallback, useRef } from 'react';
import { Upload, File, X, Shield, AlertTriangle, CheckCircle, Loader2, Hash, Cpu, Eye, Award, Download, ExternalLink } from 'lucide-react';
import { getBlockchain } from '@/lib/blockchain';
import { Block, BlockData, AnalysisDetails } from '@/lib/types';
import RadarChart from './RadarChart';
type AnalysisState = 'idle' | 'uploading' | 'hashing' | 'analyzing' | 'writing' | 'done';
type AnalysisResult = 'AUTHENTIC' | 'DEEPFAKE' | 'SUSPICIOUS';
interface AnalysisData {
  result: AnalysisResult;
  confidence: number;
  mediaHash: string;
  block: Block;
  details: AnalysisDetails;
}
const ANALYSIS_STEPS = [
  { id: 'uploading', icon: Upload, label: 'Buffer Read', desc: 'Reading raw file bytes into memory' },
  { id: 'hashing', icon: Hash, label: 'SHA-256', desc: 'Computing cryptographic fingerprint' },
  { id: 'analyzing', icon: Cpu, label: 'AI Inference', desc: 'Running 6-model neural analysis' },
  { id: 'writing', icon: Shield, label: 'Blockchain', desc: 'Sealing result on immutable ledger' },
];
export default function VerifySection() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [progress, setProgress] = useState(0);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('video/') && !file.type.startsWith('image/') && !file.type.startsWith('audio/')) {
      alert('Please upload a video, image, or audio file');
      return;
    }
    setSelectedFile(file);
    setAnalysisData(null);
    setAnalysisState('idle');
    setShowCertificate(false);
    setProgress(0);
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);
  const startAnalysis = async () => {
    if (!selectedFile) return;
    const blockchain = getBlockchain();
    try {
      setAnalysisState('uploading');
      setProgress(8);
      await new Promise(r => setTimeout(r, 700));
      setAnalysisState('hashing');
      setProgress(22);
      const mediaHash = await blockchain.hashFile(selectedFile);
      await new Promise(r => setTimeout(r, 900));
      setProgress(40);
      setAnalysisState('analyzing');
      setProgress(50);
      const analysis = await blockchain.analyzeMedia(selectedFile);
      setProgress(78);
      setAnalysisState('writing');
      setProgress(88);
      const blockData: BlockData = {
        mediaHash,
        analysisResult: analysis.result,
        confidence: analysis.confidence,
        timestamp: Date.now(),
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        mimeType: selectedFile.type,
        analysisDetails: analysis.details,
        submitterAddress: '0x' + mediaHash.slice(0, 40),
      };
      const block = await blockchain.addBlock(blockData);
      await new Promise(r => setTimeout(r, 1200));
      setProgress(100);
      setAnalysisState('done');
      setAnalysisData({ result: analysis.result, confidence: analysis.confidence, mediaHash, block, details: analysis.details });
    } catch (err) {
      console.error(err);
      setAnalysisState('idle');
    }
  };
  const reset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysisData(null);
    setAnalysisState('idle');
    setProgress(0);
    setShowCertificate(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  const getResultConfig = (result: AnalysisResult) => {
    switch (result) {
      case 'AUTHENTIC': return { icon: CheckCircle, color: 'text-neon-green', border: 'neon-border-green', badge: 'status-verified', bg: 'bg-neon-green/5', barColor: 'bg-neon-green' };
      case 'DEEPFAKE': return { icon: AlertTriangle, color: 'text-red-400', border: 'border border-red-500/40', badge: 'status-fake', bg: 'bg-red-500/5', barColor: 'bg-red-500' };
      case 'SUSPICIOUS': return { icon: Eye, color: 'text-yellow-400', border: 'border border-yellow-500/40', badge: 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400', bg: 'bg-yellow-500/5', barColor: 'bg-yellow-400' };
    }
  };
  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };
  const formatHash = (hash: string) => `${hash.slice(0, 14)}...${hash.slice(-10)}`;
  const radarScores = analysisData ? [
    { label: 'Face', value: analysisData.details.faceConsistencyScore },
    { label: 'Temporal', value: analysisData.details.temporalConsistencyScore },
    { label: 'Artifact', value: analysisData.details.artifactDetectionScore },
    { label: 'Metadata', value: analysisData.details.metadataIntegrityScore },
    { label: 'Compress', value: analysisData.details.compressionAnomalyScore },
    { label: 'Lighting', value: analysisData.details.lightingConsistencyScore },
  ] : [];
  const stateOrder: AnalysisState[] = ['uploading', 'hashing', 'analyzing', 'writing', 'done'];
  return (
    <section id="verify" className="relative py-24 cyber-grid-bg">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-bg via-dark-card/40 to-dark-bg" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 glass neon-border-blue px-4 py-2 rounded-full text-sm mb-6">
            <Shield className="w-4 h-4 text-neon-blue" />
            <span className="text-neon-blue font-mono">VERIFY MEDIA AUTHENTICITY</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            <span className="text-white">Upload & </span>
            <span className="gradient-text-blue-purple">Analyze</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Drop any video, image, or audio file. AI runs 6 detection models and permanently seals the result on the blockchain.
          </p>
        </div>
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            {!selectedFile ? (
              <div
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 min-h-72 flex flex-col items-center justify-center ${isDragging ? 'border-neon-blue bg-neon-blue/5' : 'border-dark-border hover:border-neon-blue/50 bg-dark-card'}`}
              >
                <input ref={fileInputRef} type="file" className="hidden" accept="video/*,image/*,audio/*" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-5 transition-all ${isDragging ? 'bg-neon-blue/20' : 'glass neon-border-blue'}`}>
                  <Upload className={`w-10 h-10 ${isDragging ? 'text-neon-blue animate-bounce' : 'text-gray-400'}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{isDragging ? 'Drop to analyze!' : 'Drop your file here'}</h3>
                <p className="text-gray-500 text-sm mb-4">or click to browse</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['MP4', 'MOV', 'AVI', 'JPG', 'PNG', 'WEBP', 'WAV', 'MP3'].map(ext => (
                    <span key={ext} className="glass neon-border-blue px-2 py-0.5 rounded text-xs font-mono text-neon-blue">{ext}</span>
                  ))}
                </div>
                <p className="text-gray-600 text-xs mt-4">Files processed locally — never uploaded to servers</p>
              </div>
            ) : (
              <div className="glass neon-border-blue rounded-2xl overflow-hidden">
                <div className="relative">
                  {previewUrl && selectedFile.type.startsWith('image/') && (
                    <div className="relative h-48">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover opacity-60" />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-card to-transparent" />
                      {analysisState === 'analyzing' && <div className="absolute inset-0 overflow-hidden"><div className="scan-line" /></div>}
                    </div>
                  )}
                  {previewUrl && selectedFile.type.startsWith('video/') && (
                    <div className="h-48 bg-dark-bg flex items-center justify-center relative">
                      <video src={previewUrl} className="max-h-full opacity-60" muted />
                      {analysisState === 'analyzing' && <div className="absolute inset-0 overflow-hidden"><div className="scan-line" /></div>}
                    </div>
                  )}
                  {(!previewUrl || selectedFile.type.startsWith('audio/')) && (
                    <div className="h-32 flex items-center justify-center bg-dark-bg">
                      <File className="w-14 h-14 text-neon-blue/20" />
                    </div>
                  )}
                  <button onClick={e => { e.stopPropagation(); reset(); }} className="absolute top-3 right-3 w-8 h-8 glass rounded-lg flex items-center justify-center hover:bg-red-500/20">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 glass neon-border-blue rounded-lg flex items-center justify-center flex-shrink-0">
                      <File className="w-5 h-5 text-neon-blue" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate text-sm">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">{formatBytes(selectedFile.size)} • {selectedFile.type.split('/')[1]?.toUpperCase() || 'FILE'}</p>
                    </div>
                  </div>
                  {analysisState !== 'idle' && analysisState !== 'done' && (
                    <div className="mb-5">
                      <div className="w-full h-2 bg-dark-border rounded-full overflow-hidden mb-1">
                        <div className="h-full bg-gradient-to-r from-neon-blue to-neon-purple rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
                      </div>
                      <div className="flex justify-between text-xs text-gray-600 font-mono">
                        <span>Processing...</span>
                        <span>{progress}%</span>
                      </div>
                    </div>
                  )}
                  {analysisState !== 'idle' && (
                    <div className="space-y-2 mb-5">
                      {ANALYSIS_STEPS.map(step => {
                        const currentIdx = stateOrder.indexOf(analysisState);
                        const thisIdx = stateOrder.indexOf(step.id as AnalysisState);
                        const isActive = currentIdx === thisIdx;
                        const isDone = currentIdx > thisIdx || analysisState === 'done';
                        const StepIcon = step.icon;
                        return (
                          <div key={step.id} className={`flex items-center gap-3 p-2.5 rounded-lg transition-all ${isActive ? 'bg-neon-blue/10 neon-border-blue' : isDone ? 'bg-neon-green/5' : 'bg-dark-border/20'}`}>
                            <StepIcon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-neon-blue animate-pulse' : isDone ? 'text-neon-green' : 'text-gray-700'}`} />
                            <div className="flex-1 min-w-0">
                              <div className={`text-xs font-bold ${isActive ? 'text-neon-blue' : isDone ? 'text-neon-green' : 'text-gray-600'}`}>{step.label}</div>
                              <div className="text-xs text-gray-600 truncate">{step.desc}</div>
                            </div>
                            {isDone && <CheckCircle className="w-4 h-4 text-neon-green flex-shrink-0" />}
                            {isActive && <Loader2 className="w-4 h-4 text-neon-blue animate-spin flex-shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {analysisState === 'idle' && (
                    <button onClick={startAnalysis} className="btn-primary w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2">
                      <Shield className="w-5 h-5" />
                      Start Blockchain Verification
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="lg:col-span-3 space-y-4">
            {!analysisData ? (
              <div className="glass neon-border-blue rounded-2xl p-8 text-center min-h-72 flex flex-col items-center justify-center">
                <div className="w-20 h-20 glass neon-border-blue rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-10 h-10 text-neon-blue/20" />
                </div>
                <h3 className="text-lg font-bold text-gray-400 mb-2">Awaiting Analysis</h3>
                <p className="text-sm text-gray-600 max-w-xs">Upload a media file and click "Start Blockchain Verification" to begin</p>
              </div>
            ) : (
              (() => {
                const config = getResultConfig(analysisData.result);
                const ResultIcon = config.icon;
                return (
                  <div className="space-y-4">
                    <div className={`glass rounded-2xl p-6 ${config.border} ${config.bg}`}>
                      <div className="flex items-center gap-4 mb-5">
                        <ResultIcon className={`w-14 h-14 flex-shrink-0 ${config.color}`} />
                        <div>
                          <div className={`text-2xl font-black ${config.color}`}>{analysisData.result === 'DEEPFAKE' ? 'DEEPFAKE DETECTED' : analysisData.result}</div>
                          <div className="text-sm text-gray-400">Analysis complete — result sealed on blockchain</div>
                        </div>
                      </div>
                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-gray-400">AI Confidence Score</span>
                          <span className={`font-black font-mono text-xl ${config.color}`}>{analysisData.confidence.toFixed(2)}%</span>
                        </div>
                        <div className="w-full h-3 bg-dark-border rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-1000 ${config.barColor}`} style={{ width: `${analysisData.confidence}%` }} />
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono">
                        {[
                          { label: 'Block #', value: `#${analysisData.block.index}` },
                          { label: 'Status', value: 'CONFIRMED ✓' },
                          { label: 'Block Hash', value: formatHash(analysisData.block.hash) },
                          { label: 'Nonce', value: String(analysisData.block.nonce) },
                          { label: 'SHA-256', value: formatHash(analysisData.mediaHash) },
                          { label: 'Validator', value: analysisData.block.validator },
                        ].map(({ label, value }) => (
                          <div key={label} className="bg-dark-border/40 rounded-lg px-3 py-2">
                            <div className="text-gray-600">{label}</div>
                            <div className="text-neon-blue truncate">{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="glass neon-border-blue rounded-2xl p-5">
                      <h3 className="text-sm font-bold text-neon-blue mb-4 flex items-center gap-2">
                        <Cpu className="w-4 h-4" />
                        6-MODEL AI ANALYSIS BREAKDOWN
                      </h3>
                      <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="flex-shrink-0">
                          <RadarChart
                            scores={radarScores}
                            size={200}
                            color={analysisData.result === 'AUTHENTIC' ? '#10b981' : analysisData.result === 'DEEPFAKE' ? '#f87171' : '#f59e0b'}
                          />
                        </div>
                        <div className="flex-1 w-full space-y-2.5">
                          {radarScores.map(({ label, value }) => (
                            <div key={label}>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-400">{label} Analysis</span>
                                <span className={`font-mono font-bold ${value > 70 ? 'text-neon-green' : value > 45 ? 'text-yellow-400' : 'text-red-400'}`}>{value.toFixed(1)}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-dark-border rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-700 ${value > 70 ? 'bg-neon-green' : value > 45 ? 'bg-yellow-400' : 'bg-red-500'}`} style={{ width: `${value}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setShowCertificate(s => !s)} className="w-full glass neon-border-blue rounded-xl p-3.5 text-sm text-neon-blue flex items-center justify-between hover:bg-neon-blue/5 transition-colors font-bold">
                      <span className="flex items-center gap-2"><Award className="w-4 h-4" /> View Blockchain Certificate</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    {showCertificate && (
                      <div className="glass border border-neon-blue/50 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute inset-0 cyber-grid-bg opacity-30" />
                        <div className="relative z-10">
                          <div className="text-center mb-6 border-b border-dark-border pb-5">
                            <div className="text-xs font-mono text-gray-500 tracking-[0.4em] mb-2">CHAINPROOF — BLOCKCHAIN CERTIFICATE</div>
                            <h3 className="text-2xl font-black text-white mb-1">Certificate of Verification</h3>
                            <div className="text-xs text-gray-500">Cryptographically secured • Tamper-proof • Publicly verifiable</div>
                          </div>
                          <div className={`text-center py-4 px-6 rounded-xl mb-5 ${config.bg} border ${config.color.replace('text-', 'border-').replace('neon-', 'neon-')}`}>
                            <div className={`text-4xl font-black font-mono ${config.color}`}>
                              {analysisData.result === 'DEEPFAKE' ? '⚠ DEEPFAKE' : analysisData.result === 'AUTHENTIC' ? '✓ AUTHENTIC' : '? SUSPICIOUS'}
                            </div>
                            <div className="text-sm text-gray-400 mt-1">AI Confidence: <strong className={config.color}>{analysisData.confidence.toFixed(2)}%</strong></div>
                          </div>
                          <div className="space-y-2 text-xs font-mono mb-5">
                            {[
                              { label: 'FILE NAME', value: analysisData.block.data.fileName },
                              { label: 'SHA-256 FINGERPRINT', value: analysisData.mediaHash },
                              { label: 'BLOCK HASH', value: analysisData.block.hash },
                              { label: 'MERKLE ROOT', value: analysisData.block.merkleRoot },
                              { label: 'BLOCK NUMBER', value: `#${analysisData.block.index}` },
                              { label: 'VALIDATOR', value: analysisData.block.validator },
                              { label: 'TIMESTAMP', value: new Date(analysisData.block.timestamp).toLocaleString() },
                              { label: 'NONCE', value: String(analysisData.block.nonce) },
                            ].map(({ label, value }) => (
                              <div key={label} className="flex justify-between gap-4 py-1.5 border-b border-dark-border/50">
                                <span className="text-gray-600 flex-shrink-0">{label}</span>
                                <span className="text-neon-blue break-all text-right">{value}</span>
                              </div>
                            ))}
                          </div>
                          <div className="text-center text-xs text-gray-600 pt-2">
                            <div className="font-mono">CHAINPROOF v2.1 • SHA-256 • PoA Consensus • Verified on {new Date().toLocaleDateString()}</div>
                          </div>
                        </div>
                      </div>
                    )}
                    <button onClick={reset} className="btn-secondary w-full py-3 rounded-xl text-sm font-bold">
                      Verify Another File
                    </button>
                  </div>
                );
              })()
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
