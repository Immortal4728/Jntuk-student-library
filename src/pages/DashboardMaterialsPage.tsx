import { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { getDisplaySemester } from "../lib/utils";
import { materials } from "../data/materials";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  FileText,
  AlertCircle,
  Trash2,
  Plus,
  Download
} from "lucide-react";
import { Button } from "../components/ui/button";

export default function DashboardMaterialsPage() {
  const { profile } = useAuth();
  
  const currentSemester = getDisplaySemester(profile?.semester || "1-1");
  const branch = profile?.branch || "Unknown";

  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([]);
  
  // Backlogs
  const [backlogs, setBacklogs] = useState<{semester: string, subject: string, data: Record<string, string>}[]>([]);
  const [addSem, setAddSem] = useState("");
  const [addSubj, setAddSubj] = useState("");

  const currentSemSubjects = useMemo(() => {
    const semData = (materials as any)[currentSemester] || {};
    return Object.keys(semData)
      .filter(subject => subject !== 'important')
      .map(subject => ({
        id: `${currentSemester}-${subject}`,
        name: subject,
        semester: currentSemester,
        data: semData[subject],
        isBacklog: false,
        backlogIndex: undefined as number | undefined
      }));
  }, [currentSemester]);

  const importantLink = useMemo(() => {
    return (materials as any)[currentSemester]?.important || null;
  }, [currentSemester]);

  const allSubjects = useMemo(() => {
    const backlogsMapped = backlogs.map((b, i) => ({
      id: `backlog-${i}-${b.semester}-${b.subject}`,
      name: b.subject,
      semester: b.semester,
      data: b.data,
      isBacklog: true,
      backlogIndex: i
    }));
    return [...currentSemSubjects, ...backlogsMapped];
  }, [currentSemSubjects, backlogs]);

  const availableSemesters = Object.keys(materials).filter(s => s !== currentSemester);
  const availableSubjects = addSem ? Object.keys((materials as any)[addSem] || {}) : [];

  const handleAddBacklog = () => {
    if (!addSem || !addSubj) return;
    const data = (materials as any)[addSem]?.[addSubj];
    if (!data) return;
    setBacklogs(prev => [...prev, { semester: addSem, subject: addSubj, data }]);
    setAddSubj("");
    setAddSem("");
  };

  const removeBacklog = (index: number) => {
    setBacklogs(prev => prev.filter((_, i) => i !== index));
  };

  const toggleSubject = (id: string) => {
    setExpandedSubjects((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
          Materials
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          {branch} • {currentSemester} Sem — Instantly access your current semester subjects.
        </p>
      </header>

      {/* Subject Count */}
      <div className="flex items-center justify-between px-0.5">
        <h3 className="font-semibold text-slate-700 flex items-center gap-2 text-sm">
          <BookOpen className="w-4 h-4" />
          Current Subjects
        </h3>
        <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
          {currentSemSubjects.length} subjects
        </span>
      </div>

      {/* Subjects List */}
      <div className="space-y-3">
        {importantLink && (
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/60 rounded-xl shadow-sm mb-4 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-bl-[100px] -mr-6 -mt-6 pointer-events-none" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-[10px] bg-white text-[1.25rem] shadow-sm border border-orange-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                🔥
              </div>
              <div>
                <h3 className="text-[1.0625rem] md:text-[15px] font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  Important Questions
                  <span className="px-1.5 py-0.5 rounded sm:bg-red-100/80 text-[9px] font-bold text-red-700 tracking-[0.1em] uppercase hidden sm:inline-block">Must Read</span>
                </h3>
                <p className="text-xs font-medium text-orange-700 mt-0.5">
                  High priority exam questions
                </p>
              </div>
            </div>
            <button 
              onClick={() => window.open(importantLink as string, "_blank")}
              className="relative z-10 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-all shadow-[0_2px_8px_rgba(15,23,42,0.15)] active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        )}
        {allSubjects.map((subject) => {
          const isExpanded = expandedSubjects.includes(subject.id);

          return (
            <div
              key={subject.id}
              className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all duration-200 relative ${
                isExpanded
                  ? subject.isBacklog ? "border-amber-300 shadow-md" : "border-slate-300 shadow-md"
                  : subject.isBacklog ? "border-amber-200 hover:shadow-md hover:border-amber-300" : "border-slate-200 hover:shadow-md hover:border-slate-300"
              }`}
            >
              {subject.isBacklog && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-bl-full pointer-events-none" />
              )}
              {/* Subject Header — Expandable */}
              <div className="flex items-center">
                 <button
                   onClick={() => toggleSubject(subject.id)}
                   className="flex-1 flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors text-left"
                 >
                   <div className="flex items-center gap-3 flex-1 min-w-0">
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                       isExpanded 
                         ? subject.isBacklog ? "bg-amber-100 text-amber-600" : "bg-slate-900 text-white" 
                         : subject.isBacklog ? "bg-amber-50 text-amber-500" : "bg-slate-100 text-slate-500"
                     }`}>
                       {subject.isBacklog ? <AlertCircle className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                     </div>
                     <div className="min-w-0 flex flex-col items-start gap-1">
                       <h4 className="font-semibold text-slate-900 md:text-[15px] truncate flex items-center gap-2">
                         {subject.name}
                         {subject.isBacklog && (
                           <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded tracking-widest uppercase mb-px">
                             Backlog
                           </span>
                         )}
                       </h4>
                       <p className="text-xs text-slate-400 mt-0.5 flex gap-1 items-center">
                         {subject.isBacklog ? `${subject.semester} Sem` : 'All materials available'}
                       </p>
                     </div>
                   </div>
                   <div
                     className={`p-1.5 rounded-lg transition-all ml-2 flex shrink-0 ${
                       isExpanded
                         ? "bg-slate-900 text-white"
                         : "bg-slate-100 text-slate-400"
                     }`}
                   >
                     {isExpanded ? (
                       <ChevronUp className="w-4 h-4" />
                     ) : (
                       <ChevronDown className="w-4 h-4" />
                     )}
                   </div>
                 </button>
                 {subject.isBacklog && (
                   <button 
                     onClick={() => removeBacklog(subject.backlogIndex!)}
                     className="p-4 text-slate-400 hover:text-red-500 transition-colors shrink-0"
                     title="Remove backlog"
                   >
                      <Trash2 className="w-4 h-4" />
                   </button>
                 )}
              </div>

              {/* Units — Expandable Content */}
              <div
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                  isExpanded
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="p-4 border-t border-slate-100 bg-slate-50/60">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {Object.keys(subject.data || {}).map((unitName) => (
                        <div key={unitName} className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition-all group">
                          <h3 className="font-medium text-slate-800 text-[15px] flex items-center gap-2">
                            <FileText className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                            {unitName}
                          </h3>

                          <div className="flex gap-3 mt-4 pt-3 border-t border-slate-100">
                            <button 
                              onClick={(e) => { e.stopPropagation(); window.open(subject.data[unitName], "_blank"); }}
                              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-sm font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors rounded-lg"
                            >
                              Download
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {allSubjects.length === 0 && (
          <div className="text-center py-16 border border-dashed border-slate-200 rounded-xl bg-slate-50 text-slate-500">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="font-medium">No subjects found for {currentSemester}.</p>
            <p className="text-xs mt-1 text-slate-400">
              Materials for your semester might not be available yet.
            </p>
          </div>
        )}
      </div>

      {/* Add Backlog Section */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-4 text-sm">
          <AlertCircle className="w-4 h-4 text-amber-500" />
          Add Backlog Subjects
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <select 
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300"
            value={addSem}
            onChange={(e) => {
              setAddSem(e.target.value);
              setAddSubj("");
            }}
          >
            <option value="">Select Semester...</option>
            {availableSemesters.map(sem => (
              <option key={sem} value={sem}>{sem} Sem</option>
            ))}
          </select>

          <select 
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 disabled:opacity-50 disabled:bg-slate-50"
            value={addSubj}
            onChange={(e) => setAddSubj(e.target.value)}
            disabled={!addSem}
          >
            <option value="">Select Subject...</option>
            {availableSubjects.map(subj => (
              <option key={subj} value={subj}>{subj}</option>
            ))}
          </select>

          <Button 
            onClick={handleAddBacklog}
            disabled={!addSem || !addSubj}
            className="bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 shadow-sm rounded-xl py-2.5 shrink-0"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Add Subject
          </Button>
        </div>
      </div>

    </div>
  );
}

