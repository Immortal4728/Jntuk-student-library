import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, BookOpen, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BottomCTA() {
  return (
    <section aria-label="Get started with JNTUK Library" className="relative w-full bg-slate-50 border-t border-slate-200/60 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 py-12 lg:py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl p-8 sm:p-12 lg:p-14 text-center bg-[#0F172A] border border-slate-800 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.3)]">
          
          {/* Animated BG effects */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px',
          }} />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.18, 0.1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-0 right-0 w-[350px] h-[350px] bg-blue-600 rounded-full blur-[100px] pointer-events-none" />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.15, 0.08] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-600 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-blue-300">Free for all JNTUK students</span>
            </motion.div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-3 leading-tight text-white">
              Ready to transform your academic journey?
            </h2>
            <p className="text-base sm:text-lg max-w-lg mx-auto mb-8 font-medium leading-relaxed text-slate-300">
              Join thousands of JNTUK students who track their GPA, manage backlogs, and ace their exams using our platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/dashboard"
                className="group relative inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-[14px] bg-white hover:bg-slate-100 text-[#0F172A] shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]">
                <Sparkles size={15} className="text-blue-600" />
                <span>Get Started — It's Free</span>
                <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link to="/materials"
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-white font-semibold text-[14px] border border-slate-700 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]">
                <BookOpen size={15} className="text-slate-300" />
                Explore Materials
              </Link>
              <Link to="/dashboard/tracker"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800/90 text-slate-200 font-semibold text-[14px] border border-slate-700/60 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]">
                <Calculator size={15} className="text-indigo-400" />
                Try CGPA Calculator
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
