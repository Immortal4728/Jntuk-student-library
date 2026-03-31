import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  AlertCircle,
  ArrowRight,
  Sparkles,
  CheckCircle,
  GraduationCap,
  Target,
  ChevronRight,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { getDisplaySemester } from "../lib/utils";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  // Dynamically map from real AuthContext profile storage
  const userBacklogs = (profile.backlogs || []).map((subject, idx) => ({
    id: `b${idx}`,
    subject,
  }));

  // Current hour for greeting
  const [greeting, setGreeting] = useState("");
  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(
      hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"
    );
  }, []);

  const firstName = profile.name
    ? profile.name.split(" ")[0]
    : user?.email?.split("@")[0] || "Student";

  // Progress ring calculation (for percentage)
  const percentage = profile.percentage || 0;
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] md:min-h-0 bg-[#0f172a] -m-4 p-4 md:m-0 md:rounded-[2.5rem] md:p-8 md:shadow-2xl md:ring-1 md:ring-slate-800 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans pb-24 md:pb-8 relative overflow-hidden flex flex-col">
      {/* Premium Background ambient glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* ── 1. HERO STRIP (Top — full width) ── */}
      <header className="w-full bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>

        <div className="relative z-10">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-1.5 flex items-center gap-2">
            {greeting}, {firstName} <span className="text-xl">👋</span>
          </h1>
          <div
            className="text-sm font-medium flex items-center gap-2 group cursor-pointer w-fit"
            onClick={() => userBacklogs.length > 0 && navigate("/dashboard/tracker")}
          >
            {userBacklogs.length > 0 ? (
              <>
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-400 group-hover:text-red-300 transition-colors">
                  {userBacklogs.length} backlog{userBacklogs.length > 1 ? "s" : ""} need attention
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity -ml-1 group-hover:translate-x-1" />
              </>
            ) : (
              <>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-emerald-300">
                  You're on track this semester
                </span>
              </>
            )}
          </div>
        </div>

        <div className="relative z-10 flex w-fit bg-slate-800/80 backdrop-blur-md border border-slate-700/50 px-3 py-1.5 rounded-full items-center gap-1.5 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider">
            {profile.branch} • {getDisplaySemester(profile.semester)} Sem
          </span>
        </div>
      </header>

      {/* ── 2. PRIMARY FOCUS CARD (MOST IMPORTANT) ── */}
      {userBacklogs.length > 0 && (
        <div
          className="relative overflow-hidden rounded-[1.5rem] bg-white/95 backdrop-blur-xl border border-red-200/50 shadow-[0_8px_30px_rgb(220,38,38,0.15)] p-6 md:p-8 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group"
          onClick={() => navigate("/dashboard/materials")}
        >
          {/* Subtle pulse animation border effect */}
          <div
            className="absolute inset-0 border-2 border-red-400/20 rounded-[1.5rem] animate-pulse pointer-events-none"
            style={{ animationDuration: "3s" }}
          ></div>
          {/* background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none" />

          <div className="flex justify-between items-center mb-4 relative z-10">
            <div className="flex items-center gap-2 text-red-600 font-bold uppercase tracking-widest text-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              Focus Now
            </div>

            <div className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold font-mono">
              PRIORITY
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 tracking-tight leading-tight relative z-10">
            {userBacklogs[0].subject}
          </h2>

          <Button className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-600/20 transition-all active:scale-95 group-hover:shadow-red-600/40 text-sm h-12 px-6 relative z-10 border-0">
            Study Now{" "}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform" />
          </Button>
        </div>
      )}

      {/* ── 3. METRICS GRID (Secondary) ── */}
      <div className="grid grid-cols-2 gap-4">
        {/* Subjects Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-[1.25rem] shadow-[0_4px_20px_rgb(0,0,0,0.1)] border border-slate-700/20 p-5 hover:scale-[1.03] transition-all duration-300 active:scale-95 group relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-8 -mt-8 transition-transform group-hover:scale-150" />
          <div className="w-10 h-10 bg-blue-50/80 text-blue-600 rounded-xl flex items-center justify-center mb-4 relative z-10">
            <BookOpen className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
          </div>
          <div className="relative z-10">
            <p className="text-3xl font-black text-slate-900 tracking-tight">5</p>
            <p className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-widest">
              Subjects
            </p>
          </div>
        </div>

        {/* Backlogs Card */}
        <div
          className={`backdrop-blur-md rounded-[1.25rem] shadow-[0_4px_20px_rgb(0,0,0,0.1)] p-5 hover:scale-[1.03] transition-all duration-300 active:scale-95 group relative overflow-hidden flex flex-col justify-between border ${userBacklogs.length > 0
              ? "bg-red-50/95 border-red-200/50"
              : "bg-white/95 border-slate-700/20"
            }`}
        >
          {userBacklogs.length > 0 && (
            <div className="absolute inset-0 bg-red-500/5 pointer-events-none" />
          )}
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl -mr-8 -mt-8 transition-transform group-hover:scale-150" />

          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 relative z-10 ${userBacklogs.length > 0
                ? "bg-red-100 text-red-600"
                : "bg-emerald-50 text-emerald-600"
              }`}
          >
            {userBacklogs.length > 0 ? (
              <AlertCircle className="w-5 h-5 group-hover:animate-bounce" />
            ) : (
              <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
            )}
          </div>
          <div className="relative z-10">
            <p className="text-3xl font-black text-slate-900 tracking-tight">
              {userBacklogs.length}
            </p>
            <p className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-widest">
              Backlogs
            </p>
          </div>
        </div>

        {/* CGPA Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-[1.25rem] shadow-[0_4px_20px_rgb(0,0,0,0.1)] border border-slate-700/20 p-5 hover:scale-[1.03] transition-all duration-300 active:scale-95 group relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/10 rounded-full blur-2xl -mr-8 -mt-8 transition-transform group-hover:scale-150" />
          <div className="w-10 h-10 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center mb-4 relative z-10">
            <GraduationCap className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <div className="relative z-10">
            <p className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              {profile.cgpa ? profile.cgpa.toString() : "-"}
            </p>
            <p className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-widest">
              CGPA
            </p>
          </div>
        </div>

        {/* Percentage Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-[1.25rem] shadow-[0_4px_20px_rgb(0,0,0,0.1)] border border-slate-700/20 p-5 hover:scale-[1.03] transition-all duration-300 active:scale-95 group relative overflow-hidden flex flex-col justify-between items-start">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl -mr-8 -mt-8 transition-transform group-hover:scale-150" />
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-3 relative z-10">
            <Target className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          </div>

          <div className="flex items-center gap-3 w-full relative z-10 mt-1">
            <div className="relative w-11 h-11 flex-shrink-0 group-hover:scale-105 transition-transform">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 40 40">
                <circle className="text-slate-200" strokeWidth="4" stroke="currentColor" fill="transparent" r={radius} cx="20" cy="20" />
                <circle className="text-indigo-500 transition-all duration-1000 ease-out" strokeWidth="4" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" stroke="currentColor" fill="transparent" r={radius} cx="20" cy="20" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-black text-slate-800">
                  {percentage ? `${Math.round(percentage)}%` : "-"}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                Score
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. BACKLOG DETAILS STRIP ── */}
      {userBacklogs.length > 0 && (
        <div className="flex flex-col gap-3 mt-4 relative z-10 flex-1">
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">
            Action Required
          </h3>
          <div className="space-y-3">
            {userBacklogs.map((bl) => (
              <div
                key={bl.id}
                onClick={() => navigate("/dashboard/materials")}
                className="flex items-center justify-between bg-white/5 backdrop-blur-md rounded-2xl p-4 shadow-[0_4px_20px_rgb(0,0,0,0.2)] border border-slate-700/50 hover:border-slate-600 hover:bg-white/10 active:scale-[0.98] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_12px_rgb(239,68,68,0.8)]" />
                  <span className="font-bold text-white text-sm sm:text-base tracking-tight">
                    {bl.subject}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-white transition-colors uppercase tracking-widest">
                    Open
                  </span>
                  <div className="w-7 h-7 bg-slate-800 rounded-full flex items-center justify-center group-hover:bg-slate-700 group-hover:scale-110 transition-all border border-slate-700">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
