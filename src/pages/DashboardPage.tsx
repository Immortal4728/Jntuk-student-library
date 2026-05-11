import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import { 
  Semester, 
  calcCGPA, 
  cgpaToPercentage,
  totalCreditsAll,
  totalBacklogs,
  calcSGPA,
  maxSGPA,
} from "../lib/academicUtils";
import { 
  GraduationCap, AlertTriangle, BarChart3, 
  TrendingUp, Sparkles, Target, 
  Award, Brain 
} from "lucide-react";

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("");
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [chartMode, setChartMode] = useState<"sgpa" | "cgpa">("sgpa");
  const [loading, setLoading] = useState(true);
  const [animatedCgpa, setAnimatedCgpa] = useState(0);
  const [animatedPercent, setAnimatedPercent] = useState(0);

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(
      hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"
    );

    if (user?.uid) {
      const docRef = doc(db, "users", user.uid, "academics", "data");
      const unsubscribe = onSnapshot(
        docRef,
        (snap) => {
          if (snap.exists() && snap.data().semesters) {
            setSemesters(snap.data().semesters);
          } else {
            setSemesters([]);
          }
          setLoading(false);
        },
        (error) => {
          console.error("Failed to fetch academic data", error);
          setLoading(false);
        }
      );
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Animate counters
  const cgpaValue = calcCGPA(semesters);
  const percentValue = cgpaValue > 0 ? cgpaToPercentage(cgpaValue) : 0;

  useEffect(() => {
    if (loading) return;
    const duration = 1200;
    const steps = 40;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedCgpa(cgpaValue * eased);
      setAnimatedPercent(percentValue * eased);
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, [cgpaValue, percentValue, loading]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-44 rounded-2xl bg-white/[0.03]" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-28 rounded-2xl bg-white/[0.03]" />)}
        </div>
        <div className="h-40 rounded-2xl bg-white/[0.03]" />
      </div>
    );
  }

  const firstName = profile.name
    ? profile.name.split(" ")[0]
    : user?.email?.split("@")[0] || "Student";

  const cgpa = cgpaValue > 0 ? cgpaValue.toFixed(2) : "0.00";
  const percentage = percentValue > 0 ? percentValue.toFixed(2) : "0.00";
  const semestersCompleted = semesters.length;
  const activeBacklogs = totalBacklogs(semesters);
  const completedCredits = totalCreditsAll(semesters);
  const TOTAL_DEGREE_CREDITS = 160;
  const progressPercentage = Math.min((completedCredits / TOTAL_DEGREE_CREDITS) * 100, 100);
  const bestSgpa = maxSGPA(semesters);
  const lastSemSgpa = semesters.length > 0 ? calcSGPA(semesters[semesters.length - 1].subjects) : 0;

  // Smart Analytics
  const insights: string[] = [];
  let bestSem = "";
  let highestSgpa = 0;
  let trendMsg = "";

  if (cgpaValue <= 0) {
    insights.push("⚡ Add your first semester to unlock personalized insights.");
  } else {
    // Calculate best semester
    semesters.forEach(sem => {
      const sgpa = calcSGPA(sem.subjects);
      if (sgpa > highestSgpa) {
        highestSgpa = sgpa;
        bestSem = sem.semId;
      }
    });

    if (semesters.length >= 2) {
      const prevSgpa = calcSGPA(semesters[semesters.length - 2].subjects);
      if (lastSemSgpa > prevSgpa) {
        trendMsg = `📈 SGPA improved by ${(lastSemSgpa - prevSgpa).toFixed(2)} pts!`;
      } else if (lastSemSgpa < prevSgpa) {
        trendMsg = `📉 SGPA dropped by ${(prevSgpa - lastSemSgpa).toFixed(2)} pts.`;
      } else {
        trendMsg = `⚖️ Maintained steady SGPA.`;
      }
    }

    if (cgpaValue < 7.5 && cgpaValue > 0) {
      const needed = ((7.5 * (completedCredits + 20)) - (cgpaValue * completedCredits)) / 20;
      if (needed <= 10 && needed > 0) insights.push(`🎯 Need ${needed.toFixed(1)} SGPA next sem to reach 7.5 CGPA`);
    }
    if (activeBacklogs > 0) insights.push(`⚠️ ${activeBacklogs} active backlog${activeBacklogs > 1 ? 's' : ''} — focus on clearing these.`);
    if (progressPercentage > 50) insights.push(`🚀 You're ${progressPercentage.toFixed(0)}% through your degree!`);
    
    if (cgpaValue >= 8.5) insights.push("🔥 Top tier performance. Keep it up!");
    else if (cgpaValue >= 7) insights.push("👍 Solid performance. Push for distinction.");
  }

  const quotes = [
    "Discipline is the bridge between goals and accomplishment.",
    "Success is the sum of small efforts, repeated daily.",
    "Your academic journey is a marathon, not a sprint.",
    "Excellence is not a skill, it's an attitude.",
  ];
  const todayQuote = quotes[new Date().getDay() % quotes.length];

  const chartData = semesters.map((sem, index) => {
    // For CGPA trend, we calculate the CGPA up to this specific semester
    const semsUpToNow = semesters.slice(0, index + 1);
    return {
      semId: sem.semId,
      sgpa: calcSGPA(sem.subjects),
      cgpa: calcCGPA(semsUpToNow)
    };
  });

  return (
    <div className="min-h-full pb-24 md:pb-8 flex flex-col gap-6 -m-4 md:m-0 p-4 md:p-0">
      {/* ── HERO SECTION ── */}
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl p-6 md:p-8 bg-gradient-to-br from-navy-700/80 via-navy-600/50 to-violet-accent/10 border border-white/[0.06]" style={{animationDelay:'0.1s'}}>
        {/* Ambient orbs */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-violet-600/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-pink-500/8 rounded-full blur-[60px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <p className="text-violet-400 text-xs font-bold tracking-widest uppercase mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Academic Command Center
            </p>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
              {greeting}, {firstName} 👋
            </h1>
            <p className="text-slate-400 text-sm mt-2 max-w-md leading-relaxed italic">
              "{todayQuote}"
            </p>
          </div>

          {/* CGPA Hero Display */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-violet-600/20 to-purple-600/10 border border-violet-500/20 flex flex-col items-center justify-center shadow-glow">
                <span className="text-3xl md:text-4xl font-display font-black text-white counter-value tracking-tight">
                  {animatedCgpa.toFixed(2)}
                </span>
                <span className="text-[10px] font-bold text-violet-400 tracking-widest uppercase mt-0.5">CGPA</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse-dot" />
            </div>
            <div className="hidden md:flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300 font-medium">{animatedPercent.toFixed(1)}%</span>
                <span className="text-slate-600 text-xs">overall</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-slate-300 font-medium">{bestSgpa.toFixed(2)}</span>
                <span className="text-slate-600 text-xs">best SGPA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative z-10 mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">Degree Progress</span>
            <span className="text-xs font-bold text-violet-400">{completedCredits} / {TOTAL_DEGREE_CREDITS} Credits</span>
          </div>
          <div className="w-full bg-white/[0.04] h-2.5 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500 transition-all duration-1000 ease-out progress-bar-animated"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-600 mt-1.5 font-medium">
            {progressPercentage.toFixed(1)}% of your B.Tech journey completed
          </p>
        </div>
      </div>

      {/* ── STATS GRID ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: "Current CGPA", value: cgpa, icon: GraduationCap, color: "text-violet-400", bg: "from-violet-600/10 to-violet-600/5" },
          { label: "Percentage", value: `${percentage}%`, icon: TrendingUp, color: "text-emerald-400", bg: "from-emerald-600/10 to-emerald-600/5" },
          { label: "Semesters", value: String(semestersCompleted), icon: BarChart3, color: "text-blue-400", bg: "from-blue-600/10 to-blue-600/5" },
          { label: "Backlogs", value: String(activeBacklogs), icon: AlertTriangle, color: activeBacklogs > 0 ? "text-amber-400" : "text-emerald-400", bg: activeBacklogs > 0 ? "from-amber-600/10 to-amber-600/5" : "from-emerald-600/10 to-emerald-600/5" },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="glass-card p-4 md:p-5 group cursor-default"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
              <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
            </div>
            <p className="text-[10px] font-bold text-slate-600 tracking-wider uppercase mb-0.5">{stat.label}</p>
            <h2 className="text-2xl md:text-3xl font-display font-black text-white tracking-tight counter-value">{stat.value}</h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── INSIGHTS SECTION ── */}
        <div className="glass-card p-5 md:p-6 relative overflow-hidden lg:col-span-1 flex flex-col">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-600/5 rounded-full blur-[50px] pointer-events-none" />
          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600/20 to-purple-600/10 flex items-center justify-center">
                <Brain className="w-4 h-4 text-violet-500 dark:text-violet-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">Smart Analytics</h3>
                <p className="text-[10px] text-slate-600">Personalized insights</p>
              </div>
            </div>

            {/* Top Highlights */}
            {semesters.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <p className="text-[10px] font-bold text-slate-500 tracking-wider uppercase mb-1">Best Sem</p>
                  <p className="text-lg font-display font-black text-violet-400">{bestSem}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <p className="text-[10px] font-bold text-slate-500 tracking-wider uppercase mb-1">Highest SGPA</p>
                  <p className="text-lg font-display font-black text-violet-400">{highestSgpa.toFixed(2)}</p>
                </div>
              </div>
            )}

            <div className="space-y-2.5">
              {trendMsg && (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-all duration-300">
                  <span className="text-base leading-none mt-0.5">{trendMsg.slice(0, 2)}</span>
                  <p className="text-[13px] font-medium text-slate-300 leading-relaxed">{trendMsg.slice(3)}</p>
                </div>
              )}
              {insights.map((insight, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-all duration-300"
                >
                  <span className="text-base leading-none mt-0.5">{insight.slice(0, 2)}</span>
                  <p className="text-[13px] font-medium text-slate-300 leading-relaxed">{insight.slice(3)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SEMESTER PERFORMANCE CHART ── */}
        <div className="glass-card p-5 md:p-6 lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-violet-400" />
              Performance Trend
            </h3>
            
            {/* Toggle Switch */}
            <div className="flex items-center bg-white/[0.04] rounded-lg p-1 border border-white/[0.05]">
              <button 
                onClick={() => setChartMode('sgpa')}
                className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md transition-all ${chartMode === 'sgpa' ? 'bg-violet-600 text-white shadow-glow-sm' : 'text-slate-500 hover:text-white hover:bg-white/[0.04]'}`}
              >
                SGPA
              </button>
              <button 
                onClick={() => setChartMode('cgpa')}
                className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md transition-all ${chartMode === 'cgpa' ? 'bg-violet-600 text-white shadow-glow-sm' : 'text-slate-500 hover:text-white hover:bg-white/[0.04]'}`}
              >
                CGPA
              </button>
            </div>
          </div>
          
          {semesters.length > 0 ? (
            <div className="flex-1 flex items-stretch gap-3 md:gap-6 min-h-[160px] pt-4 relative group/chart">
              {/* Background grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pb-8 pointer-events-none">
                {[10, 8, 6, 4].map(val => (
                  <div key={val} className="w-full border-t border-dashed border-white/[0.05] relative flex items-center">
                    <span className="absolute -left-1 -translate-y-1/2 text-[9px] text-slate-400 font-medium bg-[#1e2338] px-1 z-10 light-bg-white">{val}</span>
                  </div>
                ))}
              </div>

              {chartData.map((data, i) => {
                const value = chartMode === 'sgpa' ? data.sgpa : data.cgpa;
                const height = value > 0 ? (value / 10) * 100 : 5;
                const isBest = chartMode === 'sgpa' 
                  ? (data.sgpa === highestSgpa && highestSgpa > 0)
                  : (data.cgpa === cgpaValue && cgpaValue > 0 && i === chartData.length - 1);
                
                return (
                  <div key={data.semId} className="flex-1 flex flex-col items-center justify-end gap-2 group/bar relative z-10">
                    {/* Tooltip */}
                    <div className="absolute -top-10 opacity-0 group-hover/bar:opacity-100 transition-opacity duration-200 pointer-events-none flex flex-col items-center">
                      <span className="bg-white text-slate-900 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xl whitespace-nowrap">
                        {value.toFixed(2)} {chartMode.toUpperCase()}
                      </span>
                      <div className="w-2 h-2 rotate-45 bg-white -mt-1" />
                    </div>

                    <div className="w-full relative flex-1 flex items-end">
                      <div
                        className={`w-full rounded-t-xl transition-all duration-700 ease-out group-hover/bar:opacity-100 
                          ${isBest 
                            ? 'bg-gradient-to-t from-violet-600 to-fuchsia-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] opacity-100' 
                            : 'bg-gradient-to-t from-navy-600 to-navy-500 opacity-60 group-hover/chart:opacity-40 hover:!opacity-100'
                          }`}
                        style={{ 
                          height: `${height}%`,
                          minHeight: '8px',
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    </div>
                    <span className={`text-[10px] font-bold tracking-wide transition-colors ${isBest ? 'text-violet-400' : 'text-slate-500'}`}>
                      {data.semId}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center min-h-[160px] border border-dashed border-white/[0.1] rounded-xl">
              <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                <Target className="w-4 h-4" />
                Add semesters to view your performance trend
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
