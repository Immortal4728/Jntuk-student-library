import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@insforge/react';
import {
  Plus, Upload, Trash2, Save, Loader2, LogOut,
  BookOpen, GraduationCap, FileText, Flame, ClipboardList,
  ChevronDown, X, ExternalLink, Monitor, Cpu
} from 'lucide-react';
import { insforge } from '../lib/insforge';
import { useLoginModal } from '../context/LoginModalContext';

interface Semester { id: string; number: number; title: string; }
interface Subject { id: string; semester_id: string; name: string; code: string | null; branch: string; }
interface Material { id: string; subject_id: string; title: string; type: string; file_url: string | null; external_link: string | null; description: string | null; year: string | null; }

type ActiveView = 'materials' | 'upload';

export default function ControlCenter() {
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const { open: openLogin } = useLoginModal();

  const [userRole, setUserRole] = useState<string | null>(null);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);

  const [selectedBranch, setSelectedBranch] = useState<string>('CSE');
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [activeView, setActiveView] = useState<ActiveView>('materials');

  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('');
  const [materialForm, setMaterialForm] = useState({
    title: '', type: 'notes' as 'notes' | 'pyq' | 'important',
    external_link: '', description: '', year: '',
  });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [showAddSubject, setShowAddSubject] = useState(false);

  useEffect(() => { if (authLoaded && !isSignedIn) openLogin(); }, [authLoaded, isSignedIn]);

  useEffect(() => {
    if (user) {
      insforge.database.from('user_roles').select('role').eq('user_id', user.id).maybeSingle()
        .then(({ data }) => setUserRole(data?.role || null));
    }
  }, [user]);

  useEffect(() => {
    insforge.database.from('semesters').select('id, number, title').order('number', { ascending: true })
      .then(({ data }) => { if (data) setSemesters(data as Semester[]); setLoadingData(false); });
  }, []);

  useEffect(() => {
    if (selectedSemester) {
      insforge.database.from('subjects').select('*')
        .eq('semester_id', selectedSemester).eq('branch', selectedBranch).eq('regulation', 'R23')
        .order('name', { ascending: true })
        .then(({ data }) => { if (data) setSubjects(data as Subject[]); });
    } else { setSubjects([]); }
    setSelectedSubject(''); setMaterials([]);
  }, [selectedSemester, selectedBranch]);

  useEffect(() => {
    if (selectedSubject) {
      insforge.database.from('materials').select('*').eq('subject_id', selectedSubject)
        .order('created_at', { ascending: false })
        .then(({ data }) => { if (data) setMaterials(data as Material[]); });
      setActiveView('materials');
    } else { setMaterials([]); }
  }, [selectedSubject]);

  const handleAddSubject = async () => {
    if (!newSubjectName.trim() || !selectedSemester) return;
    setSaving(true);
    const { error } = await insforge.database.from('subjects')
      .insert({ semester_id: selectedSemester, name: newSubjectName.trim(), code: newSubjectCode.trim() || null, branch: selectedBranch, regulation: 'R23' })
      .select();
    if (!error) { setNewSubjectName(''); setNewSubjectCode(''); setShowAddSubject(false);
      insforge.database.from('subjects').select('*').eq('semester_id', selectedSemester).eq('branch', selectedBranch).eq('regulation', 'R23').order('name', { ascending: true })
        .then(({ data }) => { if (data) setSubjects(data as Subject[]); });
    }
    setSaving(false);
  };

  const handleDeleteSubject = async (id: string) => {
    if (!confirm('Delete this subject and all its materials?')) return;
    await insforge.database.from('subjects').delete().eq('id', id);
    insforge.database.from('subjects').select('*').eq('semester_id', selectedSemester).eq('branch', selectedBranch).eq('regulation', 'R23').order('name', { ascending: true })
      .then(({ data }) => { if (data) setSubjects(data as Subject[]); });
  };

  const handleUploadMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialForm.title.trim() || !selectedSubject) return;
    setSaving(true);
    let fileUrl = null;
    if (uploadFile) {
      const fileName = `${Date.now()}-${uploadFile.name}`;
      const { error: uploadError } = await insforge.storage.from('library-materials').upload(fileName, uploadFile);
      if (uploadError) { setSaving(false); return; }
      const publicUrlResult = insforge.storage.from('library-materials').getPublicUrl(fileName);
      fileUrl = (publicUrlResult as any)?.data?.publicUrl || null;
    }
    const { error } = await insforge.database.from('materials')
      .insert({ subject_id: selectedSubject, title: materialForm.title.trim(), type: materialForm.type, file_url: fileUrl, external_link: materialForm.external_link.trim() || null, description: materialForm.description.trim() || null, year: materialForm.year.trim() || null, uploaded_by: user?.id || null })
      .select();
    if (!error) {
      setMaterialForm({ title: '', type: 'notes', external_link: '', description: '', year: '' });
      setUploadFile(null); setActiveView('materials');
      insforge.database.from('materials').select('*').eq('subject_id', selectedSubject).order('created_at', { ascending: false })
        .then(({ data }) => { if (data) setMaterials(data as Material[]); });
    }
    setSaving(false);
  };

  const handleDeleteMaterial = async (id: string) => {
    if (!confirm('Delete this material?')) return;
    await insforge.database.from('materials').delete().eq('id', id);
    insforge.database.from('materials').select('*').eq('subject_id', selectedSubject).order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setMaterials(data as Material[]); });
  };

  const handleSignOut = async () => { await insforge.auth.signOut(); navigate('/'); };

  if (!authLoaded) return <div className="max-w-3xl mx-auto px-4 py-20 text-center"><Loader2 size={24} className="animate-spin text-accent mx-auto" /></div>;

  if (!isSignedIn) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center page-enter">
      <BookOpen size={44} className="mx-auto text-text-muted mb-3" />
      <h2 className="text-lg font-semibold text-text-primary mb-1">Access Restricted</h2>
      <p className="text-sm text-text-secondary mb-4">Sign in to access the control center</p>
      <button onClick={openLogin} className="btn-magnetic btn-primary">Sign In</button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 page-enter">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">Control Center</h1>
          <p className="text-sm text-text-secondary mt-0.5">{user?.email} · <span className="capitalize">{userRole || '...'}</span></p>
        </div>
        <button onClick={handleSignOut} className="btn-magnetic btn-ghost text-sm"><LogOut size={16} /> Sign Out</button>
      </div>

      {/* Branch Toggle */}
      <div className="flex gap-2 mb-4">
        {[{ key: 'CSE', icon: Monitor }, { key: 'ECE', icon: Cpu }].map(({ key, icon: Icon }) => (
          <button key={key} onClick={() => { setSelectedBranch(key); setSelectedSemester(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
              selectedBranch === key ? 'bg-accent text-white shadow-sm' : 'bg-surface border border-border text-text-secondary'
            }`}>
            <Icon size={16} /> {key}
          </button>
        ))}
      </div>

      {/* Semester Selector */}
      <div className="mb-4">
        <label className="text-sm font-medium text-text-primary mb-1.5 block"><GraduationCap size={14} className="inline mr-1.5 -mt-0.5" />Semester</label>
        <div className="relative">
          <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} className="input-field appearance-none pr-10 cursor-pointer" id="semester-select">
            <option value="">Select semester</option>
            {semesters.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
          <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
        </div>
      </div>

      {selectedSemester && (
        <>
          {/* Subjects */}
          <div className="flex items-center justify-between mb-3 mt-6">
            <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wider">Subjects</h2>
            <button onClick={() => setShowAddSubject(true)} className="btn-magnetic btn-primary text-xs py-1.5 px-3"><Plus size={14} /> Add</button>
          </div>

          {showAddSubject && (
            <div className="card p-4 mb-4 animate-scale-in">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-text-primary">New Subject ({selectedBranch})</h3>
                <button onClick={() => setShowAddSubject(false)} className="p-1 rounded-lg hover:bg-background"><X size={14} className="text-text-muted" /></button>
              </div>
              <div className="space-y-3">
                <input type="text" placeholder="Subject name" value={newSubjectName} onChange={(e) => setNewSubjectName(e.target.value)} className="input-field text-sm" />
                <input type="text" placeholder="Subject code (optional)" value={newSubjectCode} onChange={(e) => setNewSubjectCode(e.target.value)} className="input-field text-sm" />
                <button onClick={handleAddSubject} disabled={saving || !newSubjectName.trim()} className="btn-magnetic btn-primary text-sm w-full">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <><Save size={14} /> Save</>}
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {subjects.length === 0 ? (
              <p className="text-sm text-text-muted text-center py-8">No subjects yet for {selectedBranch}. Add one above.</p>
            ) : subjects.map((s) => (
              <div key={s.id} className={`card flex items-center gap-3 p-3.5 cursor-pointer transition-all duration-200 active:scale-[0.97] ${
                selectedSubject === s.id ? 'border-accent bg-accent/5' : 'card-interactive'
              }`} onClick={() => setSelectedSubject(s.id)}>
                <div className="w-9 h-9 bg-accent/8 rounded-lg flex items-center justify-center flex-shrink-0"><FileText size={16} className="text-accent" /></div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-text-primary text-sm truncate">{s.name}</h3>
                  {s.code && <p className="text-xs text-text-muted font-mono">{s.code}</p>}
                </div>
                {userRole === 'admin' && (
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteSubject(s.id); }}
                    className="p-2 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={14} /></button>
                )}
              </div>
            ))}
          </div>

          {/* Materials */}
          {selectedSubject && (
            <div className="mt-6 animate-slide-up">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wider">Materials</h2>
                <button onClick={() => setActiveView(activeView === 'upload' ? 'materials' : 'upload')}
                  className="btn-magnetic btn-primary text-xs py-1.5 px-3">
                  {activeView === 'upload' ? <><X size={14} /> Cancel</> : <><Upload size={14} /> Upload</>}
                </button>
              </div>

              {activeView === 'upload' && (
                <form onSubmit={handleUploadMaterial} className="card p-4 mb-4 space-y-3 animate-scale-in">
                  <input type="text" placeholder="Material title" value={materialForm.title} onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })} className="input-field text-sm" required />
                  <div className="flex gap-2">
                    {(['notes', 'pyq', 'important'] as const).map((t) => (
                      <button key={t} type="button" onClick={() => setMaterialForm({ ...materialForm, type: t })}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-200 active:scale-[0.97] ${
                          materialForm.type === t
                            ? t === 'important' ? 'bg-red-50 text-red-600 border border-red-200'
                              : t === 'pyq' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                              : 'bg-accent/10 text-accent border border-accent/20'
                            : 'bg-background text-text-secondary border border-border'
                        }`}>
                        {t === 'important' && <Flame size={12} className="inline mr-1 -mt-0.5" />}
                        {t === 'pyq' && <ClipboardList size={12} className="inline mr-1 -mt-0.5" />}
                        {t === 'notes' && <FileText size={12} className="inline mr-1 -mt-0.5" />}
                        {t === 'pyq' ? 'PYQ' : t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                  <input type="text" placeholder="Year (optional)" value={materialForm.year} onChange={(e) => setMaterialForm({ ...materialForm, year: e.target.value })} className="input-field text-sm" />
                  <input type="text" placeholder="Description (optional)" value={materialForm.description} onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })} className="input-field text-sm" />
                  <input type="url" placeholder="External link (optional)" value={materialForm.external_link} onChange={(e) => setMaterialForm({ ...materialForm, external_link: e.target.value })} className="input-field text-sm" />
                  <input type="file" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} className="input-field text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-accent/10 file:text-accent file:cursor-pointer" />
                  <button type="submit" disabled={saving || !materialForm.title.trim()} className="btn-magnetic btn-primary w-full text-sm">
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <><Upload size={14} /> Upload Material</>}
                  </button>
                </form>
              )}

              {activeView === 'materials' && (
                <div className="space-y-2">
                  {materials.length === 0 ? (
                    <p className="text-sm text-text-muted text-center py-8">No materials yet.</p>
                  ) : materials.map((m) => (
                    <div key={m.id} className="card flex items-center gap-3 p-3.5">
                      <div className={m.type === 'important' ? 'text-red-500' : m.type === 'pyq' ? 'text-emerald-600' : 'text-accent'}>
                        {m.type === 'important' ? <Flame size={16} /> : m.type === 'pyq' ? <ClipboardList size={16} /> : <FileText size={16} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-text-primary text-sm truncate">{m.title}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                            m.type === 'important' ? 'bg-red-50 text-red-600' : m.type === 'pyq' ? 'bg-emerald-50 text-emerald-600' : 'bg-accent/10 text-accent'
                          }`}>{m.type === 'pyq' ? 'PYQ' : m.type}</span>
                          {m.year && <span className="text-[10px] text-text-muted">{m.year}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {(m.file_url || m.external_link) && (
                          <a href={m.file_url || m.external_link || '#'} target="_blank" rel="noopener noreferrer"
                            className="p-2 rounded-lg text-text-muted hover:text-accent hover:bg-accent/5 transition-colors"><ExternalLink size={14} /></a>
                        )}
                        <button onClick={() => handleDeleteMaterial(m.id)}
                          className="p-2 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {!selectedSemester && !loadingData && (
        <div className="text-center py-16">
          <GraduationCap size={44} className="mx-auto text-text-muted mb-3" />
          <p className="text-text-secondary text-sm">Select branch and semester to manage content</p>
        </div>
      )}
    </div>
  );
}
