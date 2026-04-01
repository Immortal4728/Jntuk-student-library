import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  GraduationCap,
  Calculator,
  BarChart3,
  BookOpen,
  Plus,
  Trash2,
  ChevronDown,
  Edit3,
  Award,
  Star,
  Zap,
  TrendingUp,
  AlertTriangle,
  Loader2,
  Info,
  Check,
  BookMarked,
  Download,
} from "lucide-react";
import {
  GRADE_POINTS,
  GRADE_OPTIONS,
  Subject,
  Semester,
  calcSGPA,
  totalCredits,
  backlogCount,
  calcCGPA,
  cgpaToPercentage,
  getClass,
  totalBacklogs,
  totalCreditsAll,
  gradeColor,
  ALL_SEMESTER_IDS,
  createEmptySemester,
  createDefaultSubject,
  formatGpa,
} from "../lib/academicUtils";

// ─── Tab Definitions ───
type TabKey = "sgpa" | "cgpa" | "calculator";

const TABS: { key: TabKey; label: string; icon: typeof BarChart3 }[] = [
  { key: "sgpa", label: "SGPA", icon: BarChart3 },
  { key: "cgpa", label: "CGPA", icon: Award },
  { key: "calculator", label: "Calculator", icon: Calculator },
];

// ─── Circular Progress Component ───
function CircularProgress({
  value,
  max,
  label,
  color = "#6366f1",
  size = 120,
  displayDecimals = 2,
  hideMax = false,
}: {
  value: number;
  max: number;
  label: string;
  color?: string;
  size?: number;
  displayDecimals?: number;
  hideMax?: boolean;
}) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = max > 0 ? Math.min(value / max, 1) : 0;
  const offset = circumference - progress * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90 drop-shadow-sm" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#f1f5f9"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`${
              hideMax ? "text-3xl" : "text-2xl"
            } font-black text-slate-900 tracking-tight`}
          >
            {Number.isFinite(value) ? value.toFixed(displayDecimals) : "—"}
          </span>
          {!hideMax && (
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              / {max}
            </span>
          )}
        </div>
      </div>
      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full">
        {label}
      </span>
    </div>
  );
}

