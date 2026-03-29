import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Materials', path: '/materials' },
  { name: 'About', path: '/about' },
];

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-[#e2e5ea] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 h-[3.5rem] sm:h-[3.75rem] flex items-center justify-between">
          {/* Left: Logo */}
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 active:scale-[0.97] transition-transform z-10"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shadow-sm">
              <BookOpen size={15} className="text-white" />
            </div>
            <span className="text-[0.9375rem] font-bold text-[#0f172a] tracking-tight">
              JNTUK Library
            </span>
          </Link>

          {/* Center: Navigation links */}
          <div className="hidden md:flex items-center gap-7 absolute left-1/2 -translate-x-1/2">
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
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-[0.8125rem] font-semibold hover:bg-slate-800 shadow-[0_2px_12px_rgba(15,23,42,0.2)] active:scale-[0.97] transition-all duration-200"
            >
              Student Login
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg text-[#0f172a] hover:bg-[#f1f5f9] active:scale-[0.95] transition-all z-10 relative"
            aria-label="Open menu"
          >
            <Menu size={20} strokeWidth={2.5} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Slide Panel */}
      <AnimatePresence>
        {open && (
          <div className="md:hidden fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-[#0f172a]/20 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Slide-in Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="relative w-[85%] max-w-[340px] h-full bg-white shadow-2xl flex flex-col"
            >
              {/* Top Header */}
              <div className="flex items-center justify-between px-6 min-h-[4.5rem] border-b border-[#e5e7eb]/80">
                <span className="text-[1.0625rem] font-bold text-[#0f172a] tracking-tight">
                  JNTUK Library
                </span>
                <button
                  onClick={() => setOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f8fafc] text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] active:scale-95 transition-all"
                  aria-label="Close menu"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto w-full">
                {navLinks.map((link) => {
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setOpen(false)}
                      className={`relative flex items-center w-full px-5 h-[3.25rem] rounded-xl text-[1.125rem] font-semibold active:scale-[0.98] transition-all ${
                        active
                          ? 'bg-[#f1f5f9] text-[#0f172a]'
                          : 'text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]'
                      }`}
                    >
                      {active && (
                        <motion.div
                          layoutId="activeNavMobile"
                          className="absolute left-0 top-[20%] bottom-[20%] w-1.5 bg-[#0f172a] rounded-r-full"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      {link.name}
                    </Link>
                  );
                })}
              </div>

              {/* CTA Section */}
              <div className="p-5 pb-8 border-t border-[#e5e7eb]/80 bg-[#f8fafc]/50">
                <Link
                  to="/login/student"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center w-full h-[3.5rem] rounded-xl bg-[#0f172a] text-white text-[1.0625rem] font-bold active:scale-[0.98] transition-all shadow-[0_4px_16px_rgba(15,23,42,0.15)] focus:ring-2 focus:ring-offset-2 focus:ring-[#0f172a]"
                >
                  Student Login
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
