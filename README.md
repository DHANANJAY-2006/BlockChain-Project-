# BlockChain DeepFake Proof System

A professional, full-stack blockchain-secured deepfake detection web application.

## 🚀 Live Demo
Deployed on Vercel — check deployment link.

## 🛠 Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom cyber/blockchain theme
- **Blockchain**: Custom JavaScript blockchain with SHA-256 hashing
- **AI Analysis**: Multi-model deepfake detection simulation
- **Animations**: Canvas particle system, CSS animations

## 🔗 Features
- **Upload & Verify**: Drag-and-drop media upload with real-time analysis progress
- **Blockchain Recording**: Every verification permanently recorded on-chain
- **SHA-256 Hashing**: Cryptographic fingerprinting of all media
- **Live Blockchain Explorer**: View all blocks, transactions, and chain integrity
- **Network Statistics**: Real-time live counters and detection breakdown
- **6 AI Models**: Face consistency, temporal analysis, artifact detection, metadata integrity, compression analysis, lighting verification

## 🔧 Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📦 Deploy to Vercel
```bash
vercel --prod
```

## 🏗 Architecture
```
src/
├── app/
│   ├── layout.tsx       # Root layout with fonts & metadata
│   ├── page.tsx         # Main page assembling all sections
│   └── globals.css      # Global styles & cyber theme
├── components/
│   ├── Navbar.tsx        # Responsive navigation
│   ├── HeroSection.tsx   # Animated canvas hero
│   ├── FeaturesSection.tsx # Feature cards
│   ├── VerifySection.tsx # File upload & analysis
│   ├── BlockchainSection.tsx # Live blockchain explorer
│   ├── HowItWorksSection.tsx # 5-step pipeline
│   ├── StatsSection.tsx  # Network statistics
│   └── Footer.tsx        # Footer
└── lib/
    ├── blockchain.ts     # Blockchain implementation
    └── types.ts          # TypeScript interfaces
```

## 👨‍💻 Author
**DHANANJAY** — [GitHub](https://github.com/DHANANJAY-2006)