// ─── Main Component ───
export default function AcademicTrackerPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>("sgpa");
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedSem, setExpandedSem] = useState<string | null>(null);
  const [activeSemTab, setActiveSemTab] = useState<string>("1-1");
  const [saveToast, setSaveToast] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const [gradeInfoOpen, setGradeInfoOpen] = useState(false);
  const [animateBars, setAnimateBars] = useState(false);
  const [downloadState, setDownloadState] = useState<"idle" | "loading" | "success">("idle");

  // ─── Animate Progress Bars ───
  useEffect(() => {
    if (activeTab === "cgpa") {
      setAnimateBars(false);
      const timer = setTimeout(() => setAnimateBars(true), 100);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  // ─── Load from Firebase ───
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const loadData = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "users", user.uid, "academics", "data");
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setSemesters(data.semesters || []);
          if (data.semesters?.length > 0) {
            setActiveSemTab(data.semesters[0].semId);
          }
        }
      } catch (err) {
        console.error("Failed to load academic data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  // ─── Auto-save to Firebase (debounced) ───
  const saveToFirebase = useCallback(
    async (data: Semester[]) => {
      if (!user) return;
      setSaving(true);
      try {
        const docRef = doc(db, "users", user.uid, "academics", "data");
        await setDoc(docRef, { semesters: data, updatedAt: new Date().toISOString() });

        // Calculate CGPA and update the main user document
        const currentCgpa = calcCGPA(data);
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, { cgpa: currentCgpa, updatedAt: new Date().toISOString() }, { merge: true });

        setSaveToast(true);
        setTimeout(() => setSaveToast(false), 1500);
      } catch (err) {
        console.error("Failed to save:", err);
      } finally {
        setSaving(false);
      }
    },
    [user]
  );

  const debouncedSave = useCallback(
    (data: Semester[]) => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => saveToFirebase(data), 800);
    },
    [saveToFirebase]
  );

  // ─── Mutators ───
  const updateSemesters = (updated: Semester[]) => {
    setSemesters(updated);
    debouncedSave(updated);
  };

  const addSemester = () => {
    const used = new Set(semesters.map((s) => s.semId));
    const next = ALL_SEMESTER_IDS.find((id) => !used.has(id));
    if (!next) return;
    const updated = [...semesters, createEmptySemester(next)];
    // Sort semesters by semId order
    updated.sort(
      (a, b) => ALL_SEMESTER_IDS.indexOf(a.semId) - ALL_SEMESTER_IDS.indexOf(b.semId)
    );
    updateSemesters(updated);
    setActiveSemTab(next);
  };

  const deleteSemester = (semId: string) => {
    const updated = semesters.filter((s) => s.semId !== semId);
    updateSemesters(updated);
    if (activeSemTab === semId && updated.length > 0) {
      setActiveSemTab(updated[0].semId);
    }
  };

  const addSubject = (semId: string) => {
    const updated = semesters.map((sem) =>
      sem.semId === semId
        ? { ...sem, subjects: [...sem.subjects, createDefaultSubject()] }
        : sem
    );
    updateSemesters(updated);
  };

  const updateSubject = (
    semId: string,
    subId: string,
    field: keyof Subject,
    value: string | number
  ) => {
    const updated = semesters.map((sem) =>
      sem.semId === semId
        ? {
            ...sem,
            subjects: sem.subjects.map((sub) =>
              sub.id === subId ? { ...sub, [field]: value } : sub
            ),
          }
        : sem
    );
    updateSemesters(updated);
  };

  const deleteSubject = (semId: string, subId: string) => {
    const updated = semesters.map((sem) =>
      sem.semId === semId
        ? { ...sem, subjects: sem.subjects.filter((sub) => sub.id !== subId) }
        : sem
    );
    updateSemesters(updated);
  };

  // ─── Computed values ───
  const cgpa = calcCGPA(semesters);
  const percentage = cgpaToPercentage(cgpa);
  const classAwarded = getClass(cgpa);
  const allBacklogs = totalBacklogs(semesters);
  const allCredits = totalCreditsAll(semesters);
  const activeSem = semesters.find((s) => s.semId === activeSemTab);

  // ─── Generate PDF ───
  const generatePDF = async () => {
    const element = document.getElementById("pdf-report-root");
    if (!element) return;
    
    // Render the hidden layout
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    
    const rollNum = (user as any)?.rollNumber || "Student";
    pdf.save(`JNTUK_Report_${rollNum}.pdf`);
  };

  // ─── Download Handler ───
  const handleDownload = async () => {
    if (downloadState !== "idle") return;
    setDownloadState("loading");
    
    try {
      // Small delay to ensure the DOM is ready + UX formatting
      await new Promise((res) => setTimeout(res, 1000));
      await generatePDF();
      
      setDownloadState("success");
    } catch (e) {
      console.error("PDF generation failed:", e);
      setDownloadState("idle");
      return;
    }
    
    setTimeout(() => {
      setDownloadState("idle");
    }, 1500);
  };

  // ─── Loading State ───
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Loading academic data…</p>
      </div>
    );
  }

  // ─── Empty State ───
  const isEmpty = semesters.length === 0;

  return (
    <div className="space-y-6 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ─── HEADER ─── */}
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-[60px] -mr-10 -mt-10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/20 rounded-full blur-[50px] -ml-8 -mb-8" />
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 bg-white/15 backdrop-blur-md rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Academic Tracker</h1>
          </div>
          <p className="text-indigo-100 text-sm mt-1 ml-0.5">
            Track SGPA, CGPA, and manage your semester grades
          </p>
        </div>
      </header>

      {/* ─── TAB BAR ─── */}
      <div className="flex bg-white rounded-2xl border border-gray-200 p-1.5 shadow-sm">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeTab === tab.key
                ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                : "text-gray-500 hover:bg-gray-50 active:bg-gray-100"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ─── EMPTY STATE ─── */}
      {isEmpty && activeTab !== "calculator" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-2xl flex items-center justify-center mb-5">
            <BookMarked className="w-8 h-8 text-indigo-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            No semester data yet
          </h3>
          <p className="text-slate-500 text-sm max-w-xs mb-5">
            Head over to the <strong>Calculator</strong> tab to add your semesters and grades.
          </p>
          <button
            onClick={() => {
              setActiveTab("calculator");
              if (semesters.length === 0) addSemester();
            }}
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Your First Semester
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 1: SGPA VIEW — Expandable Semester Cards
         ═══════════════════════════════════════════════════════════════ */}
      {activeTab === "sgpa" && !isEmpty && (
        <div className="space-y-4">
          {semesters.map((sem) => {
            const sgpa = calcSGPA(sem.subjects);
            const pct = cgpaToPercentage(sgpa);
            const backs = backlogCount(sem.subjects);
            const credits = totalCredits(sem.subjects);
            const isExpanded = expandedSem === sem.semId;

            return (
              <div
                key={sem.semId}
                className="bg-[#ffffff] rounded-[16px] border border-gray-200 overflow-hidden transition-all duration-300 group hover:shadow-md hover:border-indigo-200"
              >
                {/* Collapsed Header */}
                <button
                  onClick={() => setExpandedSem(isExpanded ? null : sem.semId)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 transition-colors relative"
                >
                  {/* Left: Semester label */}
                  <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-[12px] flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-white text-sm font-black">{sem.semId}</span>
                    </div>
                    <h3 className="text-[15px] font-bold text-gray-800 whitespace-nowrap">
                      {sem.semId} Sem
                    </h3>
                  </div>

                  {/* Right: Inline Metrics + Arrow */}
                  <div className="flex items-center gap-4 sm:gap-6 ml-auto flex-shrink-0">
                    <div className="hidden sm:flex items-center gap-5 text-right">
                      {backs > 0 && (
                        <div className="flex flex-col items-end justify-center">
                          <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest leading-none mb-1.5">Backlogs</span>
                          <span className="text-xs font-black text-red-500 bg-red-50 px-2 py-0.5 rounded flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {backs}
                          </span>
                        </div>
                      )}
                      <div className="flex flex-col items-end justify-center hidden md:flex">
                        <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest leading-none mb-1.5">%</span>
                        <span className="text-[13px] font-bold text-gray-600">
                          {pct.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex flex-col items-end justify-center">
                        <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest leading-none mb-1.5">SGPA</span>
                        <span className="text-[15px] font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600">
                          {formatGpa(sgpa)}
                        </span>
                      </div>
                    </div>

                    {/* Mobile simplified view */}
                    <div className="flex items-center gap-3 sm:hidden">
                      <div className="flex flex-col items-end justify-center">
                        <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-widest leading-none mb-1">SGPA</span>
                        <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center gap-1.5">
                          {backs > 0 && <AlertTriangle className="w-3 h-3 text-red-500" />}
                          {formatGpa(sgpa)}
                        </span>
                      </div>
                    </div>

                    <div className={`w-8 h-8 flex items-center justify-center rounded-full text-[#6b7280] transition-transform duration-300 ${isExpanded ? "rotate-180 bg-purple-50 text-indigo-600" : "bg-gray-50 group-hover:bg-gray-100"}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </button>

                {/* Expanded Body */}
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-5 pt-1 border-t border-gray-100 bg-[#ffffff]">
                      {sem.subjects.length === 0 ? (
                        <p className="text-sm text-[#6b7280] text-center py-6">
                          No subjects added yet
                        </p>
                      ) : (
                        <div className="flex flex-col">
                          {/* Table Header */}
                          <div className="grid grid-cols-[1fr_auto_auto] gap-4 py-2.5 border-b border-gray-200 mb-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Subject</span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center w-12">Grade</span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right w-12">Credits</span>
                          </div>

                          {/* Subject Rows */}
                          <div className="divide-y divide-[#f1f5f9]">
                            {sem.subjects.map((sub) => (
                              <div
                                key={sub.id}
                                className="grid grid-cols-[1fr_auto_auto] gap-4 py-3 items-center group/row"
                              >
                                {/* Subject Name */}
                                <div className="min-w-0 pr-2">
                                  <p className="text-[13px] font-semibold text-gray-800 truncate">
                                    {sub.name || "Unnamed Subject"}
                                  </p>
                                </div>
                                {/* Grade Badge */}
                                <div className="w-12 flex justify-center">
                                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-black ${gradeColor(sub.grade).bg} ${gradeColor(sub.grade).text}`}>
                                    {sub.grade}
                                  </span>
                                </div>
                                {/* Credits */}
                                <div className="w-12 flex justify-end">
                                  <span className="text-[13px] font-bold text-gray-600">
                                    {sub.credits}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Footer / Total Row */}
                      {sem.subjects.length > 0 && (
                        <div className="flex items-center justify-end gap-6 pt-3.5 mt-2 border-t border-[#f1f5f9]">
                          <span className="text-[11px] font-bold text-[#6b7280] uppercase tracking-widest">
                            Total Credits
                          </span>
                          <span className="text-[15px] font-black text-gray-900 w-12 text-right">
                            {credits}
                          </span>
                        </div>
                      )}

                      {/* Edit button shortcut */}
                      <div className="mt-5 flex justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTab("calculator");
                            setActiveSemTab(sem.semId);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Edit Semester
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Download Report Button */}
          <button
            onClick={handleDownload}
            disabled={downloadState !== "idle"}
            className={`flex w-fit mx-auto mt-8 mb-6 items-center justify-center min-w-[200px] gap-2.5 px-6 py-3.5 rounded-xl text-white font-semibold transition-all duration-300 print:hidden ${
              downloadState === "idle"
                ? "bg-gradient-to-r from-purple-500 to-indigo-600 shadow-md hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:-translate-y-0.5 hover:scale-105 active:scale-95 cursor-pointer"
                : downloadState === "loading"
                ? "bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)] scale-95 opacity-90 cursor-not-allowed"
                : "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-100"
            }`}
          >
            {downloadState === "idle" && (
              <>
                <Download className="w-5 h-5" />
                <span className="tracking-wide">Download Report</span>
              </>
            )}
            {downloadState === "loading" && (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="tracking-wide">Generating Report...</span>
              </>
            )}
            {downloadState === "success" && (
              <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-300">
                <Check className="w-5 h-5" />
                <span className="tracking-wide">Download Ready</span>
              </div>
            )}
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 2: CGPA OVERVIEW DASHBOARD
         ═══════════════════════════════════════════════════════════════ */}
      {activeTab === "cgpa" && !isEmpty && (
        <div className="space-y-6">
          {/* Top: Circular Progress Indicators */}
          <div className="bg-white rounded-[24px] border border-slate-100 p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all">
            <div className="flex items-center justify-center gap-10 sm:gap-20">
              <CircularProgress
                value={cgpa}
                max={10}
                label="CGPA"
                color="#8b5cf6"
                size={120}
                displayDecimals={2}
                hideMax={true}
              />
              <CircularProgress
                value={percentage}
                max={100}
                label="Percentage"
                color="#8b5cf6"
                size={120}
                displayDecimals={2}
                hideMax={true}
              />
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Total Backlogs */}
            <div
              className={`rounded-[24px] border p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all ${
                allBacklogs > 0
                  ? "bg-red-50 border-red-100"
                  : "bg-emerald-50 border-emerald-100"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                  allBacklogs > 0 ? "bg-red-100" : "bg-emerald-100"
                }`}
              >
                <AlertTriangle
                  className={`w-6 h-6 ${
                    allBacklogs > 0 ? "text-red-600" : "text-emerald-600"
                  }`}
                />
              </div>
              <p className="text-3xl font-black text-slate-900">{allBacklogs}</p>
              <p className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-widest">
                Backlogs
              </p>
            </div>

            {/* Class Awarded */}
            <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-amber-600" />
              </div>
              <p className="text-xl font-black text-slate-900 leading-tight">
                {classAwarded}
              </p>
              <p className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-widest">
                Class
              </p>
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6 px-1">
              Summary
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center group">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform duration-300">
                  <Zap className="w-6 h-6 text-indigo-600" />
                </div>
                <p className="text-xl font-black text-slate-900">{formatGpa(cgpa)}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                  Max CGPA
                </p>
              </div>
              <div className="text-center group">
                <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform duration-300">
                  <TrendingUp className="w-6 h-6 text-violet-600" />
                </div>
                <p className="text-xl font-black text-slate-900">{percentage.toFixed(2)}%</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                  Percentage
                </p>
              </div>
              <div className="text-center group">
                <div className="w-12 h-12 bg-cyan-50 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform duration-300">
                  <BookOpen className="w-6 h-6 text-cyan-600" />
                </div>
                <p className="text-xl font-black text-slate-900">{allCredits}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                  Credits
                </p>
              </div>
            </div>
          </div>

          {/* Semester Breakdown */}
          <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-5 px-1">
              Semester Breakdown
            </h3>
            <div className="space-y-4">
              {semesters.map((sem) => {
                const sgpa = calcSGPA(sem.subjects);
                const maxPossible = 10;
                const pctBar = maxPossible > 0 ? (sgpa / maxPossible) * 100 : 0;

                return (
                  <div key={sem.semId} className="group flex items-center gap-4 hover:bg-slate-50/80 p-3 -mx-3 rounded-2xl transition-all duration-300 transform hover:scale-[1.01]">
                    <span className="text-sm font-bold text-slate-500 w-10 flex-shrink-0 text-right">
                      {sem.semId}
                    </span>
                    <div className="flex-1 h-3.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-1000 ease-out group-hover:brightness-110"
                        style={{ width: animateBars ? `${pctBar}%` : "0%" }}
                      />
                    </div>
                    <span className="text-sm font-black text-slate-700 w-10 text-left">
                      {formatGpa(sgpa)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 3: CALCULATOR MODE
         ═══════════════════════════════════════════════════════════════ */}
      {activeTab === "calculator" && (
        <div className="space-y-4">
          {/* Top Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={addSemester}
              disabled={semesters.length >= 8}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none"
            >
              <Plus className="w-4 h-4" />
              Add Semester
            </button>
            {activeSem && (
              <button
                onClick={() => deleteSemester(activeSemTab)}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-bold hover:bg-red-100 active:scale-95 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                Delete {activeSemTab}
              </button>
            )}
            <button
              onClick={() => setGradeInfoOpen(!gradeInfoOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-600 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 active:scale-95 transition-all ml-auto"
            >
              <Info className="w-4 h-4" />
              Grades
            </button>
          </div>

          {/* Grade Info Panel */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              gradeInfoOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
              <p className="text-xs font-bold text-indigo-800 mb-3 uppercase tracking-wider">
                Grade Point System
              </p>
              <div className="flex flex-wrap gap-2">
                {GRADE_OPTIONS.map((g) => (
                  <div
                    key={g}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold ${gradeColor(g).bg} ${gradeColor(g).text}`}
                  >
                    {g} = {GRADE_POINTS[g]}
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-indigo-600 mt-3">
                SGPA = Σ(grade × credits) / Σ(credits) &nbsp;|&nbsp; % = CGPA × 9.5
              </p>
            </div>
          </div>

          {/* Semester Tabs */}
          {semesters.length > 0 ? (
            <>
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {semesters.map((sem) => (
                  <button
                    key={sem.semId}
                    onClick={() => setActiveSemTab(sem.semId)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                      activeSemTab === sem.semId
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                        : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {sem.semId} Sem
                  </button>
                ))}
              </div>

              {/* Active Semester SGPA indicator */}
              {activeSem && (
                <div className="flex items-center justify-between bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-4">
                  <div>
                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-0.5">
                      Semester {activeSemTab} SGPA
                    </p>
                    <p className="text-3xl font-black text-indigo-700 tracking-tight">
                      {activeSem.subjects.length === 0
                        ? "—"
                        : formatGpa(calcSGPA(activeSem.subjects))}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-violet-500 uppercase tracking-widest mb-0.5">
                      Overall CGPA
                    </p>
                    <p className="text-3xl font-black text-violet-700 tracking-tight">
                      {semesters.length === 0 ? "—" : formatGpa(cgpa)}
                    </p>
                  </div>
                </div>
              )}

              {/* Subject List (Editable) */}
              {activeSem && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">
                      Subjects ({activeSem.subjects.length})
                    </h3>
                    <button
                      onClick={() => addSubject(activeSemTab)}
                      className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 active:scale-95 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add
                    </button>
                  </div>

                  {activeSem.subjects.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <BookOpen className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-sm font-medium text-slate-500">
                        No subjects yet
                      </p>
                      <button
                        onClick={() => addSubject(activeSemTab)}
                        className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                      >
                        + Add your first subject
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {activeSem.subjects.map((sub, idx) => (
                        <div
                          key={sub.id}
                          className="p-4 hover:bg-slate-50/50 transition-colors"
                        >
                          {/* Subject Name */}
                          <div className="flex items-center gap-2 mb-3">
                            <span className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-400 flex-shrink-0">
                              {idx + 1}
                            </span>
                            <input
                              type="text"
                              value={sub.name}
                              onChange={(e) =>
                                updateSubject(activeSemTab, sub.id, "name", e.target.value)
                              }
                              placeholder="Subject name"
                              className="flex-1 bg-transparent border-0 border-b-2 border-slate-200 focus:border-indigo-500 text-sm font-semibold text-slate-800 placeholder:text-slate-300 outline-none py-1 transition-colors"
                            />
                            <button
                              onClick={() => deleteSubject(activeSemTab, sub.id)}
                              className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Grade + Credits Row */}
                          <div className="flex items-center gap-3 ml-8">
                            <div className="flex-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                                Grade
                              </label>
                              <select
                                value={sub.grade}
                                onChange={(e) =>
                                  updateSubject(activeSemTab, sub.id, "grade", e.target.value)
                                }
                                className={`w-full p-2.5 rounded-xl border text-sm font-bold transition-all ${
                                  gradeColor(sub.grade).bg
                                } ${gradeColor(sub.grade).text} border-transparent focus:ring-2 focus:ring-indigo-500/20 outline-none appearance-none cursor-pointer`}
                              >
                                {GRADE_OPTIONS.map((g) => (
                                  <option key={g} value={g}>
                                    {g} ({GRADE_POINTS[g]})
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="w-24">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                                Credits
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                value={sub.credits}
                                onChange={(e) => {
                                  const raw = Number(e.target.value);
                                  const credit = Number.isFinite(raw)
                                    ? Math.max(0, raw)
                                    : 0;
                                  updateSubject(
                                    activeSemTab,
                                    sub.id,
                                    "credits",
                                    credit
                                  );
                                }}
                                min={0}
                                max={10}
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-center text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Footer with Total Credits */}
                  {activeSem.subjects.length > 0 && (
                    <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">
                        Total Credits
                      </span>
                      <span className="text-sm font-black text-indigo-600">
                        {totalCredits(activeSem.subjects)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-2xl flex items-center justify-center mb-5">
                <Calculator className="w-8 h-8 text-indigo-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Add your first semester
              </h3>
              <p className="text-slate-500 text-sm max-w-xs mb-5">
                Start by adding a semester, then add subjects with grades and credits.
              </p>
              <button
                onClick={addSemester}
                className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Semester
              </button>
            </div>
          )}
        </div>
      )}

      {/* ─── Elite Loading Overlay Fullscreen ─── */}
      {downloadState === "loading" && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/30 backdrop-blur-sm animate-in fade-in duration-300 print:hidden">
          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-5 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center relative shadow-inner">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              <div className="absolute inset-0 rounded-2xl border-[3px] border-indigo-600/20 animate-ping"></div>
            </div>
            <div className="text-center px-4">
              <h3 className="text-[17px] font-black text-slate-800">Preparing Report...</h3>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                Please Wait
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── HIDDEN PDF REPORT TEMPLATE ─── */}
      <div id="pdf-report-root" className="absolute left-[-9999px] top-0 bg-white text-black p-12 font-sans w-[800px]">
        {/* Header */}
        <div className="flex items-end justify-between border-b-2 border-slate-800 pb-4 mb-8">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-wider text-slate-900">University Name</h1>
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-widest mt-1">Academic Performance Report</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Date: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Student Info */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Student Name</p>
            <p className="text-sm font-bold text-slate-800 mt-1">{(user as any)?.displayName || (user as any)?.name || "Student Name"}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Roll Number</p>
            <p className="text-sm font-bold text-slate-800 mt-1">{(user as any)?.rollNumber || "N/A"}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Branch</p>
            <p className="text-sm font-bold text-slate-800 mt-1">{(user as any)?.branch || "N/A"}</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="border border-slate-200 rounded-lg p-5">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Cumulative GPA</p>
            <p className="text-3xl font-black text-slate-900 text-center mt-2">{formatGpa(cgpa)}</p>
          </div>
          <div className="border border-slate-200 rounded-lg p-5">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Percentage</p>
            <p className="text-3xl font-black text-slate-900 text-center mt-2">{cgpaToPercentage(cgpa).toFixed(2)}%</p>
          </div>
          <div className="border border-slate-200 rounded-lg p-5">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Semesters</p>
            <p className="text-3xl font-black text-slate-900 text-center mt-2">{semesters.length}</p>
          </div>
        </div>

        {/* Semester Table */}
        <table className="w-full text-left border-collapse border border-slate-200">
          <thead>
            <tr className="border-b-2 border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50">
              <th className="py-3 px-4 border-r border-slate-200">Semester</th>
              <th className="py-3 px-4 border-r border-slate-200 text-center">SGPA</th>
              <th className="py-3 px-4 border-r border-slate-200 text-center">Credits</th>
              <th className="py-3 px-4 border-r border-slate-200 text-center">Percentage</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {semesters.map((sem, idx) => {
              const sGpa = calcSGPA(sem.subjects);
              const sPct = cgpaToPercentage(sGpa);
              const sCred = totalCredits(sem.subjects);
              const sBacks = backlogCount(sem.subjects);
              
              return (
                <tr key={sem.semId} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="py-3 px-4 font-bold text-slate-800 border-r border-b border-slate-200">{sem.semId} Sem</td>
                  <td className="py-3 px-4 font-black text-slate-900 text-center border-r border-b border-slate-200">{formatGpa(sGpa)}</td>
                  <td className="py-3 px-4 font-bold text-slate-600 text-center border-r border-b border-slate-200">{sCred}</td>
                  <td className="py-3 px-4 font-bold text-slate-600 text-center border-r border-b border-slate-200">{sPct.toFixed(2)}%</td>
                  <td className="py-3 px-4 text-center border-b border-slate-200">
                    {sBacks > 0 ? (
                      <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                        {sBacks} Backlog{sBacks > 1 ? "s" : ""}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                        Clear
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Footer */}
        <div className="mt-16 pt-6 border-t border-slate-200 flex items-center justify-between">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Generated by Academic Tracker
          </p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {new Date().getFullYear()} Version
          </p>
        </div>
      </div>

      {/* ─── Auto-save Toast ─── */}
      <div
        className={`fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          saveToast
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-2 bg-emerald-900/90 backdrop-blur-md text-emerald-100 px-4 py-2.5 rounded-full shadow-xl border border-emerald-700/50">
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold">Saved to cloud</span>
        </div>
      </div>

      {/* ─── Saving indicator ─── */}
      {saving && (
        <div className="fixed bottom-20 md:bottom-6 right-4 z-50">
          <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md text-white px-3 py-2 rounded-full shadow-xl">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span className="text-[11px] font-bold">Saving…</span>
          </div>
        </div>
      )}
    </div>
  );
}
