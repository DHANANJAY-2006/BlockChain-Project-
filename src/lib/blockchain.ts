// Blockchain implementation for DeepFake Proof System
import { Block, BlockData, Transaction, NetworkStats } from './types';

// Simple SHA-256 hash simulation (for browser compatibility without Node crypto)
async function sha256(message: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback: deterministic pseudo-hash for SSR
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(64, '0');
}

// Synchronous hash for SSR fallback
function syncHash(message: string): string {
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  // Generate 64-char hex string
  const base = Math.abs(hash).toString(16);
  let result = '';
  for (let i = 0; i < 64; i++) {
    result += base[(i * 7 + hash) % base.length] || '0';
  }
  return result.slice(0, 64);
}

class BlockchainService {
  private chain: Block[] = [];
  private transactions: Transaction[] = [];
  private difficulty = 2;
  private validators = [
    '0x7f3b...a1c9',
    '0x2e8d...f4b7',
    '0x9a1f...c3e2',
    '0x4d6c...b8a5',
    '0x1b9e...d7f3',
  ];

  constructor() {
    this.initializeChain();
  }

  private initializeChain() {
    // Create genesis block
    const genesisBlock: Block = {
      index: 0,
      timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
      data: {
        mediaHash: '0000000000000000000000000000000000000000000000000000000000000000',
        analysisResult: 'AUTHENTIC',
        confidence: 100,
        timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000,
        fileName: 'GENESIS',
        fileSize: 0,
        mimeType: 'application/genesis',
        analysisDetails: {
          faceConsistencyScore: 100,
          temporalConsistencyScore: 100,
          artifactDetectionScore: 100,
          metadataIntegrityScore: 100,
          compressionAnomalyScore: 100,
          lightingConsistencyScore: 100,
        },
        submitterAddress: '0x0000...0000',
      },
      previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
      hash: syncHash('GENESIS_BLOCK_CHAINPROOF_V1'),
      nonce: 0,
      merkleRoot: syncHash('GENESIS_MERKLE'),
      validator: this.validators[0],
    };
    this.chain.push(genesisBlock);

    // Add pre-existing demo blocks
    this.addDemoBlocks();
  }

  private addDemoBlocks() {
    const demoData = [
      { file: 'press_conference_2024.mp4', result: 'AUTHENTIC' as const, confidence: 98.7, size: 45678901 },
      { file: 'viral_video_clip.mp4', result: 'DEEPFAKE' as const, confidence: 96.3, size: 12345678 },
      { file: 'celebrity_interview.mp4', result: 'SUSPICIOUS' as const, confidence: 72.1, size: 78901234 },
      { file: 'news_broadcast.mp4', result: 'AUTHENTIC' as const, confidence: 99.1, size: 34567890 },
      { file: 'social_media_clip.mp4', result: 'DEEPFAKE' as const, confidence: 94.8, size: 8901234 },
      { file: 'political_speech.mp4', result: 'AUTHENTIC' as const, confidence: 97.5, size: 56789012 },
      { file: 'documentary_segment.mp4', result: 'AUTHENTIC' as const, confidence: 99.8, size: 123456789 },
      { file: 'fake_celebrity_ad.mp4', result: 'DEEPFAKE' as const, confidence: 99.2, size: 5678901 },
    ];

    demoData.forEach((item, i) => {
      const timestamp = Date.now() - (demoData.length - i) * 3 * 60 * 60 * 1000;
      const blockData: BlockData = {
        mediaHash: syncHash(item.file + timestamp),
        analysisResult: item.result,
        confidence: item.confidence,
        timestamp,
        fileName: item.file,
        fileSize: item.size,
        mimeType: 'video/mp4',
        analysisDetails: this.generateAnalysisDetails(item.result, item.confidence),
        submitterAddress: this.validators[i % this.validators.length],
      };

      const previousBlock = this.chain[this.chain.length - 1];
      const block: Block = {
        index: i + 1,
        timestamp,
        data: blockData,
        previousHash: previousBlock.hash,
        hash: syncHash(JSON.stringify(blockData) + previousBlock.hash + i),
        nonce: Math.floor(Math.random() * 10000),
        merkleRoot: syncHash(blockData.mediaHash + blockData.analysisResult),
        validator: this.validators[i % this.validators.length],
      };
      this.chain.push(block);

      // Add corresponding transaction
      this.transactions.push({
        id: '0x' + syncHash(block.hash + i).slice(0, 40),
        blockIndex: block.index,
        mediaHash: blockData.mediaHash,
        result: item.result,
        confidence: item.confidence,
        timestamp,
        status: 'CONFIRMED',
        gasUsed: Math.floor(Math.random() * 50000) + 21000,
        fileName: item.file,
      });
    });
  }

