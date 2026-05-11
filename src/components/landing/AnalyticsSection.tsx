import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Target, Zap } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

function MiniLineChart() {
  const points = [20, 35, 28, 45, 42, 58, 55, 70, 65, 82, 78, 90];
  const w = 200, h = 60;
  const path = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - (p / 100) * h;
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16">
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path d={`${path} L${w},${h} L0,${h} Z`} fill="url(#fillGrad)"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true }} transition={{ duration: 1, delay: 0.5 }} />
      <motion.path d={path} fill="none" stroke="url(#lineGrad)" strokeWidth="2" strokeLinecap="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true }} transition={{ duration: 2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} />
    </svg>
  );
}

function CircularProgress({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 36, c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={r} fill="none" stroke="#e2e8f0" strokeWidth="6" />
        <motion.circle cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c - (value / 100) * c }}
          viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          transform="rotate(-90 44 44)" />
        <text x="44" y="44" textAnchor="middle" dominantBaseline="central"
          className="text-sm font-bold fill-slate-900">{value}%</text>
      </svg>
      <span className="text-[11px] font-semibold text-slate-500">{label}</span>
    </div>
  );
}

export default function AnalyticsSection() {
  return (
    <section className="relative w-full bg-white border-t border-slate-100 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-16 py-20 lg:py-28">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-14">
          <span className="text-[11px] font-bold tracking-[0.2em] text-indigo-600 uppercase mb-4 block">
            Academic Analytics
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Data-driven{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
              academic insights
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto font-medium">
            Understand your performance patterns and make smarter decisions.
          </p>
        </motion.div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CGPA Growth Chart */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.08)] transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <TrendingUp size={20} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">CGPA Growth Trend</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Semester-over-semester</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50">
                <TrendingUp size={12} className="text-emerald-600" />
                <span className="text-[11px] font-semibold text-emerald-700">+12.4%</span>
              </div>
            </div>
            <MiniLineChart />
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
              {['Sem 1: 7.2', 'Sem 3: 8.1', 'Sem 6: 9.3'].map((s) => (
                <span key={s} className="text-[11px] font-medium text-slate-500">{s}</span>
              ))}
            </div>
          </motion.div>

          {/* Circular Progress Cards */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.08)] transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                <Target size={20} className="text-violet-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Academic Progress</h3>
                <p className="text-[11px] text-slate-500 font-medium">Overall completion metrics</p>
              </div>
            </div>
            <div className="flex items-center justify-around">
              <CircularProgress value={87} label="CGPA Target" color="#6366f1" />
              <CircularProgress value={79} label="Credits Done" color="#8b5cf6" />
              <CircularProgress value={95} label="Attendance" color="#10b981" />
            </div>
          </motion.div>

          {/* Insight Cards Row */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Zap, title: 'Strongest Subject', value: 'Data Structures', sub: 'SGPA: 9.8', color: '#f59e0b', bg: '#fef3c7' },
              { icon: BarChart3, title: 'Average SGPA', value: '8.72', sub: 'Across 6 semesters', color: '#6366f1', bg: '#eef2ff' },
              { icon: Target, title: 'Predicted Final CGPA', value: '8.9 - 9.1', sub: 'Based on current trend', color: '#8b5cf6', bg: '#f5f3ff' },
            ].map((c) => (
              <div key={c.title} className="rounded-xl border border-slate-200/80 bg-white p-5 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.06)] transition-shadow duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: c.bg }}>
                    <c.icon size={16} style={{ color: c.color }} />
                  </div>
                  <span className="text-[12px] font-semibold text-slate-600">{c.title}</span>
                </div>
                <div className="text-xl font-bold text-slate-900 mb-0.5">{c.value}</div>
                <span className="text-[11px] font-medium text-slate-500">{c.sub}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
