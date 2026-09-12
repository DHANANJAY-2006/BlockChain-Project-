// Blockchain types for deepfake detection

export interface BlockData {
  mediaHash: string;
  analysisResult: 'AUTHENTIC' | 'DEEPFAKE' | 'SUSPICIOUS';
  confidence: number;
  timestamp: number;
  fileName: string;
  fileSize: number;
  mimeType: string;
  analysisDetails: AnalysisDetails;
  submitterAddress: string;
}

export interface AnalysisDetails {
  faceConsistencyScore: number;
  temporalConsistencyScore: number;
  artifactDetectionScore: number;
  metadataIntegrityScore: number;
  compressionAnomalyScore: number;
  lightingConsistencyScore: number;
}

export interface Block {
  index: number;
  timestamp: number;
  data: BlockData;
  previousHash: string;
  hash: string;
  nonce: number;
  merkleRoot: string;
  validator: string;
}

export interface Transaction {
  id: string;
  blockIndex: number;
  mediaHash: string;
  result: 'AUTHENTIC' | 'DEEPFAKE' | 'SUSPICIOUS';
  confidence: number;
  timestamp: number;
  status: 'CONFIRMED' | 'PENDING' | 'FAILED';
  gasUsed: number;
  fileName: string;
}

export interface NetworkStats {
  totalBlocks: number;
  totalVerifications: number;
  authenticCount: number;
  deepfakeCount: number;
  suspiciousCount: number;
  networkHashrate: string;
  activeValidators: number;
  averageBlockTime: number;
}
