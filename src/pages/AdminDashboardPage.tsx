import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Users, BookOpen, Upload, LogOut, Trash2,
  CheckCircle, AlertCircle, Loader2, FileUp, Search, Shield,
  UserX, UserCheck
} from "lucide-react";
import { db, storage } from "../lib/firebase";
import {
  collection, addDoc, getDocs, deleteDoc, doc, updateDoc,
  serverTimestamp
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { subjectsData, commonFirstYear } from "../lib/data";
import { normalizeSemester } from "../lib/utils";

// ─── Constants ───
const BRANCHES = ["CSE", "ECE", "IT", "AIML"];
const SEMESTERS = ["1-1", "1-2", "2-1", "2-2", "3-1", "3-2", "4-1", "4-2"];
const TYPES = [
  { id: "unit-1", label: "Unit 1" },
  { id: "unit-2", label: "Unit 2" },
  { id: "unit-3", label: "Unit 3" },
  { id: "unit-4", label: "Unit 4" },
  { id: "unit-5", label: "Unit 5" },
  { id: "prev-papers", label: "PYQ" },
  { id: "important-qs", label: "Important Qs" },
];

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "materials", label: "Materials", icon: BookOpen },
  { id: "upload", label: "Upload", icon: Upload },
];

function getSubjects(branch: string, semester: string): string[] {
  if (semester.startsWith("1-")) return commonFirstYear[semester] || [];
  return subjectsData[branch]?.[semester] || [];
}

