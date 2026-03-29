import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import {
  GraduationCap,
  Calculator,
  BarChart3,
  BookOpen,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
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
}: {
  value: number;
  max: number;
  label: string;
  color?: string;
  size?: number;
}) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = max > 0 ? Math.min(value / max, 1) : 0;
  const offset = circumference - progress * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e2e8f0"
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
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            {value || "—"}
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            / {max}
          </span>
        </div>
      </div>
      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

// ─── Grade Badge ───
function GradeBadge({ grade }: { grade: string }) {
  const { bg, text } = gradeColor(grade);
  return (
    <span
      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-black ${bg} ${text} transition-all`}
    >
      {grade}
    </span>
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
      <div className="flex bg-white rounded-2xl border border-slate-200 p-1.5 shadow-sm">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeTab === tab.key
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                : "text-slate-500 hover:bg-slate-50 active:bg-slate-100"
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
        <div className="space-y-3">
          {semesters.map((sem) => {
            const sgpa = calcSGPA(sem.subjects);
            const pct = cgpaToPercentage(sgpa);
            const backs = backlogCount(sem.subjects);
            const credits = totalCredits(sem.subjects);
            const isExpanded = expandedSem === sem.semId;

            return (
              <div
                key={sem.semId}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300"
              >
                {/* Collapsed Header */}
                <button
                  onClick={() => setExpandedSem(isExpanded ? null : sem.semId)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-slate-50/50 active:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-500/20">
                      <span className="text-white text-sm font-black">{sem.semId}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 truncate">
                        {sem.semId} Semester
                      </h3>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs font-semibold text-indigo-600">{sgpa} SGPA</span>
                        <span className="text-[10px] text-slate-400">•</span>
                        <span className="text-xs text-slate-500">{pct}%</span>
                        {backs > 0 && (
                          <>
                            <span className="text-[10px] text-slate-400">•</span>
                            <span className="text-xs font-bold text-red-500 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              {backs}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden sm:block">
                      {credits} credits
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Expanded Body */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-out ${
                    isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-5 pb-5 border-t border-slate-100">
                    {sem.subjects.length === 0 ? (
                      <p className="text-sm text-slate-400 text-center py-6">
                        No subjects added yet
                      </p>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {sem.subjects.map((sub) => (
                          <div
                            key={sub.id}
                            className="flex items-center justify-between py-3.5 gap-3"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <GradeBadge grade={sub.grade} />
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-slate-800 truncate">
                                  {sub.name || "Unnamed Subject"}
                                </p>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  {sub.credits} credits • {GRADE_POINTS[sub.grade] ?? 0} pts
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTab("calculator");
                                setActiveSemTab(sem.semId);
                              }}
                              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-100">
                      <span className="text-xs font-bold text-slate-500">
                        Total Credits
                      </span>
                      <span className="text-sm font-black text-indigo-600">
                        {credits}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 2: CGPA OVERVIEW DASHBOARD
         ═══════════════════════════════════════════════════════════════ */}
      {activeTab === "cgpa" && !isEmpty && (
        <div className="space-y-4">
          {/* Top: Circular Progress Indicators */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-center gap-8 sm:gap-14">
              <CircularProgress
                value={cgpa}
                max={10}
                label="CGPA"
                color="#6366f1"
                size={120}
              />
              <CircularProgress
                value={parseFloat(percentage.toFixed(1))}
                max={100}
                label="Percentage"
                color="#8b5cf6"
                size={120}
              />
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Total Backlogs */}
            <div
              className={`rounded-2xl border p-5 shadow-sm transition-all ${
                allBacklogs > 0
                  ? "bg-red-50 border-red-200"
                  : "bg-emerald-50 border-emerald-200"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                  allBacklogs > 0 ? "bg-red-100" : "bg-emerald-100"
                }`}
              >
                <AlertTriangle
                  className={`w-5 h-5 ${
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
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mb-3">
                <Star className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-lg font-black text-slate-900 leading-tight">
                {classAwarded}
              </p>
              <p className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-widest">
                Class
              </p>
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              Summary
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Zap className="w-5 h-5 text-indigo-600" />
                </div>
                <p className="text-lg font-black text-slate-900">{cgpa}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Max CGPA
                </p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-5 h-5 text-violet-600" />
                </div>
                <p className="text-lg font-black text-slate-900">{percentage}%</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Percentage
                </p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <BookOpen className="w-5 h-5 text-cyan-600" />
                </div>
                <p className="text-lg font-black text-slate-900">{allCredits}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Credits
                </p>
              </div>
            </div>
          </div>

          {/* Semester Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              Semester Breakdown
            </h3>
            <div className="space-y-3">
              {semesters.map((sem) => {
                const sgpa = calcSGPA(sem.subjects);
                const maxPossible = 10;
                const pctBar = maxPossible > 0 ? (sgpa / maxPossible) * 100 : 0;

                return (
                  <div key={sem.semId} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500 w-8 flex-shrink-0">
                      {sem.semId}
                    </span>
                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700 ease-out"
                        style={{ width: `${pctBar}%` }}
                      />
                    </div>
                    <span className="text-xs font-black text-slate-700 w-10 text-right">
                      {sgpa}
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
                SGPA = Σ(grade × credits) / Σ(credits) &nbsp;|&nbsp; % = (CGPA − 0.75) × 10
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
                      {calcSGPA(activeSem.subjects) || "—"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-violet-500 uppercase tracking-widest mb-0.5">
                      Overall CGPA
                    </p>
                    <p className="text-3xl font-black text-violet-700 tracking-tight">
                      {cgpa || "—"}
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
                                value={sub.credits}
                                onChange={(e) =>
                                  updateSubject(
                                    activeSemTab,
                                    sub.id,
                                    "credits",
                                    Math.max(0, parseInt(e.target.value) || 0)
                                  )
                                }
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
