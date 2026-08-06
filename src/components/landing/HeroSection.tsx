import { motion, animate } from 'framer-motion';
import { ArrowRight, Sparkles, Calculator, BookOpen, TrendingUp, BarChart3, FileText, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };

/* ── Particle field ── */
function ParticleField() {
  const particles = Array.from({ length: 35 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 4,
    opacity: Math.random() * 0.2 + 0.05,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div key={p.id}
          className="absolute rounded-full bg-slate-300"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            boxShadow: `0 0 ${p.size * 2}px rgba(148,163,184,${p.opacity})`,
          }}
          animate={{
            y: [0, -30 - Math.random() * 20, 0],
            x: [0, (Math.random() - 0.5) * 40, 0],
            opacity: [p.opacity, p.opacity * 1.5, p.opacity],
          }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/* ── Animated grid background ── */
function AnimatedGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute inset-0" style={{
        backgroundImage: `linear-gradient(to right, rgba(148,163,184,0.06) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(148,163,184,0.06) 1px, transparent 1px)`,
        backgroundSize: '56px 56px',
      }} />
      {/* Animated scan line */}
      <motion.div className="absolute left-0 right-0 h-[2px]"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(148,163,184,0.1), rgba(203,213,225,0.05), transparent)' }}
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }} />
    </div>
  );
}

/* ── Floating stat widget ── */
function FloatingWidget({ children, className, delay = 0, y = [0, -12, 0], duration = 5 }: {
  children: React.ReactNode; className: string; delay?: number; y?: number[]; duration?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay: delay + 0.5, ease: [0.22, 1, 0.36, 1] as const }}
      className={className}
    >
      <motion.div
        animate={{ y }}
        transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay: delay * 0.5 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ── Animated SGPA counter ── */
function AnimatedSGPA() {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const timeout = setTimeout(() => {
      const ctrl = animate(0, 8.72, {
        duration: 2.5,
        ease: [0.22, 1, 0.36, 1] as const,
        onUpdate: (v) => setVal(parseFloat(v.toFixed(2))),
      });
      return () => ctrl.stop();
    }, 1200);
    return () => clearTimeout(timeout);
  }, []);
  return <span className="tabular-nums">{val.toFixed(2)}</span>;
}

/* ── Mini bar chart for widget ── */
function MiniBarChart() {
  const bars = [65, 72, 58, 85, 78, 92, 88];
  return (
    <div className="flex items-end gap-1 h-10">
      {bars.map((h, i) => (
        <motion.div key={i} className="flex-1 rounded-sm min-w-[4px] bg-slate-300"
          initial={{ height: 0 }}
          animate={{ height: `${h}%` }}
          transition={{ duration: 0.8, delay: 1.5 + i * 0.08, ease: [0.22, 1, 0.36, 1] as const }}
        />
      ))}
    </div>
  );
}

/* ── Feature pills ── */
const featurePills = [
  { label: 'Materials', icon: BookOpen, iconColor: 'text-blue-600', bg: 'bg-blue-50/80 border-blue-100' },
  { label: 'PYQs', icon: FileText, iconColor: 'text-purple-600', bg: 'bg-purple-50/80 border-purple-100' },
  { label: 'SGPA Calculator', icon: Calculator, iconColor: 'text-blue-600', bg: 'bg-blue-50/80 border-blue-100' },
  { label: 'CGPA Tracker', icon: TrendingUp, iconColor: 'text-indigo-600', bg: 'bg-indigo-50/80 border-indigo-100' },
  { label: 'Results', icon: BarChart3, iconColor: 'text-violet-600', bg: 'bg-violet-50/80 border-violet-100' },
  { label: 'Analytics', icon: TrendingUp, iconColor: 'text-emerald-600', bg: 'bg-emerald-50/80 border-emerald-100' },
  { label: 'Backlogs', icon: AlertTriangle, iconColor: 'text-rose-600', bg: 'bg-rose-50/80 border-rose-100' },
];

