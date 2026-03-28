import { Link } from 'react-router-dom';
import { Monitor, Cpu, ChevronRight } from 'lucide-react';

const branches = [
  {
    key: 'CSE',
    label: 'CSE',
    fullName: 'Computer Science & Engineering',
    icon: Monitor,
    accent: '#2563eb',
    bg: 'bg-[#2563eb]/[0.06]',
  },
  {
    key: 'ECE',
    label: 'ECE',
    fullName: 'Electronics & Communication Engineering',
    icon: Cpu,
    accent: '#7c3aed',
    bg: 'bg-[#7c3aed]/[0.06]',
  },
];

export default function MaterialsPage() {
  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-4rem)]">
      <div className="max-w-5xl mx-auto px-5 pt-12 pb-24 md:pt-16 md:pb-28">
        {/* Header - Mobile first */}
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl lg:text-[2.25rem] font-bold text-[#0f172a] tracking-tight">
            Materials
          </h1>
          <p className="text-[15px] lg:text-base text-[#64748b] font-medium leading-relaxed">
            Select your branch to continue
          </p>

          <div className="inline-flex self-start items-center gap-2 px-3 py-1.5 mt-2 rounded-full bg-[#2563eb]/[0.07]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
            <span className="text-[13px] font-semibold text-[#2563eb]">R23 Regulation</span>
          </div>
        </div>

        {/* Branch Flow - Mobile: Stacked, Desktop: Grid */}
        <div className="mt-10 flex flex-col gap-4 md:grid md:grid-cols-2 lg:gap-6">
          {branches.map((branch) => {
            const Icon = branch.icon;
            return (
              <Link
                key={branch.key}
                to={`/materials/${branch.key}`}
                className="group w-full bg-white border border-[#e5e7eb] rounded-[1.25rem] p-5 md:p-6 hover:border-[#cbd5e1] active:scale-[0.98] transition-all flex items-center md:items-start gap-4 shadow-sm hover:shadow-md"
              >
                <div
                  className={`w-14 h-14 md:w-12 md:h-12 rounded-xl ${branch.bg} flex items-center justify-center flex-shrink-0`}
                >
                  <Icon size={24} className="md:w-5 md:h-5" style={{ color: branch.accent }} />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h2 className="text-[17px] md:text-[1rem] font-semibold text-[#0f172a] leading-tight">
                    {branch.label}
                  </h2>
                  <p className="text-[14px] md:text-[0.8125rem] text-[#64748b] mt-1 line-clamp-1">
                    {branch.fullName}
                  </p>
                  <div
                    className="mt-3 hidden md:inline-flex items-center gap-1.5 text-[13px] font-semibold"
                    style={{ color: branch.accent }}
                  >
                    View Semesters
                    <ChevronRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </div>
                </div>
                
                {/* Mobile Right Arrow */}
                <div className="md:hidden flex-shrink-0 text-[#94a3b8] group-active:text-[#0f172a] transition-colors">
                  <ChevronRight size={20} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
