import { ExternalLink, Ribbon } from "lucide-react";

export default function ResultsHubPage() {
  const results = [
    { sem: "1-1 Semester", link: "https://saitirumalaresults.com/view-results-483.html" },
    { sem: "1-2 Semester", link: "https://saitirumalaresults.com/view-results-512.html" },
    { sem: "2-1 Semester", link: "https://saitirumalaresults.com/view-results-525.html" },
    { sem: "2-2 Semester", link: "https://saitirumalaresults.com/view-results-555.html" },
    { sem: "3-1 Semester", link: "https://saitirumalaresults.com/view-results-572.html" }
  ];

  return (
    <div className="bg-[#f8fafc] min-h-full font-sans pb-24 md:pb-8 flex flex-col space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-6 md:p-8 md:m-0 -m-4 md:rounded-[2.5rem]">
      {/* ── HEADER ── */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <Ribbon className="w-8 h-8 text-indigo-500" />
          Student Results Hub
        </h1>
        <p className="text-[13px] font-bold text-slate-500 uppercase tracking-widest">
          View your official semester-wise results below
        </p>
      </div>

      {/* ── GRID LAYOUT ── */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
        {results.map((r, i) => {
          const isLatest = i === results.length - 1;

          return (
            <div 
              key={i} 
              className="group relative bg-white border border-gray-200 rounded-[1.25rem] p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col justify-between items-start min-h-[160px]"
            >
              {isLatest && (
                <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-lg shadow-sm">
                  Latest
                </div>
              )}

              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                  {r.sem}
                </h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                  View official result
                </p>
              </div>

              <a
                href={r.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[13px] font-bold shadow-sm hover:shadow-indigo-500/25 hover:scale-[1.03] active:scale-95 transition-all w-full justify-center md:w-auto md:justify-start"
              >
                View Result
                <ExternalLink className="w-4 h-4 ml-0.5" />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
