import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Flame, FileText, ClipboardList, Download, ExternalLink, BookOpen, ChevronRight } from 'lucide-react';
import { insforge } from '../lib/insforge';

interface Material {
  id: string;
  title: string;
  type: 'notes' | 'pyq' | 'important';
  file_url: string | null;
  external_link: string | null;
  description: string | null;
  year: string | null;
}

interface Subject {
  id: string;
  name: string;
  code: string | null;
}

type TabType = 'important' | 'notes' | 'pyq';

const tabs: { key: TabType; label: string; icon: typeof Flame }[] = [
  { key: 'important', label: 'Important', icon: Flame },
  { key: 'notes', label: 'Notes', icon: FileText },
  { key: 'pyq', label: 'PYQs', icon: ClipboardList },
];

export default function FilesPage() {
  const { branch, semesterNumber, subjectId } = useParams();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('important');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [subjectId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: subData } = await insforge.database
        .from('subjects')
        .select('id, name, code')
        .eq('id', subjectId)
        .maybeSingle();
      if (subData) setSubject(subData as Subject);

      const { data, error } = await insforge.database
        .from('materials')
        .select('*')
        .eq('subject_id', subjectId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (!error && data) setMaterials(data as Material[]);
    } catch (err) {
      console.error('Failed to load:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = materials.filter((m) => m.type === activeTab);

  const typeColor: Record<TabType, string> = {
    important: '#ef4444',
    notes: '#2563eb',
    pyq: '#16a34a',
  };

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-5xl mx-auto px-5 pt-16 pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-[0.75rem] font-medium text-[#94a3b8] flex-wrap">
          <Link to="/materials" className="hover:text-[#64748b] transition-colors">Materials</Link>
          <ChevronRight size={12} />
          <Link to={`/materials/${branch}`} className="hover:text-[#64748b] transition-colors">{branch}</Link>
          <ChevronRight size={12} />
          <Link to={`/materials/${branch}/semester/${semesterNumber}`} className="hover:text-[#64748b] transition-colors">
            Sem {semesterNumber}
          </Link>
          <ChevronRight size={12} />
          <span className="text-[#2563eb] truncate max-w-[140px]">{subject?.name || '...'}</span>
        </div>

        {/* Header */}
        {loading ? (
          <div className="h-8 w-48 bg-white border border-[#e5e7eb] rounded-lg animate-pulse" />
        ) : subject ? (
          <>
            <h1 className="text-[1.75rem] sm:text-[2rem] font-bold text-[#0f172a] tracking-tight">
              {subject.name}
            </h1>
            {subject.code && (
              <p className="text-[0.8125rem] text-[#94a3b8] mt-1 font-mono">{subject.code}</p>
            )}
          </>
        ) : (
          <h1 className="text-[1.5rem] font-bold text-[#0f172a]">Subject not found</h1>
        )}

        {/* Tabs */}
        <div className="mt-8 flex gap-1 p-1 bg-white border border-[#e5e7eb] rounded-xl">
          {tabs.map((tab) => {
            const count = materials.filter((m) => m.type === tab.key).length;
            const isActive = activeTab === tab.key;
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[0.8125rem] font-semibold transition-all active:scale-[0.97] ${
                  isActive
                    ? 'bg-[#f8fafc] text-[#0f172a] shadow-sm'
                    : 'text-[#94a3b8] hover:text-[#64748b]'
                }`}
              >
                <Icon size={14} />
                {tab.label}
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-[#2563eb]/[0.08] text-[#2563eb]' : 'bg-[#f1f5f9] text-[#94a3b8]'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Materials list */}
        <div className="mt-6 space-y-2">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="h-[72px] bg-white border border-[#e5e7eb] rounded-xl animate-pulse" />
            ))
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <BookOpen size={36} className="mx-auto text-[#cbd5e1] mb-3" />
              <p className="text-[0.875rem] font-medium text-[#64748b]">
                No {activeTab === 'pyq' ? 'PYQs' : activeTab} available yet
              </p>
              <p className="text-[0.75rem] text-[#94a3b8] mt-1">Check back later</p>
            </div>
          ) : (
            filtered.map((mat) => {
              const href = mat.file_url || mat.external_link;
              const isExternal = !!mat.external_link && !mat.file_url;
              const color = typeColor[mat.type];

              return (
                <div
                  key={mat.id}
                  className="bg-white border border-[#e5e7eb] rounded-xl p-4 flex items-start gap-3"
                >
                  <div className="mt-0.5" style={{ color }}>
                    {mat.type === 'important' ? (
                      <Flame size={18} />
                    ) : mat.type === 'pyq' ? (
                      <ClipboardList size={18} />
                    ) : (
                      <FileText size={18} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[0.9375rem] font-semibold text-[#0f172a] leading-snug">
                      {mat.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {mat.year && (
                        <span className="text-[0.6875rem] text-[#94a3b8] font-mono">{mat.year}</span>
                      )}
                      {mat.description && (
                        <span className="text-[0.75rem] text-[#94a3b8]">{mat.description}</span>
                      )}
                    </div>
                  </div>
                  {href && (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[0.75rem] font-semibold active:scale-[0.95] transition-all ${
                        isExternal
                          ? 'bg-white border border-[#e5e7eb] text-[#64748b] hover:bg-[#f8fafc]'
                          : 'bg-[#2563eb] text-white hover:bg-[#1d4ed8] shadow-sm'
                      }`}
                    >
                      {isExternal ? <ExternalLink size={13} /> : <Download size={13} />}
                      {isExternal ? 'Open' : 'Download'}
                    </a>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
