import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, BookOpen, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BottomCTA() {
  return (
    <section className="relative w-full bg-[#fafafa] border-t border-slate-100 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-16 py-16 lg:py-24">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl p-8 sm:p-12 lg:p-16 text-center"
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 35%, #312e81 60%, #1e1b4b 85%, #0f172a 100%)' }}>
          
          {/* Animated BG effects */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px',
          }} />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.08, 0.15, 0.08] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500 rounded-full blur-[120px]" />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.06, 0.12, 0.06] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-violet-500 rounded-full blur-[120px]" />
          <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-indigo-500/5"
            animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: 'linear' }} />
          <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border border-violet-500/5"
            animate={{ rotate: -360 }} transition={{ duration: 35, repeat: Infinity, ease: 'linear' }} />

          {/* Floating particles */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div key={i}
              className="absolute w-1 h-1 rounded-full bg-white/20"
              style={{ left: `${15 + i * 10}%`, top: `${20 + (i % 3) * 25}%` }}
              animate={{ y: [0, -15, 0], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
            />
          ))}

          <div className="relative z-10">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-semibold tracking-wider uppercase" style={{ color: 'rgba(255,255,255,0.9)' }}>Free for all JNTUK students</span>
            </motion.div>

            <h2 className="text-2xl sm:text-3xl lg:text-[2.5rem] font-bold tracking-tight mb-4 leading-tight" style={{ color: '#ffffff' }}>
              Ready to transform your{' '}
              <span className="bg-gradient-to-r from-indigo-200 via-violet-200 to-fuchsia-200 bg-clip-text text-transparent">
                academic journey
              </span>
              <span style={{ color: '#ffffff' }}>?</span>
            </h2>
            <p className="text-base sm:text-lg max-w-lg mx-auto mb-10 font-medium leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Join thousands of JNTUK students who track their GPA, manage backlogs, and ace their exams using our platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/dashboard"
                className="group relative inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-xl font-bold text-[15px] overflow-hidden transition-all duration-300 hover:-translate-y-1 active:scale-[0.97]"
                style={{ backgroundColor: '#ffffff', color: '#0f172a', boxShadow: '0 4px 24px rgba(255,255,255,0.15), 0 0 60px rgba(255,255,255,0.05)' }}>
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-100/0 via-indigo-100/50 to-indigo-100/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <Sparkles size={16} className="relative z-10 text-indigo-600" />
                <span className="relative z-10">Get Started — It's Free</span>
                <ArrowRight size={16} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
              <Link to="/materials"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/10 font-semibold text-[15px] border border-white/15 backdrop-blur-sm hover:bg-white/15 hover:border-white/25 transition-all duration-300 hover:-translate-y-1 active:scale-[0.97]"
                style={{ color: '#ffffff' }}>
                <BookOpen size={15} style={{ color: 'rgba(255,255,255,0.9)' }} />
                Explore Materials
              </Link>
              <Link to="/dashboard/tracker"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-[15px] border border-violet-400/20 hover:border-violet-400/40 transition-all duration-300 hover:-translate-y-1 active:scale-[0.97]"
                style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(99,102,241,0.2))', backdropFilter: 'blur(8px)', color: '#ffffff' }}>
                <Calculator size={15} style={{ color: '#c4b5fd' }} />
                Try CGPA Calculator
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
