import { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { FileText, Download, Eye, ChevronRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { getDisplaySemester } from "../lib/utils";
import { materials } from '../data/materials';

interface Material {
  id: string;
  title: string;
  fileURL: string;
}

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

const getOriginalSubjectName = (branch: string, semesterNumber: string, subjectSlug: string): string => {
  const currentSemLabel = getDisplaySemester(semesterNumber || '1-1');

  // New centralized materials keys:
  // - UI may pass the subject key directly (e.g. "ADS", "Computer Networks", "P&S")
  // - Or it may pass a slugified variant depending on the page.
  const semesterMaterials = (materials as any)?.[currentSemLabel] as Record<string, string> | undefined;
  if (semesterMaterials && subjectSlug) {
    if (Object.prototype.hasOwnProperty.call(semesterMaterials, subjectSlug)) return subjectSlug;

    // Fallback: try matching by slugified keys.
    const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const foundKey = Object.keys(semesterMaterials).find((k) => slugify(k) === subjectSlug);
    if (foundKey) return foundKey;
  }
  
  let subjectsList: string[] = [];
  if (currentSemLabel.startsWith('1-')) {
    subjectsList = commonFirstYear[currentSemLabel] || [];
  } else {
    subjectsList = subjectsData[branch]?.[currentSemLabel] || [];
  }

  const found = subjectsList.find(s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-') === subjectSlug);
  return found || subjectSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

export default function FilesPage() {
  const { branch, semesterNumber, subjectId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  const view = searchParams.get('view') || 'unit-1';

  const branchUpper = branch?.toUpperCase() || 'CSE';
  const originalSubjectName = getOriginalSubjectName(branchUpper, semesterNumber || '1', subjectId || '');

  useEffect(() => {
    const fetchMaterials = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "materials"),
          where("branch", "==", branchUpper),
          where("semester", "==", semesterNumber),
          where("subject", "==", originalSubjectName),
          where("unit", "==", view)
        );

        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Material[];
        
        setMaterials(docs);
      } catch (err) {
        console.error('Failed to load materials:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [branchUpper, semesterNumber, originalSubjectName, view]);

  const formatViewName = (str: string) => {
    if (str.startsWith('unit-')) return `Unit ${str.split('-')[1]}`;
    if (str === 'important-qs') return 'Important Questions';
    if (str === 'prev-papers') return 'Previous Papers';
    return str;
  };

  const viewName = formatViewName(view);

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-4rem)] relative">
      <div className="max-w-3xl mx-auto px-5 pt-10 pb-32">
        {/* Navigation & Header Area */}
        <div className="flex flex-col gap-5 mb-10">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 active:scale-90 transition-all shadow-sm self-start"
            aria-label="Go back"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-slate-500">
             <Link to={`/materials/${branch}/semester/${semesterNumber}`} className="hover:text-indigo-600 transition-colors">
               SEM {semesterNumber}
             </Link>
             <ChevronRight size={12} strokeWidth={2.5} className="text-slate-300" />
             <span className="text-slate-900 truncate max-w-[150px] sm:max-w-none">{originalSubjectName}</span>
          </div>

          <div className="mt-2">
            <h1 className="text-[2rem] sm:text-[2.75rem] font-bold text-slate-900 tracking-tight leading-[1.1] mb-2.5">
              {viewName}
            </h1>
            <p className="text-[1.0625rem] font-medium text-slate-500">
              Access your files instantly below
            </p>
          </div>
        </div>

        {/* Materials List */}
        <div className="flex flex-col gap-4">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-[1.25rem] border border-slate-200 p-5 h-[5.5rem] animate-pulse" />
            ))
          ) : materials.length === 0 ? (
            <div className="bg-white rounded-[1.25rem] border border-slate-200 py-16 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-16 h-16 rounded-[1.25rem] bg-indigo-50/50 border border-indigo-100 flex items-center justify-center mb-5">
                <AlertCircle size={28} className="text-indigo-400" />
              </div>
              <h3 className="text-[1.125rem] font-bold text-slate-900 tracking-tight">No files uploaded yet</h3>
              <p className="text-[0.875rem] font-medium text-slate-500 mt-2 max-w-xs">
                Check back soon or request them from an admin.
              </p>
            </div>
          ) : (
            materials.map((mat) => (
              <div 
                key={mat.id}
                className="bg-white rounded-[1.25rem] border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-5 group"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    <FileText size={24} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-[1.0625rem] font-bold text-slate-900 truncate pr-2">
                    {mat.title}
                  </h3>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                  <a
                    href={mat.fileURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[0.875rem] transition-colors"
                  >
                    <Eye size={18} strokeWidth={2.5} />
                    Preview
                  </a>
                  <a
                    href={mat.fileURL}
                    download
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[0.875rem] transition-colors shadow-sm shadow-indigo-200"
                  >
                    <Download size={18} strokeWidth={2.5} />
                    Download
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
