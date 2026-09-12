import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ChainProof | Blockchain DeepFake Detection System',
  description: 'Advanced AI-powered deepfake detection secured by immutable blockchain technology. Verify media authenticity with cryptographic proof.',
  keywords: 'blockchain, deepfake detection, media verification, AI, cryptography, digital authenticity',
  openGraph: {
    title: 'ChainProof | Blockchain DeepFake Detection',
    description: 'Verify media authenticity with blockchain-secured AI detection',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-dark-bg antialiased">{children}</body>
    </html>
  )
}
