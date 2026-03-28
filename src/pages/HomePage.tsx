import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { Database, FileText, Layers, Terminal, ChevronRight, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Calculate active card index based on scroll position to simulate usage
  const cardIndex = useTransform(scrollYProgress, [0, 0.1, 0.2, 0.3], [0, 1, 2, 2]);

  // Smooth out the parallax for performance
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Main Card
  const y1 = useTransform(smoothProgress, [0, 1], [0, -120]);
  const rotate1 = useTransform(smoothProgress, [0, 1], [2, 6]);
  // Background Card 1
  const y2 = useTransform(smoothProgress, [0, 1], [0, -220]);
  const rotate2 = useTransform(smoothProgress, [0, 1], [-2, -6]);
  // Background Card 2
  const y3 = useTransform(smoothProgress, [0, 1], [0, -80]);
  const rotate3 = useTransform(smoothProgress, [0, 1], [1, -1]);

  // Mouse interaction for top-most card
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const transformX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const transformY = useSpring(mouseY, { stiffness: 150, damping: 20 });
  
  const handleMouseMove = (e: React.MouseEvent) => {
    // Only apply on desktop to maintain performance
    if (window.innerWidth < 1024) return;
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left - width / 2) / 25; // max 2deg tilt
    const y = -(clientY - top - height / 2) / 25;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="bg-[#fafafa] relative overflow-hidden flex flex-col pt-16">
      
      {/* 
        ========================================
        HERO SECTION (Floating System)
        ========================================
      */}
      <section 
        ref={containerRef}
        className="w-full relative min-h-[95vh] flex items-center"
        style={{
          background: 'radial-gradient(circle at 50% 0%, #ffffff 0%, #fafafa 100%)'
        }}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-[20%] w-[800px] h-[600px] bg-gradient-to-br from-blue-100/40 to-transparent rounded-full blur-3xl opacity-50 mix-blend-multiply border-none" />
          <div className="absolute top-[20%] right[-10%] w-[600px] h-[600px] bg-gradient-to-bl from-indigo-100/40 to-transparent rounded-full blur-3xl opacity-50 mix-blend-multiply border-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_10%,#000_70%,transparent_100%)]" />
        </div>

        <div className="max-w-[1600px] w-full mx-auto px-6 sm:px-12 lg:px-24 flex flex-col lg:flex-row items-center justify-between relative z-10 pt-10 pb-20">
          
          {/* LEFT ZONE */}
          <div className="w-full lg:w-5/12 flex flex-col justify-center relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/5 border border-slate-900/10 mb-8 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700 shadow-[0_0_8px_rgba(51,65,85,0.5)]" />
                <span className="text-[11px] font-bold text-slate-700 tracking-[0.2em] uppercase">
                  JNTUK R23 SYSTEM
                </span>
              </div>

              <h1 className="text-[3.5rem] sm:text-[5rem] lg:text-[6.5rem] font-bold text-slate-900 tracking-[-0.04em] leading-[0.9] mb-8">
                JNTUK<br />
                <span className="text-slate-400">Library</span>
              </h1>

              <p className="text-[1.125rem] sm:text-[1.25rem] text-slate-600 leading-[1.6] max-w-md font-medium">
                Direct access to semester-wise materials, PYQs, and important questions.
              </p>
            </motion.div>
          </div>

          {/* RIGHT ZONE - SYSTEM ILLUSION */}
          <div className="w-full lg:w-7/12 mt-20 lg:mt-0 relative h-[500px] lg:h-[700px] flex items-center justify-center lg:justify-end">
            <div 
              className="relative w-full max-w-[540px] h-full flex items-center justify-center perspective-[2000px]"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              
              {/* Background Card 2: Important Questions (Bottom Layer) */}
              <motion.div 
                style={{ 
                  y: y3, 
                  rotate: rotate3,
                  rotateX: transformY,
                  rotateY: transformX,
                  opacity: useTransform(cardIndex, [0, 1, 2], [0.6, 0.8, 1]),
                  scale: useTransform(cardIndex, [0, 1, 2], [0.95, 0.98, 1.02]),
                  filter: useTransform(cardIndex, [0, 1, 2], ['blur(2px)', 'blur(1px)', 'blur(0px)']),
                }}
                initial={{ opacity: 0, x: 50, y: 30, scale: 0.9 }}
                animate={{ opacity: 0.6, x: 0, y: 0, scale: 0.95 }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                className="absolute z-10 w-[70%] lg:w-[280px] bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] right-[10%] lg:right-[0%] bottom-[15%] lg:bottom-[20%] transition-colors origin-bottom-right hidden sm:block"
              >
                <div className="flex items-center gap-3 mb-4 opacity-80">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400 border border-slate-700/50">
                    <Layers size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-medium text-white text-sm">Vital Sets</h3>
                    <span className="text-[11px] text-slate-400">Important Questions</span>
                  </div>
                </div>
                <div className="flex gap-2 opacity-50">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-12 flex-1 rounded-md bg-slate-800 border border-slate-700/50 flex flex-col justify-end p-1.5 relative overflow-hidden">
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-700/50 to-transparent h-1/2" />
                      <div className="w-full h-1 bg-amber-400/20 rounded-full mb-0.5">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${40 + (i * 15)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Background Card 1: PYQs (Middle Layer) */}
              <motion.div 
                style={{ 
                  y: y2, 
                  rotate: rotate2,
                  rotateX: transformY,
                  rotateY: transformX,
                  opacity: useTransform(cardIndex, [0, 1, 2], [0.8, 1, 0.8]),
                  scale: useTransform(cardIndex, [0, 1, 2], [0.98, 1.02, 0.98]),
                  filter: useTransform(cardIndex, [0, 1, 2], ['blur(1px)', 'blur(0px)', 'blur(1px)']),
                }}
                initial={{ opacity: 0, x: -40, y: -20, scale: 0.95 }}
                animate={{ opacity: 0.8, x: 0, y: 0, scale: 0.98 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="absolute z-20 w-[75%] lg:w-[300px] bg-white/90 rounded-2xl p-5 sm:p-6 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.03)] backdrop-blur-xl left-[5%] lg:left-[5%] top-[25%] lg:top-[20%] origin-top-left hidden sm:block"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50/80 flex items-center justify-center text-indigo-600 border border-indigo-100/50">
                    <Terminal size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-[13px]">Previous Year Papers</h3>
                    <span className="text-[11px] text-slate-500">2019 - 2023 Archive</span>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-indigo-500 rounded-full" 
                    initial={{ width: '40%' }}
                    animate={{ width: '65%' }}
                    transition={{ duration: 2, delay: 1, ease: 'easeOut' }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-2 font-medium tracking-wide">INDEXING COMPLETE...</p>
              </motion.div>

              {/* Main Interactive Card (Top Layer) */}
              <motion.div 
                style={{ 
                  y: y1, 
                  rotate: rotate1,
                  rotateX: transformY,
                  rotateY: transformX,
                  opacity: useTransform(cardIndex, [0, 1, 2], [1, 0.9, 0.8]),
                  scale: useTransform(cardIndex, [0, 1, 2], [1.02, 0.98, 0.95]),
                  filter: useTransform(cardIndex, [0, 1, 2], ['blur(0px)', 'blur(1px)', 'blur(2px)']),
                  boxShadow: useTransform(cardIndex, 
                    [0, 1], 
                    ['0 25px 50px -12px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04), 0 0 20px rgba(59,130,246,0.15)', '0 10px 30px -10px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.03), 0 0 0px rgba(59,130,246,0)']
                  )
                }}
                initial={{ opacity: 0, y: 60, rotate: -2 }}
                animate={{ opacity: 1, y: 0, rotate: 2 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                className="absolute z-30 w-full lg:w-[380px] bg-white rounded-2xl p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)] backdrop-blur-2xl right-[0%] lg:right-[15%] origin-center"
              >
                <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-100/80">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                    <Database size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-[15px] tracking-tight">CSE Architecture</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded uppercase tracking-wider">Sem 3</span>
                      <span className="text-slate-300 text-xs">•</span>
                      <span className="text-[11px] font-medium text-slate-500">Data Structures</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {[
                    { title: "Unit 1: Linked Lists", type: "PDF", size: "2.4 MB", active: true },
                    { title: "Unit 2: Trees & Graphs", type: "PDF", size: "3.1 MB", active: false },
                    { title: "Lab Record Manual", type: "DOCX", size: "1.8 MB", active: false }
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center justify-between group p-2 rounded-lg transition-colors ${item.active ? 'bg-slate-50/80' : 'hover:bg-slate-50/50 cursor-default'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${item.active ? 'bg-blue-100/50 text-blue-600' : 'bg-slate-100/50 text-slate-400 group-hover:text-slate-600 group-hover:bg-slate-200/50'}`}>
                          <FileText size={14} strokeWidth={item.active ? 2 : 1.5} />
                        </div>
                        <span className={`text-[13px] font-medium transition-colors ${item.active ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-800'}`}>{item.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono tracking-tight">{item.size}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* 
        ========================================
        SYSTEM ACCESS : TRANSITION FLOW
        ========================================
      */}
      <section className="w-full bg-white relative z-20 border-t border-slate-100 py-24 lg:py-32">
        <div className="max-w-5xl mx-auto px-6 sm:px-12">
          
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-xs font-bold tracking-widest text-[#2563eb] uppercase mb-3">System Access</span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">Select your context</h2>
          </div>

          {/* Interactive Flow Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            
            {/* Step 1 */}
            <Link to="/materials" className="group relative bg-[#fafafa] border border-slate-200 hover:border-blue-200 hover:bg-white rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_10px_30px_-10px_rgba(59,130,246,0.15)] block">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors mb-4">
                <Cpu size={18} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Branch & Reg</h3>
              <p className="text-sm text-slate-500 font-medium">Initialize context via CSE/ECE/etc.</p>
              
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                <ChevronRight size={18} className="text-blue-500" />
              </div>
            </Link>

            {/* Connecting Arrow (Desktop) */}
            <div className="hidden md:flex absolute top-1/2 left-[33%] -translate-y-1/2 -translate-x-1/2 z-10 w-8 h-8 items-center justify-center text-slate-300">
              <ChevronRight size={20} />
            </div>

            {/* Step 2 */}
            <Link to="/materials" className="group relative bg-[#fafafa] border border-slate-200 hover:border-indigo-200 hover:bg-white rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_10px_30px_-10px_rgba(99,102,241,0.15)] block">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors mb-4">
                <Layers size={18} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Semester</h3>
              <p className="text-sm text-slate-500 font-medium">Target specific timeline.</p>
              
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                <ChevronRight size={18} className="text-indigo-500" />
              </div>
            </Link>

            {/* Connecting Arrow (Desktop) */}
            <div className="hidden md:flex absolute top-1/2 left-[66%] -translate-y-1/2 -translate-x-1/2 z-10 w-8 h-8 items-center justify-center text-slate-300">
              <ChevronRight size={20} />
            </div>

            {/* Step 3 */}
            <Link to="/materials" className="group relative bg-[#fafafa] border border-slate-200 hover:border-amber-200 hover:bg-white rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_10px_30px_-10px_rgba(245,158,11,0.15)] block">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 group-hover:text-amber-600 group-hover:border-amber-100 transition-colors mb-4">
                <Database size={18} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Subject Vault</h3>
              <p className="text-sm text-slate-500 font-medium">Extract precise materials.</p>
              
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                <ChevronRight size={18} className="text-amber-500" />
              </div>
            </Link>

          </div>

        </div>
      </section>
    </div>
  );
}