export default function HeroSection() {
  return (
    <section id="hero" aria-label="Hero — JNTUK Library academic platform" className="relative w-full min-h-[90dvh] flex items-center overflow-hidden">
      {/* Layered background */}
      <div className="absolute inset-0 pointer-events-none">
        <AnimatedGrid />
        {/* Gradient orbs (Neutral) */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.12, 0.2, 0.12] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 left-[15%] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-slate-200/30 via-slate-100/20 to-transparent blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.16, 0.08] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-[20%] -right-20 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-gray-200/25 via-slate-50/10 to-transparent blur-[100px]"
        />
        {/* Radial vignette */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 70% 50% at 30% 50%, transparent 0%, #ffffff 100%)',
        }} />
        <ParticleField />
      </div>

      <motion.div variants={stagger} initial="hidden" animate="show"
        className="relative z-10 w-full max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 pt-12 lg:pt-16 pb-12 lg:pb-16 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-6 items-center">

        {/* ═══ LEFT: Text content ═══ */}
        <div className="flex flex-col items-start lg:items-start text-left">
          {/* Badge */}
          <motion.div variants={fadeUp} className="mb-4">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
              </span>
              <span className="text-[11px] font-bold text-slate-700 tracking-[0.12em] uppercase">
                Academic Platform • Live
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={fadeUp}
            className="text-[2.75rem] sm:text-[3.5rem] lg:text-[4rem] xl:text-[4.5rem] font-black tracking-[-0.04em] leading-[1.05] py-1 overflow-visible mb-4 text-[#0F172A]">
            <motion.span className="inline-block bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent"
              style={{ backgroundSize: '200% 100%' }}
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}>
              JNTUK Library
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p variants={fadeUp}
            className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl font-medium mb-6">
            Access study materials, PYQs, SGPA/CGPA calculators, backlog tracking, and academic analytics — all in one modern platform built for JNTUK students.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-5">
            <Link to="/dashboard" id="cta-enter-dashboard"
              className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-[14px] overflow-hidden bg-[#0F172A] hover:bg-[#1E293B] text-white shadow-[0_4px_16px_rgba(15,23,42,0.14)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.24)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200">
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <Sparkles size={15} className="relative z-10 text-blue-400" />
              <span className="relative z-10">Enter Dashboard</span>
              <ArrowRight size={15} className="relative z-10 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link to="/materials" id="cta-explore-materials"
              className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white text-slate-800 font-semibold text-[14px] border border-slate-200/90 shadow-[0_2px_8px_rgba(15,23,42,0.04)] hover:bg-slate-50 hover:border-slate-300 hover:shadow-[0_6px_20px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200">
              <BookOpen size={15} className="text-blue-600 group-hover:scale-105 transition-transform" />
              Explore Materials
            </Link>
            <Link to="/dashboard/tracker" id="cta-cgpa-calculator"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100/90 text-slate-800 font-semibold text-[14px] border border-slate-200/60 hover:bg-slate-200/70 hover:border-slate-300 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200">
              <Calculator size={15} className="text-indigo-600 group-hover:scale-105 transition-transform" />
              Try Calculator
            </Link>
          </motion.div>

          {/* Feature pill strip */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
            {featurePills.map((pill) => (
              <motion.div key={pill.label}
                whileHover={{ scale: 1.02, y: -1 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200/80 shadow-[0_1px_4px_rgba(15,23,42,0.03)] cursor-default transition-all duration-200 hover:border-slate-300 hover:shadow-[0_4px_12px_rgba(15,23,42,0.06)]">
                <div className={`w-4 h-4 rounded-full ${pill.bg} flex items-center justify-center`}>
                  <pill.icon size={10} className={pill.iconColor} />
                </div>
                <span className="text-[11px] font-semibold text-slate-700">{pill.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ═══ RIGHT: Floating dashboard showcase ═══ */}
        <div className="relative hidden lg:block h-[520px]">
          {/* Glowing backdrop */}
          <motion.div className="absolute inset-0 rounded-3xl"
            animate={{ opacity: [0.1, 0.18, 0.1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ background: 'radial-gradient(ellipse at center, rgba(37,99,235,0.08), transparent 70%)' }}
          />

          {/* ─ SGPA Widget ─ */}
          <FloatingWidget className="absolute top-2 left-2 z-20" delay={0} y={[0, -6, 0]} duration={5.5}>
            <div className="w-[205px] rounded-2xl bg-white border border-slate-200/80 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition-all duration-300 hover:shadow-[0_16px_36px_rgba(15,23,42,0.12)]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <Calculator size={14} className="text-blue-600" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Current SGPA</span>
              </div>
              <div className="text-[2.25rem] font-extrabold text-[#0F172A] leading-none mb-1.5 tracking-tight">
                <AnimatedSGPA />
              </div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                <TrendingUp size={12} className="text-emerald-500" />
                <span>+0.32 from last sem</span>
              </div>
            </div>
          </FloatingWidget>

          {/* ─ Semester Chart Widget ─ */}
          <FloatingWidget className="absolute top-0 right-0 z-20" delay={0.2} y={[0, -5, 0]} duration={6}>
            <div className="w-[205px] rounded-2xl bg-white border border-slate-200/80 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition-all duration-300 hover:shadow-[0_16px_36px_rgba(15,23,42,0.12)]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                  <BarChart3 size={14} className="text-indigo-600" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Semester Trend</span>
              </div>
              <MiniBarChart />
              <div className="flex justify-between mt-2">
                {['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7'].map(s => (
                  <span key={s} className="text-[8px] font-bold text-slate-400">{s}</span>
                ))}
              </div>
            </div>
          </FloatingWidget>

          {/* ─ CGPA Progress Widget ─ */}
          <FloatingWidget className="absolute top-[185px] left-[-5px] z-20" delay={0.4} y={[0, -8, 0]} duration={7}>
            <div className="w-[185px] rounded-2xl bg-white border border-slate-200/80 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition-all duration-300 hover:shadow-[0_16px_36px_rgba(15,23,42,0.12)]">
              <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">CGPA Progress</span>
              <div className="mt-2.5 h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full bg-[#2563EB]"
                  initial={{ width: '0%' }}
                  animate={{ width: '87%' }}
                  transition={{ duration: 2, delay: 1.8, ease: [0.22, 1, 0.36, 1] as const }} />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[9px] font-medium text-slate-400">0.0</span>
                <span className="text-[11px] font-bold text-[#0F172A]">8.72</span>
                <span className="text-[9px] font-medium text-slate-400">10.0</span>
              </div>
            </div>
          </FloatingWidget>

          {/* ─ Materials Card ─ */}
          <FloatingWidget className="absolute top-[170px] right-[-10px] z-20" delay={0.3} y={[0, -6, 0]} duration={5.5}>
            <div className="w-[195px] rounded-2xl bg-white border border-slate-200/80 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition-all duration-300 hover:shadow-[0_16px_36px_rgba(15,23,42,0.12)]">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center">
                  <FileText size={14} className="text-purple-600" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">PYQ Library</span>
              </div>
              <div className="space-y-1.5">
                {['Data Structures', 'DBMS', 'OS'].map((subj, i) => (
                  <div key={subj} className="flex items-center gap-2 px-2 py-1 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ['#2563EB', '#8B5CF6', '#10B981'][i] }} />
                    <span className="text-[10px] font-semibold text-slate-700">{subj}</span>
                  </div>
                ))}
              </div>
            </div>
          </FloatingWidget>

          {/* ─ Backlog Tracker Widget ─ */}
          <FloatingWidget className="absolute bottom-[90px] left-[15px] z-20" delay={0.5} y={[0, -6, 0]} duration={6.5}>
            <div className="w-[180px] rounded-2xl bg-white border border-slate-200/80 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition-all duration-300 hover:shadow-[0_16px_36px_rgba(15,23,42,0.12)]">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <span className="text-[10px] font-black text-emerald-600">✓</span>
                </div>
                <span className="text-[11px] font-bold text-[#0F172A] tracking-wide uppercase">No Backlogs</span>
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold pl-8">All 48 subjects cleared</div>
            </div>
          </FloatingWidget>

          {/* ─ Analytics Widget (Best Semester) ─ */}
          <FloatingWidget className="absolute bottom-[50px] right-[5px] z-20" delay={0.6} y={[0, -8, 0]} duration={7.5}>
            <div className="w-[200px] rounded-2xl bg-[#0F172A] border border-slate-800 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.25)] transition-all duration-300 hover:shadow-[0_20px_48px_rgba(15,23,42,0.35)]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
                  <TrendingUp size={14} className="text-blue-400" />
                </div>
                <span className="text-[10px] font-bold text-slate-300 tracking-wider uppercase">Best Semester</span>
              </div>
              <div className="text-[2.25rem] font-black text-white leading-none tracking-tight my-1.5">9.31</div>
              <div className="text-[11px] text-slate-300 font-medium">Semester 6 • Spring 2024</div>
            </div>
          </FloatingWidget>

          {/* Connecting lines / decoration */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-[0.12]" viewBox="0 0 500 520">
            <motion.circle cx="250" cy="260" r="170" fill="none" stroke="url(#heroGrad)" strokeWidth="0.5" strokeDasharray="8 8"
              animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '250px 260px' }} />
            <motion.circle cx="250" cy="260" r="110" fill="none" stroke="url(#heroGrad)" strokeWidth="0.5" strokeDasharray="4 12"
              animate={{ rotate: -360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '250px 260px' }} />
            <defs>
              <linearGradient id="heroGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="text-[10px] font-semibold text-slate-400 tracking-widest uppercase">Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border-2 border-slate-300/60 flex items-start justify-center pt-1.5">
          <div className="w-1 h-1.5 rounded-full bg-slate-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}
