import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import { 
  Semester, 
  calcCGPA, 
  totalCreditsAll,
  totalBacklogs
} from "../lib/academicUtils";
import { Plus, BookOpen, PenTool, LayoutDashboard } from "lucide-react";

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("");
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return null;

  const firstName = profile.name
    ? profile.name.split(" ")[0]
    : user?.email?.split("@")[0] || "Student";
    
  // Tracker Calculations
  const cgpaValue = calcCGPA(semesters);
  const cgpa = cgpaValue > 0 ? cgpaValue.toFixed(2) : "0.00";
  const percentage = cgpaValue > 0 ? (cgpaValue * 9.5).toFixed(1) : "0";
  const semestersCompleted = semesters.length;
  const activeBacklogs = totalBacklogs(semesters);
  
  // Progress Computations
  const completedCredits = totalCreditsAll(semesters);
  const TOTAL_DEGREE_CREDITS = 160;
  const progressPercentage = Math.min((completedCredits / TOTAL_DEGREE_CREDITS) * 100, 100);

  // Smart Insight Box Logic
  let insightMessage = "⚡ Add your first semester to unlock insights.";
  if (cgpaValue > 0) {
    if (cgpaValue < 7) {
      insightMessage = "⚠️ You need to push harder this semester.";
    } else if (cgpaValue >= 7 && cgpaValue <= 8) {
      insightMessage = "👍 You're doing good. Aim higher.";
    } else {
      insightMessage = "🔥 Strong performance. Maintain consistency.";
    }
  }

  // Activity Logic
  const lastSem = semesters.length > 0 ? semesters[semesters.length - 1] : null;

  return (
    <div className="bg-[#f8fafc] min-h-full font-sans pb-24 md:pb-8 flex flex-col p-6 md:p-8 md:m-0 -m-4 md:rounded-[2.5rem]">
      {/* 1. Greeting Section */}
      <div className="mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
          {greeting}, {firstName} 👋
        </h1>
        <p className="text-slate-500 text-[15px] mt-1.5 font-medium">
          Stay consistent. You're building something.
        </p>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-5xl animate-in fade-in slide-in-from-bottom-3 duration-700">
        
        {/* 2. Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
            <p className="text-[13px] font-bold text-slate-400 tracking-wider uppercase mb-1">Current CGPA</p>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">{cgpa}</h2>
          </div>
          {/* Card 2 */}
          <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
            <p className="text-[13px] font-bold text-slate-400 tracking-wider uppercase mb-1">Overall Percentage</p>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">{percentage}%</h2>
          </div>
          {/* Card 3 */}
          <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
            <p className="text-[13px] font-bold text-slate-400 tracking-wider uppercase mb-1">Semesters Done</p>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">{semestersCompleted}</h2>
          </div>
        </div>

        {/* 3. Action Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button 
            onClick={() => navigate("/dashboard/tracker")}
            className="flex items-center justify-center gap-2 p-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-sm hover:bg-slate-800 transition-colors active:scale-[0.98]"
          >
            <Plus size={18} strokeWidth={2.5} />
            Add Semester
          </button>
          <button 
            onClick={() => navigate("/dashboard/materials")}
            className="flex items-center justify-center gap-2 p-3.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors active:scale-[0.98]"
          >
            <BookOpen size={18} strokeWidth={2.5} className="text-slate-400" />
            View Materials
          </button>
          <button 
            onClick={() => navigate("/dashboard/tracker")}
            className="flex items-center justify-center gap-2 p-3.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors active:scale-[0.98]"
          >
            <PenTool size={18} strokeWidth={2.5} className="text-slate-400" />
            Update Backlogs
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 flex flex-col gap-6">
            {/* 4. Progress Section */}
            <div className="p-6 md:p-8 bg-white border border-slate-100 rounded-[1.5rem] shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">Academic Progress</h3>
                  {activeBacklogs > 0 && (
                    <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2.5 py-1 rounded-md uppercase tracking-wide">
                      {activeBacklogs} Active Backlog{activeBacklogs > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  {completedCredits} / {TOTAL_DEGREE_CREDITS} Credits
                </span>
              </div>
              
              <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden">
                 <div 
                   className="bg-indigo-600 h-full rounded-full transition-all duration-1000 ease-out" 
                   style={{ width: `${progressPercentage}%` }} 
                 />
              </div>
              <p className="text-sm font-medium text-slate-500 mt-3">
                {progressPercentage.toFixed(1)}% of your B.Tech journey completed
              </p>
            </div>

            {/* 5. Smart Insight Box */}
            <div className="p-6 bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-[1.5rem] shadow-sm flex items-start gap-4">
              <div>
                <h4 className="text-[13px] font-bold text-slate-400 tracking-wider uppercase mb-1.5">Insight</h4>
                <p className="text-[1.0625rem] font-semibold text-slate-800 leading-snug">
                  {insightMessage}
                </p>
              </div>
            </div>
          </div>
          
          {/* 6. Recent Activity */}
          <div className="lg:col-span-2">
            <div className="p-6 md:p-8 bg-white border border-slate-100 rounded-[1.5rem] shadow-[0_4px_20px_rgba(15,23,42,0.03)] h-full">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-5">Recent Activity</h3>
              
              {semestersCompleted > 0 ? (
                <div className="flex flex-col gap-5">
                  <div className="flex gap-4">
                     <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <LayoutDashboard size={18} strokeWidth={2.5} />
                     </div>
                     <div>
                        <h4 className="text-[15px] font-bold text-slate-900 tracking-tight">{lastSem?.semId} Added</h4>
                        <p className="text-sm font-medium text-slate-500 mt-0.5">Updated your academic record</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <PenTool size={18} strokeWidth={2.5} />
                     </div>
                     <div>
                        <h4 className="text-[15px] font-bold text-slate-900 tracking-tight">CGPA Re-calculated</h4>
                        <p className="text-sm font-medium text-slate-500 mt-0.5">Currently standing at {cgpa}</p>
                     </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                     <LayoutDashboard size={20} className="text-slate-300" />
                  </div>
                  <p className="text-sm font-semibold text-slate-500">No activity yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
