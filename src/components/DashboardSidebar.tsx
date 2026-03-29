import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LogOut,
  Menu,
  X,
  Bookmark,
  AlertCircle,
  UserCircle,
  Settings,
  LayoutDashboard,
  GraduationCap,
  LibraryBig,
  Pencil,
} from "lucide-react";
import { Button } from "./ui/button";
import { getDisplaySemester } from "../lib/utils";

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
  const navigate = useNavigate();

  const toggleSidebar = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/dashboard/materials", icon: LibraryBig, label: "Materials" },
    { to: "/dashboard/saved", icon: Bookmark, label: "Saved Materials" },
    {
      to: "#backlogs",
      icon: AlertCircle,
      label: "Update Backlogs",
      isAction: true,
      onClick: () => {
        onOpenBacklogModal();
        setIsMobileMenuOpen(false);
      },
    },
    {
      to: "/dashboard/tracker",
      icon: GraduationCap,
      label: "Academic Tracker",
    },
  ];

  const displayName =
    profile.name ||
    user?.email?.split("@")[0] ||
    "Student";

  return (
    <>
      {/* ── MOBILE TOP BAR ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-2.5">
          {/* Mini profile image in mobile bar */}
          {profile.photoURL ? (
            <img
              src={profile.photoURL}
              alt=""
              className="w-7 h-7 rounded-full object-cover border border-slate-200"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
              <UserCircle className="w-5 h-5 text-slate-400" />
            </div>
          )}
          <span className="font-bold text-sm tracking-tight text-slate-900">
            JNTUK Hub
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenContextSwitcher}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 text-white rounded-full text-[11px] font-semibold shadow-sm hover:bg-slate-800 transition-colors"
          >
            {profile.branch} • {getDisplaySemester(profile.semester)} Sem
            <Pencil className="w-2.5 h-2.5 opacity-60" />
          </button>
          <button
            onClick={toggleSidebar}
            className="p-2 -mr-2 text-slate-600"
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
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30 transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside
        className={`
        fixed md:static inset-y-0 left-0 z-40 w-[280px] bg-white border-r border-slate-200/60 flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {/* Profile Section */}
        <div className="p-5 pb-4 border-b border-slate-100 flex flex-col items-center text-center mt-14 md:mt-0">
          {/* Profile Image */}
          {profile.photoURL ? (
            <img
              src={profile.photoURL}
              alt={displayName}
              className="w-16 h-16 rounded-full object-cover mb-3 border-2 border-slate-100 shadow-sm"
            />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-50 rounded-full flex items-center justify-center mb-3 border-2 border-slate-100 shadow-sm">
              <UserCircle className="w-10 h-10 text-slate-400" />
            </div>
          )}

          <h2 className="font-bold text-sm leading-tight truncate w-full text-slate-900">
            {displayName.toUpperCase()}
          </h2>
          {profile.college && (
            <p className="text-xs text-slate-500 mt-0.5 truncate w-full">
              {profile.college}
            </p>
          )}
          <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full mt-2">
            {profile.branch} • {getDisplaySemester(profile.semester)} Sem
          </span>

          <div className="flex gap-2 w-full mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenProfileEdit}
              className="flex-1 text-xs h-8 bg-slate-50 hover:bg-slate-100 border-slate-200"
            >
              <Settings className="w-3 h-3 mr-1.5" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut().then(() => navigate("/"))}
              className="flex-1 text-xs h-8 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100"
            >
              <LogOut className="w-3 h-3 mr-1.5" />
              Logout
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.08em] px-4 mb-2">
            Navigation
          </p>
          {navItems.map((item) =>
            item.isAction ? (
              <button
                key={item.label}
                onClick={item.onClick}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              >
                <item.icon className="w-[18px] h-[18px]" />
                <span className="text-[13px] font-medium">{item.label}</span>
              </button>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/dashboard"}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? "bg-slate-900 text-white font-medium shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`
                }
              >
                <item.icon className="w-[18px] h-[18px]" />
                <span className="text-[13px] font-medium">{item.label}</span>
              </NavLink>
            )
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 text-center font-medium tracking-wide">
            JNTUK Library • v1.0
          </p>
        </div>
      </aside>
    </>
  );
}
