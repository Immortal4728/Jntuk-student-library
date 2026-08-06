import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Calculator, BookOpen, FileText, BarChart3, AlertTriangle,
  LayoutDashboard, TrendingUp, GraduationCap, ChevronRight, Zap
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

const features = [
  {
    icon: Calculator, title: 'SGPA Calculator', link: '/dashboard/tracker',
    description: 'Calculate your Semester GPA instantly with our smart calculator.',
    gradient: 'from-indigo-500 to-blue-500', color: '#6366f1',
  },
  {
    icon: TrendingUp, title: 'CGPA Tracker', link: '/dashboard/tracker',
    description: 'Track cumulative GPA across all semesters with trend analysis.',
    gradient: 'from-violet-500 to-purple-500', color: '#8b5cf6',
  },
  {
    icon: FileText, title: 'PYQ Library', link: '/materials',
    description: 'Previous year questions organized by subject & year. 2019–2024.',
    gradient: 'from-amber-500 to-orange-500', color: '#f59e0b',
  },
  {
    icon: BookOpen, title: 'Materials Hub', link: '/materials',
    description: 'Unit-wise notes, lab manuals, and reference materials for every subject.',
    gradient: 'from-sky-500 to-cyan-500', color: '#0ea5e9',
  },
  {
    icon: AlertTriangle, title: 'Backlog Tracker', link: '/dashboard/tracker',
    description: 'Monitor and manage backlog subjects with smart reminders.',
    gradient: 'from-rose-500 to-pink-500', color: '#f43f5e',
  },
  {
    icon: LayoutDashboard, title: 'Academic Dashboard', link: '/dashboard',
    description: 'Your personalized command center for all academic data.',
    gradient: 'from-emerald-500 to-teal-500', color: '#10b981',
  },
  {
    icon: BarChart3, title: 'Semester Analytics', link: '/dashboard/tracker',
    description: 'Visualize performance trends with beautiful charts & graphs.',
    gradient: 'from-blue-500 to-indigo-600', color: '#3b82f6',
  },
  {
    icon: GraduationCap, title: 'Progress Tracking', link: '/dashboard',
    description: 'Track your academic journey from first semester to graduation.',
    gradient: 'from-fuchsia-500 to-violet-500', color: '#d946ef',
  },
];

export default function FeaturesGrid() {
  return (
    <section id="features" aria-label="Platform features" className="relative w-full bg-slate-50/50 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-slate-100/40 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 py-14 lg:py-20">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }}
          className="text-center mb-10 lg:mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[11px] font-bold tracking-[0.12em] uppercase mb-4"
          >
            <Zap size={12} className="text-blue-500" />
            Platform Features
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-3">
            Everything you need,{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              one ecosystem
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            From study materials to GPA tracking — a complete academic toolkit designed for JNTUK students.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div variants={stagger} initial="hidden" whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {features.map((f) => (
            <motion.div key={f.title} variants={fadeUp}
              whileHover={{ y: -4, transition: { duration: 0.25, ease: 'easeOut' } }}
              className="group relative rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 transition-all duration-300 hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)] hover:border-slate-300 overflow-hidden h-full flex flex-col justify-between">
              
              {/* Top accent line */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, transparent, ${f.color}, transparent)` }}
              />

              <div className="relative z-10 flex-1 flex flex-col justify-between">
                <div>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all duration-200 group-hover:scale-105"
                    style={{ backgroundColor: `${f.color}12`, border: `1px solid ${f.color}20` }}>
                    <f.icon size={20} style={{ color: f.color }} strokeWidth={2} />
                  </div>
                  <h3 className="text-[15px] font-bold text-[#0F172A] mb-1.5 tracking-tight break-words">{f.title}</h3>
                  <p className="text-[13px] text-slate-600 leading-relaxed mb-4 font-medium break-words">{f.description}</p>
                </div>
                <Link to={f.link}
                  className="inline-flex items-center gap-1 text-[12px] font-bold transition-all duration-200 group-hover:gap-1.5 mt-auto"
                  style={{ color: f.color }}>
                  Explore <ChevronRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
