import { useState, useEffect, useRef, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Users, BookOpen, Upload, LogOut, Trash2,
  CheckCircle, AlertCircle, Loader2, FileUp, Search, Shield,
  UserX, UserCheck, ChevronRight, Eye, Download, X
} from "lucide-react";
import { db, storage } from "../lib/firebase";
import {
  collection, addDoc, getDocs, deleteDoc, doc, updateDoc,
  serverTimestamp
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { subjectsData, commonFirstYear } from "../lib/data";
import { normalizeSemester } from "../lib/utils";
import "./AdminDashboardPage.css";

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

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function AdminDashboardPage() {
  const { user, signOut, isAdmin } = useAuth();
  const [tab, setTab] = useState("dashboard");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [globalSearch, setGlobalSearch] = useState("");

  const flash = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  if (!isAdmin) {
    return (
      <div className="admin-denied">
        <div className="admin-denied-inner">
          <Shield />
          <h2>Access Denied</h2>
          <p>Admin privileges required.</p>
        </div>
      </div>
    );
  }

  const initials = (user?.email || "A").charAt(0).toUpperCase();

  return (
    <div className="admin-root">
      {/* ─── SIDEBAR ─── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <h1>JNTUK Admin</h1>
          <p>Control Center</p>
        </div>

        <nav className="admin-nav">
          {NAV.map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`admin-nav-item ${tab === item.id ? "active" : ""}`}
            >
              <item.icon /> {item.label}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <p className="admin-sidebar-email">{user?.email}</p>
          <button onClick={signOut} className="admin-signout-btn">
            <LogOut style={{ width: 13, height: 13 }} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <main className="admin-main">
        {/* Header */}
        <div className="admin-header">
          <h2 className="admin-header-title">
            {NAV.find(n => n.id === tab)?.label}
          </h2>
          <div className="admin-header-right">
            <div className="admin-search-box">
              <Search />
              <input
                type="text"
                value={globalSearch}
                onChange={e => setGlobalSearch(e.target.value)}
                placeholder="Search anything..."
              />
            </div>
            <div className="admin-avatar">{initials}</div>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className={`admin-toast ${toast.ok ? "ok" : "err"}`}>
            {toast.ok ? <CheckCircle style={{ width: 16, height: 16 }} /> : <AlertCircle style={{ width: 16, height: 16 }} />}
            {toast.msg}
          </div>
        )}

        <div className="admin-content">
          {tab === "dashboard" && <DashboardTab />}
          {tab === "users" && <UsersTab flash={flash} globalSearch={globalSearch} />}
          {tab === "materials" && <MaterialsTab flash={flash} globalSearch={globalSearch} />}
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
  const [stats, setStats] = useState({ users: 0, materials: 0, backlogs: 0, downloads: 0 });
  const [loading, setLoading] = useState(true);
  const [branchCounts, setBranchCounts] = useState<Record<string, number>>({});
  const [semCounts, setSemCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    (async () => {
      try {
        const [uSnap, mSnap] = await Promise.all([
          getDocs(collection(db, "users")),
          getDocs(collection(db, "materials")),
        ]);

        let backlogCount = 0;
        const bc: Record<string, number> = {};
        uSnap.docs.forEach(d => {
          const data = d.data();
          if (data.backlogs && Array.isArray(data.backlogs)) {
            backlogCount += data.backlogs.length;
          }
          const branch = data.branch || "Other";
          bc[branch] = (bc[branch] || 0) + 1;
        });

        const sc: Record<string, number> = {};
        mSnap.docs.forEach(d => {
          const data = d.data();
          const sem = normalizeSemester(data.semester) || "?";
          sc[sem] = (sc[sem] || 0) + 1;
        });

        setStats({ users: uSnap.size, materials: mSnap.size, backlogs: backlogCount, downloads: 0 });
        setBranchCounts(bc);
        setSemCounts(sc);
      } catch { /* silent */ }
      setLoading(false);
    })();
  }, []);

  const cards = [
    { label: "Total Users", value: stats.users, color: "blue", icon: Users },
    { label: "Total Materials", value: stats.materials, color: "indigo", icon: BookOpen },
    { label: "Downloads", value: stats.downloads, color: "emerald", icon: Download },
    { label: "Total Backlogs", value: stats.backlogs, color: "amber", icon: AlertCircle },
  ];

  if (loading) {
    return <div className="admin-loading"><Loader2 style={{ width: 24, height: 24 }} /></div>;
  }

  const maxBranch = Math.max(...Object.values(branchCounts), 1);
  const maxSem = Math.max(...Object.values(semCounts), 1);

  return (
    <div>
      {/* Stat Cards */}
      <div className="admin-stats-grid">
        {cards.map(c => (
          <div key={c.label} className={`admin-stat-card ${c.color}`}>
            <div className={`admin-stat-icon ${c.color}`}>
              <c.icon style={{ width: 20, height: 20 }} />
            </div>
            <p className="admin-stat-value">{c.value}</p>
            <p className="admin-stat-label">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="admin-charts-grid">
        {/* Users per Branch */}
        <div className="admin-chart-card">
          <h3 className="admin-chart-title">Users by Branch</h3>
          <div className="admin-bar-chart">
            {BRANCHES.map((b, i) => {
              const count = branchCounts[b] || 0;
              const pct = Math.max((count / maxBranch) * 100, count > 0 ? 8 : 0);
              const colors = ["blue", "indigo", "emerald", "amber"];
              return (
                <div key={b} className="admin-bar-row">
                  <span className="admin-bar-label">{b}</span>
                  <div className="admin-bar-track">
                    <div className={`admin-bar-fill ${colors[i % 4]}`} style={{ width: `${pct}%` }}>
                      {count}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Materials per Semester */}
        <div className="admin-chart-card">
          <h3 className="admin-chart-title">Materials by Semester</h3>
          <div className="admin-bar-chart">
            {SEMESTERS.map((s, i) => {
              const count = semCounts[s] || 0;
              const pct = Math.max((count / maxSem) * 100, count > 0 ? 8 : 0);
              const colors = ["blue", "indigo", "emerald", "amber"];
              return (
                <div key={s} className="admin-bar-row">
                  <span className="admin-bar-label">{s}</span>
                  <div className="admin-bar-track">
                    <div className={`admin-bar-fill ${colors[i % 4]}`} style={{ width: `${pct}%` }}>
                      {count}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE 2: USERS
// ═══════════════════════════════════════════════════════════════
function UsersTab({ flash, globalSearch }: { flash: (m: string, ok?: boolean) => void; globalSearch: string }) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterBranch, setFilterBranch] = useState("all");
  const [filterSem, setFilterSem] = useState("all");
  const [viewUser, setViewUser] = useState<any>(null);

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

  const q = (search || globalSearch).toLowerCase();
  const filtered = users.filter(u => {
    if (filterBranch !== "all" && u.branch !== filterBranch) return false;
    if (filterSem !== "all" && normalizeSemester(u.semester) !== filterSem) return false;
    if (q) {
      const name = (u.name || "").toLowerCase();
      const email = (u.email || u.id || "").toLowerCase();
      if (!name.includes(q) && !email.includes(q)) return false;
    }
    return true;
  });

  return (
    <div>
      {/* User Detail Modal */}
      {viewUser && (
        <div className="admin-modal-backdrop" onClick={() => setViewUser(null)}>
          <div className="admin-modal-card" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 className="admin-modal-title" style={{ marginBottom: 0 }}>User Details</h3>
              <button className="admin-action-btn" onClick={() => setViewUser(null)}><X style={{ width: 18, height: 18, color: "#94a3b8" }} /></button>
            </div>
            <div style={{ marginTop: 16 }}>
              {[
                ["Name", viewUser.name || "—"],
                ["Email", viewUser.email || viewUser.id],
                ["Branch", viewUser.branch || "—"],
                ["Semester", normalizeSemester(viewUser.semester) || "—"],
                ["College", viewUser.college || "—"],
                ["Status", viewUser.disabled ? "Disabled" : "Active"],
                ["Backlogs", viewUser.backlogs?.length || 0],
                ["CGPA", viewUser.cgpa ?? "—"],
              ].map(([k, v]) => (
                <div className="admin-modal-row" key={k as string}>
                  <span className="admin-modal-key">{k}</span>
                  <span className="admin-modal-val">{String(v)}</span>
                </div>
              ))}
            </div>
            <button className="admin-modal-close" onClick={() => setViewUser(null)}>Close</button>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-toolbar-search">
          <Search />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name or email..."
          />
        </div>
        <select value={filterBranch} onChange={e => setFilterBranch(e.target.value)} className="admin-filter-select">
          <option value="all">All Branches</option>
          {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select value={filterSem} onChange={e => setFilterSem(e.target.value)} className="admin-filter-select">
          <option value="all">All Semesters</option>
          {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <span className="admin-count-badge">{filtered.length} users</span>
      </div>

      {/* Table */}
      <div className="admin-table-wrap">
        {loading ? (
          <div className="admin-loading"><Loader2 style={{ width: 24, height: 24 }} /></div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">No users found.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Branch</th>
                <th>Semester</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td><span style={{ fontWeight: 700, color: "#0f172a" }}>{u.name || "—"}</span></td>
                  <td><span style={{ fontFamily: "monospace", fontSize: 12, color: "#64748b" }}>{u.email || u.id}</span></td>
                  <td><span className="admin-badge branch">{u.branch || "—"}</span></td>
                  <td>{normalizeSemester(u.semester) || "—"}</td>
                  <td>
                    {u.disabled
                      ? <span className="admin-badge disabled">Disabled</span>
                      : <span className="admin-badge active">Active</span>
                    }
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-action-btn view" title="View" onClick={() => setViewUser(u)}>
                        <Eye />
                      </button>
                      <button
                        className={`admin-action-btn ${u.disabled ? "enable" : "disable"}`}
                        title={u.disabled ? "Enable" : "Disable"}
                        onClick={() => handleToggle(u)}
                      >
                        {u.disabled ? <UserCheck /> : <UserX />}
                      </button>
                      <button className="admin-action-btn delete" title="Delete" onClick={() => handleDelete(u)}>
                        <Trash2 />
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
// PAGE 3: MATERIALS (Expandable Hierarchy)
// ═══════════════════════════════════════════════════════════════
function MaterialsTab({ flash, globalSearch }: { flash: (m: string, ok?: boolean) => void; globalSearch: string }) {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterBranch, setFilterBranch] = useState("all");
  const [filterSem, setFilterSem] = useState("all");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

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

  const q = (search || globalSearch).toLowerCase();
  const filtered = materials.filter(m => {
    if (filterBranch !== "all" && m.branch !== filterBranch) return false;
    if (filterSem !== "all" && m.semester !== filterSem) return false;
    if (q) {
      if (!(m.title || "").toLowerCase().includes(q) && !(m.subject || "").toLowerCase().includes(q)) return false;
    }
    return true;
  });

  // Group: Branch → Semester → Subject → Files
  const grouped = useMemo(() => {
    const map: Record<string, Record<string, Record<string, any[]>>> = {};
    filtered.forEach(m => {
      const b = m.branch || "Other";
      const s = normalizeSemester(m.semester) || "?";
      const sub = m.subject || "General";
      if (!map[b]) map[b] = {};
      if (!map[b][s]) map[b][s] = {};
      if (!map[b][s][sub]) map[b][s][sub] = [];
      map[b][s][sub].push(m);
    });
    return map;
  }, [filtered]);

  const toggle = (key: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-toolbar-search">
          <Search />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title or subject..." />
        </div>
        <select value={filterBranch} onChange={e => setFilterBranch(e.target.value)} className="admin-filter-select">
          <option value="all">All Branches</option>
          {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select value={filterSem} onChange={e => setFilterSem(e.target.value)} className="admin-filter-select">
          <option value="all">All Semesters</option>
          {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <span className="admin-count-badge">{filtered.length} items</span>
      </div>

      {loading ? (
        <div className="admin-loading"><Loader2 style={{ width: 24, height: 24 }} /></div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="admin-table-wrap"><div className="admin-empty">No materials found.</div></div>
      ) : (
        Object.entries(grouped).map(([branch, sems]) => (
          <div key={branch} className="admin-hierarchy-group">
            <button className="admin-hierarchy-header" onClick={() => toggle(branch)}>
              <ChevronRight className={`admin-hierarchy-chevron ${expanded.has(branch) ? "open" : ""}`} />
              <span className="admin-hierarchy-header-text">{branch}</span>
              <span className="admin-hierarchy-count">
                {Object.values(sems).reduce((t, subMap) => t + Object.values(subMap).reduce((s, arr) => s + arr.length, 0), 0)} files
              </span>
            </button>
            {expanded.has(branch) && (
              <div className="admin-hierarchy-items">
                {Object.entries(sems).sort(([a],[b]) => a.localeCompare(b)).map(([sem, subjects]) => (
                  <div key={sem}>
                    <div style={{ padding: "8px 20px 4px 48px" }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: "#818cf8", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>
                        Semester {sem}
                      </span>
                    </div>
                    {Object.entries(subjects).map(([subject, files]) => (
                      <div key={subject}>
                        <div style={{ padding: "6px 20px 2px 64px" }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>{subject}</span>
                          <span style={{ fontSize: 10, color: "#94a3b8", marginLeft: 8 }}>({files.length})</span>
                        </div>
                        {files.map((m: any) => (
                          <div key={m.id} className="admin-hierarchy-item" style={{ paddingLeft: 80 }}>
                            <div>
                              <span className="admin-hierarchy-item-name">{m.title}</span>
                              <span className="admin-hierarchy-item-meta" style={{ marginLeft: 10 }}>
                                {TYPES.find(t => t.id === m.unit)?.label || m.unit}
                              </span>
                            </div>
                            <button className="admin-action-btn delete" onClick={() => handleDelete(m)}>
                              <Trash2 />
                            </button>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
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
          flash(`"${title.trim()}" uploaded successfully`);
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
    <div>
      <form onSubmit={handleUpload} className="admin-upload-card">
        {/* Branch + Semester */}
        <div className="admin-upload-grid" style={{ marginBottom: 18 }}>
          <div>
            <label className="admin-field-label">Branch</label>
            <select value={branch} onChange={e => setBranch(e.target.value)} className="admin-input" style={{ cursor: "pointer" }}>
              {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="admin-field-label">Semester</label>
            <select value={semester} onChange={e => setSemester(e.target.value)} className="admin-input" style={{ cursor: "pointer" }}>
              {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Subject */}
        <div className="admin-field">
          <label className="admin-field-label">Subject</label>
          {subjects.length === 0 ? (
            <div className="admin-alert-warn">No subjects for {branch} {semester}</div>
          ) : (
            <select value={subject} onChange={e => setSubject(e.target.value)} className="admin-input" style={{ cursor: "pointer" }}>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          )}
        </div>

        {/* Type */}
        <div className="admin-field">
          <label className="admin-field-label">Type</label>
          <div className="admin-type-pills">
            {TYPES.map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setType(t.id)}
                className={`admin-type-pill ${type === t.id ? "active" : ""}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="admin-field">
          <label className="admin-field-label">Title</label>
          <input
            ref={titleRef}
            type="text"
            required
            autoFocus
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Unit 1 Complete Notes"
            className="admin-input"
            style={{ height: 46, fontSize: 15 }}
          />
        </div>

        {/* File */}
        <div className="admin-field">
          <label className="admin-field-label">File</label>
          <div className={`admin-dropzone ${file ? "has-file" : ""}`}>
            <input ref={fileRef} type="file" required onChange={e => setFile(e.target.files?.[0] || null)} />
            <FileUp style={{ width: 20, height: 20, color: file ? "#10b981" : "#94a3b8" }} />
            <span className="admin-dropzone-text" style={{ color: file ? "#065f46" : "#64748b" }}>
              {file ? file.name : "Click to attach file"}
            </span>
          </div>
        </div>

        {/* Progress */}
        {uploading && (
          <div className="admin-field">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span className="admin-field-label" style={{ marginBottom: 0 }}>Uploading</span>
              <span className="admin-field-label" style={{ marginBottom: 0 }}>{progress}%</span>
            </div>
            <div className="admin-progress-bar">
              <div className="admin-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={uploading || !file || !title.trim() || !subject}
          className="admin-submit-btn"
        >
          {uploading ? <><Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> Uploading...</> : "Upload Material"}
        </button>
      </form>

      {/* Recent uploads */}
      {recents.length > 0 && (
        <div className="admin-recents">
          <h3 className="admin-recents-title">Recent Uploads</h3>
          {recents.map((m: any) => (
            <div key={m.id} className="admin-recent-item">
              <div style={{ minWidth: 0, flex: 1 }}>
                <p className="admin-recent-item-title">{m.title}</p>
                <p className="admin-recent-item-meta">{m.subject} · {m.branch} {normalizeSemester(m.semester)}</p>
              </div>
              <button className="admin-action-btn delete" onClick={() => handleDeleteRecent(m.id)} style={{ opacity: 1, flexShrink: 0 }}>
                <Trash2 />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
