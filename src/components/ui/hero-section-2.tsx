import React from 'react';
import { cn } from "../../lib/utils";
import { motion } from 'framer-motion';
import { Globe, Phone, MapPin } from 'lucide-react';

// Icon component for contact details replaced by mapping Lucide-React alternatives
const InfoIcon = ({ type }: { type: 'website' | 'phone' | 'address' }) => {
    const icons = {
        website: <Globe className="h-5 w-5 text-blue-600" />,
        phone: <Phone className="h-5 w-5 text-blue-600" />,
        address: <MapPin className="h-5 w-5 text-blue-600" />,
    };
    return <div className="mr-2 flex-shrink-0">{icons[type]}</div>;
};

import { HTMLMotionProps } from "framer-motion";

export interface HeroSectionProps extends Omit<HTMLMotionProps<"section">, "title"> {
  logo?: {
    url: string;
    alt: string;
    text?: string;
  };
  slogan?: string;
  title: React.ReactNode;
  subtitle: string;
  callToAction: {
    text: string;
    href: string;
  };
  backgroundImage: string;
  contactInfo: {
    website: string;
    phone: string;
    address: string;
  };
}

const HeroSection = React.forwardRef<HTMLDivElement, HeroSectionProps>(
  ({ className, logo, slogan, title, subtitle, callToAction, backgroundImage, contactInfo, ...props }, ref) => {
    
    // Animation variants for the container to orchestrate children animations
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.15,
          delayChildren: 0.2,
        },
      },
    };

    // Animation variants for individual text/UI elements
    const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          duration: 0.5,
          ease: "easeOut",
        },
      },
    };
    
    return (
      <motion.section
        ref={ref}
          className={cn(
          "relative flex w-full flex-col overflow-hidden bg-white text-slate-900 md:flex-row shadow-sm rounded-3xl border border-slate-100",
          className
        )}
        initial="hidden"
        animate="visible"
        variants={containerVariants as any}
        {...props}
      >
        {/* Left Side: Content */}
        <div className="flex w-full flex-col justify-between p-8 md:w-1/2 md:p-12 lg:w-3/5 lg:p-16">
            {/* Top Section: Logo & Main Content */}
            <div>
                <motion.header className="mb-12" variants={itemVariants as any}>
                    {logo && (
                        <div className="flex items-center">
                            <img src={logo.url} alt={logo.alt} className="mr-3 h-8 w-8 rounded-full border border-slate-200" />
                            <div>
                                {logo.text && <p className="text-lg font-bold text-slate-900">{logo.text}</p>}
                                {slogan && <p className="text-xs tracking-wider text-slate-500 font-medium">{slogan}</p>}
                            </div>
                        </div>
                    )}
                </motion.header>

                <motion.main variants={containerVariants as any}>
                    <motion.h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl tracking-tight" variants={itemVariants as any}>
                        {title}
                    </motion.h1>
                    <motion.div className="my-6 h-1 w-20 bg-blue-600 rounded-full" variants={itemVariants as any}></motion.div>
                    <motion.p className="mb-8 max-w-md text-base text-slate-500 font-medium" variants={itemVariants as any}>
                        {subtitle}
                    </motion.p>
                    <motion.a href={callToAction.href} className="text-[1rem] font-bold tracking-wide text-blue-600 transition-colors hover:text-blue-800" variants={itemVariants as any}>
                        {callToAction.text}
                    </motion.a>
                </motion.main>
            </div>

            {/* Bottom Section: Footer Info */}
            <motion.footer className="mt-12 w-full" variants={itemVariants as any}>
                <div className="grid grid-cols-1 gap-6 text-sm text-slate-600 font-medium sm:grid-cols-3">
                    <div className="flex items-center">
                        <InfoIcon type="website" />
                        <span>{contactInfo.website}</span>
                    </div>
                    <div className="flex items-center">
                        <InfoIcon type="phone" />
                        <span>{contactInfo.phone}</span>
                    </div>
                    <div className="flex items-center">
                        <InfoIcon type="address" />
                        <span>{contactInfo.address}</span>
                    </div>
                </div>
            </motion.footer>
        </div>

        {/* Right Side: Image with Clip Path Animation */}
        <motion.div 
          className="w-full min-h-[300px] bg-cover bg-center md:w-1/2 md:min-h-full lg:w-2/5"
          style={{ 
            backgroundImage: `url(${backgroundImage})`,
          }}
          initial={{ clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)' }}
          animate={{ clipPath: 'polygon(25% 0, 100% 0, 100% 100%, 0% 100%)' }}
          transition={{ duration: 1.2, ease: "circOut" }}
        >
        </motion.div>
      </motion.section>
    );
  }
);

HeroSection.displayName = "HeroSection";

export { HeroSection };
