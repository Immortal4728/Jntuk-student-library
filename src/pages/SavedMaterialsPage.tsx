import { Bookmark } from "lucide-react";

export default function SavedMaterialsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
          Saved Materials
        </h1>
        <p className="text-slate-500 mt-1">
          Quick access to your bookmarked resources.
        </p>
      </header>

      <div className="bg-white rounded-xl border border-slate-200 p-12 flex flex-col items-center justify-center text-center shadow-sm">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-5">
          <Bookmark className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">
          No saved materials yet
        </h3>
        <p className="text-slate-500 mt-1.5 text-sm max-w-xs">
          Subjects you bookmark from the Materials page will appear here for
          quick access.
        </p>
      </div>
    </div>
  );
}
