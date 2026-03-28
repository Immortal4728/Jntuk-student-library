import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Materials', path: '/materials' },
  { name: 'About', path: '/about' },
];

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#e5e7eb]">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 active:scale-[0.97] transition-transform z-10"
        >
          <div className="w-8 h-8 rounded-lg bg-[#2563eb] flex items-center justify-center shadow-sm">
            <BookOpen size={16} className="text-white" />
          </div>
          <span className="text-[0.9375rem] font-bold text-[#0f172a] tracking-tight">
            JNTUK Library
          </span>
        </Link>

        {/* Center: Navigation links */}
        <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-[0.875rem] font-semibold transition-colors ${
                isActive(link.path)
                  ? 'text-[#0f172a]'
                  : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right: Authentication group */}
        <div className="hidden md:flex items-center gap-3 z-10">
          <Link
            to="/login/student"
            className="px-4 py-2 rounded-xl bg-[#2563eb] text-white text-[0.8125rem] font-semibold hover:bg-[#1d4ed8] shadow-[0_2px_8px_rgba(37,99,235,0.2)] active:scale-[0.97] transition-all"
          >
            Student Login
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg text-[#64748b] hover:bg-[#f1f5f9] active:scale-[0.95] transition-all z-10 relative"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[#e5e7eb] bg-white px-5 py-4 shadow-lg absolute w-full">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={`block px-4 py-3 rounded-xl text-[0.9375rem] font-medium active:scale-[0.97] transition-all ${
                  isActive(link.path)
                    ? 'text-[#2563eb] bg-[#2563eb]/[0.06]'
                    : 'text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-[#e5e7eb] flex flex-col gap-2.5">
            <Link
              to="/login/student"
              onClick={() => setOpen(false)}
              className="w-full text-center py-3 rounded-xl bg-[#2563eb] text-white text-[0.9375rem] font-semibold hover:bg-[#1d4ed8] active:scale-[0.98] transition-all shadow-[0_2px_8px_rgba(37,99,235,0.2)]"
            >
              Student Login
            </Link>
            {/* Admin Login hidden per request */}
          </div>
        </div>
      )}
    </nav>
  );
}
