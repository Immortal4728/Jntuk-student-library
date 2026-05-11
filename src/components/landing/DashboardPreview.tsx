import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { TrendingUp, BarChart3, BookOpen, Calculator, Zap } from 'lucide-react';

/* Animated bar for charts */
function AnimBar({ height, delay, color }: { height: number; delay: number; color: string }) {
  return (
    <motion.div className="flex-1 rounded-t-md" style={{ backgroundColor: color }}
      initial={{ height: 0 }} whileInView={{ height: `${height}%` }}
      viewport={{ once: true }} transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }} />
  );
}

export default function DashboardPreview() {
  const [sgpa, setSgpa] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        const end = 8.72;
        const dur = 2000;
        const t0 = performance.now();
        const step = (now: number) => {
          const p = Math.min((now - t0) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setSgpa(parseFloat((ease * end).toFixed(2)));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const semesters = [
    { sem: 'S1', sgpa: 8.2, color: '#6366f1' },
    { sem: 'S2', sgpa: 7.8, color: '#8b5cf6' },
    { sem: 'S3', sgpa: 8.5, color: '#6366f1' },
    { sem: 'S4', sgpa: 9.1, color: '#7c3aed' },
    { sem: 'S5', sgpa: 8.7, color: '#6366f1' },
    { sem: 'S6', sgpa: 9.3, color: '#8b5cf6' },
  ];

  return (
    <section ref={ref} className="relative w-full bg-[#fafafa] border-t border-slate-100 overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] rounded-full bg-gradient-to-b from-indigo-100/20 to-transparent blur-3xl pointer-events-none" />
      <motion.div
        className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tl from-violet-100/20 to-transparent blur-[100px] pointer-events-none"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-16 py-20 lg:py-28">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 border border-violet-100/80 text-violet-600 text-[11px] font-bold tracking-[0.15em] uppercase mb-5">
            <Zap size={12} className="text-violet-500" />
            Dashboard Preview
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Your academic life,{' '}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">visualized</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto font-medium">
            Real-time insights into your performance, trends, and academic progress.
          </p>
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-2xl border border-slate-200/80 bg-white overflow-hidden"
          style={{ boxShadow: '0 24px 80px -16px rgba(0,0,0,0.1), 0 0 0 1px rgba(99,102,241,0.03)' }}>
          
          {/* Top bar */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100 bg-slate-50/50">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400/60" />
              <div className="w-3 h-3 rounded-full bg-amber-400/60" />
              <div className="w-3 h-3 rounded-full bg-emerald-400/60" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="px-4 py-1 rounded-md bg-slate-100 text-[11px] text-slate-400 font-medium">
                jntuk-library.vercel.app/dashboard
              </div>
            </div>
          </div>

          {/* Dashboard content */}
          <div className="p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* CGPA Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-1 rounded-xl border border-slate-200/80 bg-gradient-to-br from-indigo-50/50 to-violet-50/30 p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Calculator size={16} className="text-indigo-600" />
                </div>
                <span className="text-sm font-semibold text-slate-700">Current CGPA</span>
              </div>
              <div className="text-[3rem] font-extrabold text-slate-900 tracking-tight leading-none mb-1 tabular-nums">
                {sgpa}
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600">
                <TrendingUp size={14} />
                <span className="text-[12px] font-semibold">+0.32 from last sem</span>
              </div>
              <div className="mt-4 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full relative overflow-hidden"
                  style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }}
                  initial={{ width: 0 }} whileInView={{ width: '87%' }}
                  viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.5 }}>
                  {/* Shimmer */}
                  <motion.div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }}
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 2 }}
                  />
                </motion.div>
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px] text-slate-500 font-medium">0.0</span>
                <span className="text-[10px] text-slate-500 font-medium">10.0</span>
              </div>
            </motion.div>

            {/* Semester Performance Chart */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-2 rounded-xl border border-slate-200/80 bg-white p-5"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                    <BarChart3 size={16} className="text-violet-600" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Semester Performance</span>
                </div>
                <span className="text-[11px] font-medium text-slate-500 px-2.5 py-1 rounded-md bg-slate-50">All Semesters</span>
              </div>
              <div className="flex items-end gap-3 h-[160px]">
                {semesters.map((s, i) => (
                  <div key={s.sem} className="flex-1 flex flex-col items-center gap-2 h-full">
                    <div className="flex-1 w-full flex items-end">
                      <AnimBar height={(s.sgpa / 10) * 100} delay={0.3 + i * 0.1} color={s.color} />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500">{s.sem}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Stats Row */}
            {[
              { label: 'Backlogs', value: '0', icon: BookOpen, color: '#10b981', bg: '#d1fae5', trend: 'Cleared' },
              { label: 'Credits Earned', value: '142', icon: BarChart3, color: '#3b82f6', bg: '#dbeafe', trend: '/180' },
              { label: 'Best SGPA', value: '9.3', icon: TrendingUp, color: '#8b5cf6', bg: '#ede9fe', trend: 'Sem 6' },
            ].map((s) => (
              <motion.div key={s.label}
                whileHover={{ scale: 1.03, y: -2 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl border border-slate-200/80 bg-white p-4 flex items-center gap-4 cursor-default"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: s.bg }}>
                  <s.icon size={18} style={{ color: s.color }} />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900">{s.value}
                    <span className="text-[12px] font-medium text-slate-400 ml-1">{s.trend}</span>
                  </div>
                  <span className="text-[12px] text-slate-500 font-medium">{s.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
