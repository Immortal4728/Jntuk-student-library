import { Link } from 'react-router-dom';
import { Monitor, Cpu, Terminal, Bot, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const branches = [
  {
    key: 'CSE',
    label: 'CSE',
    fullName: 'Computer Science & Engineering',
    icon: Monitor,
    accent: '#2563eb', // blue-600
    bg: 'bg-blue-50',
  },
  {
    key: 'IT',
    label: 'IT',
    fullName: 'Information Technology',
    icon: Terminal,
    accent: '#0ea5e9', // sky-500
    bg: 'bg-sky-50',
  },
  {
    key: 'AIML',
    label: 'CSE-AIML',
    fullName: 'Artificial Intelligence & Machine Learning',
    icon: Bot,
    accent: '#10b981', // emerald-500
    bg: 'bg-emerald-50',
  },
  {
    key: 'ECE',
    label: 'ECE',
    fullName: 'Electronics & Communication Engineering',
    icon: Cpu,
    accent: '#7c3aed', // violet-600
    bg: 'bg-violet-50',
  },

];

export default function MaterialsPage() {
  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-4rem)]">
      <div className="max-w-3xl mx-auto px-5 pt-12 pb-24 md:pt-16 md:pb-28">

        {/* Header Section */}
        <div className="flex flex-col gap-2.5">
          <h1 className="text-[2rem] md:text-[2.5rem] font-bold text-[#0f172a] tracking-tight leading-none">
            Materials
          </h1>
          <p className="text-[1rem] text-[#64748b] font-medium">
            Select your branch to continue
          </p>

          <div className="inline-flex self-start items-center gap-2 px-3 py-1.5 mt-2 rounded-full bg-blue-50 border border-blue-100/50">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span className="text-[13px] font-bold text-blue-700">R23 Regulation</span>
          </div>
        </div>

        {/* Branch Selection List */}
        <div className="mt-8 flex flex-col gap-4">
          {branches.map((branch, index) => {
            const Icon = branch.icon;
            return (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
                key={branch.key}
              >
                <Link
                  to={`/materials/${branch.key}`}
                  className="group block w-full bg-white border border-[#e2e8f0] rounded-2xl p-4 sm:p-5 hover:border-[#cbd5e1] hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)] active:scale-[0.98] transition-all duration-200"
                >
                  <div className="flex items-center justify-between gap-4">

                    {/* Left: Icon + Text Content */}
                    <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                      <div
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${branch.bg} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}
                      >
                        <Icon size={26} style={{ color: branch.accent }} strokeWidth={2.25} />
                      </div>

                      <div className="flex flex-col justify-center min-w-0 pr-2">
                        <span className="text-[1.125rem] sm:text-[1.25rem] font-bold text-[#0f172a] tracking-tight leading-none mb-1.5">
                          {branch.label}
                        </span>
                        <span className="text-[0.875rem] sm:text-[0.9375rem] text-[#64748b] font-medium leading-snug truncate sm:whitespace-normal">
                          {branch.fullName}
                        </span>
                      </div>
                    </div>

                    {/* Right: Navigation Arrow */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#f8fafc] group-hover:bg-[#f1f5f9] flex items-center justify-center text-[#94a3b8] group-hover:text-[#475569] transition-colors">
                      <ChevronRight size={20} strokeWidth={2.5} />
                    </div>

                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
