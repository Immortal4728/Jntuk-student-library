import { motion } from 'framer-motion';
import { BookOpen, FileText, HelpCircle, Zap, Layout, Shield, RefreshCw } from 'lucide-react';
import SEO from '../components/SEO';

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const fade = {
  hidden: { y: 14, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Semester-wise Materials',
    desc: 'Unit-wise notes, lab manuals, and reference materials organized by branch and semester.',
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.08)',
  },
  {
    icon: FileText,
    title: 'Previous Question Papers',
    desc: 'Complete archive of PYQs from 2019–2024, sorted and instantly downloadable.',
    color: '#0ea5e9',
    bg: 'rgba(14,165,233,0.08)',
  },
  {
    icon: HelpCircle,
    title: 'Important Questions & Notes',
    desc: 'Curated sets of high-yield questions that frequently appear in exams.',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
  },
];

const PRINCIPLES = [
  {
    icon: Zap,
    label: 'Fast by Default',
    desc: 'No loading spinners, no friction. Materials load instantly on any device.',
  },
  {
    icon: Layout,
    label: 'Structured Access',
    desc: 'Branch → Semester → Subject → Download. A predictable path every time.',
  },
  {
    icon: Shield,
    label: 'No Account Required',
    desc: 'Browse and download materials without signing up. Zero barriers to access.',
  },
  {
    icon: RefreshCw,
    label: 'Continuously Updated',
    desc: 'New materials and regulations added as they become available.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-4rem)] relative overflow-hidden">
      <SEO
        title="About JNTUK Library - Student Materials Platform"
        description="Learn about JNTUK Library — a centralized platform for JNTUK students to access semester-wise materials, notes, PYQs, and important questions. Built by Rishi Chowdary."
        keywords="about JNTUK library, JNTUK student platform, JNTU Kakinada materials platform, engineering study resources"
        canonicalUrl="/about"
      />
      {/* Subtle Grid Background */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <motion.div
        className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16 relative z-10"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        {/* ─── HERO: What is this platform? ─── */}
        <section className="pt-12 sm:pt-16 pb-12 sm:pb-16 md:pt-20 md:pb-20 border-b border-[#e5e7eb]/60">
          <div className="max-w-2xl">
            <motion.span
              className="inline-block text-[10px] sm:text-[11px] font-bold tracking-[0.15em] uppercase text-[#94a3b8] mb-3"
              variants={fade}
            >
              About
            </motion.span>

            <motion.h1
              className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] font-bold text-[#0f172a] tracking-tight leading-[1.1] mb-5"
              variants={fade}
            >
              About JNTUK Library
            </motion.h1>

            <motion.p
              className="text-[15px] sm:text-base md:text-[1.0625rem] text-[#475569] leading-[1.7] font-medium"
              variants={fade}
            >
              A centralized platform for JNTUK students to access semester-wise materials, 
              notes, and previous question papers — all in one place. Built to eliminate 
              the chaos of scattered WhatsApp groups and random Google Drive links.
            </motion.p>
          </div>
        </section>

        {/* ─── WHAT'S INSIDE: Scannable feature bullets ─── */}
        <motion.section
          className="pt-12 sm:pt-14 pb-12 sm:pb-14 md:pt-16 md:pb-16 border-b border-[#e5e7eb]/60"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <motion.div className="mb-8 sm:mb-10" variants={fade}>
            <h2 className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#94a3b8] mb-2">
              Resources
            </h2>
            <p className="text-xl sm:text-2xl md:text-[1.75rem] font-bold text-[#0f172a] tracking-tight">
              What you'll find here
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {FEATURES.map((item) => (
              <motion.div
                key={item.title}
                className="group rounded-2xl border border-[#e5e7eb]/80 bg-white p-5 sm:p-6 transition-all duration-200 hover:border-[#d1d5db] hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
                variants={fade}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-105"
                  style={{ backgroundColor: item.bg }}
                >
                  <item.icon size={20} style={{ color: item.color }} strokeWidth={1.5} />
                </div>
                <h3 className="text-[15px] font-semibold text-[#0f172a] tracking-tight mb-1.5">
                  {item.title}
                </h3>
                <p className="text-[13px] sm:text-[13.5px] text-[#64748b] leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ─── HOW IT'S BUILT: Principles ─── */}
        <motion.section
          className="pt-12 sm:pt-14 pb-12 sm:pb-14 md:pt-16 md:pb-16 border-b border-[#e5e7eb]/60"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <motion.div className="mb-8 sm:mb-10" variants={fade}>
            <h2 className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#94a3b8] mb-2">
              Design
            </h2>
            <p className="text-xl sm:text-2xl md:text-[1.75rem] font-bold text-[#0f172a] tracking-tight">
              How it's built
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 sm:gap-y-8 max-w-3xl">
            {PRINCIPLES.map((item) => (
              <motion.div
                key={item.label}
                className="flex gap-3.5"
                variants={fade}
              >
                <div className="w-9 h-9 rounded-lg bg-[#f1f5f9] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <item.icon size={16} className="text-[#475569]" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-[14px] sm:text-[15px] font-semibold text-[#0f172a] tracking-tight mb-1">
                    {item.label}
                  </h3>
                  <p className="text-[13px] sm:text-[13.5px] text-[#64748b] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ─── CREATOR ─── */}
        <motion.section
          className="pt-12 sm:pt-14 pb-12 sm:pb-14 md:pt-16 md:pb-16 border-b border-[#e5e7eb]/60"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <motion.div 
            className="w-full max-w-3xl mx-auto rounded-2xl md:rounded-[1.5rem] border border-[#e2e5ea] bg-white p-7 sm:p-10 md:p-12 shadow-[0_2px_16px_rgba(0,0,0,0.02)]"
            variants={fade}
          >
            <div className="flex flex-col items-center text-center">
              <h2 className="text-[10px] sm:text-[11px] font-bold tracking-[0.15em] uppercase text-[#94a3b8] mb-3">
                Creator
              </h2>
              <p className="text-xl sm:text-[1.75rem] font-bold text-[#0f172a] tracking-tight mb-1">
                Rishi Chowdary
              </p>
              <p className="text-[11px] sm:text-[12px] font-bold tracking-[0.08em] uppercase text-[#64748b] mb-6 sm:mb-8">
                Full Stack Developer
              </p>
              
              <p className="text-[15px] sm:text-base text-[#475569] leading-[1.65] font-medium max-w-xl mx-auto mb-8 sm:mb-10">
                Building practical systems that simplify how students access academic resources. JNTUK Library is engineered for speed, clarity, and zero-friction usability.
              </p>

              <div className="w-full max-w-md mx-auto h-px bg-[#f1f5f9] mb-8" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12 w-full max-w-lg mx-auto">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#94a3b8] mb-1.5">
                    Focus
                  </span>
                  <span className="text-[14px] font-medium text-[#1e293b]">
                    Clarity-first product engineering
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#94a3b8] mb-1.5">
                    Goal
                  </span>
                  <span className="text-[14px] font-medium text-[#1e293b]">
                    Zero-friction academic tools
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* ─── SUPPORT ─── */}
        <motion.section
          className="pt-12 sm:pt-14 pb-12 sm:pb-14 md:pt-16 md:pb-16 border-b border-[#e5e7eb]/60"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-16">
            {/* Left: Text */}
            <motion.div className="w-full lg:max-w-[420px]" variants={fade}>
              <h2 className="text-xl sm:text-2xl md:text-[1.75rem] font-bold text-[#0f172a] tracking-tight mb-3">
                Support the Platform
              </h2>
              <p className="text-[14px] sm:text-[15px] text-[#64748b] leading-[1.7] mb-5">
                Maintained entirely by one person. Direct support pays for hosting, 
                database infrastructure, and ongoing content updates.
              </p>
              <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#94a3b8]">
                Completely optional — always appreciated.
              </p>
            </motion.div>

            {/* Right: Payment Panel */}
            <motion.div
              className="w-full lg:w-[380px] flex-shrink-0"
              variants={fade}
            >
              <div className="rounded-2xl border border-[#e2e5ea] bg-white p-5 sm:p-7 shadow-sm">
                {/* Amount Chips */}
                <div className="flex gap-2.5 mb-5">
                  {['₹50', '₹100', '₹200'].map((amount) => (
                    <button
                      key={amount}
                      className="flex-1 py-3 sm:py-2.5 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] text-[14px] sm:text-[0.875rem] font-semibold text-[#64748b] hover:border-[#cbd5e1] hover:bg-white active:scale-[0.98] transition-all"
                    >
                      {amount}
                    </button>
                  ))}
                </div>

                {/* Primary Button */}
                <button className="w-full py-3.5 rounded-xl bg-[#0f172a] text-white text-[14px] sm:text-[15px] font-semibold hover:bg-[#1e293b] active:scale-[0.98] transition-all mb-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                  Support via Razorpay
                </button>

                {/* Subtext */}
                <div className="flex items-center justify-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-[11px] font-medium text-[#94a3b8]">Secure transaction</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* ─── CLOSING TRUST SIGNAL ─── */}
        <motion.section
          className="pt-14 pb-20 sm:pt-16 sm:pb-24 flex items-center justify-center text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
        >
          <motion.div className="max-w-md" variants={fade}>
            <p className="text-[15px] sm:text-base md:text-[1.0625rem] font-medium text-[#334155] tracking-tight">
              "Built to simplify access to academic resources."
            </p>
            <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#94a3b8] mt-3">
              Actively maintained · Continuously updated
            </p>
          </motion.div>
        </motion.section>

      </motion.div>
    </div>
  );
}


