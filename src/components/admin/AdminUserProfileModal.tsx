import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, BookOpen, GraduationCap, Building2, 
  CalendarDays, Shield, Activity, AlertCircle, 
  CheckCircle2, Clock, LineChart, Award, AlertTriangle, ShieldCheck
} from "lucide-react";
import { getDisplaySemester } from "../../lib/utils";
import { UserAvatar } from "../ui/UserAvatar";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { calcSGPA } from "../../lib/academicUtils";

interface AdminUserProfileModalProps {
  user: any | null;
  onClose: () => void;
}

export default function AdminUserProfileModal({ user, onClose }: AdminUserProfileModalProps) {
  const [academicsData, setAcademicsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const fetchAcademics = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "users", user.id, "academics", "data");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAcademicsData(docSnap.data());
        } else {
          setAcademicsData(null);
        }
      } catch (err) {
        console.error("Failed to fetch academics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAcademics();
  }, [user]);

  if (!user) return null;

  const semesters = academicsData?.semesters || [];
  const sgpas = semesters.map((sem: any) => calcSGPA(sem.subjects));
  const hasAcademics = sgpas.length > 0;
  const maxSgpa = hasAcademics ? Math.max(...sgpas).toFixed(2) : "N/A";
  const minSgpa = hasAcademics ? Math.min(...sgpas).toFixed(2) : "N/A";
  const avgSgpa = hasAcademics ? (sgpas.reduce((a:number, b:number) => a + b, 0) / sgpas.length).toFixed(2) : "N/A";

  const hasBacklogs = user.backlogs && user.backlogs.length > 0;
  const isHighPerformer = user.cgpa && Number(user.cgpa) >= 8.5;
  const isAdmin = user.email === "rishichowdary2099@gmail.com";
  
  let joinedDate = "Date unavailable";
  if (user.createdAt?.seconds) {
    joinedDate = new Date(user.createdAt.seconds * 1000).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } else if (user.metadata?.creationTime) {
    joinedDate = new Date(user.metadata.creationTime).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  let lastActive = "Unavailable";
  if (user.lastLoginAt?.seconds) {
    lastActive = new Date(user.lastLoginAt.seconds * 1000).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } else if (user.metadata?.lastSignInTime) {
    lastActive = new Date(user.metadata.lastSignInTime).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  const percentage = user.percentage || (user.cgpa ? (Number(user.cgpa) * 9.5).toFixed(1) : "Not Available");

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full flex items-center justify-center transition-colors"
          >
            <X size={20} />
          </button>

          {/* LEFT SIDEBAR */}
          <div className="w-full md:w-[340px] shrink-0 bg-slate-50 border-r border-slate-200/60 p-8 overflow-y-auto custom-scrollbar">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="relative mb-4">
                <UserAvatar
                  photoURL={user.photoURL}
                  name={user.name || user.email}
                  className="w-24 h-24 shadow-md border-4 border-white"
                />
                {isAdmin && (
                  <div className="absolute -bottom-2 -right-2 bg-amber-100 text-amber-600 p-1.5 rounded-full border-2 border-white shadow-sm" title="Admin">
                    <ShieldCheck size={16} />
                  </div>
                )}
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight break-words w-full">{user.name || "Anonymous User"}</h2>
              <p className="text-sm font-medium text-slate-500 mt-0.5 break-words w-full">{user.email || "No Email"}</p>
              
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                </span>
                {isAdmin ? (
                  <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">Admin</span>
                ) : (
                  <span className="px-2.5 py-1 rounded-md bg-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-wider">Regular User</span>
                )}
                {isHighPerformer && (
                  <span className="px-2.5 py-1 rounded-md bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wider">High Performer</span>
                )}
                {hasBacklogs && (
                  <span className="px-2.5 py-1 rounded-md bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider">Backlogs</span>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Identity & Account</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CalendarDays size={16} className="text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Joined</p>
                      <p className="text-sm font-medium text-slate-900">{joinedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield size={16} className="text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Provider</p>
                      <p className="text-sm font-medium text-slate-900 capitalize">{user.photoURL?.includes('google') ? 'Google OAuth' : 'Email/Password'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Academic Base</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Building2 size={16} className="text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">College</p>
                      <p className="text-sm font-medium text-slate-900">{user.college || "Not Available"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <BookOpen size={16} className="text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Branch</p>
                      <p className="text-sm font-medium text-slate-900">{user.branch || "Not Available"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <GraduationCap size={16} className="text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Current Semester</p>
                      <p className="text-sm font-medium text-slate-900">{user.semester ? `${getDisplaySemester(user.semester)} Sem` : "Not Available"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar bg-white flex flex-col">
            
            {/* Top Grid - Core Academic Performance */}
            <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
              <Activity size={20} className="text-violet-500" /> Academic Performance
            </h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Overall CGPA</span>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black text-slate-900">{user.cgpa ? Number(user.cgpa).toFixed(2) : "N/A"}</span>
                  {user.cgpa && <span className="text-xs font-bold text-emerald-500 bg-emerald-100 px-1.5 py-0.5 rounded-md mb-1.5">/ 10</span>}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Percentage</span>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black text-slate-900">{percentage !== "Not Available" ? percentage : "N/A"}</span>
                  {percentage !== "Not Available" && <span className="text-xs font-bold text-slate-500 mb-1.5">%</span>}
                </div>
              </div>
              <div className={`rounded-2xl p-4 border flex flex-col justify-between ${hasBacklogs ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                <span className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${hasBacklogs ? 'text-red-600' : 'text-emerald-600'}`}>Backlogs</span>
                <div className="flex items-center gap-2">
                  <span className={`text-3xl font-black ${hasBacklogs ? 'text-red-600' : 'text-emerald-600'}`}>
                    {user.backlogs?.length || 0}
                  </span>
                  {hasBacklogs && <AlertCircle size={20} className="text-red-500" />}
                  {!hasBacklogs && <CheckCircle2 size={20} className="text-emerald-500" />}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Avg SGPA</span>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black text-slate-900">{avgSgpa}</span>
                </div>
              </div>
            </div>

            {/* Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
                <h4 className="text-[12px] font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-4">
                  <LineChart size={16} className="text-blue-500" /> SGPA Trend
                </h4>
                {loading ? (
                  <div className="h-56 flex items-center justify-center">
                    <p className="text-sm font-medium text-slate-400 animate-pulse">Loading data...</p>
                  </div>
                ) : hasAcademics ? (
                  <div className="h-56 relative flex flex-col pt-6">
                    {/* Y-axis grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pb-8 pointer-events-none z-0">
                      {[10, 8, 6, 4].map(val => (
                        <div key={val} className="w-full border-t border-dashed border-slate-200 relative flex items-center">
                          <span className="absolute -left-1 -translate-y-1/2 text-[9px] text-slate-400 font-bold bg-white px-1 z-10">{val}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex-1 flex items-end justify-between gap-2 md:gap-4 px-4 pb-2 z-10 relative">
                      {sgpas.map((val: number, i: number) => {
                        const isBest = val.toFixed(2) === maxSgpa;
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center justify-end h-full relative group">
                            {/* Tooltip */}
                            <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none flex flex-col items-center z-20">
                              <span className="bg-slate-800 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xl whitespace-nowrap">
                                {val.toFixed(2)} SGPA
                              </span>
                              <div className="w-2 h-2 rotate-45 bg-slate-800 -mt-1" />
                            </div>

                            <div className="w-full relative flex-1 flex items-end">
                              <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${(val / 10) * 100}%` }}
                                transition={{ delay: i * 0.1, duration: 0.8, type: "spring" }}
                                className={`w-full rounded-t-lg transition-all duration-300 ${
                                  isBest 
                                    ? 'bg-gradient-to-t from-violet-500 to-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)] opacity-100' 
                                    : 'bg-gradient-to-t from-slate-200 to-blue-300 opacity-60 group-hover:opacity-100'
                                }`}
                                style={{ minHeight: '8px' }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="flex items-center justify-between gap-2 md:gap-4 px-4 mt-2">
                      {semesters.map((sem: any, i: number) => (
                        <span key={i} className={`flex-1 text-center text-[10px] font-bold whitespace-nowrap overflow-hidden text-ellipsis ${sgpas[i].toFixed(2) === maxSgpa ? 'text-violet-600' : 'text-slate-400'}`} title={sem.semId}>
                          {sem.semId}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-56 flex items-center justify-center text-center">
                    <p className="text-sm font-medium text-slate-400">No semester performance<br/>data available.</p>
                  </div>
                )}
              </div>

              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
                <h4 className="text-[12px] font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-4">
                  <Award size={16} className="text-orange-500" /> Semester Insights
                </h4>
                {loading ? (
                  <div className="h-full flex items-center justify-center pb-8">
                     <p className="text-sm font-medium text-slate-400 animate-pulse">Loading insights...</p>
                  </div>
                ) : hasAcademics ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-slate-500">Highest SGPA</span>
                        <span className="text-slate-900">{maxSgpa}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-400 rounded-full" style={{ width: `${(Number(maxSgpa)/10)*100}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-slate-500">Lowest SGPA</span>
                        <span className="text-slate-900">{minSgpa}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-300 rounded-full" style={{ width: `${(Number(minSgpa)/10)*100}%` }} />
                      </div>
                    </div>
                    {hasBacklogs && (
                      <div className="p-3 bg-red-50 border border-red-100 rounded-xl mt-4 flex items-start gap-3">
                        <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-red-800">Requires Attention</p>
                          <p className="text-[11px] text-red-600 font-medium mt-0.5">Student has {user.backlogs.length} pending backlog(s).</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center pb-8 text-center">
                     <p className="text-sm font-medium text-slate-400">No academic insights<br/>available yet.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="mt-auto">
              <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                <Clock size={20} className="text-slate-700" /> Activity Timeline
              </h3>
              <div className="relative pl-6 space-y-6 before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-slate-100">
                <div className="relative">
                  <div className="absolute -left-6 w-[10px] h-[10px] rounded-full bg-violet-500 border-2 border-white shadow-sm mt-1" />
                  <p className="text-sm font-bold text-slate-900">Profile Accessed</p>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">Admin view initiated</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Just now</p>
                </div>
                {lastActive !== "Unavailable" && (
                  <div className="relative">
                    <div className="absolute -left-6 w-[10px] h-[10px] rounded-full bg-blue-500 border-2 border-white shadow-sm mt-1" />
                    <p className="text-sm font-bold text-slate-900">Last Signed In</p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">User authenticated successfully</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{lastActive}</p>
                  </div>
                )}
                {academicsData?.lastUpdated && (
                  <div className="relative">
                    <div className="absolute -left-6 w-[10px] h-[10px] rounded-full bg-emerald-500 border-2 border-white shadow-sm mt-1" />
                    <p className="text-sm font-bold text-slate-900">Academic Data Updated</p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">Records updated to {semesters.length} semesters</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                      {new Date(academicsData.lastUpdated.seconds * 1000).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                )}
                <div className="relative">
                  <div className="absolute -left-6 w-[10px] h-[10px] rounded-full bg-slate-300 border-2 border-white shadow-sm mt-1" />
                  <p className="text-sm font-bold text-slate-900">Account Created</p>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">Joined via {user.photoURL?.includes('google') ? 'Google' : 'Email'}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{joinedDate}</p>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
