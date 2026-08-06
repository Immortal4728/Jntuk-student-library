import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { TrendingUp, BarChart3, BookOpen, Calculator, Zap } from 'lucide-react';

/* Animated bar for charts */
function AnimBar({ height, delay, color }: { height: number; delay: number; color: string }) {
  return (
    <motion.div className="flex-1 rounded-t-md" style={{ backgroundColor: color }}
      initial={{ height: 0 }} whileInView={{ height: `${height}%` }}
      viewport={{ once: true }} transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] as const }} />
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
    <section ref={ref} aria-label="Dashboard preview" className="relative w-full bg-slate-50/50 border-t border-slate-200/60 overflow-hidden">
      <div className="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 py-14 lg:py-20">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[11px] font-bold tracking-[0.12em] uppercase mb-4">
            <Zap size={12} className="text-blue-500" />
            Dashboard Preview
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-3">
            Your academic life,{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">visualized</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto font-medium">
            Real-time insights into your performance, trends, and academic progress.
          </p>
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
          className="relative rounded-2xl border border-slate-200/90 bg-white overflow-hidden"
          style={{ boxShadow: '0 20px 60px -15px rgba(15,23,42,0.08)' }}>
          
          {/* Top bar */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100 bg-slate-50/70">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400/70" />
              <div className="w-3 h-3 rounded-full bg-amber-400/70" />
              <div className="w-3 h-3 rounded-full bg-emerald-400/70" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="px-4 py-1 rounded-md bg-white border border-slate-200/60 text-[11px] text-slate-500 font-semibold shadow-2xs">
                jntuk-library.vercel.app/dashboard
              </div>
            </div>
          </div>

          {/* Dashboard content */}
          <div className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* CGPA Card */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="lg:col-span-1 rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.03)]"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <Calculator size={16} className="text-blue-600" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Current CGPA</span>
              </div>
              <div className="text-[2.75rem] font-extrabold text-[#0F172A] tracking-tight leading-none mb-1.5 tabular-nums">
                {sgpa}
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600">
                <TrendingUp size={14} />
                <span className="text-[12px] font-bold">+0.32 from last sem</span>
              </div>
              <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full bg-[#2563EB]"
                  initial={{ width: 0 }} whileInView={{ width: '87%' }}
                  viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.4 }} />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px] text-slate-400 font-medium">0.0</span>
                <span className="text-[10px] text-slate-400 font-medium">10.0</span>
              </div>
            </motion.div>

            {/* Semester Performance Chart */}
            <motion.div
              whileHover={{ scale: 1.005 }}
              transition={{ duration: 0.2 }}
              className="lg:col-span-2 rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.03)]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                    <BarChart3 size={16} className="text-indigo-600" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Semester Performance</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-600 px-2.5 py-1 rounded-md bg-slate-100/80">All Semesters</span>
              </div>
              <div className="flex items-end gap-3 h-[150px]">
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
              { label: 'Backlogs', value: '0', icon: BookOpen, iconColor: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100', trend: 'Cleared' },
              { label: 'Credits Earned', value: '142', icon: BarChart3, iconColor: 'text-blue-600', bg: 'bg-blue-50 border-blue-100', trend: '/180' },
              { label: 'Best SGPA', value: '9.31', icon: TrendingUp, iconColor: 'text-purple-600', bg: 'bg-purple-50 border-purple-100', trend: 'Sem 6' },
            ].map((s) => (
              <motion.div key={s.label}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl border border-slate-200/80 bg-white p-4 flex items-center gap-3.5 cursor-default shadow-[0_2px_8px_rgba(15,23,42,0.02)]"
              >
                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center flex-shrink-0 ${s.bg}`}>
                  <s.icon size={18} className={s.iconColor} />
                </div>
                <div>
                  <div className="text-xl font-extrabold text-[#0F172A]">{s.value}
                    <span className="text-[12px] font-semibold text-slate-400 ml-1.5">{s.trend}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-semibold">{s.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
