import { useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LogOut,
  Menu,
  X,
  AlertCircle,
  Settings,
  LayoutDashboard,
  GraduationCap,
  LibraryBig,
  FileBadge,
  Sparkles,
  Sun,
  ChevronRight
} from "lucide-react";

import { getDisplaySemester } from "../lib/utils";
import { UserAvatar } from "./ui/UserAvatar";

interface DashboardSidebarProps {
  onOpenBacklogModal: () => void;
  onOpenProfileEdit: () => void;
  onOpenContextSwitcher: () => void;
}

export default function DashboardSidebar({
  onOpenBacklogModal,
  onOpenProfileEdit,
  onOpenContextSwitcher,
}: DashboardSidebarProps) {
  const { user, signOut, profile } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleThemeToggle = useCallback(() => {
    setIsToggling(true);
    toggleTheme();
    setTimeout(() => setIsToggling(false), 500);
  }, [toggleTheme]);

  const toggleSidebar = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", description: "Overview & stats" },
    { to: "/dashboard/tracker", icon: GraduationCap, label: "CGPA Calculator", description: "Track your GPA" },
    { to: "/dashboard/materials", icon: LibraryBig, label: "Materials", description: "Notes & PYQs" },
    { to: "/dashboard/results", icon: FileBadge, label: "Results Hub", description: "View results" },
    {
      to: "#backlogs",
      icon: AlertCircle,
      label: "Backlog Tracker",
      description: "Manage backlogs",
      isAction: true,
      onClick: () => {
        onOpenBacklogModal();
        setIsMobileMenuOpen(false);
      },
    },
  ];

  const displayName =
    profile.name ||
    user?.email?.split("@")[0] ||
    "Student";



  return (
    <>
      {/* ── MOBILE TOP BAR ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-navy-800/95 backdrop-blur-xl border-b border-white/5 px-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-2.5">
          {/* Logo — Theme Toggle */}
          <button
            onClick={handleThemeToggle}
            title="Toggle Theme"
            className={`theme-logo-btn w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center shadow-glow-sm ${isToggling ? 'toggling' : ''}`}
          >
            {theme === 'dark' ? (
              <Sparkles className="w-3.5 h-3.5 text-white" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-white" />
            )}
          </button>
          <span className="font-display font-bold text-sm tracking-tight text-white">
            JNTUK <span className="text-violet-400">Academic</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenContextSwitcher}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-violet-accent/15 text-violet-300 rounded-full text-[11px] font-semibold hover:bg-violet-accent/20 transition-colors border border-violet-500/20"
          >
            {profile.branch} • {getDisplaySemester(profile.semester)} Sem
            <ChevronRight className="w-2.5 h-2.5 opacity-60" />
          </button>
          <button
            onClick={toggleSidebar}
            className="p-2 -mr-2 text-slate-400 hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* ── MOBILE OVERLAY ── */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside
        className={`
        fixed md:static inset-y-0 left-0 z-40 w-[280px] flex flex-col transition-transform duration-300 ease-in-out
        bg-gradient-to-b from-navy-800 to-navy-700 border-r border-white/[0.04]
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {/* Logo — Theme Toggle */}
        <div className="px-5 pt-5 pb-3 hidden md:flex items-center gap-3">
          <button
            onClick={handleThemeToggle}
            title="Toggle Theme"
            className={`theme-logo-btn w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center shadow-glow-sm group/logo relative ${isToggling ? 'toggling' : ''}`}
          >
            {theme === 'dark' ? (
              <Sparkles className="w-4.5 h-4.5 text-white" />
            ) : (
              <Sun className="w-4.5 h-4.5 text-white" />
            )}
            {/* Tooltip */}
            <span className="absolute left-full ml-3 px-2 py-1 rounded-md bg-navy-700 text-[10px] font-bold text-slate-300 whitespace-nowrap opacity-0 group-hover/logo:opacity-100 pointer-events-none transition-opacity duration-200 border border-white/[0.06] shadow-lg">
              {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </span>
          </button>
          <div>
            <h1 className="font-display font-bold text-[15px] text-white tracking-tight leading-none">
              JNTUK <span className="text-violet-400">Academic</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5 tracking-wider uppercase">
              Command Center
            </p>
          </div>
        </div>

        {/* Profile Section */}
        <div className="px-4 py-4 mt-14 md:mt-2">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] transition-all duration-300">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <UserAvatar
                photoURL={profile.photoURL}
                name={displayName}
                className="w-11 h-11 rounded-xl ring-2 ring-violet-500/30 shadow-glow-sm"
              />
              {/* Info */}
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-[13px] text-white truncate leading-tight">
                  {displayName}
                </h2>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-md border border-violet-500/10">
                    {profile.branch}
                  </span>
                  <span className="text-[10px] font-medium text-slate-500">
                    {getDisplaySemester(profile.semester)} Sem
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={onOpenProfileEdit}
                className="flex-1 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.05] rounded-lg h-8 transition-all duration-200"
              >
                <Settings className="w-3 h-3" />
                Edit
              </button>
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="flex-1 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-red-400/70 hover:text-red-300 bg-red-500/[0.04] hover:bg-red-500/[0.08] border border-red-500/[0.08] rounded-lg h-8 transition-all duration-200"
              >
                <LogOut className="w-3 h-3" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-0.5">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.1em] px-3 mb-2 mt-1">
            Navigation
          </p>
          {navItems.map((item) =>
            item.isAction ? (
              <button
                key={item.label}
                onClick={item.onClick}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-slate-500 hover:text-white hover:bg-white/[0.04] group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center group-hover:bg-violet-accent/10 transition-all duration-200">
                  <item.icon className="w-[16px] h-[16px] group-hover:text-violet-400 transition-colors" />
                </div>
                <div className="text-left">
                  <span className="text-[13px] font-medium block leading-tight">{item.label}</span>
                  <span className="text-[10px] text-slate-600 group-hover:text-slate-500 leading-none">{item.description}</span>
                </div>
              </button>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/dashboard"}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "bg-gradient-to-r from-violet-600/15 to-purple-600/10 text-white border border-violet-500/15 shadow-glow-sm"
                      : "text-slate-500 hover:text-white hover:bg-white/[0.04]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                      isActive 
                        ? "bg-violet-600/20" 
                        : "bg-white/[0.03] group-hover:bg-violet-accent/10"
                    }`}>
                      <item.icon className={`w-[16px] h-[16px] transition-colors ${
                        isActive ? "text-violet-400" : "group-hover:text-violet-400"
                      }`} />
                    </div>
                    <div className="text-left">
                      <span className="text-[13px] font-medium block leading-tight">{item.label}</span>
                      <span className={`text-[10px] leading-none ${
                        isActive ? "text-violet-400/60" : "text-slate-600 group-hover:text-slate-500"
                      }`}>{item.description}</span>
                    </div>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(124,58,237,0.6)] animate-pulse-dot" />
                    )}
                  </>
                )}
              </NavLink>
            )
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.04]">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-slate-600 font-medium tracking-wider">
              JNTUK ACADEMIC • v2.0
            </p>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] text-emerald-500/70 font-medium">Live</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── LOGOUT CONFIRMATION MODAL ── */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsLogoutModalOpen(false)}
          />
          <div className="relative w-full max-w-sm bg-navy-800 border border-white/[0.08] rounded-2xl shadow-modal overflow-hidden animate-scale-in">
            <div className="p-6">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
                <LogOut className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight mb-2">
                Sign Out
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Are you sure you want to sign out? You will need to log back in to access your command center.
              </p>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="flex-1 h-10 flex items-center justify-center rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-sm font-semibold text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsLogoutModalOpen(false);
                    signOut().then(() => navigate("/"));
                  }}
                  className="flex-1 h-10 flex items-center justify-center rounded-xl bg-red-500 hover:bg-red-600 text-sm font-semibold text-white transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
