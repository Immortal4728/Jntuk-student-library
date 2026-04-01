import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, ChevronDown, BookCopy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';

const years = [
  {
    id: 'year-1',
    title: '1st Year',
    subtitle: 'Common for all branches',
    iconColor: 'text-blue-500',
    bgTint: 'bg-blue-50/40',
    indicator: 'bg-blue-500',
    borderActive: 'border-blue-200/60',
    shadow: 'shadow-[0_8px_30px_rgba(59,130,246,0.06)]',
    semesters: [
      { number: '1-1', label: '1-1' },
      { number: '1-2', label: '1-2' },
    ],
  },
  {
    id: 'year-2',
    title: '2nd Year',
    iconColor: 'text-emerald-500',
    bgTint: 'bg-emerald-50/40',
    indicator: 'bg-emerald-500',
    borderActive: 'border-emerald-200/60',
    shadow: 'shadow-[0_8px_30px_rgba(16,185,129,0.06)]',
    semesters: [
      { number: '2-1', label: '2-1' },
      { number: '2-2', label: '2-2' },
    ],
  },
  {
    id: 'year-3',
    title: '3rd Year',
    iconColor: 'text-orange-500',
    bgTint: 'bg-orange-50/40',
    indicator: 'bg-orange-500',
    borderActive: 'border-orange-200/60',
    shadow: 'shadow-[0_8px_30px_rgba(249,115,22,0.06)]',
    semesters: [
      { number: '3-1', label: '3-1' },
      { number: '3-2', label: '3-2' },
    ],
  },
  {
    id: 'year-4',
    title: '4th Year',
    iconColor: 'text-rose-500',
    bgTint: 'bg-rose-50/40',
    indicator: 'bg-rose-500',
    borderActive: 'border-rose-200/60',
    shadow: 'shadow-[0_8px_30px_rgba(244,63,94,0.06)]',
    semesters: [
      { number: '4-1', label: '4-1', comingSoon: true },
      { number: '4-2', label: '4-2', comingSoon: true },
    ],
  },
];

export default function SemesterListPage() {
  const { branch } = useParams<{ branch: string }>();
  const [expandedYear, setExpandedYear] = useState<string | null>(null);

  useEffect(() => {
    setExpandedYear(null);
  }, [branch]);

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-4rem)] selection:bg-[#0f172a] selection:text-white">
      <SEO
        title={`JNTUK ${branch?.toUpperCase()} Materials | Semester Wise Notes & PYQs`}
        description={`Access JNTUK ${branch?.toUpperCase()} semester-wise materials, notes, PYQs, and important questions. R23 Regulation. All years available.`}
        keywords={`JNTUK ${branch?.toUpperCase()} materials, ${branch?.toUpperCase()} notes, ${branch?.toUpperCase()} PYQs, JNTUK ${branch?.toUpperCase()} semester wise, R23 ${branch?.toUpperCase()}`}
        canonicalUrl={`/materials/${branch}`}
      />
      {/* Sticky top branch selector / header */}
      <div className="sticky top-16 z-20 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 px-5 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.12em] uppercase text-slate-400 mb-1">
              <Link to="/materials" className="hover:text-slate-900 transition-colors">Materials</Link>
              <ChevronRight size={12} strokeWidth={2.5} />
              <span className="text-slate-900">{branch}</span>
            </div>
            <h1 className="text-[1.25rem] font-bold text-slate-900 tracking-tight leading-none">
              Select Year
            </h1>
          </div>
          <div className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200/60">
            <span className="text-[11px] font-bold text-slate-500">R23</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 pt-8 pb-32">
        <div className="flex flex-col gap-4">
          {years.map((year) => {
            const isExpanded = expandedYear === year.id;

            return (
              <div 
                key={year.id} 
                className={`relative bg-white rounded-[1.25rem] border transition-all duration-300 ease-out overflow-hidden ${
                  isExpanded 
                    ? `border-transparent ${year.shadow}` 
                    : 'border-slate-200/70 shadow-sm hover:border-slate-300'
                }`}
              >
                {/* Background Tint Layer */}
                <div 
                  className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${
                    isExpanded ? `opacity-100 ${year.bgTint}` : 'opacity-0'
                  }`} 
                />

                {/* Left Active Indicator */}
                <div 
                  className={`absolute left-0 top-6 bottom-6 w-[3px] rounded-r-full transition-transform duration-300 origin-left ${year.indicator} ${
                    isExpanded ? 'scale-x-100' : 'scale-x-0'
                  }`} 
                />

                <button
                  onClick={() => setExpandedYear(isExpanded ? null : year.id)}
                  className="relative w-full flex items-center justify-between p-5 sm:p-6 text-left active:scale-[0.99] transition-transform duration-200 focus:outline-none"
                >
                  <div className="flex items-center gap-4 pl-1">
                    <BookCopy size={24} strokeWidth={2} className={`${year.iconColor} ${isExpanded ? 'opacity-100' : 'opacity-80'}`} />
                    <div className="flex flex-col mt-0.5">
                      <span className={`text-[1.1875rem] font-bold tracking-tight transition-colors duration-200 ${
                        isExpanded ? 'text-slate-900' : 'text-slate-700'
                      }`}>
                        {year.title}
                      </span>
                      {year.subtitle && (
                        <span className="text-[0.8125rem] font-medium text-slate-400 mt-0.5">
                          {year.subtitle}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isExpanded ? 'bg-white shadow-sm' : 'bg-slate-50'
                  }`}>
                    <ChevronDown
                      size={18}
                      strokeWidth={2.5}
                      className={`text-slate-400 transition-transform duration-300 ease-out ${
                        isExpanded ? '-rotate-180 text-slate-700' : ''
                      }`}
                    />
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="relative z-10"
                    >
                      <div className="px-5 pb-6 sm:px-6 sm:pb-7">
                        <p className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-3 pl-1">
                          Select Semester
                        </p>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                          {year.semesters.map((sem) => {
                            const isSoon = 'comingSoon' in sem && sem.comingSoon;
                            return (
                            <Link
                              key={sem.number}
                              to={`/materials/${branch}/semester/${sem.number}`}
                              className={`group relative flex flex-col items-center justify-center rounded-xl border shadow-sm active:scale-[0.97] active:shadow-none transition-all duration-200 overflow-hidden ${
                                isSoon
                                  ? 'h-[4.5rem] bg-gradient-to-b from-amber-50/60 to-white border-amber-200/60 hover:border-amber-300'
                                  : 'h-16 bg-gradient-to-b from-white to-slate-50/50 border-slate-200 hover:border-slate-300 hover:shadow-md'
                              }`}
                            >
                              {/* Hover Glow / Selection Flash */}
                              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/[0.02] group-active:bg-slate-900/[0.04] transition-colors duration-200" />
                              
                              <span className={`relative z-10 text-[1.125rem] font-bold tracking-tight transition-colors duration-200 ${
                                isSoon ? 'text-slate-500 group-hover:text-slate-700' : 'text-slate-600 group-hover:text-slate-900'
                              }`}>
                                {sem.label}
                              </span>
                              {isSoon && (
                                <span className="relative z-10 mt-1 px-2 py-0.5 rounded-full bg-amber-100 text-[9px] font-bold text-amber-700 tracking-[0.08em] uppercase">
                                  Coming Soon
                                </span>
                              )}
                            </Link>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
