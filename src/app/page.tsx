import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import VerifySection from '@/components/VerifySection';
import CompareSection from '@/components/CompareSection';
import ThreatFeedSection from '@/components/ThreatFeedSection';
import BlockchainSection from '@/components/BlockchainSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import StatsSection from '@/components/StatsSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-dark-bg">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <VerifySection />
      <CompareSection />
      <ThreatFeedSection />
      <BlockchainSection />
      <HowItWorksSection />
      <StatsSection />
      <Footer />
    </main>
  );
}