// ─── Shared Styles ───
const inputClass = "w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all";
const selectClass = inputClass + " cursor-pointer";
const thClass = "px-4 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider";
const tdClass = "px-4 py-3 text-sm text-slate-700";

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function AdminDashboardPage() {
  const { user, signOut, isAdmin } = useAuth();
  const [tab, setTab] = useState("dashboard");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const flash = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Shield className="w-12 h-12 text-red-300 mx-auto mb-3" />
          <p className="text-red-600 font-bold text-lg">Access Denied</p>
          <p className="text-sm text-slate-500 mt-1">Admin privileges required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f4f5f7] overflow-hidden">
      {/* ─── SIDEBAR ─── */}
      <aside className="w-[220px] bg-[#0f172a] flex flex-col shrink-0">
        <div className="p-5 pb-6">
          <h1 className="text-[14px] font-bold text-white tracking-tight">JNTUK Admin</h1>
          <p className="text-[11px] text-slate-500 mt-0.5">Control Center</p>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {NAV.map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-semibold transition-colors ${
                tab === item.id
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <item.icon className="w-4 h-4" /> {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <p className="text-[11px] text-slate-500 truncate mb-3 px-1">{user?.email}</p>
          <button
            onClick={signOut}
            className="w-full flex items-center justify-center gap-1.5 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-[11px] font-bold transition-colors"
          >
            <LogOut className="w-3 h-3" /> Sign Out
          </button>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 h-14 flex items-center px-7 shadow-sm">
          <h2 className="text-[15px] font-bold text-slate-800">
            {NAV.find(n => n.id === tab)?.label}
          </h2>
        </div>

        {/* Toast */}
        {toast && (
          <div className={`mx-7 mt-5 px-4 py-2.5 rounded-lg border flex items-center gap-2 text-sm font-semibold ${
            toast.ok ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-700"
          }`}>
            {toast.ok ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.msg}
          </div>
        )}

        <div className="p-7">
          {tab === "dashboard" && <DashboardTab />}
          {tab === "users" && <UsersTab flash={flash} />}
          {tab === "materials" && <MaterialsTab flash={flash} />}
          {tab === "upload" && <UploadTab flash={flash} />}
        </div>
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE 1: DASHBOARD
// ═══════════════════════════════════════════════════════════════
function DashboardTab() {
  const [stats, setStats] = useState({ users: 0, materials: 0, backlogs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [uSnap, mSnap] = await Promise.all([
          getDocs(collection(db, "users")),
          getDocs(collection(db, "materials")),
        ]);

        // Count backlogs across all user profiles
        let backlogCount = 0;
        uSnap.docs.forEach(d => {
          const data = d.data();
          if (data.backlogs && Array.isArray(data.backlogs)) {
            backlogCount += data.backlogs.length;
          }
        });

        setStats({ users: uSnap.size, materials: mSnap.size, backlogs: backlogCount });
      } catch { /* silent */ }
      setLoading(false);
    })();
  }, []);

  const cards = [
    { label: "Total Users", value: stats.users, color: "bg-blue-50 text-blue-600", icon: Users },
    { label: "Total Materials", value: stats.materials, color: "bg-indigo-50 text-indigo-600", icon: BookOpen },
    { label: "Total Backlogs", value: stats.backlogs, color: "bg-amber-50 text-amber-600", icon: AlertCircle },
  ];

  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-5">
          {cards.map(c => (
            <div key={c.label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${c.color}`}>
                <c.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-slate-800">{c.value}</p>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">{c.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE 2: USERS
// ═══════════════════════════════════════════════════════════════
function UsersTab({ flash }: { flash: (m: string, ok?: boolean) => void }) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterBranch, setFilterBranch] = useState("all");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "users"));
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch {
      flash("Failed to load users", false);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggle = async (u: any) => {
    const newStatus = u.disabled ? false : true;
    try {
      await updateDoc(doc(db, "users", u.id), { disabled: newStatus });
      flash(newStatus ? "User disabled" : "User enabled");
      fetchUsers();
    } catch {
      flash("Action failed", false);
    }
  };

  const handleDelete = async (u: any) => {
    if (!confirm(`Delete user "${u.name || u.id}"? This cannot be undone.`)) return;
    try {
      await deleteDoc(doc(db, "users", u.id));
      flash("User deleted");
      fetchUsers();
    } catch {
      flash("Delete failed", false);
    }
  };

  const filtered = users.filter(u => {
    if (filterBranch !== "all" && u.branch !== filterBranch) return false;
    if (search) {
      const q = search.toLowerCase();
      const name = (u.name || "").toLowerCase();
      const email = (u.email || u.id || "").toLowerCase();
      if (!name.includes(q) && !email.includes(q)) return false;
    }
    return true;
  });

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name or email..."
            className="w-full h-9 pl-9 pr-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <select
          value={filterBranch}
          onChange={e => setFilterBranch(e.target.value)}
          className="h-9 px-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 cursor-pointer focus:outline-none"
        >
          <option value="all">All Branches</option>
          {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-auto">{filtered.length} users</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-500 font-medium">No users found.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className={thClass}>Name</th>
                <th className={thClass}>Email</th>
                <th className={thClass}>Branch</th>
                <th className={thClass}>Semester</th>
                <th className={thClass}>Status</th>
                <th className={thClass + " text-right"}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/60 transition-colors group">
                  <td className={tdClass}>
                    <span className="font-bold text-slate-800">{u.name || "—"}</span>
                  </td>
                  <td className={tdClass}>
                    <span className="text-slate-500 font-mono text-[12px]">{u.email || u.id}</span>
                  </td>
                  <td className={tdClass}>
                    <span className="bg-slate-100 text-slate-600 text-[11px] font-bold px-2 py-0.5 rounded">{u.branch || "—"}</span>
                  </td>
                  <td className={tdClass}>{normalizeSemester(u.semester) || "—"}</td>
                  <td className={tdClass}>
                    {u.disabled ? (
                      <span className="text-red-600 bg-red-50 text-[11px] font-bold px-2 py-0.5 rounded border border-red-100">Disabled</span>
                    ) : (
                      <span className="text-emerald-700 bg-emerald-50 text-[11px] font-bold px-2 py-0.5 rounded border border-emerald-100">Active</span>
                    )}
                  </td>
                  <td className={tdClass + " text-right"}>
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleToggle(u)}
                        title={u.disabled ? "Enable user" : "Disable user"}
                        className={`p-1.5 rounded-lg transition-colors ${
                          u.disabled
                            ? "text-emerald-500 hover:bg-emerald-50"
                            : "text-amber-500 hover:bg-amber-50"
                        }`}
                      >
                        {u.disabled ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(u)}
                        className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE 3: MATERIALS
// ═══════════════════════════════════════════════════════════════
function MaterialsTab({ flash }: { flash: (m: string, ok?: boolean) => void }) {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterBranch, setFilterBranch] = useState("all");
  const [filterSem, setFilterSem] = useState("all");

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "materials"));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      docs.sort((a: any, b: any) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
      setMaterials(docs);
    } catch {
      flash("Failed to load materials", false);
    }
    setLoading(false);
  };

  useEffect(() => { fetchMaterials(); }, []);

  const handleDelete = async (m: any) => {
    if (!confirm(`Delete "${m.title}"?`)) return;
    try {
      await deleteDoc(doc(db, "materials", m.id));
      flash("Material deleted");
      fetchMaterials();
    } catch {
      flash("Delete failed", false);
    }
  };

  const filtered = materials.filter(m => {
    if (filterBranch !== "all" && m.branch !== filterBranch) return false;
    if (filterSem !== "all" && m.semester !== filterSem) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!(m.title || "").toLowerCase().includes(q) && !(m.subject || "").toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search title or subject..."
            className="w-full h-9 pl-9 pr-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <select value={filterBranch} onChange={e => setFilterBranch(e.target.value)} className="h-9 px-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 cursor-pointer focus:outline-none">
          <option value="all">All Branches</option>
          {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select value={filterSem} onChange={e => setFilterSem(e.target.value)} className="h-9 px-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 cursor-pointer focus:outline-none">
          <option value="all">All Semesters</option>
          {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-auto">{filtered.length} items</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-500 font-medium">No materials found.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className={thClass}>Title</th>
                <th className={thClass}>Subject</th>
                <th className={thClass}>Branch</th>
                <th className={thClass}>Semester</th>
                <th className={thClass}>Type</th>
                <th className={thClass + " text-right"}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(m => (
                <tr key={m.id} className="hover:bg-slate-50/60 transition-colors group">
                  <td className={tdClass}>
                    <span className="font-bold text-slate-800">{m.title}</span>
                  </td>
                  <td className={tdClass}>
                    <span className="text-slate-600 truncate block max-w-[200px]" title={m.subject}>{m.subject}</span>
                  </td>
                  <td className={tdClass}>
                    <span className="bg-slate-100 text-slate-600 text-[11px] font-bold px-2 py-0.5 rounded">{m.branch}</span>
                  </td>
                  <td className={tdClass}>{normalizeSemester(m.semester)}</td>
                  <td className={tdClass}>
                    <span className="text-[11px] font-semibold text-slate-500">{TYPES.find(t => t.id === m.unit)?.label || m.unit}</span>
                  </td>
                  <td className={tdClass + " text-right"}>
                    <button
                      onClick={() => handleDelete(m)}
                      className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE 4: UPLOAD
// ═══════════════════════════════════════════════════════════════
function UploadTab({ flash }: { flash: (m: string, ok?: boolean) => void }) {
  const titleRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [branch, setBranch] = useState(localStorage.getItem("adm_b") || "CSE");
  const [semester, setSemester] = useState(localStorage.getItem("adm_s") || "3-2");
  const [subject, setSubject] = useState("");
  const [type, setType] = useState("unit-1");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [recents, setRecents] = useState<any[]>([]);

  const subjects = getSubjects(branch, semester);

  useEffect(() => {
    localStorage.setItem("adm_b", branch);
    localStorage.setItem("adm_s", semester);
    const list = getSubjects(branch, semester);
    if (list.length > 0 && !list.includes(subject)) setSubject(list[0]);
  }, [branch, semester]);

  useEffect(() => { loadRecents(); }, []);

  const loadRecents = async () => {
    try {
      const snap = await getDocs(collection(db, "materials"));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      docs.sort((a: any, b: any) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
      setRecents(docs.slice(0, 8));
    } catch { /* silent */ }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title.trim() || !subject) return;
    setUploading(true);
    setProgress(0);

    try {
      const ext = file.name.split(".").pop();
      const fname = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const storageRef = ref(storage, `materials/${branch}/${semester}/${fname}`);
      const task = uploadBytesResumable(storageRef, file);

      task.on("state_changed",
        snap => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
        () => { flash("Upload failed", false); setUploading(false); },
        async () => {
          const url = await getDownloadURL(task.snapshot.ref);
          await addDoc(collection(db, "materials"), {
            title: title.trim(), branch, semester, subject,
            unit: type, fileURL: url, fileName: file.name,
            createdAt: serverTimestamp(),
          });
          flash(`"${title.trim()}" uploaded`);
          setTitle("");
          setFile(null);
          if (fileRef.current) fileRef.current.value = "";
          setUploading(false);
          loadRecents();
          setTimeout(() => titleRef.current?.focus(), 100);
        }
      );
    } catch {
      flash("Upload failed", false);
      setUploading(false);
    }
  };

  const handleDeleteRecent = async (id: string) => {
    try {
      await deleteDoc(doc(db, "materials", id));
      flash("Deleted");
      loadRecents();
    } catch {
      flash("Delete failed", false);
    }
  };

  return (
    <div className="max-w-xl">
      <form onSubmit={handleUpload} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">

        {/* Branch + Semester */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Branch</label>
            <select value={branch} onChange={e => setBranch(e.target.value)} className={selectClass}>
              {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Semester</label>
            <select value={semester} onChange={e => setSemester(e.target.value)} className={selectClass}>
              {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Subject</label>
          {subjects.length === 0 ? (
            <div className="h-10 px-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center text-sm font-medium text-amber-700">
              No subjects for {branch} {semester}
            </div>
          ) : (
            <select value={subject} onChange={e => setSubject(e.target.value)} className={selectClass}>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          )}
        </div>

        {/* Type */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Type</label>
          <div className="flex flex-wrap gap-1.5">
            {TYPES.map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setType(t.id)}
                className={`px-3 py-1.5 rounded-md text-[12px] font-bold transition-all ${
                  type === t.id ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Title</label>
          <input
            ref={titleRef}
            type="text"
            required
            autoFocus
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Unit 1 Complete Notes"
            className={inputClass + " h-11 text-[15px] font-semibold"}
          />
        </div>

        {/* File */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">File</label>
          <div className={`relative border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer transition-all ${
            file ? "border-emerald-300 bg-emerald-50/40 py-3" : "border-slate-300 bg-slate-50 hover:bg-slate-100 py-5"
          }`}>
            <input ref={fileRef} type="file" required onChange={e => setFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div className="flex items-center gap-2.5 pointer-events-none">
              <FileUp className={`w-5 h-5 ${file ? "text-emerald-600" : "text-slate-400"}`} />
              <span className={`text-sm font-bold ${file ? "text-emerald-800" : "text-slate-500"}`}>
                {file ? file.name : "Click to attach file"}
              </span>
            </div>
          </div>
        </div>

        {/* Progress */}
        {uploading && (
          <div>
            <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              <span>Uploading</span><span>{progress}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-indigo-500 transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={uploading || !file || !title.trim() || !subject}
          className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white text-[14px] font-bold rounded-xl shadow-sm transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : "Upload Material"}
        </button>
      </form>

      {/* Recent uploads */}
      {recents.length > 0 && (
        <div className="mt-8">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Recent Uploads</h3>
          <div className="space-y-1.5">
            {recents.map((m: any) => (
              <div key={m.id} className="bg-white rounded-lg border border-slate-200 px-3.5 py-2.5 flex items-center justify-between group hover:border-slate-300 transition-colors">
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-slate-800 truncate">{m.title}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{m.subject} · {m.branch} {normalizeSemester(m.semester)}</p>
                </div>
                <button onClick={() => handleDeleteRecent(m.id)} className="p-1 rounded text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
