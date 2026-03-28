import { HeroSection } from '../components/ui/hero-section-2';

export default function HeroSectionDemo() {
  return (
    <div className="w-full min-h-[calc(100vh-8rem)] flex items-center justify-center bg-[#f8fafc] p-6 lg:p-12">
      <HeroSection
        logo={{
            url: "https://images.unsplash.com/photo-1614680376593-902f74a9cb0c?w=100&auto=format&fit=crop&q=60",
            alt: "Mountain Logo",
            text: "Summit Expeditions"
        }}
        slogan="ELEVATE YOUR PERSPECTIVE"
        title={
          <>
            Each Peak <br />
            <span className="text-blue-600 border-b-4 border-blue-600/30">Teaches Something</span>
          </>
        }
        subtitle="Discover breathtaking landscapes and challenge yourself with our guided mountain expeditions. Join a community of adventurers."
        callToAction={{
          text: "JOIN US TO EXPLORE",
          href: "/materials",
        }}
        backgroundImage="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&auto=format&fit=crop&q=60"
        contactInfo={{
            website: "yourwebsite.com",
            phone: "+1 (555) 123-4567",
            address: "20 Fieldstone Dr, Roswell, GA",
        }}
        className="max-w-[1400px] w-full mx-auto"
      />
    </div>
  );
}
