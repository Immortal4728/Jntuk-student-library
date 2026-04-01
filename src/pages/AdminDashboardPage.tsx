import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Users, BookOpen, LogOut, Trash2,
  Shield, Eye, Settings, Server, Database, Activity,
  ChevronRight, AlertTriangle, RefreshCcw, X, Loader2
} from "lucide-react";
import { db } from "../lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { materials } from "../data/materials";
import { normalizeSemester, getDisplaySemester } from "../lib/utils";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "materials", label: "Materials", icon: BookOpen },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function AdminDashboardPage() {
  const { user, signOut, isAdmin } = useAuth();
  const [tab, setTab] = useState("dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
            <Shield size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-500 text-sm">You do not have administrative privileges to view this control center.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-6 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans selection:bg-slate-900 selection:text-white">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col flex-shrink-0 relative z-10">
        <div className="p-6">
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-900 text-white rounded-md flex items-center justify-center">
              <Shield size={14} />
            </div>
            Admin Center
          </h1>
          <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Control Panel</p>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          {NAV.map(item => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active 
                    ? "bg-slate-900 text-white shadow-sm" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="px-3 py-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="truncate pr-2">
              <p className="text-xs font-bold text-slate-900 truncate">{user?.email}</p>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Administrator</p>
            </div>
            <button 
              onClick={signOut}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200 transition-colors shrink-0"
              title="Sign Out"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between sticky top-0 z-20">
           <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Shield size={16} className="text-slate-900" />
            Admin Center
          </h1>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-600">
            <LayoutDashboard size={20} />
          </button>
        </div>

        {isSidebarOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-2 flex flex-wrap gap-2 shadow-sm relative z-10 w-full animate-in slide-in-from-top-2">
            {NAV.map(item => (
              <button
                key={item.id}
                onClick={() => { setTab(item.id); setSidebarOpen(false); }}
                className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  tab === item.id 
                    ? "bg-slate-900 text-white" 
                    : "bg-slate-50 text-slate-600 border border-slate-200"
                }`}
              >
                <item.icon size={14} />
                {item.label}
              </button>
            ))}
          </div>
        )}

        <div className="p-5 md:p-10 max-w-6xl mx-auto w-full">
          {tab === "dashboard" && <DashboardTab setTab={setTab} />}
          {tab === "users" && <UsersTab />}
          {tab === "materials" && <MaterialsTab />}
          {tab === "settings" && <SettingsTab />}
        </div>
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════
function DashboardTab({ setTab }: { setTab: (t: string) => void }) {
  const [usersCount, setUsersCount] = useState<number | null>(null);

  useEffect(() => {
    getDocs(collection(db, "users")).then(snap => setUsersCount(snap.size)).catch(() => setUsersCount(0));
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Admin Control Center</h1>
        <p className="text-slate-500 text-sm md:text-base font-medium mt-1">Manage system and users efficiently</p>
      </header>

      {/* CORE STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <Users size={20} />
          </div>
          <p className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-1">Total Users</p>
          <h2 className="text-3xl font-black text-slate-900">{usersCount === null ? "-" : usersCount}</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
            <Server size={20} />
          </div>
          <p className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-1">Branches Available</p>
          <h2 className="text-3xl font-black text-slate-900">1</h2>
          <p className="text-xs font-semibold text-slate-400 mt-2">Currently serving CSE only</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <Activity size={20} />
          </div>
          <p className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-1">System Health</p>
          <h2 className="text-xl font-bold text-emerald-600 flex items-center gap-2 mt-1">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            Online & Stable
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* QUICK ACTIONS */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <LayoutDashboard size={16} className="text-slate-400" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button onClick={() => setTab("materials")} className="flex items-center gap-4 bg-white border border-slate-200 p-4 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all text-left group">
              <div className="w-10 h-10 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                <BookOpen size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Materials Overview</h4>
                <p className="text-xs font-medium text-slate-500 mt-0.5">View content status</p>
              </div>
            </button>
            
            <button onClick={() => setTab("users")} className="flex items-center gap-4 bg-white border border-slate-200 p-4 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all text-left group">
              <div className="w-10 h-10 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                <Users size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Manage Users</h4>
                <p className="text-xs font-medium text-slate-500 mt-0.5">Control access & accounts</p>
              </div>
            </button>
            
            <button onClick={() => setTab("settings")} className="flex items-center gap-4 bg-white border border-slate-200 p-4 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all text-left group">
              <div className="w-10 h-10 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                <Settings size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">System Parameters</h4>
                <p className="text-xs font-medium text-slate-500 mt-0.5">Update core settings</p>
              </div>
            </button>

            <button onClick={() => alert("Action restricted in current environment.")} className="flex items-center gap-4 bg-red-50 border border-red-100/50 p-4 rounded-xl hover:bg-red-100/50 hover:shadow-sm transition-all text-left group">
              <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center transition-colors">
                <AlertTriangle size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-red-700">Reset Data</h4>
                <p className="text-xs font-medium text-red-600/70 mt-0.5">Clear operational cache</p>
              </div>
            </button>
          </div>
        </div>

        {/* SYSTEM HEALTH CARD */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Database size={16} className="text-slate-400" />
            System Status
          </h3>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">App Version</span>
                <span className="text-sm font-black text-slate-900">v2.1.0</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Database</span>
                <span className="text-sm font-black text-slate-900">Connected</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Data Store</span>
                <span className="text-sm font-black text-slate-900">materials.js</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Last Updated</span>
                <span className="text-sm font-black text-indigo-600 flex items-center gap-1.5">
                  <RefreshCcw size={14} />
                  Just now
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// USERS SECTION (Main Focus)
// ═══════════════════════════════════════════════════════════════
function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "users"));
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (userId: string) => {
    if (!window.confirm("Permanently delete this user record form database?")) return;
    try {
      await deleteDoc(doc(db, "users", userId));
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Directory</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage accounts and monitor academic metrics.</p>
        </div>
        <div className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-200 inline-flex items-center">
          {users.length} Total Records
        </div>
      </header>

      <div className="bg-white border flex flex-col border-slate-200 rounded-[1.5rem] shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center flex-1 p-20">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 p-20 text-center">
            <Users className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No users found</h3>
            <p className="text-sm text-slate-500 mt-1">When users sign up, they will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Name / Email</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Branch</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap text-center">Semester</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap text-center">CGPA</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 truncate max-w-[180px]">{u.name || "Anonymous User"}</p>
                      <p className="font-medium text-slate-500 text-xs truncate max-w-[180px] mt-0.5">{u.email || u.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-[6px] bg-slate-100 text-[11px] font-bold text-slate-600 border border-slate-200">
                        {u.branch || "CSE"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-slate-700">{getDisplaySemester(u.semester)}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-black text-slate-900 flex items-center justify-center gap-1.5">
                        {u.cgpa ? (
                          <>
                            {Number(u.cgpa).toFixed(2)}
                            {Number(u.cgpa) > 8 && <span className="text-orange-500 text-[10px]">🔥</span>}
                          </>
                        ) : (
                          <span className="text-slate-300 font-medium">—</span>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => alert(`Profile Viewer: \nName: ${u.name}\nEmail: ${u.email}\nBranch: ${u.branch}\nID: ${u.id}`)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all"
                          title="View Profile"
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(u.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 shadow-sm transition-all"
                          title="Delete User"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <span className="text-xs font-bold text-slate-400 group-hover:hidden">—</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MATERIALS SECTION (Read Only Overview)
// ═══════════════════════════════════════════════════════════════
function MaterialsTab() {
  const semestersData = Object.keys(materials);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Content Status</h1>
        <p className="text-slate-500 text-sm font-medium mt-1">System wide verification of loaded academic material files.</p>
      </header>
      
      <div className="bg-white border border-slate-200 rounded-[1.5rem] p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <Server size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">CSE Repository</h2>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-0.5">Online & Active</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {semestersData.map(semLabel => {
            const hasData = Object.keys((materials as any)[semLabel] || {}).length > 0;
            return (
              <div key={semLabel} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                <span className="font-bold text-slate-800">{semLabel} Semester</span>
                {hasData ? (
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded uppercase tracking-wider">Available</span>
                ) : (
                  <span className="text-[10px] font-bold bg-slate-200 text-slate-500 px-2 py-0.5 rounded uppercase tracking-wider">Empty</span>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-xs font-medium text-slate-400 flex items-center gap-2">
            <AlertTriangle size={14} className="text-amber-500" />
            Upload interface is disabled. Materials are hardcoded securely in the datastore logic.
          </p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════════════
function SettingsTab() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-slate-500 text-sm font-medium mt-1">Configure parameters and core logic.</p>
      </header>

      <div className="bg-white border border-slate-200 rounded-[1.5rem] p-10 shadow-sm flex flex-col items-center justify-center text-center">
        <Settings className="w-12 h-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Configuration Locked</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
          Dynamic configurations are disabled in the current build environment to maintain stability.
        </p>
      </div>
    </div>
  )
}
