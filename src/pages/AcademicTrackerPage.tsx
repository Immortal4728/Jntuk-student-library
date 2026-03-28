import { GraduationCap, TrendingUp, BookOpen, CheckCircle2 } from "lucide-react";

export default function AcademicTrackerPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
          Academic Tracker
        </h1>
        <p className="text-slate-500 mt-1">
          Track your academic progress and study patterns.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          {
            icon: BookOpen,
            label: "Subjects",
            value: "5",
            sub: "This semester",
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            icon: CheckCircle2,
            label: "Completed",
            value: "0",
            sub: "Chapters done",
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            icon: TrendingUp,
            label: "Progress",
            value: "0%",
            sub: "Overall",
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
          >
            <div
              className={`w-9 h-9 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}
            >
              <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Coming Soon */}
      <div className="bg-white rounded-xl border border-slate-200 p-12 flex flex-col items-center justify-center text-center shadow-sm">
        <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-blue-100 rounded-full flex items-center justify-center mb-5">
          <GraduationCap className="w-8 h-8 text-violet-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">
          Tracker coming soon
        </h3>
        <p className="text-slate-500 mt-1.5 text-sm max-w-sm">
          We're building a detailed progress tracker that will help you monitor
          your study progress across all subjects and semesters.
        </p>
      </div>
    </div>
  );
}
