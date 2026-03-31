import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, FileText, ArrowLeft, ChevronDown, FolderArchive, FileArchive, AlertCircle, Clock, Construction } from 'lucide-react';
import { getDisplaySemester } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import { materials } from '../data/materials';
import { downloadFile } from '../lib/downloadFile';

const resourceTypes = [
  {
    id: 'study-material-zip',
    label: 'Study Material (ZIP)',
    icon: FolderArchive,
    description: 'Includes all 5 units combined in one downloadable file',
  },
  { id: 'important-qs', label: 'Important Questions', icon: FileText },
  { id: 'prev-papers', label: 'Previous Papers', icon: FileArchive },
];

export default function SubjectsPage() {
  const { branch, semesterNumber } = useParams<{ branch: string; semesterNumber: string }>();
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const currentSemLabel = getDisplaySemester(semesterNumber || '1-1');

  const branchName = branch?.toUpperCase() || 'CSE';
  const subjectsForSemester = (materials as any)?.[currentSemLabel] as Record<string, string> | undefined;
  const comingSoon = !subjectsForSemester || Object.keys(subjectsForSemester).length === 0;

  const mappedSubjects = Object.keys(subjectsForSemester || {}).map((subjectKey) => ({
    id: subjectKey,
    name: subjectKey,
    materialKey: subjectKey,
    code: null,
  }));

  const totalResourcesPerSubject = resourceTypes.length;

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
              {/* Icon */}
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 shadow-[0_8px_30px_rgba(245,158,11,0.1)] flex items-center justify-center">
                  <Construction size={34} className="text-amber-500" strokeWidth={1.5} />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center shadow-sm">
                  <Clock size={12} className="text-amber-600" strokeWidth={2.5} />
                </div>
              </div>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/60 mb-5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                </span>
                <span className="text-[11px] font-bold text-amber-700 tracking-[0.1em] uppercase">Coming Soon</span>
              </div>

              {/* Title */}
              <h3 className="text-[1.5rem] sm:text-[1.75rem] font-bold text-slate-900 tracking-tight mb-3">
                {currentSemLabel} Semester Materials
              </h3>
              <p className="text-[0.9375rem] font-medium text-slate-500 max-w-sm leading-relaxed mb-8">
                We're preparing content for this semester. Materials will be available here once they're ready.
              </p>

              {/* Back button */}
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-[14px] font-semibold shadow-[0_2px_12px_rgba(15,23,42,0.2)] hover:shadow-[0_6px_20px_rgba(15,23,42,0.25)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300"
              >
                <ArrowLeft size={16} strokeWidth={2.5} />
                Go Back
              </button>
            </motion.div>
          ) : mappedSubjects.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-[1.25rem] bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-5">
                <AlertCircle size={28} className="text-slate-400" />
              </div>
              <h3 className="text-[1.125rem] font-bold text-slate-900 tracking-tight">No materials added yet</h3>
              <p className="text-[0.875rem] font-medium text-slate-500 mt-2 max-w-xs">
                Check back soon.
              </p>
            </div>
          ) : (
            mappedSubjects.map((subject, idx) => {
              const isExpanded = expandedId === subject.id;
              const isAnotherExpanded = expandedId !== null && expandedId !== subject.id;
              const isFirst = idx === 0;
              
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
                            {totalResourcesPerSubject} Resources
                          </p>
                          
                          {!isExpanded && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-slate-300" />
                              <span className="text-[0.8125rem] font-bold text-indigo-600 flex items-center gap-1 group-hover:underline decoration-indigo-200 underline-offset-4">
                                View Materials
                              </span>
                            </>
                          )}
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
                           <div className="flex flex-col gap-7 pt-3 border-t border-slate-100/80 mt-1">
                             
                             {/* RESOURCES Flow Layout */}
                             <div>
                               <h4 className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mb-2 pl-2">Resources</h4>
                               <div className="flex flex-col">
                                 {resourceTypes.map((type, idx) => (
                                  type.id === 'study-material-zip' ? (
                                    <button
                                      key={type.id}
                                      type="button"
                                      onClick={() => downloadFile((subjectsForSemester as any)?.[subject.materialKey])}
                                      aria-label={`Download ${type.label}`}
                                      className={`group flex items-center justify-between p-3.5 -mx-2 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition-colors duration-200 ${
                                        idx !== resourceTypes.length - 1 ? 'border-b border-slate-50/80' : ''
                                      }`}
                                    >
                                      <div className="flex items-center gap-3.5 min-w-0">
                                        <type.icon size={18} strokeWidth={2.25} className="text-slate-400 group-hover:text-emerald-500 transition-colors flex-shrink-0" />
                                        <div className="min-w-0">
                                          <span className="block text-[0.9375rem] font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                                            {type.label}
                                          </span>
                                          <p className="text-[0.75rem] leading-5 text-slate-500 mt-0.5">
                                            {type.description}
                                          </p>
                                        </div>
                                      </div>
                                      <ChevronRight size={16} strokeWidth={2.5} className="text-slate-300 group-hover:text-emerald-500 transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 flex-shrink-0" />
                                    </button>
                                  ) : (
                                    <Link
                                      key={type.id}
                                      to={`/materials/${branch}/semester/${semesterNumber}/${subject.id}?view=${type.id}`}
                                      className={`group flex items-center justify-between p-3.5 -mx-2 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition-colors duration-200 ${
                                        idx !== resourceTypes.length - 1 ? 'border-b border-slate-50/80' : ''
                                      }`}
                                    >
                                      <div className="flex items-center gap-3.5">
                                        <type.icon size={18} strokeWidth={2.25} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
                                        <span className="text-[0.9375rem] font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                                          {type.label}
                                        </span>
                                      </div>
                                      <ChevronRight size={16} strokeWidth={2.5} className="text-slate-300 group-hover:text-emerald-500 transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0" />
                                    </Link>
                                  )
                                ))}
                              </div>
                            </div>

                           </div>
                         </div>
                       </motion.div>
                     )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
}
