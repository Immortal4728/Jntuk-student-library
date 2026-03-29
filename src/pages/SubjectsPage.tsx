import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, FileText, ArrowLeft, ChevronDown, BookOpen, FileQuestion, ScrollText, AlertCircle } from 'lucide-react';
import { getDisplaySemester } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const unitTypes = [
  { id: 'unit-1', label: 'Unit 1', icon: BookOpen },
  { id: 'unit-2', label: 'Unit 2', icon: BookOpen },
  { id: 'unit-3', label: 'Unit 3', icon: BookOpen },
  { id: 'unit-4', label: 'Unit 4', icon: BookOpen },
  { id: 'unit-5', label: 'Unit 5', icon: BookOpen },
];

const resourceTypes = [
  { id: 'important-qs', label: 'Important Questions', icon: FileQuestion },
  { id: 'prev-papers', label: 'Previous Papers', icon: ScrollText },
];

const subjectsData: Record<string, Record<string, string[]>> = {
  CSE: {
    "2-1": ["Universal Human Values", "Discrete Mathematics", "Digital Logic", "Data Structures", "OOPs with Java"],
    "2-2": ["MEFA", "Probability & Statistics", "DBMS", "Operating Systems", "Software Engineering"],
    "3-1": ["Data Warehousing", "Formal Languages", "Computer Networks", "Artificial Intelligence", "EDVC"],
    "3-2": ["Compiler Design", "Cloud Computing", "Network Security", "Machine Learning", "Software Project Mgmt", "MPMC"]
  },
  IT: {
    "2-1": ["Discrete Mathematics", "Universal Human Values", "Digital Logic", "Data Structures", "Java"],
    "2-2": ["Optimization", "Probability & Statistics", "Operating Systems", "DBMS", "Software Engineering"],
    "3-1": ["Advanced Java", "Computer Networks", "Compiler Design", "Data Warehousing", "Electronics"],
    "3-2": ["Machine Learning", "Software Methodology", "Software Project Mgmt", "Network Security", "Cloud Computing", "MPMC"]
  },
  ECE: {
    "2-1": ["Probability & Stochastic", "Universal Human Values", "Signals & Systems", "Electronic Devices", "Logic Design"],
    "2-2": ["MEFA", "Control Systems", "Electromagnetic Waves", "Circuit Analysis", "Analog Communication"],
    "3-1": ["IC Applications", "Digital Communications", "Antennas & Propagation", "Measurements", "Computer Architecture"],
    "3-2": ["VLSI Design", "Digital Signal Processing", "Machine Learning", "Microcontrollers", "Embedded Systems", "DBMS"]
  },
  AIML: {
  }
};

const commonFirstYear: Record<string, string[]> = {
  "1-1": [
    "Communicative English",
    "Engineering Chemistry",
    "Linear Algebra & Calculus",
    "Basic Civil & Mechanical Engineering",
    "Introduction to Programming (C)"
  ],
  "1-2": [
    "Engineering Physics",
    "Differential Equations & Vector Calculus",
    "Basic Electrical and Engineering",
    "Engineering Graphics",
    "Data Structures"
  ]
};

const getSubjects = (branch: string, semester: string): string[] => {
  const year = semester.split("-")[0];
  if (year === "1") {
    return commonFirstYear[semester] || [];
  }
  return subjectsData[branch]?.[semester] || [];
};

export default function SubjectsPage() {
  const { branch, semesterNumber } = useParams<{ branch: string; semesterNumber: string }>();
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const currentSemLabel = getDisplaySemester(semesterNumber || '1-1');

  const branchName = branch?.toUpperCase() || 'CSE';
  const retrievedSubjects = getSubjects(branchName, currentSemLabel);

  const mappedSubjects = retrievedSubjects.map(name => ({
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name,
    code: null
  }));

  const totalResourcesPerSubject = unitTypes.length + resourceTypes.length;

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-4rem)] selection:bg-slate-900 selection:text-white relative">
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
          {mappedSubjects.length === 0 ? (
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
                             
                             {/* UNITS Flow Layout */}
                             <div>
                               <h4 className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mb-2 pl-2">Units</h4>
                               <div className="flex flex-col">
                                 {unitTypes.map((type, idx) => (
                                   <Link
                                     key={type.id}
                                     to={`/materials/${branch}/semester/${semesterNumber}/${subject.id}?view=${type.id}`}
                                     className={`group flex items-center justify-between p-3.5 -mx-2 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition-colors duration-200 ${
                                       idx !== unitTypes.length - 1 ? 'border-b border-slate-50/80' : ''
                                     }`}
                                   >
                                     <div className="flex items-center gap-3.5">
                                       <type.icon size={18} strokeWidth={2.25} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                       <span className="text-[0.9375rem] font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                                         {type.label}
                                       </span>
                                     </div>
                                     <ChevronRight size={16} strokeWidth={2.5} className="text-slate-300 group-hover:text-indigo-500 transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0" />
                                   </Link>
                                 ))}
                               </div>
                             </div>

                             {/* RESOURCES Flow Layout */}
                             <div>
                               <h4 className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mb-2 pl-2">Resources</h4>
                               <div className="flex flex-col">
                                 {resourceTypes.map((type, idx) => (
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
