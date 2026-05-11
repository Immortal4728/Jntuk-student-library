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
    <section id="features" className="relative w-full bg-white overflow-hidden">
      {/* Top gradient blend */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#fafafa] to-transparent pointer-events-none" />
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-gradient-to-br from-indigo-50/40 via-violet-50/20 to-transparent blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-16 py-20 lg:py-28">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.7 }}
          className="text-center mb-14 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100/80 text-indigo-600 text-[11px] font-bold tracking-[0.15em] uppercase mb-6"
          >
            <Zap size={12} className="text-indigo-500" />
            Platform Features
          </motion.div>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-slate-900 tracking-tight mb-4">
            Everything you need,{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-500 bg-clip-text text-transparent">
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
              whileHover={{ y: -8, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const } }}
              className="group relative rounded-2xl border border-slate-200/80 bg-white p-6 transition-all duration-400 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] hover:border-slate-300/60 overflow-hidden">
              
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(400px circle at 50% 0%, ${f.color}0d, transparent 70%)` }} />
              
              {/* Top accent line */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, transparent, ${f.color}, transparent)` }}
              />

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                  style={{ backgroundColor: `${f.color}10`, border: `1px solid ${f.color}18` }}>
                  <f.icon size={22} style={{ color: f.color }} strokeWidth={1.5} />
                </div>
                <h3 className="text-[15px] font-semibold text-slate-900 mb-1.5 tracking-tight">{f.title}</h3>
                <p className="text-[13px] text-slate-500 leading-relaxed mb-4 font-medium">{f.description}</p>
                <Link to={f.link}
                  className="inline-flex items-center gap-1 text-[12px] font-semibold transition-all duration-200 group-hover:gap-2"
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
