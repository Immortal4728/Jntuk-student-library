import { motion, useScroll, useTransform, useSpring, useMotionValue, animate } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import SEO from '../components/SEO';
import {
  FileText,
  BookOpen,
  ArrowRight,
  Sparkles,
  Download,
  Users,
  GraduationCap,
  ChevronRight,
  Layers,
  Database,
  CheckCircle2,
  Clock,
  Star,
} from 'lucide-react';
import { Link } from 'react-router-dom';

/* ─── Animated Counter ─── */
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const controls = animate(0, target, {
            duration: 2,
            ease: [0.22, 1, 0.36, 1],
            onUpdate: (v) => setCount(Math.round(v)),
          });
          return () => controls.stop();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ─── Stagger container ─── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

/* ─── Feature data ─── */
const features = [
  {
    icon: BookOpen,
    title: 'Notes & Materials',
    description: 'Unit-wise notes, lab manuals, and reference materials for every subject.',
    color: '#0ea5e9',
    bgColor: 'rgba(14,165,233,0.08)',
    borderColor: 'rgba(14,165,233,0.15)',
  },
];

/* ─── Preview card data (floating UI illusion) ─── */
const previewSubjects = [
  { name: 'Data Structures', units: 5, type: 'PDF', size: '2.4 MB', progress: 80, label: 'Unit 1–5' },
  { name: 'Digital Logic Design', units: 6, type: 'PDF', size: '3.1 MB', progress: 65, label: 'Unit 1–6' },
  { name: 'Discrete Mathematics', units: 5, type: 'PDF', size: '1.8 MB', progress: 45, label: 'Unit 1–5' },
  { name: 'OOP with Java', units: 5, type: 'DOCX', size: '2.9 MB', progress: 92, label: 'Unit 1–5' },
];

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const smoothScroll = useSpring(scrollYProgress, { stiffness: 80, damping: 30 });
  const heroY = useTransform(smoothScroll, [0, 1], [0, -100]);
  const heroOpacity = useTransform(smoothScroll, [0, 0.5], [1, 0]);
  const cardY = useTransform(smoothScroll, [0, 1], [0, -60]);
  const cardRotate = useTransform(smoothScroll, [0, 1], [2, 8]);

  /* Mouse tilt for preview card (desktop only) */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const tiltX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const tiltY = useSpring(mouseY, { stiffness: 120, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (window.innerWidth < 1024) return;
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    mouseX.set(-(clientY - top - height / 2) / 30);
    mouseY.set((clientX - left - width / 2) / 30);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  /* Active row animation */
  const [activeRow, setActiveRow] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRow((prev) => (prev + 1) % previewSubjects.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden bg-[#fafafa]">
      <SEO
        title="JNTUK Materials | All Semesters Notes"
        description="Access JNTUK semester-wise materials and notes for CSE, ECE, IT, AIML students. R23 Regulation. Free download."
        canonicalUrl="/"
      />
      {/* ═══════════════════════════════════════════
          HERO SECTION — 100vh Full Viewport
      ═══════════════════════════════════════════ */}
      <section
        ref={heroRef}
        id="hero"
        className="relative w-full min-h-[100dvh] flex items-center overflow-hidden"
      >
        {/* ── Background layers ── */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Grid pattern */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(99,102,241,0.06) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(99,102,241,0.06) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />
          {/* Radial mask over grid */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 80% 60% at 50% 0%, transparent 0%, #f9fafb 100%)',
            }}
          />
          {/* Ambient glows */}
          <div className="absolute -top-32 left-1/4 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-indigo-200/30 via-blue-100/20 to-transparent blur-3xl" />
          <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-sky-200/25 via-cyan-100/15 to-transparent blur-3xl" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] rounded-full bg-gradient-to-t from-violet-100/20 to-transparent blur-3xl" />
        </div>

        {/* ── Main content ── */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 w-full max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16 pt-10 sm:pt-14 pb-10 lg:pt-0 lg:pb-0 flex flex-col lg:flex-row items-center gap-8 lg:gap-6"
        >
          {/* LEFT — Copy + CTAs */}
          <div className="w-full lg:w-[55%] flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="flex flex-col items-center lg:items-start"
            >
              {/* Badge */}
              <motion.div variants={fadeUp} className="mb-4 sm:mb-5">
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200/80 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600 tracking-[0.15em] uppercase">
                    R23 Regulation • Live
                  </span>
                </div>
              </motion.div>

              {/* Heading */}
              <motion.h1
                variants={fadeUp}
                className="text-[4.2rem] sm:text-[5rem] lg:text-[6rem] xl:text-[7rem] font-extrabold tracking-[-0.045em] leading-[0.85] mb-4 sm:mb-5"
              >
                <span className="text-slate-900">JNTUK</span>
                <br />
                <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 bg-clip-text text-transparent">
                  Library
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={fadeUp}
                className="text-[15px] sm:text-lg lg:text-xl text-slate-500 leading-relaxed max-w-lg font-medium mb-6 sm:mb-7"
              >
                Access semester-wise materials and notes instantly.
              </motion.p>

              {/* CTAs */}
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
                <Link
                  to="/materials"
                  id="cta-enter-library"
                  className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-slate-900 text-white font-semibold text-[15px] shadow-[0_2px_20px_rgba(15,23,42,0.25)] hover:shadow-[0_8px_30px_rgba(15,23,42,0.3)] transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  Enter Library
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
                <Link
                  to="/materials"
                  id="cta-explore-materials"
                  className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/90 text-slate-700 font-semibold text-[15px] border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] backdrop-blur-md hover:bg-white hover:border-slate-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  <Sparkles size={15} className="text-indigo-500" />
                  Explore Materials
                </Link>
              </motion.div>

              {/* Mini trust bar */}
              <motion.div
                variants={fadeUp}
                className="flex items-center gap-5 mt-7 sm:mt-8 text-slate-400"
              >
                <div className="flex items-center gap-1.5">
                  <Users size={13} />
                  <span className="text-[11px] font-semibold">2,500+ students</span>
                </div>
                <div className="w-px h-3.5 bg-slate-200" />
                <div className="flex items-center gap-1.5">
                  <Download size={13} />
                  <span className="text-[11px] font-semibold">10K+ downloads</span>
                </div>
                <div className="hidden sm:block w-px h-3.5 bg-slate-200" />
                <div className="hidden sm:flex items-center gap-1.5">
                  <GraduationCap size={13} />
                  <span className="text-[11px] font-semibold">R23 updated</span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* RIGHT — Floating Preview Card + Decorative Cards */}
          <div className="w-full lg:w-[45%] flex items-center justify-center lg:justify-end relative">
            <div
              className="relative w-full max-w-[520px] h-[440px] sm:h-[500px] lg:h-[560px]"
              style={{ perspective: '2000px' }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Background decorative card — PYQ */}
              <motion.div
                initial={{ opacity: 0, y: 40, rotate: -6 }}
                animate={{ opacity: 1, y: 0, rotate: -6 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                className="absolute -left-4 sm:-left-10 top-[12%] w-[210px] sm:w-[260px] z-10 hidden sm:block"
              >
                <div className="bg-slate-900 rounded-2xl p-5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4),0_8px_20px_-10px_rgba(0,0,0,0.2)]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400 border border-slate-700/50">
                      <Layers size={16} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="text-white text-xs font-semibold">PYQ Archive</h4>
                      <span className="text-[10px] text-slate-400">2019–2024</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    {[65, 80, 45, 92].map((w, i) => (
                      <div key={i} className="flex-1 h-8 rounded bg-slate-800 border border-slate-700/30 relative overflow-hidden">
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-500/40 to-amber-500/10 rounded-b"
                          initial={{ height: 0 }}
                          animate={{ height: `${w}%` }}
                          transition={{ duration: 1.5, delay: 0.8 + i * 0.15, ease: 'easeOut' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Background decorative card — Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30, rotate: 4 }}
                animate={{ opacity: 1, y: 0, rotate: 4 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
                className="absolute -right-2 sm:-right-8 bottom-[8%] w-[190px] sm:w-[220px] z-10 hidden sm:block"
              >
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-[0_12px_48px_-10px_rgba(0,0,0,0.1),0_4px_12px_-4px_rgba(0,0,0,0.04)] border border-slate-200/60">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <CheckCircle2 size={14} strokeWidth={2} />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700">Materials Ready</span>
                  </div>
                  <div className="space-y-2">
                    {['CSE', 'ECE', 'EEE'].map((branch, i) => (
                      <div key={branch} className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 font-medium w-8">{branch}</span>
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${75 + i * 10}%` }}
                            transition={{ duration: 1.5, delay: 1 + i * 0.2, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* MAIN Preview Card — Subjects list */}
              <motion.div
                style={{
                  y: cardY,
                  rotateX: tiltX,
                  rotateY: tiltY,
                  rotate: cardRotate,
                }}
                initial={{ opacity: 0, y: 60, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="absolute z-20 inset-0 m-auto w-[94%] sm:w-[400px] lg:w-[430px] h-fit bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-[0_24px_80px_-16px_rgba(0,0,0,0.15),0_8px_24px_-8px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.02)] overflow-hidden"
              >
                {/* Card header */}
                <div className="px-5 pt-5 pb-4 border-b border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-[0_4px_12px_rgba(99,102,241,0.3)]">
                        <Database size={18} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 text-sm tracking-tight">
                          CSE • 2-1 Sem
                        </h3>
                        <span className="text-[11px] text-slate-400 font-medium">
                          R23 Regulation
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-semibold text-emerald-700">Updated</span>
                    </div>
                  </div>
                </div>

                {/* Subject rows */}
                <div className="px-3 py-2">
                  {previewSubjects.map((subject, i) => (
                    <motion.div
                      key={subject.name}
                      animate={{
                        backgroundColor: activeRow === i ? 'rgba(99,102,241,0.04)' : 'transparent',
                      }}
                      transition={{ duration: 0.4 }}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl group cursor-default"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          activeRow === i
                            ? 'bg-indigo-100 text-indigo-600'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        <FileText size={14} strokeWidth={activeRow === i ? 2 : 1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`text-[13px] font-medium transition-colors truncate ${
                              activeRow === i ? 'text-slate-900' : 'text-slate-600'
                            }`}
                          >
                            {subject.name}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono tracking-tight ml-2 flex-shrink-0 bg-slate-50 px-1.5 py-0.5 rounded">
                            {subject.size}
                          </span>
                        </div>
                        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-indigo-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${subject.progress}%` }}
                            transition={{
                              duration: 1.5,
                              delay: 0.6 + i * 0.15,
                              ease: 'easeOut',
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Card footer */}
                <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Clock size={12} />
                      <span className="text-[10px] font-medium">Last updated 2h ago</span>
                    </div>
                    <div className="flex items-center gap-1 text-indigo-500">
                      <span className="text-[11px] font-semibold">View All</span>
                      <ChevronRight size={12} />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        >
          <span className="text-[10px] font-semibold text-slate-400 tracking-widest uppercase">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-5 h-8 rounded-full border-2 border-slate-300 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-1.5 rounded-full bg-slate-400" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURES SECTION
      ═══════════════════════════════════════════ */}
      <section id="features" className="relative w-full bg-white border-t border-slate-100">
        {/* Top gradient connector */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#fafafa] to-white pointer-events-none" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16 py-16 lg:py-24">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-12 lg:mb-16"
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[11px] font-bold tracking-[0.15em] uppercase mb-5">
              <Star size={12} className="fill-indigo-500 text-indigo-500" />
              Core Features
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-slate-900 tracking-tight mb-4">
              Everything you need,{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                one platform
              </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto font-medium">
              Stop searching across dozens of groups. Get your materials in seconds.
            </p>
          </motion.div>

          {/* Feature cards */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                className="group relative rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7 transition-shadow duration-300 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.1)] hover:border-slate-300/80"
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: feature.bgColor,
                    border: `1px solid ${feature.borderColor}`,
                  }}
                >
                  <feature.icon size={22} style={{ color: feature.color }} strokeWidth={1.5} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-slate-900 mb-2 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-[14px] text-slate-500 leading-relaxed mb-5 font-medium">
                  {feature.description}
                </p>

                {/* Link */}
                <Link
                  to="/materials"
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold transition-colors duration-200"
                  style={{ color: feature.color }}
                >
                  Browse now
                  <ChevronRight
                    size={14}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>

                {/* Hover gradient glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${feature.bgColor}, transparent 40%)`,
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STATS BAR
      ═══════════════════════════════════════════ */}
      <section className="relative w-full bg-slate-900 overflow-hidden">
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16 py-12 lg:py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12"
          >
            {[
              { value: 2500, suffix: '+', label: 'Active Students', icon: Users },
              { value: 10000, suffix: '+', label: 'Downloads', icon: Download },
              { value: 850, suffix: '+', label: 'Materials', icon: FileText },
              { value: 6, suffix: '', label: 'Branches', icon: GraduationCap },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon size={20} className="text-indigo-400 mx-auto mb-3" />
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-1">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <span className="text-xs sm:text-sm text-slate-400 font-medium">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SYSTEM ACCESS — Quick Flow
      ═══════════════════════════════════════════ */}
      <section className="relative w-full bg-white border-t border-slate-100">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16 py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-14"
          >
            <span className="text-[11px] font-bold tracking-[0.2em] text-indigo-600 uppercase mb-4 block">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Three steps. Zero friction.
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 relative"
          >
            {/* Connector lines (desktop) */}
            <div className="hidden md:block absolute top-[52px] left-[33.33%] right-[33.33%] h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 z-0" />

            {[
              {
                step: '01',
                title: 'Choose Branch',
                desc: 'Select your engineering branch — CSE, ECE, EEE, MECH, and more.',
                color: '#6366f1',
              },
              {
                step: '02',
                title: 'Pick Semester',
                desc: 'Navigate to your current or target semester for focused results.',
                color: '#0ea5e9',
              },
              {
                step: '03',
                title: 'Download',
                desc: 'Access notes and materials — download instantly.',
                color: '#10b981',
              },
            ].map((item) => (
              <motion.div key={item.step} variants={fadeUp}>
                <Link
                  to="/materials"
                  className="group relative block bg-[#fafafa] hover:bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-6 sm:p-7 transition-all duration-300 hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)]"
                >
                  {/* Step number */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm mb-5 shadow-md transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1.5">{item.title}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>

                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                    <ArrowRight size={16} style={{ color: item.color }} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          BOTTOM CTA
      ═══════════════════════════════════════════ */}
      <section className="relative w-full bg-[#fafafa] border-t border-slate-100">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16 py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 sm:p-12 lg:p-16 text-center"
          >
            {/* BG pattern */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-4">
                Ready to ace your exams?
              </h2>
              <p className="text-base sm:text-lg text-slate-400 max-w-md mx-auto mb-8 font-medium">
                Join thousands of JNTUK students who trust this platform the night before their exams.
              </p>
              <Link
                to="/materials"
                className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-white text-slate-900 font-semibold text-[15px] shadow-[0_4px_20px_rgba(255,255,255,0.15)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.25)] transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Get Started — It's Free
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
