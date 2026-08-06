import SEO from '../components/SEO';
import HeroSection from '../components/landing/HeroSection';
import FeaturesGrid from '../components/landing/FeaturesGrid';
import DashboardPreview from '../components/landing/DashboardPreview';
import StatsBar from '../components/landing/StatsBar';
import AnalyticsSection from '../components/landing/AnalyticsSection';
import BottomCTA from '../components/landing/BottomCTA';

export default function HomePage() {
  return (
    <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      <SEO
        title="JNTUK R23 Materials, SGPA & CGPA Calculator | JNTUK Library"
        description="Free JNTUK R23 regulation study materials, unit-wise notes, previous year question papers (PYQs), and instant SGPA & CGPA calculator for JNTUK CSE, ECE, IT, and AIML students."
        keywords="JNTUK R23 materials, JNTUK CGPA calculator, JNTUK SGPA calculator, JNTUK R23 notes, JNTUK previous question papers, JNTUK R23 syllabus, JNTUK grade calculator, JNTUK SGPA to percentage, JNTUK CSE R23 materials, JNTUK ECE R23 materials, JNTUK Library, JNTU Kakinada materials"
        canonicalUrl="/"
        breadcrumbs={[
          { name: 'Home', url: '/' },
        ]}
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
