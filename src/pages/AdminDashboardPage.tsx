import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Users, BookOpen, LogOut, Trash2,
  Shield, Eye, Settings, Server, Database, Activity,
  AlertTriangle, Loader2, Search,
  TrendingUp, ChevronRight,
  UserX
} from "lucide-react";
import { db } from "../lib/firebase";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { materials } from "../data/materials";
import { getDisplaySemester } from "../lib/utils";
import AdminUserProfileModal from "../components/admin/AdminUserProfileModal";
import { UserAvatar } from "../components/ui/UserAvatar";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "User Directory", icon: Users },
  { id: "materials", label: "Content Matrix", icon: BookOpen },
  { id: "settings", label: "System Config", icon: Settings },
];

export default function AdminDashboardPage() {
  const { user, signOut, isAdmin } = useAuth();
  const [tab, setTab] = useState("dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Global Users State
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      console.log("Snapshot docs:", snapshot.docs.length);
      
      const usersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log("Fetched users:", usersList);
      console.log("Fetched count:", usersList.length);

      setUsers(usersList);
      setLoadingUsers(false);
    }, (error) => {
      console.error("Error fetching users:", error);
      setLoadingUsers(false);
    });
    return () => unsubscribe();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfdfd] text-slate-800 p-4 font-sans selection:bg-violet-500/30">
        <div className="bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col items-center max-w-sm w-full text-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500 to-rose-400" />
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6 border border-red-100/50">
            <Shield size={28} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Access Denied</h2>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            You do not have administrative privileges to view the command center.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-8 w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-[0_4px_14px_rgba(15,23,42,0.2)] hover:shadow-[0_6px_20px_rgba(15,23,42,0.3)] hover:-translate-y-0.5"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans selection:bg-violet-500/30 selection:text-violet-900">
      {/* SIDEBAR */}
      <aside className="w-[280px] bg-white border-r border-slate-200/60 hidden md:flex flex-col flex-shrink-0 relative z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-6 md:pt-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 shadow-sm flex items-center justify-center text-violet-600">
              <Shield size={20} />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-slate-900 tracking-tight leading-none">
                JNTUK <span className="text-violet-600">Admin</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Command Center</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          {NAV.map(item => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all group ${
                  active 
                    ? "bg-violet-50 text-violet-700 shadow-sm border border-violet-100/50" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
                }`}
              >
                <Icon size={18} className={active ? "text-violet-600" : "text-slate-400 group-hover:text-slate-600 transition-colors"} />
                {item.label}
                {active && <ChevronRight size={14} className="ml-auto text-violet-400" />}
              </button>
            );
          })}
        </nav>

        {/* Profile Card */}
        <div className="p-4 border-t border-slate-100/80 bg-slate-50/50">
          <div className="px-3.5 py-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between group">
            <div className="flex items-center gap-3 truncate pr-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shrink-0 shadow-sm">
                <span className="text-white text-xs font-bold">AD</span>
              </div>
              <div className="truncate">
                <p className="text-[13px] font-bold text-slate-900 truncate">{user?.email?.split('@')[0]}</p>
                <p className="text-[10px] uppercase font-bold text-violet-500 tracking-wider">Super Admin</p>
              </div>
            </div>
            <button 
              onClick={signOut}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition-all shrink-0"
              title="Secure Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden bg-white/80 backdrop-blur-md border-b border-slate-200 px-5 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
           <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Shield size={18} className="text-violet-600" />
            JNTUK Admin
          </h1>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 -mr-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <LayoutDashboard size={20} />
          </button>
        </div>

        {isSidebarOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 grid grid-cols-2 gap-2 shadow-sm relative z-10 w-full animate-in slide-in-from-top-2">
            {NAV.map(item => (
              <button
                key={item.id}
                onClick={() => { setTab(item.id); setSidebarOpen(false); }}
                className={`flex flex-col items-center justify-center gap-1.5 px-3 py-3 rounded-xl text-xs font-bold transition-all ${
                  tab === item.id 
                    ? "bg-violet-50 text-violet-700 border border-violet-100" 
                    : "bg-slate-50 text-slate-600 border border-slate-200"
                }`}
              >
                <item.icon size={18} className={tab === item.id ? "text-violet-600" : "text-slate-400"} />
                {item.label}
              </button>
            ))}
          </div>
        )}

        <div className="p-5 md:p-10 max-w-[1400px] mx-auto w-full">
          {tab === "dashboard" && <DashboardTab users={users} loading={loadingUsers} setTab={setTab} />}
          {tab === "users" && <UsersTab users={users} loading={loadingUsers} />}
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
function DashboardTab({ users, loading, setTab }: { users: any[], loading: boolean, setTab: (t: string) => void }) {
  const cseUsers = users.filter(u => !u.branch || u.branch.toUpperCase() === 'CSE').length;
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">System Overview</h1>
        <p className="text-slate-500 text-sm md:text-base font-medium mt-2 max-w-xl">
          Real-time metrics and operational status for the JNTUK Academic Platform.
        </p>
      </header>

      {/* CORE STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-[0_2px_12px_rgba(15,23,42,0.03)] hover:shadow-md transition-shadow group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users size={64} className="text-violet-500" />
          </div>
          <div className="w-12 h-12 rounded-2xl bg-violet-50 border border-violet-100 text-violet-600 flex items-center justify-center mb-5 relative z-10">
            <Users size={22} />
          </div>
          <p className="text-[12px] font-bold text-slate-400 tracking-widest uppercase mb-1 relative z-10">Total Users</p>
          <div className="flex items-baseline gap-3 relative z-10">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
              {loading ? <Loader2 className="w-8 h-8 animate-spin text-slate-300" /> : users.length}
            </h2>
            {!loading && users.length > 0 && <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1"><TrendingUp size={12}/> Live</span>}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-[0_2px_12px_rgba(15,23,42,0.03)] hover:shadow-md transition-shadow group relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-5 relative z-10">
            <Server size={22} />
          </div>
          <p className="text-[12px] font-bold text-slate-400 tracking-widest uppercase mb-1 relative z-10">Active Branches</p>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight relative z-10">1</h2>
          <p className="text-[11px] font-bold text-indigo-500 mt-2 relative z-10 bg-indigo-50/50 inline-block px-2 py-1 rounded-lg">CSE ({cseUsers} Users)</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-[0_2px_12px_rgba(15,23,42,0.03)] hover:shadow-md transition-shadow group relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-5 relative z-10">
            <BookOpen size={22} />
          </div>
          <p className="text-[12px] font-bold text-slate-400 tracking-widest uppercase mb-1 relative z-10">Total Subjects</p>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight relative z-10">
            {Object.values(materials).reduce((acc, sem) => acc + Object.keys(sem).length, 0)}
          </h2>
          <p className="text-[11px] font-bold text-slate-400 mt-2 relative z-10">Across all semesters</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-[0_2px_12px_rgba(15,23,42,0.03)] hover:shadow-md transition-shadow group relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mb-5 relative z-10">
            <Activity size={22} />
          </div>
          <p className="text-[12px] font-bold text-slate-400 tracking-widest uppercase mb-1 relative z-10">System Status</p>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight relative z-10 mt-1">Healthy</h2>
          <div className="flex items-center gap-1.5 mt-2 relative z-10">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span className="text-xs font-bold text-emerald-600">All systems operational</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* QUICK ACTIONS */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <LayoutDashboard size={16} className="text-violet-500" />
            Platform Management
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button onClick={() => setTab("users")} className="flex items-start gap-4 bg-white border border-slate-200/60 p-5 rounded-3xl hover:border-violet-200 hover:shadow-md transition-all text-left group">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-600 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-violet-50 group-hover:text-violet-600 group-hover:border-violet-100 transition-colors">
                <Users size={20} />
              </div>
              <div>
                <h4 className="text-[15px] font-bold text-slate-900 group-hover:text-violet-700 transition-colors">User Management</h4>
                <p className="text-[13px] font-medium text-slate-500 mt-1 leading-snug">View, edit, and moderate student accounts and academic data.</p>
              </div>
            </button>
            
            <button onClick={() => setTab("materials")} className="flex items-start gap-4 bg-white border border-slate-200/60 p-5 rounded-3xl hover:border-violet-200 hover:shadow-md transition-all text-left group">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-600 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-violet-50 group-hover:text-violet-600 group-hover:border-violet-100 transition-colors">
                <BookOpen size={20} />
              </div>
              <div>
                <h4 className="text-[15px] font-bold text-slate-900 group-hover:text-violet-700 transition-colors">Content Matrix</h4>
                <p className="text-[13px] font-medium text-slate-500 mt-1 leading-snug">Verify loaded materials, subjects, and resource availability.</p>
              </div>
            </button>
          </div>
        </div>

        {/* RECENT REGISTRATIONS (Mini list) */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Activity size={16} className="text-violet-500" />
            Recent Activity
          </h3>
          <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] h-[calc(100%-2rem)]">
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-slate-300" /></div>
            ) : users.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-8">
                <UserX className="w-8 h-8 text-slate-200 mb-2" />
                <p className="text-xs font-semibold text-slate-400">No users yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Take top 4 sorted by createdAt (which we sort in the global state or here) */}
                {users.slice().sort((a,b) => (b.createdAt?.seconds||0) - (a.createdAt?.seconds||0)).slice(0, 4).map(u => (
                  <div key={u.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 text-white flex items-center justify-center shrink-0 text-sm font-bold shadow-sm">
                      {(u.name?.[0] || u.email?.[0] || '?').toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-slate-900 truncate">{u.name || "Anonymous User"}</p>
                      <p className="text-[11px] font-medium text-slate-500 truncate">{u.email || "No Email"}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        {u.branch || 'CSE'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setTab("users")} className="w-full mt-4 py-2 text-[12px] font-bold text-violet-600 hover:bg-violet-50 rounded-xl transition-colors">
              View All Users
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// USERS SECTION (Main Focus)
// ═══════════════════════════════════════════════════════════════
function UsersTab({ users, loading }: { users: any[], loading: boolean }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBranch, setFilterBranch] = useState("ALL");
  const [filterSem] = useState("ALL");
  const [sortBy, setSortBy] = useState("recent"); // recent | cgpa
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const handleDelete = async (userId: string) => {
    if (!window.confirm("Permanently delete this user record from the database?")) return;
    try {
      await deleteDoc(doc(db, "users", userId));
      // State updates automatically via onSnapshot listener in parent!
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchSearch = (u.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (u.email || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchBranch = filterBranch === "ALL" || (u.branch || "CSE") === filterBranch;
      const matchSem = filterSem === "ALL" || u.semester === filterSem;
      return matchSearch && matchBranch && matchSem;
    }).sort((a, b) => {
      if (sortBy === "cgpa") {
        return (Number(b.cgpa) || 0) - (Number(a.cgpa) || 0);
      } else {
        return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
      }
    });
  }, [users, searchTerm, filterBranch, filterSem, sortBy]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Directory</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage accounts and monitor academic metrics.</p>
        </div>
        <div className="px-4 py-2 bg-white text-slate-700 text-sm font-bold rounded-xl border border-slate-200 shadow-sm inline-flex items-center gap-2">
          <Users size={16} className="text-violet-500" />
          {filteredUsers.length} Users Found
        </div>
      </header>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Branch Filter */}
          <select 
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-700 outline-none hover:border-violet-300 focus:border-violet-500 cursor-pointer appearance-none pr-8 relative transition-all"
            style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1em' }}
          >
            <option value="ALL">All Branches</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="IT">IT</option>
          </select>

          {/* Sort By */}
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-700 outline-none hover:border-violet-300 focus:border-violet-500 cursor-pointer appearance-none pr-8 relative transition-all"
            style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1em' }}
          >
            <option value="recent">Sort: Newest</option>
            <option value="cgpa">Sort: Highest CGPA</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-[0_2px_20px_rgba(15,23,42,0.04)] overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center flex-1 py-32">
            <Loader2 className="w-10 h-10 text-violet-500 animate-spin mb-4" />
            <p className="text-sm font-bold text-slate-500">Loading directory...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-32 text-center px-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
              <UserX className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">No matches found</h3>
            <p className="text-sm font-medium text-slate-500 max-w-sm">Adjust your filters or search query to find users.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Profile</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Academic Info</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-center">CGPA</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <UserAvatar
                          photoURL={u.photoURL}
                          name={u.name || u.email}
                          className="w-10 h-10 border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900 text-[14px]">{u.name || "Anonymous User"}</p>
                          <p className="font-medium text-slate-500 text-[12px] mt-0.5">{u.email || u.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-black text-slate-600 border border-slate-200 tracking-wider">
                          {u.branch || "CSE"}
                        </span>
                        <span className="text-[12px] font-bold text-slate-600">{getDisplaySemester(u.semester)} Sem</span>
                      </div>
                      <p className="text-[11px] font-medium text-slate-400">Backlogs: <span className={u.backlogs?.length > 0 ? "text-red-500 font-bold" : "text-slate-500"}>{u.backlogs?.length || 0}</span></p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-black text-slate-900 flex items-center justify-center gap-1.5 text-base">
                        {u.cgpa ? (
                          <>
                            {Number(u.cgpa).toFixed(2)}
                            {Number(u.cgpa) >= 8.5 && <span className="text-orange-500 text-sm" title="Excellent">🔥</span>}
                          </>
                        ) : (
                          <span className="text-slate-300 font-medium">—</span>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setSelectedUser(u)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-violet-600 hover:border-violet-300 hover:bg-violet-50 shadow-sm transition-all"
                          title="View Data"
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(u.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-300 hover:bg-red-50 shadow-sm transition-all"
                          title="Delete User"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <span className="text-xs font-bold text-slate-300 group-hover:hidden">—</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AdminUserProfileModal 
        user={selectedUser} 
        onClose={() => setSelectedUser(null)} 
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MATERIALS SECTION (Read Only Overview)
// ═══════════════════════════════════════════════════════════════
function MaterialsTab() {
  const semestersData = Object.keys(materials);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Content Matrix</h1>
        <p className="text-slate-500 text-sm font-medium mt-2 max-w-xl">
          System wide verification of loaded academic material files and subject mappings.
        </p>
      </header>
      
      <div className="bg-white border border-slate-200/60 rounded-3xl p-8 shadow-[0_2px_20px_rgba(15,23,42,0.03)]">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
            <Database size={26} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">CSE Subject Repository</h2>
            <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mt-1 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Online & Verifying
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {semestersData.map(semLabel => {
            const subjects = Object.keys((materials as any)[semLabel] || {});
            const hasData = subjects.length > 0;
            return (
              <div key={semLabel} className="p-5 rounded-2xl border border-slate-200/60 bg-white shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-black text-slate-800 text-lg">{semLabel}</span>
                  {hasData ? (
                    <span className="text-[10px] font-black bg-emerald-50 border border-emerald-100 text-emerald-600 px-2.5 py-1 rounded-md uppercase tracking-wider">Active</span>
                  ) : (
                    <span className="text-[10px] font-black bg-slate-100 border border-slate-200 text-slate-500 px-2.5 py-1 rounded-md uppercase tracking-wider">Empty</span>
                  )}
                </div>
                <div className="text-sm font-medium text-slate-500">
                  <span className="font-bold text-slate-900">{subjects.length}</span> subjects loaded
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3">
            <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-amber-800 leading-relaxed">
              Upload interface is currently locked. Materials are hardcoded securely in the <code className="font-mono text-xs bg-amber-100 px-1.5 py-0.5 rounded text-amber-900 mx-1">data/materials.ts</code> datastore logic to ensure maximum stability for student access.
            </p>
          </div>
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Config</h1>
        <p className="text-slate-500 text-sm font-medium mt-2">Manage application parameters and core logic.</p>
      </header>

      <div className="bg-white border border-slate-200/60 rounded-3xl p-16 shadow-[0_2px_20px_rgba(15,23,42,0.03)] flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-50 via-white to-white pointer-events-none" />
        
        <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 border border-slate-100 relative z-10">
          <Settings className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight relative z-10">Configuration Locked</h3>
        <p className="text-base font-medium text-slate-500 mt-3 max-w-md mx-auto relative z-10 leading-relaxed">
          Dynamic configurations and environment variables are disabled in the current build environment to maintain production stability.
        </p>
      </div>
    </div>
  )
}
