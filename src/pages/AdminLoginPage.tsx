import { Lock } from 'lucide-react';

export default function AdminLoginPage() {
  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-3.5rem)] flex items-start justify-center pt-20 px-5">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#0f172a] flex items-center justify-center">
            <Lock size={14} className="text-white" />
          </div>
          <span className="text-[0.9375rem] font-semibold text-[#0f172a]">Admin Login</span>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-[0.8125rem] font-medium text-[#0f172a] mb-1.5">
              Email
            </label>
            <input
              type="email"
              placeholder="admin@jntuk.edu"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e7eb] bg-white text-[0.875rem] text-[#0f172a] placeholder:text-[#94a3b8] outline-none focus:border-[#0f172a] focus:ring-2 focus:ring-[#0f172a]/10 transition-all"
            />
          </div>
          <div>
            <label className="block text-[0.8125rem] font-medium text-[#0f172a] mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e7eb] bg-white text-[0.875rem] text-[#0f172a] placeholder:text-[#94a3b8] outline-none focus:border-[#0f172a] focus:ring-2 focus:ring-[#0f172a]/10 transition-all"
            />
          </div>
          <button
            type="submit"
            className="w-full mt-2 bg-[#0f172a] text-white py-2.5 rounded-xl text-[0.875rem] font-semibold shadow-sm hover:bg-black active:scale-[0.97] transition-all"
          >
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
}
