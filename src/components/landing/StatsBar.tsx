import { motion, animate } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Users, Download, FileText, Calculator } from 'lucide-react';

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        const c = animate(0, target, {
          duration: 2, ease: [0.22, 1, 0.36, 1] as const,
          onUpdate: (v) => setCount(Math.round(v)),
        });
        return () => c.stop();
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const stats = [
  { value: 2500, suffix: '+', label: 'Active Students', icon: Users, color: '#6366f1' },
  { value: 10000, suffix: '+', label: 'Downloads', icon: Download, color: '#8b5cf6' },
  { value: 500, suffix: '+', label: 'Study Materials', icon: FileText, color: '#0ea5e9' },
  { value: 20000, suffix: '+', label: 'GPA Calculations', icon: Calculator, color: '#7c3aed' },
];

export default function StatsBar() {
  return (
    <section className="relative w-full bg-slate-900 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />
      {/* Gradient accents */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[200px] bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[200px] bg-violet-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-16 py-14 lg:py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center"
                style={{ backgroundColor: `${s.color}30` }}>
                <s.icon size={20} style={{ color: s.color, filter: 'brightness(1.3)' }} />
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-1" style={{ color: '#ffffff', textShadow: '0 0 20px rgba(255,255,255,0.1)' }}>
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </div>
              <span className="text-xs sm:text-sm font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
