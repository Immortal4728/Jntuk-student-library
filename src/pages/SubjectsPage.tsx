import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BookOpen, ChevronRight, FileText } from 'lucide-react';
import { insforge } from '../lib/insforge';

interface Subject {
  id: string;
  name: string;
  code: string | null;
}

export default function SubjectsPage() {
  const { branch, semesterNumber } = useParams<{ branch: string; semesterNumber: string }>();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubjects();
  }, [branch, semesterNumber]);

  const loadSubjects = async () => {
    setLoading(true);
    try {
      const { data: semData } = await insforge.database
        .from('semesters')
        .select('id')
        .eq('number', parseInt(semesterNumber || '1'))
        .maybeSingle();

      if (semData) {
        const { data, error } = await insforge.database
          .from('subjects')
          .select('id, name, code')
          .eq('semester_id', semData.id)
          .eq('branch', branch || 'CSE')
          .eq('regulation', 'R23')
          .eq('is_active', true)
          .order('name', { ascending: true });

        if (!error && data) setSubjects(data as Subject[]);
      }
    } catch (err) {
      console.error('Failed to load subjects:', err);
    } finally {
      setLoading(false);
    }
  };

  const ordinal = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
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
          <span className="text-[#2563eb]">Sem {semesterNumber}</span>
        </div>

        <h1 className="text-[1.75rem] sm:text-[2rem] font-bold text-[#0f172a] tracking-tight">
          {ordinal(parseInt(semesterNumber || '1'))} Semester
        </h1>
        <p className="mt-2 text-[0.875rem] text-[#64748b] font-medium">
          Select a subject to view materials
        </p>

        {/* Subject list */}
        <div className="mt-8 space-y-2">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-[68px] bg-white border border-[#e5e7eb] rounded-xl animate-pulse"
              />
            ))
          ) : subjects.length === 0 ? (
            <div className="py-20 text-center">
              <BookOpen size={36} className="mx-auto text-[#cbd5e1] mb-3" />
              <p className="text-[0.875rem] font-medium text-[#64748b]">No subjects added yet</p>
              <p className="text-[0.75rem] text-[#94a3b8] mt-1">Check back later</p>
            </div>
          ) : (
            subjects.map((subject) => (
              <Link
                key={subject.id}
                to={`/materials/${branch}/semester/${semesterNumber}/${subject.id}`}
                className="group flex items-center gap-4 bg-white border border-[#e5e7eb] rounded-xl p-4 hover:border-[#d1d5db] hover:shadow-sm active:scale-[0.97] transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#2563eb]/[0.06] flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-[#2563eb]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[0.9375rem] font-semibold text-[#0f172a] truncate">
                    {subject.name}
                  </h3>
                  {subject.code && (
                    <p className="text-[0.75rem] text-[#94a3b8] mt-0.5 font-mono">
                      {subject.code}
                    </p>
                  )}
                </div>
                <ChevronRight
                  size={16}
                  className="text-[#cbd5e1] group-hover:text-[#94a3b8] flex-shrink-0 transition-colors"
                />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
