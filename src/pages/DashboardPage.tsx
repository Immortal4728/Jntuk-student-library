import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  AlertCircle,
  Download,
  Activity,
  ArrowRight,
  LibraryBig,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "../components/ui/button";

// --- Types ---
type Backlog = {
  id: string;
  subject: string;
};

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  // --- Mock Data ---
  const [userBacklogs] = useState<Backlog[]>([
    { id: "b1", subject: "Data Structures" },
    { id: "b2", subject: "Operating Systems" },
  ]);

  // Recent materials preview (max 3)
  const recentMaterials = [
    { name: "Compiler Design", type: "Unit 3", time: "2 hours ago" },
    { name: "Machine Learning", type: "Important Questions", time: "Yesterday" },
    { name: "Web Technologies", type: "Unit 1", time: "2 days ago" },
  ];

  // Current hour for greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6">
      {/* ── Welcome Section ── */}
      <header className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 md:p-8 text-white">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              {profile.branch} • Semester {profile.semester.replace("S", "")}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {greeting},{" "}
            {profile.name || user?.email?.split("@")[0] || "Student"} 👋
          </h1>
          <p className="text-slate-400 mt-1.5 text-sm md:text-base max-w-lg">
            Here's your academic overview. Stay focused, stay ahead.
          </p>
        </div>
      </header>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            icon: BookOpen,
            label: "Subjects",
            value: "5",
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "border-blue-100",
          },
          {
            icon: AlertCircle,
            label: "Backlogs",
            value: String(userBacklogs.length),
            color: "text-amber-600",
            bg: "bg-amber-50",
            border: "border-amber-100",
          },
          {
            icon: Download,
            label: "Downloads",
            value: "12",
            color: "text-green-600",
            bg: "bg-green-50",
            border: "border-green-100",
          },
          {
            icon: Activity,
            label: "Progress",
            value: "34%",
            color: "text-violet-600",
            bg: "bg-violet-50",
            border: "border-violet-100",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`bg-white rounded-xl border ${stat.border} p-4 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div
              className={`w-9 h-9 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}
            >
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-slate-900 tracking-tight">
              {stat.value}
            </p>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Active Backlogs ── */}
      {userBacklogs.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-900 text-sm">
                  Active Backlogs
                </h3>
                <p className="text-[11px] text-amber-600/80">
                  {userBacklogs.length} subject{userBacklogs.length > 1 ? "s" : ""} need attention
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/dashboard/materials")}
              className="bg-white text-amber-900 border-amber-200 hover:bg-amber-100 h-8 self-start sm:self-auto text-xs font-semibold"
            >
              View Materials
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>
          <div className="space-y-2">
            {userBacklogs.map((bl) => (
              <div
                key={bl.id}
                className="flex items-center justify-between bg-white rounded-lg p-3 border border-amber-100/60 shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="font-medium text-slate-800 text-sm">
                    {bl.subject}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate("/dashboard/materials")}
                  className="h-7 text-amber-700 hover:bg-amber-100 hover:text-amber-900 text-xs px-2.5"
                >
                  Study →
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Recent Activity ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <h3 className="font-semibold text-slate-900 text-sm">
              Recent Activity
            </h3>
          </div>
          <button
            onClick={() => navigate("/dashboard/materials")}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {recentMaterials.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 hover:bg-slate-50/80 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                  <LibraryBig className="w-4 h-4 text-slate-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-400">{item.type}</p>
                </div>
              </div>
              <span className="text-xs text-slate-400 shrink-0 ml-3">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick Access CTA ── */}
      <button
        onClick={() => navigate("/dashboard/materials")}
        className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl p-5 flex items-center justify-between hover:from-slate-800 hover:to-slate-700 transition-all shadow-sm group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
            <LibraryBig className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="font-semibold">Browse Materials</p>
            <p className="text-xs text-slate-400">
              {profile.branch} • Semester {profile.semester.replace("S", "")}
            </p>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
