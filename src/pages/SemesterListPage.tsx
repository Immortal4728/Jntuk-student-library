import { Link, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const semesterData = [
  { number: 1, label: '1st Semester', year: 'First Year' },
  { number: 2, label: '2nd Semester', year: 'First Year' },
  { number: 3, label: '3rd Semester', year: 'Second Year' },
  { number: 4, label: '4th Semester', year: 'Second Year' },
  { number: 5, label: '5th Semester', year: 'Third Year' },
  { number: 6, label: '6th Semester', year: 'Third Year' },
  { number: 7, label: '7th Semester', year: 'Fourth Year' },
  { number: 8, label: '8th Semester', year: 'Fourth Year' },
];

export default function SemesterListPage() {
  const { branch } = useParams<{ branch: string }>();

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-5xl mx-auto px-5 pt-16 pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-[0.75rem] font-medium text-[#94a3b8]">
          <Link to="/materials" className="hover:text-[#64748b] transition-colors">
            Materials
          </Link>
          <ChevronRight size={12} />
          <span className="text-[#2563eb]">{branch}</span>
          <span>·</span>
          <span>R23</span>
        </div>

        <h1 className="text-[1.75rem] sm:text-[2rem] font-bold text-[#0f172a] tracking-tight">
          Select Semester
        </h1>

        {/* Semester list */}
        <div className="mt-8 space-y-2">
          {semesterData.map((sem) => (
            <Link
              key={sem.number}
              to={`/materials/${branch}/semester/${sem.number}`}
              className="group flex items-center gap-4 bg-white border border-[#e5e7eb] rounded-xl p-4 hover:border-[#d1d5db] hover:shadow-sm active:scale-[0.97] transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[#f8fafc] border border-[#e5e7eb] flex items-center justify-center text-[0.875rem] font-bold text-[#0f172a] flex-shrink-0">
                {sem.number}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[0.9375rem] font-semibold text-[#0f172a]">
                  {sem.label}
                </h3>
                <p className="text-[0.75rem] text-[#94a3b8] mt-0.5">
                  {sem.year}
                </p>
              </div>
              <ChevronRight
                size={16}
                className="text-[#cbd5e1] group-hover:text-[#94a3b8] flex-shrink-0 transition-colors"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