  private generateAnalysisDetails(result: 'AUTHENTIC' | 'DEEPFAKE' | 'SUSPICIOUS', confidence: number) {
    if (result === 'AUTHENTIC') {
      return {
        faceConsistencyScore: 95 + Math.random() * 5,
        temporalConsistencyScore: 94 + Math.random() * 6,
        artifactDetectionScore: 96 + Math.random() * 4,
        metadataIntegrityScore: 98 + Math.random() * 2,
        compressionAnomalyScore: 93 + Math.random() * 7,
        lightingConsistencyScore: 95 + Math.random() * 5,
      };
    } else if (result === 'DEEPFAKE') {
      return {
        faceConsistencyScore: 20 + Math.random() * 30,
        temporalConsistencyScore: 15 + Math.random() * 25,
        artifactDetectionScore: 10 + Math.random() * 20,
        metadataIntegrityScore: 30 + Math.random() * 40,
        compressionAnomalyScore: 25 + Math.random() * 35,
        lightingConsistencyScore: 20 + Math.random() * 30,
      };
    } else {
      return {
        faceConsistencyScore: 55 + Math.random() * 20,
        temporalConsistencyScore: 50 + Math.random() * 25,
        artifactDetectionScore: 45 + Math.random() * 30,
        metadataIntegrityScore: 65 + Math.random() * 20,
        compressionAnomalyScore: 55 + Math.random() * 25,
        lightingConsistencyScore: 60 + Math.random() * 20,
      };
    }
  }

  async addBlock(data: BlockData): Promise<Block> {
    const previousBlock = this.chain[this.chain.length - 1];
    const blockString = JSON.stringify(data) + previousBlock.hash + this.chain.length;
    const hash = await sha256(blockString);
    const merkleRoot = await sha256(data.mediaHash + data.analysisResult + data.timestamp);

    const newBlock: Block = {
      index: this.chain.length,
      timestamp: Date.now(),
      data,
      previousHash: previousBlock.hash,
      hash,
      nonce: Math.floor(Math.random() * 100000),
      merkleRoot,
      validator: this.validators[this.chain.length % this.validators.length],
    };

    this.chain.push(newBlock);

    // Add transaction
    const txHash = await sha256(hash + this.chain.length);
    this.transactions.unshift({
      id: '0x' + txHash.slice(0, 40),
      blockIndex: newBlock.index,
      mediaHash: data.mediaHash,
      result: data.analysisResult,
      confidence: data.confidence,
      timestamp: newBlock.timestamp,
      status: 'CONFIRMED',
      gasUsed: Math.floor(Math.random() * 50000) + 21000,
      fileName: data.fileName,
    });

    return newBlock;
  }

  async analyzeMedia(file: File): Promise<{ result: 'AUTHENTIC' | 'DEEPFAKE' | 'SUSPICIOUS'; confidence: number; details: any }> {
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));
    
    // Generate analysis based on file properties
    const fileHash = syncHash(file.name + file.size + file.lastModified);
    const numHash = parseInt(fileHash.slice(0, 8), 16);
    const rand = (numHash % 100) / 100;

    let result: 'AUTHENTIC' | 'DEEPFAKE' | 'SUSPICIOUS';
    let confidence: number;

    if (rand < 0.55) {
      result = 'AUTHENTIC';
      confidence = 85 + Math.random() * 14;
    } else if (rand < 0.80) {
      result = 'DEEPFAKE';
      confidence = 80 + Math.random() * 19;
    } else {
      result = 'SUSPICIOUS';
      confidence = 60 + Math.random() * 30;
    }

    const details = this.generateAnalysisDetails(result, confidence);
    return { result, confidence, details };
  }

  async hashFile(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const buffer = e.target?.result as ArrayBuffer;
        if (buffer && window.crypto?.subtle) {
          const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
          resolve(hashHex);
        } else {
          resolve(syncHash(file.name + file.size));
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }

  getChain(): Block[] {
    return [...this.chain].reverse();
  }

  getTransactions(): Transaction[] {
    return [...this.transactions];
  }

  getNetworkStats(): NetworkStats {
    const total = this.transactions.length;
    return {
      totalBlocks: this.chain.length,
      totalVerifications: total,
      authenticCount: this.transactions.filter(t => t.result === 'AUTHENTIC').length,
      deepfakeCount: this.transactions.filter(t => t.result === 'DEEPFAKE').length,
      suspiciousCount: this.transactions.filter(t => t.result === 'SUSPICIOUS').length,
      networkHashrate: (Math.random() * 500 + 1000).toFixed(2) + ' TH/s',
      activeValidators: 47,
      averageBlockTime: 2.3,
    };
  }

  validateChain(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      if (currentBlock.previousHash !== previousBlock.hash) return false;
    }
    return true;
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }
}

// Singleton instance
let blockchainInstance: BlockchainService | null = null;

export function getBlockchain(): BlockchainService {
  if (!blockchainInstance) {
    blockchainInstance = new BlockchainService();
  }
  return blockchainInstance;
}

export { BlockchainService };
