import SEO from '../components/SEO';
import HeroSection from '../components/landing/HeroSection';
import FeaturesGrid from '../components/landing/FeaturesGrid';
import DashboardPreview from '../components/landing/DashboardPreview';
import StatsBar from '../components/landing/StatsBar';
import AnalyticsSection from '../components/landing/AnalyticsSection';
import BottomCTA from '../components/landing/BottomCTA';

export default function HomePage() {
  return (
    <div className="relative overflow-hidden bg-[#fafafa]">
      <SEO
        title="JNTUK Library | Study Materials, SGPA/CGPA Calculator, Academic Dashboard"
        description="Your complete JNTUK academic platform. Access study materials, PYQs, SGPA/CGPA calculators, backlog tracking, and academic analytics in one modern ecosystem."
        canonicalUrl="/"
      />
      <HeroSection />
      <FeaturesGrid />
      <StatsBar />
      <DashboardPreview />
      <AnalyticsSection />
      <BottomCTA />
    </div>
  );
}
