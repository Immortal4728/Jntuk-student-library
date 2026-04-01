import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, FileText, ArrowLeft, ChevronDown, Clock, Construction, Download, BookOpen } from 'lucide-react';
import { getDisplaySemester } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import { materials } from '../data/materials';

export default function SubjectsPage() {
  const { branch, semesterNumber } = useParams<{ branch: string; semesterNumber: string }>();
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const currentSemLabel = getDisplaySemester(semesterNumber || '1-1');
  const branchName = branch?.toUpperCase() || 'CSE';
  
  const subjectsForSemester = (materials as any)?.[currentSemLabel] as Record<string, Record<string, string>> | undefined;
  
  let importantLink: string | null = null;
  const mappedSubjects = Object.keys(subjectsForSemester || {})
    .filter(subjectKey => {
      if (subjectKey === 'important') {
        importantLink = (subjectsForSemester as any)[subjectKey] as unknown as string;
        return false;
      }
      return true;
    })
    .map((subjectKey) => ({
      id: subjectKey,
      name: subjectKey,
      data: subjectsForSemester![subjectKey]
    }));
    
  // If the only key is 'important', then comingSoon shouldn't trigger, it should just map 0 subjects and show the important link.
  const comingSoon = !subjectsForSemester || Object.keys(subjectsForSemester).length === 0;

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-4rem)] selection:bg-slate-900 selection:text-white relative">
      <SEO
        title={`JNTUK ${branchName} ${currentSemLabel} Materials | Notes, PYQs`}
        description={`Download JNTUK ${branchName} ${currentSemLabel} semester materials — unit-wise notes, previous papers, and important questions. R23 Regulation.`}
        keywords={`JNTUK ${branchName} ${currentSemLabel}, ${branchName} ${currentSemLabel} notes, ${branchName} ${currentSemLabel} PYQs, JNTUK ${currentSemLabel} semester materials, R23 ${branchName}`}
        canonicalUrl={`/materials/${branch}/semester/${semesterNumber}`}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl mx-auto px-5 pt-10 pb-32"
      >
        
        {/* Navigation & Header Area */}
        <div className="flex flex-col gap-5 mb-12">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 active:scale-90 transition-all shadow-sm"
              aria-label="Go back"
            >
              <ArrowLeft size={20} strokeWidth={2.5} />
            </button>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Link 
              to="/materials" 
              className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-[12px] font-bold text-slate-500 hover:text-slate-800 hover:border-slate-300 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              MATERIALS
            </Link>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100/60 shadow-sm">
              <span className="text-[12px] font-bold text-indigo-700 uppercase tracking-wide">BRANCH: {branchName}</span>
              <span className="w-1 h-1 rounded-full bg-indigo-300" />
              <span className="text-[12px] font-bold text-indigo-700 uppercase tracking-wide">{currentSemLabel} SEM</span>
            </div>
          </div>

          <div className="mt-2">
            <h1 className="text-[2rem] sm:text-[2.75rem] font-bold text-slate-900 tracking-tight leading-[1.1] mb-2.5">
              {currentSemLabel} Semester – {branchName} Materials
            </h1>
            <p className="text-[1.0625rem] font-medium text-slate-500">
              All your subjects and resources in one place
            </p>
          </div>
        </div>

        {/* Subject Accordion List */}
        <div className="flex flex-col gap-4 relative">
          {comingSoon ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="py-16 sm:py-24 flex flex-col items-center justify-center text-center"
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 shadow-[0_8px_30px_rgba(245,158,11,0.1)] flex items-center justify-center">
                  <Construction size={34} className="text-amber-500" strokeWidth={1.5} />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center shadow-sm">
                  <Clock size={12} className="text-amber-600" strokeWidth={2.5} />
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/60 mb-5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                </span>
                <span className="text-[11px] font-bold text-amber-700 tracking-[0.1em] uppercase">Coming Soon</span>
              </div>

              <h3 className="text-[1.5rem] sm:text-[1.75rem] font-bold text-slate-900 tracking-tight mb-3">
                {currentSemLabel} Semester Materials
              </h3>
              <p className="text-[0.9375rem] font-medium text-slate-500 max-w-sm leading-relaxed mb-8">
                We're preparing content for this semester. Materials will be available here once they're ready.
              </p>

              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-[14px] font-semibold shadow-[0_2px_12px_rgba(15,23,42,0.2)] hover:shadow-[0_6px_20px_rgba(15,23,42,0.25)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300"
              >
                <ArrowLeft size={16} strokeWidth={2.5} />
                Go Back
              </button>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-4">
              {importantLink && (
                <div className="flex items-center justify-between p-5 sm:p-6 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/60 rounded-[1.25rem] shadow-sm mb-2 relative overflow-hidden group hover:shadow-md transition-all">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-bl-[100px] -mr-8 -mt-8 pointer-events-none" />
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-[14px] bg-white text-[1.5rem] shadow-sm border border-orange-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      🔥
                    </div>
                    <div>
                      <h3 className="text-[1.125rem] sm:text-[1.25rem] font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        Important Questions
                        <span className="px-2 py-0.5 rounded-[4px] bg-red-100/80 text-[10px] font-bold text-red-700 tracking-[0.1em] uppercase hidden sm:inline-block">Must Read</span>
                      </h3>
                      <p className="text-[0.8125rem] sm:text-[0.875rem] font-medium text-orange-700 mt-0.5">
                        High priority exam questions
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => window.open(importantLink as string, "_blank")}
                    className="relative z-10 flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-slate-900 hover:bg-slate-800 text-white text-[13px] font-bold rounded-xl transition-all shadow-[0_4px_14px_rgba(15,23,42,0.15)] hover:shadow-[0_6px_20px_rgba(15,23,42,0.2)] hover:-translate-y-0.5 active:scale-95"
                  >
                    <Download size={16} strokeWidth={2.5} />
                    <span className="hidden sm:inline">Download</span>
                  </button>
                </div>
              )}
              {mappedSubjects.map((subject, idx) => {
                const isExpanded = expandedId === subject.id;
                const isAnotherExpanded = expandedId !== null && expandedId !== subject.id;
                const isFirst = idx === 0;
                
                const unitKeys = Object.keys(subject.data || {});

                return (
                  <div 
                    key={subject.id} 
                    className={`bg-white rounded-[1.25rem] border transition-all duration-300 ease-[0.16,1,0.3,1] overflow-hidden ${
                      isExpanded 
                        ? 'border-indigo-200/80 shadow-[0_16px_40px_rgba(79,70,229,0.12)] ring-4 ring-indigo-50 z-10 scale-[1.02] bg-indigo-50/10' 
                        : `border-slate-200/70 shadow-sm hover:border-slate-300 hover:shadow z-0 origin-center ${
                            isAnotherExpanded ? 'opacity-40 saturate-[0.8] scale-[0.98] hover:opacity-80' : ''
                          }`
                    }`}
                  >
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : subject.id)}
                      className="w-full flex items-center justify-between p-5 sm:p-6 text-left active:scale-[0.98] transition-transform duration-200 focus:outline-none"
                    >
                      <div className="flex items-center gap-5 min-w-0 w-full">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                          isExpanded ? 'bg-indigo-600 text-white shadow-md scale-105' : 'bg-slate-100 text-slate-400'
                        }`}>
                          <FileText size={24} strokeWidth={isExpanded ? 2.5 : 2} />
                        </div>
                        
                        <div className="flex-1 min-w-0 pr-2">
                          {isFirst && !isExpanded && (
                            <div className="mb-2">
                              <span className="px-2 py-0.5 rounded-[4px] bg-emerald-100/80 text-[10px] font-bold text-emerald-700 tracking-[0.15em] uppercase">
                                Start Here
                              </span>
                            </div>
                          )}
                          
                          <h3 className={`text-[1.1875rem] font-bold truncate transition-colors duration-200 ${
                            isExpanded ? 'text-slate-900' : 'text-slate-800'
                          }`}>
                            {subject.name}
                          </h3>
                          
                          <div className="flex items-center gap-3 mt-1.5 transition-opacity duration-300">
                            <p className={`text-[0.8125rem] font-medium transition-colors ${
                              isExpanded ? 'text-indigo-600/70' : 'text-slate-500'
                            }`}>
                              {unitKeys.length} Resource{unitKeys.length !== 1 && 's'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                         isExpanded ? 'bg-indigo-100' : 'bg-slate-50'
                      }`}>
                        <ChevronDown
                           size={20}
                           strokeWidth={2.5}
                           className={`transition-transform duration-300 ease-out ${
                             isExpanded ? '-rotate-180 text-indigo-600' : 'text-slate-300'
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
                             transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                         >
                           <div className="px-5 pb-6 pt-1 sm:px-6">
                             <div className="flex flex-col gap-3 pt-3 border-t border-slate-100/80 mt-1">
                               {unitKeys.map((unitKey) => (
                                 <div key={unitKey} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl hover:bg-slate-100 hover:border-slate-300 transition-colors">
                                    <div className="flex items-center gap-3">
                                       <BookOpen size={18} className="text-indigo-500" />
                                       <span className="text-[0.9375rem] font-bold text-slate-700">{unitKey}</span>
                                    </div>
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); window.open((subject.data as any)[unitKey], "_blank"); }}
                                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-bold rounded-lg transition-colors shadow-sm"
                                    >
                                      <Download size={16} strokeWidth={2.5} />
                                      <span>Download</span>
                                    </button>
                                 </div>
                               ))}
                             </div>
                           </div>
                         </motion.div>
                       )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
