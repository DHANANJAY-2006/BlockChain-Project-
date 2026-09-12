'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, File, X, Shield, AlertTriangle, CheckCircle, Loader2, Hash, Clock, Cpu, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { getBlockchain } from '@/lib/blockchain';
import { Block, BlockData, AnalysisDetails } from '@/lib/types';

type AnalysisState = 'idle' | 'uploading' | 'hashing' | 'analyzing' | 'writing' | 'done';
type AnalysisResult = 'AUTHENTIC' | 'DEEPFAKE' | 'SUSPICIOUS';

interface AnalysisData {
  result: AnalysisResult;
  confidence: number;
  mediaHash: string;
  block: Block;
  details: AnalysisDetails;
}

export default function VerifySection() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [progress, setProgress] = useState(0);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stateMessages: Record<AnalysisState, string> = {
    idle: '',
    uploading: 'Reading file buffer...',
    hashing: 'Computing SHA-256 cryptographic hash...',
    analyzing: 'Running AI neural network analysis...',
    writing: 'Writing result to blockchain...',
    done: 'Verification complete!',
  };

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('video/') && !file.type.startsWith('image/') && !file.type.startsWith('audio/')) {
      alert('Please upload a video, image, or audio file');
      return;
    }
    setSelectedFile(file);
    setAnalysisData(null);
    setAnalysisState('idle');
    
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
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
      // Step 1: Upload/read
      setAnalysisState('uploading');
      setProgress(10);
      await new Promise(r => setTimeout(r, 800));
      
      // Step 2: Hash
      setAnalysisState('hashing');
      setProgress(25);
      const mediaHash = await blockchain.hashFile(selectedFile);
      await new Promise(r => setTimeout(r, 1000));
      
      // Step 3: Analyze
      setAnalysisState('analyzing');
      setProgress(50);
      const analysis = await blockchain.analyzeMedia(selectedFile);
      setProgress(80);
      
      // Step 4: Write to blockchain
      setAnalysisState('writing');
      setProgress(90);
      
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
      await new Promise(r => setTimeout(r, 1000));
      
      setProgress(100);
      setAnalysisState('done');
      setAnalysisData({
        result: analysis.result,
        confidence: analysis.confidence,
        mediaHash,
        block,
        details: analysis.details,
      });
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
    setShowDetails(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getResultConfig = (result: AnalysisResult) => {
    switch (result) {
      case 'AUTHENTIC':
        return { icon: CheckCircle, color: 'text-neon-green', bgColor: 'status-verified', label: 'AUTHENTIC', borderClass: 'neon-border-green' };
      case 'DEEPFAKE':
        return { icon: AlertTriangle, color: 'text-red-400', bgColor: 'status-fake', label: 'DEEPFAKE DETECTED', borderClass: 'border border-red-500/40' };
      case 'SUSPICIOUS':
        return { icon: Eye, color: 'text-yellow-400', bgColor: 'status-processing', label: 'SUSPICIOUS', borderClass: 'border border-yellow-500/40' };
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatHash = (hash: string) => `${hash.slice(0, 16)}...${hash.slice(-8)}`;

  return (
    <section id="verify" className="relative py-24 cyber-grid-bg">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-bg via-dark-card/50 to-dark-bg" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass neon-border-blue px-4 py-2 rounded-full text-sm mb-6">
            <Shield className="w-4 h-4 text-neon-blue" />
            <span className="text-neon-blue font-mono">VERIFY MEDIA AUTHENTICITY</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            <span className="text-white">Upload &</span>{' '}
            <span className="gradient-text-blue-purple">Analyze</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Drop any video, image, or audio file. Our AI will analyze it and permanently record the result on the blockchain.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Upload Area */}
          <div className="lg:col-span-3">
            {!selectedFile ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 min-h-64 flex flex-col items-center justify-center ${
                  isDragging
                    ? 'border-neon-blue bg-neon-blue/5 shadow-lg shadow-neon-blue/20'
                    : 'border-dark-border hover:border-neon-blue/50 hover:bg-neon-blue/3 bg-dark-card'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="video/*,image/*,audio/*"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all ${
                  isDragging ? 'bg-neon-blue/20' : 'glass neon-border-blue'
                }`}>
                  <Upload className={`w-10 h-10 ${isDragging ? 'text-neon-blue animate-bounce' : 'text-gray-400'}`} />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">
                  {isDragging ? 'Drop to analyze!' : 'Drop your media file here'}
                </h3>
                <p className="text-gray-500 text-sm mb-4">or click to browse</p>
                
                <div className="flex flex-wrap justify-center gap-2">
                  {['MP4', 'AVI', 'MOV', 'JPG', 'PNG', 'WAV', 'MP3'].map(ext => (
                    <span key={ext} className="glass neon-border-blue px-2 py-0.5 rounded text-xs font-mono text-neon-blue">
                      {ext}
                    </span>
                  ))}
                </div>
                
                <p className="text-gray-600 text-xs mt-4">Maximum file size: 500MB</p>
              </div>
            ) : (
              <div className="glass neon-border-blue rounded-2xl overflow-hidden">
                {/* File preview */}
                <div className="relative bg-dark-card">
                  {previewUrl && selectedFile.type.startsWith('image/') && (
                    <div className="relative h-56">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover opacity-60" />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-card to-transparent" />
                      {analysisState === 'analyzing' && (
                        <div className="absolute inset-0 overflow-hidden">
                          <div className="scan-line" />
                        </div>
                      )}
                    </div>
                  )}
                  {previewUrl && selectedFile.type.startsWith('video/') && (
                    <div className="h-56 bg-dark-bg flex items-center justify-center">
                      <video src={previewUrl} className="max-h-full opacity-60" controls={false} />
                      {analysisState === 'analyzing' && (
                        <div className="absolute inset-0 overflow-hidden">
                          <div className="scan-line" />
                        </div>
                      )}
                    </div>
                  )}
                  {(!previewUrl || selectedFile.type.startsWith('audio/')) && (
                    <div className="h-32 flex items-center justify-center bg-dark-bg">
                      <File className="w-16 h-16 text-neon-blue/30" />
                    </div>
                  )}
                  
                  <button
                    onClick={(e) => { e.stopPropagation(); reset(); }}
                    className="absolute top-3 right-3 w-8 h-8 glass rounded-lg flex items-center justify-center hover:bg-red-500/20 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                
                {/* File info */}
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 glass neon-border-blue rounded-lg flex items-center justify-center">
                      <File className="w-5 h-5 text-neon-blue" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatBytes(selectedFile.size)} • {selectedFile.type.split('/')[1]?.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Analysis Progress */}
                  {analysisState !== 'idle' && analysisState !== 'done' && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Loader2 className="w-4 h-4 text-neon-blue animate-spin" />
                        <span className="text-sm text-neon-blue font-mono">{stateMessages[analysisState]}</span>
                      </div>
                      <div className="w-full h-2 bg-dark-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-neon-blue to-neon-purple rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="text-right text-xs text-gray-500 mt-1 font-mono">{progress}%</div>
                    </div>
                  )}
                  
                  {/* Analysis steps indicator */}
                  {analysisState !== 'idle' && (
                    <div className="grid grid-cols-4 gap-1 mb-4">
                      {[
                        { id: 'uploading', icon: Upload, label: 'Read' },
                        { id: 'hashing', icon: Hash, label: 'Hash' },
                        { id: 'analyzing', icon: Cpu, label: 'Analyze' },
                        { id: 'writing', icon: Shield, label: 'Record' },
                      ].map(({ id, icon: Icon, label }, idx) => {
                        const stateOrder = ['uploading', 'hashing', 'analyzing', 'writing', 'done'];
                        const currentIdx = stateOrder.indexOf(analysisState);
                        const thisIdx = stateOrder.indexOf(id);
                        const isActive = currentIdx === thisIdx;
                        const isDone = currentIdx > thisIdx || analysisState === 'done';
                        
                        return (
                          <div key={id} className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                            isActive ? 'bg-neon-blue/10 neon-border-blue' : isDone ? 'bg-neon-green/5' : 'bg-dark-border/30'
                          }`}>
                            <Icon className={`w-4 h-4 ${isActive ? 'text-neon-blue animate-pulse' : isDone ? 'text-neon-green' : 'text-gray-600'}`} />
                            <span className={`text-xs font-mono ${isActive ? 'text-neon-blue' : isDone ? 'text-neon-green' : 'text-gray-600'}`}>
                              {label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  {analysisState === 'idle' && (
                    <button
                      onClick={startAnalysis}
                      className="btn-primary w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                    >
                      <Shield className="w-5 h-5" />
                      Start Blockchain Verification
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-4">
            {analysisData ? (
              (() => {
                const config = getResultConfig(analysisData.result);
                const Icon = config.icon;
                return (
                  <div className="space-y-4">
                    {/* Main Result */}
                    <div className={`glass rounded-2xl p-6 ${config.borderClass}`}>
                      <div className="text-center mb-4">
                        <Icon className={`w-16 h-16 ${config.color} mx-auto mb-3`} />
                        <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${config.bgColor}`}>
                          {config.label}
                        </div>
                        <div className="mt-3">
                          <span className={`text-5xl font-black font-mono ${config.color}`}>
                            {analysisData.confidence.toFixed(1)}%
                          </span>
                          <div className="text-xs text-gray-500 mt-1">AI Confidence Score</div>
                        </div>
                      </div>
                      
                      {/* Confidence bar */}
                      <div className="w-full h-3 bg-dark-border rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${
                            analysisData.result === 'AUTHENTIC' ? 'bg-neon-green' :
                            analysisData.result === 'DEEPFAKE' ? 'bg-red-500' : 'bg-yellow-400'
                          }`}
                          style={{ width: `${analysisData.confidence}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Blockchain Record */}
                    <div className="glass neon-border-blue rounded-2xl p-4">
                      <h3 className="text-sm font-bold text-neon-blue mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        BLOCKCHAIN RECORD
                      </h3>
                      <div className="space-y-2 text-xs font-mono">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Block #</span>
                          <span className="text-neon-blue">{analysisData.block.index}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Hash</span>
                          <span className="text-neon-blue">{formatHash(analysisData.block.hash)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Media Hash</span>
                          <span className="text-gray-300">{formatHash(analysisData.mediaHash)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Validator</span>
                          <span className="text-neon-purple">{analysisData.block.validator}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Nonce</span>
                          <span className="text-gray-300">{analysisData.block.nonce}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Status</span>
                          <span className="status-verified px-2 py-0.5 rounded text-xs">CONFIRMED</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Analysis Details Toggle */}
                    <button
                      onClick={() => setShowDetails(!showDetails)}
                      className="w-full glass neon-border-blue rounded-xl p-3 text-sm text-neon-blue flex items-center justify-between hover:bg-neon-blue/5 transition-colors"
                    >
                      <span>View Analysis Details</span>
                      {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    
                    {showDetails && (
                      <div className="glass neon-border-blue rounded-xl p-4 space-y-3">
                        {Object.entries(analysisData.details).map(([key, value]) => {
                          const label = key.replace(/([A-Z])/g, ' $1').replace('Score', '').trim();
                          const numValue = typeof value === 'number' ? value : 0;
                          return (
                            <div key={key}>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-400 capitalize">{label}</span>
                                <span className={`font-mono font-bold ${
                                  numValue > 80 ? 'text-neon-green' : numValue > 50 ? 'text-yellow-400' : 'text-red-400'
                                }`}>{numValue.toFixed(1)}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-dark-border rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    numValue > 80 ? 'bg-neon-green' : numValue > 50 ? 'bg-yellow-400' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${numValue}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    
                    <button onClick={reset} className="btn-secondary w-full py-2.5 rounded-xl text-sm">
                      Verify Another File
                    </button>
                  </div>
                );
              })()
            ) : (
              <div className="glass neon-border-blue rounded-2xl p-6 text-center min-h-48 flex flex-col items-center justify-center">
                <div className="w-16 h-16 glass neon-border-blue rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-neon-blue/30" />
                </div>
                <h3 className="text-lg font-bold text-gray-400 mb-2">Awaiting Analysis</h3>
                <p className="text-sm text-gray-600">Upload a media file to begin blockchain verification</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
