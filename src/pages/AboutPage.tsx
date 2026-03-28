import { motion } from 'framer-motion';

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const fade = {
  hidden: { y: 16, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};


const APPROACH = [
  {
    label: 'Structured Systems',
    desc: 'Organized, predictable access to information.',
  },
  {
    label: 'Performance First',
    desc: 'Fast, frictionless interactions on any device.',
  },
  {
    label: 'Clarity Over Complexity',
    desc: 'No unnecessary features, no noise.',
  },
  {
    label: 'Real Usage Focus',
    desc: 'Built for actual student behaviors, not assumptions.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-4rem)] relative overflow-hidden">
      {/* Subtle Grid Background */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      <motion.div
        className="max-w-6xl mx-auto px-5 lg:px-8 relative z-10"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        {/* ─── HERO & IDENTITY PANEL ─── */}
        <section className="pt-16 pb-16 md:pt-24 md:pb-24 border-b border-[#e5e7eb]/60">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12 lg:gap-24">

            {/* Left — Hero text (Mobile Stack First) */}
            <div className="w-full lg:max-w-[540px]">
              <motion.span
                className="inline-block text-[11px] font-bold tracking-[0.15em] uppercase text-[#64748b] mb-4"
                variants={fade}
              >
                System / Identity
              </motion.span>

              <motion.h1
                className="text-[2.5rem] md:text-[3.25rem] font-bold text-[#0f172a] tracking-tight leading-[1.05]"
                variants={fade}
              >
                About the Founder
              </motion.h1>

              <motion.div
                className="mt-6 h-[3px] w-12 bg-[#0f172a]"
                variants={fade}
              />

              <motion.p
                className="mt-8 text-[15px] md:text-[1.0625rem] text-[#334155] leading-[1.7] font-medium"
                variants={fade}
              >
                "This platform was created for students — to cut through the chaos and deliver structured academic materials with absolute clarity and speed."
              </motion.p>

              <motion.p
                className="mt-4 text-[14px] md:text-[0.9375rem] text-[#64748b] leading-[1.75]"
                variants={fade}
              >
                If it helped you, support the mission to keep it free, reliable, and continuously improving for everyone.
              </motion.p>
            </div>

            {/* Right — System Card */}
            <motion.div
              className="w-full lg:min-w-[360px] lg:max-w-[400px] flex-shrink-0 mt-2 lg:mt-0"
              variants={fade}
            >
              <div
                className="rounded-2xl md:rounded-[1.25rem] border border-[#e2e5ea] bg-white/90 backdrop-blur-md shadow-sm"
              >
                {/* Card Header */}
                <div className="px-6 py-6 md:px-8 md:pt-8 md:pb-6 border-b border-[#f1f5f9]">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-[#0f172a] flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-[1rem] leading-none select-none">R</span>
                    </div>
                    <div>
                      <p className="text-[17px] sm:text-[1rem] font-semibold text-[#0f172a] leading-tight tracking-tight">
                        Rishi Chowdary
                      </p>
                      <p className="text-[11px] font-bold tracking-[0.08em] uppercase text-[#64748b] mt-1.5">
                        Full Stack Engineer
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="px-6 py-6 md:px-8 md:py-7 space-y-6">
                  <InfoRow label="Identity" value="Full Stack Engineer" />
                  <InfoRow label="Institution" value="Sai Tirumala NVR Engineering College" />
                  <InfoRow label="Focus" value="System design, performance, and usability." />
                  <InfoRow label="Goal" value="Build zero-friction academic tools." />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── APPROACH ─── */}
        <motion.section
          className="pt-20 pb-20 md:pt-28 md:pb-28 border-b border-[#e5e7eb]/60"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10% 0px' }}
        >
          <motion.div className="mb-12 md:mb-14" variants={fade}>
            <h2 className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#64748b] mb-2">
              Engineering
            </h2>
            <p className="text-3xl md:text-[2rem] font-bold text-[#0f172a] tracking-tight">
              Approach
            </p>
          </motion.div>

          <div className="flex flex-col gap-8 md:gap-6 max-w-2xl">
            {APPROACH.map((item, i) => (
              <motion.div
                key={i}
                className="flex flex-col md:flex-row md:items-baseline md:gap-6 pb-6 md:border-b border-[#e5e7eb]/50 last:border-0 last:pb-0 relative"
                variants={fade}
              >
                {/* Mobile visual separator */}
                <div className="absolute left-0 top-0 w-8 h-[2px] bg-slate-200 md:hidden" />
                
                <div className="md:w-1/3 shrink-0 mb-2 md:mb-0 pt-3 md:pt-0">
                  <h3 className="text-[15px] md:text-[0.9375rem] font-semibold text-[#0f172a] tracking-tight">
                    {item.label}
                  </h3>
                </div>
                <div className="md:w-2/3">
                  <p className="text-[14px] md:text-[0.9375rem] text-[#64748b] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ─── SUPPORT ─── */}
        <motion.section
          className="pt-20 pb-20 md:pt-28 md:pb-28 border-b border-[#e5e7eb]/60"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10% 0px' }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12 lg:gap-20">
            {/* Left: Text */}
            <motion.div className="w-full lg:max-w-[460px]" variants={fade}>
              <h2 className="text-[1.75rem] md:text-[2rem] font-bold text-[#0f172a] tracking-tight mb-4">
                Support the System
              </h2>
              <p className="text-[15px] md:text-[0.9375rem] text-[#64748b] leading-[1.7] mb-8">
                Maintained entirely by one person. Direct support pays for hosting, database scales, and ongoing optimization cycles.
              </p>
              
              <div className="h-[2px] w-8 bg-[#e2e8f0] mb-6" />
              
              <p className="text-[12px] font-semibold tracking-[0.06em] uppercase text-[#94a3b8]">
                Support is 100% optional, but highly appreciated.
              </p>
            </motion.div>

            {/* Right: Payment Panel */}
            <motion.div 
              className="w-full lg:w-[420px] flex-shrink-0 group"
              variants={fade}
            >
              <div 
                className="rounded-2xl md:rounded-[1.25rem] border border-[#e2e5ea] bg-white p-6 sm:p-9 shadow-sm"
              >
                {/* Amount Chips - Touch targets upgraded */}
                <div className="flex gap-2.5 md:gap-3 mb-6">
                  {['₹50', '₹100', '₹200'].map((amount) => (
                    <button 
                      key={amount}
                      className="flex-1 py-3.5 md:py-2.5 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] text-[15px] md:text-[0.875rem] font-semibold text-[#64748b] hover:border-[#cbd5e1] hover:bg-white active:scale-[0.98] transition-all"
                    >
                      {amount}
                    </button>
                  ))}
                </div>

                {/* Primary Button */}
                <button 
                  className="w-full py-4 rounded-xl bg-[#0f172a] text-white text-[15px] font-semibold tracking-wide hover:bg-[#1e293b] active:scale-[0.98] transition-all mb-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                >
                  Support via Razorpay
                </button>

                {/* Subtext */}
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-[12px] font-medium text-[#94a3b8]">Secure transaction</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* ─── CLOSING ─── */}
        <motion.section
          className="pt-20 pb-28 md:pt-32 md:pb-40 flex items-center justify-center text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10% 0px' }}
          variants={stagger}
        >
          <motion.div variants={fade}>
            <p className="text-[17px] md:text-[1.125rem] font-medium text-[#0f172a] tracking-wide">
              "Built to solve a problem I faced myself."
            </p>
          </motion.div>
        </motion.section>

      </motion.div>
    </div>
  );
}

/* ─── Sub-components ─── */

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#94a3b8] mb-1.5">
        {label}
      </p>
      <p className="text-[15px] md:text-[14px] font-medium text-[#1e293b] leading-[1.5]">
        {value}
      </p>
    </div>
  );
}
