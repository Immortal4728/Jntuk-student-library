import { Outlet } from "react-router-dom";
import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import DashboardSidebar from "./DashboardSidebar";
import LoginModal from "./LoginModal";
import { X, Camera, Loader2, UserCircle } from "lucide-react";
import { Button } from "./ui/button";

export default function DashboardLayout() {
  const { profile, updateProfile, profileLoading } = useAuth();

  // --- Modal States ---
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [isBacklogModalOpen, setIsBacklogModalOpen] = useState(false);
  const [isContextSwitcherOpen, setIsContextSwitcherOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // --- Profile Edit ---
  const [editName, setEditName] = useState(profile.name);
  const [editCollege, setEditCollege] = useState(profile.college);
  const [editBranch, setEditBranch] = useState(profile.branch);
  const [editSemester, setEditSemester] = useState(profile.semester);
  const [editPhotoURL, setEditPhotoURL] = useState(profile.photoURL);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Context Switcher ---
  const [tempBranch, setTempBranch] = useState(profile.branch);
  const [tempSem, setTempSem] = useState(profile.semester);

  const branches = ["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT"];
  const semesters = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];

  const openProfileEdit = () => {
    setEditName(profile.name);
    setEditCollege(profile.college);
    setEditBranch(profile.branch);
    setEditSemester(profile.semester);
    setEditPhotoURL(profile.photoURL);
    setIsProfileEditOpen(true);
  };

  // --- Image → Base64 ---
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Max 500KB to fit in Firestore (1MB doc limit, base64 ≈ 1.37× original)
    if (file.size > 500 * 1024) {
      alert("Image must be under 500KB. Please choose a smaller image.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setEditPhotoURL(result);
    };
    reader.readAsDataURL(file);
  };

  // --- Save Profile to Firestore ---
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        name: editName,
        college: editCollege,
        branch: editBranch,
        semester: editSemester,
        photoURL: editPhotoURL,
      });
      setIsProfileEditOpen(false);
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const openContextSwitcher = () => {
    setTempBranch(profile.branch);
    setTempSem(profile.semester);
    setIsContextSwitcherOpen(true);
  };

  const handleSaveContext = async () => {
    setIsSaving(true);
    try {
      await updateProfile({ branch: tempBranch, semester: tempSem });
      setIsContextSwitcherOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveBacklogs = () => {
    setIsBacklogModalOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] text-slate-900 font-sans">
      <DashboardSidebar
        onOpenBacklogModal={() => setIsBacklogModalOpen(true)}
        onOpenProfileEdit={openProfileEdit}
        onOpenContextSwitcher={openContextSwitcher}
      />

      <main className="flex-1 overflow-y-auto pt-14 md:pt-0 relative">
        {/* Profile loading skeleton */}
        {profileLoading ? (
          <div className="max-w-4xl mx-auto p-4 md:p-8 pb-24">
            <div className="animate-pulse space-y-6">
              <div className="h-40 bg-slate-200 rounded-2xl" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-24 bg-slate-200 rounded-xl" />
                ))}
              </div>
              <div className="h-32 bg-slate-200 rounded-xl" />
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto p-4 md:p-8 pb-24">
            <Outlet />
          </div>
        )}
      </main>

      {/* ════════════════════════════════════════════════════════
          MODAL: EDIT PROFILE (with image upload)
         ════════════════════════════════════════════════════════ */}
      {isProfileEditOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  Edit Profile
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your details. Changes are saved to cloud.
                </p>
              </div>
              <button
                onClick={() => setIsProfileEditOpen(false)}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1 bg-slate-50/50">
              {/* Profile Image Upload */}
              <div className="flex flex-col items-center">
                <div className="relative group">
                  {editPhotoURL ? (
                    <img
                      src={editPhotoURL}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 shadow-sm"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center border-2 border-slate-200 shadow-sm">
                      <UserCircle className="w-12 h-12 text-slate-300" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Camera className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {editPhotoURL ? "Change Photo" : "Upload Photo"}
                </button>
                {editPhotoURL && (
                  <button
                    type="button"
                    onClick={() => setEditPhotoURL("")}
                    className="text-[11px] text-red-500 hover:text-red-600 mt-0.5 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider ml-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Your name"
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
                />
              </div>

              {/* College */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider ml-1">
                  College
                </label>
                <input
                  type="text"
                  value={editCollege}
                  onChange={(e) => setEditCollege(e.target.value)}
                  placeholder="College name"
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
                />
              </div>

              {/* Branch + Semester */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider ml-1">
                    Branch
                  </label>
                  <select
                    value={editBranch}
                    onChange={(e) => setEditBranch(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
                  >
                    {branches.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider ml-1">
                    Semester
                  </label>
                  <select
                    value={editSemester}
                    onChange={(e) => setEditSemester(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
                  >
                    {semesters.map((s) => (
                      <option key={s} value={s}>
                        Semester {s.replace("S", "")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-slate-100 bg-white">
              <Button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 shadow-sm font-semibold disabled:opacity-60"
              >
                {isSaving ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </span>
                ) : (
                  "Save Profile"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          MODAL: CONTEXT SWITCHER
         ════════════════════════════════════════════════════════ */}
      {isContextSwitcherOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900">
                Switch Context
              </h3>
              <button
                onClick={() => setIsContextSwitcherOpen(false)}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider ml-1">
                  Branch
                </label>
                <select
                  value={tempBranch}
                  onChange={(e) => setTempBranch(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
                >
                  {branches.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider ml-1">
                  Semester
                </label>
                <select
                  value={tempSem}
                  onChange={(e) => setTempSem(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
                >
                  {semesters.map((s) => (
                    <option key={s} value={s}>
                      Semester {s.replace("S", "")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-5 border-t border-slate-100">
              <Button
                onClick={handleSaveContext}
                disabled={isSaving}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 shadow-sm font-semibold disabled:opacity-60"
              >
                {isSaving ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Applying...
                  </span>
                ) : (
                  "Apply & Reload"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          MODAL: UPDATE BACKLOGS
         ════════════════════════════════════════════════════════ */}
      {isBacklogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  Update Backlogs
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select subjects to track on dashboard.
                </p>
              </div>
              <button
                onClick={() => setIsBacklogModalOpen(false)}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto w-full space-y-6 flex-1 bg-slate-50/50">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider ml-1">
                    Year
                  </label>
                  <select className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm">
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider ml-1">
                    Semester
                  </label>
                  <select className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm">
                    <option>Sem 1</option>
                    <option>Sem 2</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider ml-1 mb-1 block">
                  Select Subjects
                </label>
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 shadow-sm">
                  {[
                    "Data Structures",
                    "Operating Systems",
                    "Mathematics II",
                    "Computer Architecture",
                    "Physics",
                  ].map((sub, i) => (
                    <label
                      key={sub}
                      className="flex items-center gap-3 p-3.5 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        defaultChecked={i < 2}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-white"
                      />
                      <span className="text-sm font-medium text-slate-700">
                        {sub}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 bg-white">
              <Button
                onClick={handleSaveBacklogs}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 shadow-sm font-semibold"
              >
                Save & Update Dashboard
              </Button>
            </div>
          </div>
        </div>
      )}

      <LoginModal />
    </div>
  );
}
