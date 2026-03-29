import { Outlet } from "react-router-dom";
import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import DashboardSidebar from "./DashboardSidebar";
import LoginModal from "./LoginModal";
import { X, Camera, Loader2, UserCircle, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import Cropper from "react-easy-crop";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../lib/firebase";
import { subjectsData, commonFirstYear } from "../lib/data";
import { getDisplaySemester } from "../lib/utils";

// --- Helper: Crop Image to Blob ---
async function getCroppedImg(imageSrc: string, pixelCrop: any): Promise<Blob | null> {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => {
    image.onload = resolve;
  });

  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.8));
}

export default function DashboardLayout() {
  const { user, profile, updateProfile, profileLoading } = useAuth();

  // --- Modal States ---
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [isBacklogModalOpen, setIsBacklogModalOpen] = useState(false);
  const [isContextSwitcherOpen, setIsContextSwitcherOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{message: string, type: "success"|"error"} | null>(null);

  const showToast = (message: string, type: "success"|"error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // --- Profile Edit ---
  const [editName, setEditName] = useState(profile.name);
  const [editCollege, setEditCollege] = useState(profile.college);
  const [editBranch, setEditBranch] = useState(profile.branch);
  const [editSemester, setEditSemester] = useState(profile.semester);
  const [editPhotoURL, setEditPhotoURL] = useState(profile.photoURL);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Cropper State ---
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // --- Backlog Tracker State ---
  const [backlogYear, setBacklogYear] = useState("2");
  const [backlogSem, setBacklogSem] = useState("1");
  const [selectedBacklogs, setSelectedBacklogs] = useState<string[]>([]);

  // Calculate subjects based on Year + Sem inputs
  const currentBacklogSemLabel = `${backlogYear}-${backlogSem}`;
  let backlogOptions: string[] = [];
  if (backlogYear === "1") {
    backlogOptions = commonFirstYear[currentBacklogSemLabel] || [];
  } else {
    backlogOptions = subjectsData[profile.branch]?.[currentBacklogSemLabel] || [];
  }

  // --- Context Switcher ---
  const [tempBranch, setTempBranch] = useState(profile.branch);
  const [tempSem, setTempSem] = useState(profile.semester);

  // Strict controlled branch list
  const branches = ["CSE", "ECE", "IT", "AIML"];
  const semesters = ["1-1", "1-2", "2-1", "2-2", "3-1", "3-2", "4-1", "4-2"];

  const openProfileEdit = () => {
    setEditName(profile.name);
    setEditCollege(profile.college);
    setEditBranch(profile.branch);
    setEditSemester(profile.semester);
    setEditPhotoURL(profile.photoURL);
    setIsProfileEditOpen(true);
  };

  // --- Image Flow ---
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setCropImageSrc(reader.result as string);
      setIsCropping(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);

    // reset input so the exact same file can be chosen again if needed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCropComplete = async () => {
    if (!cropImageSrc || !croppedAreaPixels || !user?.uid) return;
    setIsUploadingPhoto(true);

    try {
      // 1. Generate compressed Blob from React-Easy-Crop properties
      const blob = await getCroppedImg(cropImageSrc, croppedAreaPixels);
      if (!blob) throw new Error("Could not crop image");

      // 2. Upload explicitly to Firebase Storage
      const storageRef = ref(storage, `profiles/${user.uid}`);
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);

      // 3. Drop down into Edit State (will be saved when they tap "Save Profile")
      setEditPhotoURL(url);
      
      setIsCropping(false);
      setCropImageSrc(null);
    } catch (err) {
      console.error(err);
      showToast("Failed to process and upload image.", "error");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

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
      showToast("Profile saved successfully", "success");
    } catch (error) {
      console.error("Save failed:", error);
      showToast("Failed to save profile. Please try again.", "error");
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
      showToast("Context updated successfully", "success");
    } catch (error) {
      console.error("Context update failed:", error);
      showToast("Failed to update context.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const openBacklogModal = () => {
    // Reset inputs intelligently
    const displaySem = getDisplaySemester(profile.semester || "1-1");
    const [y, s] = displaySem.split('-');
    setBacklogYear(y || "1");
    setBacklogSem(s || "1");
    
    // Sync current checked state from profile exactly as requested
    setSelectedBacklogs(profile.backlogs || []);
    setIsBacklogModalOpen(true);
  };

  const toggleBacklog = (subject: string) => {
    setSelectedBacklogs(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const handleSaveBacklogs = async () => {
    setIsSaving(true);
    try {
      await updateProfile({ 
        backlogs: selectedBacklogs,
        backlogSemester: currentBacklogSemLabel 
      });
      setIsBacklogModalOpen(false);
      showToast("Backlogs saved directly to your profile", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to save backlogs.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] text-slate-900 font-sans">
      <DashboardSidebar
        onOpenBacklogModal={openBacklogModal}
        onOpenProfileEdit={openProfileEdit}
        onOpenContextSwitcher={openContextSwitcher}
      />

      <main id="dashboard-scroll-container" className="flex-1 overflow-y-auto pt-14 md:pt-0 relative">
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
                      className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 shadow-sm transition-opacity"
                      style={{ opacity: isUploadingPhoto ? 0.5 : 1 }}
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center border-2 border-slate-200 shadow-sm relative">
                      {isUploadingPhoto ? (
                         <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
                      ) : (
                         <UserCircle className="w-12 h-12 text-slate-300" />
                      )}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingPhoto}
                    className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed"
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
                  disabled={isUploadingPhoto}
                  className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors disabled:opacity-50"
                >
                  {isUploadingPhoto ? "Uploading..." : editPhotoURL ? "Change Photo" : "Upload Photo"}
                </button>
                {editPhotoURL && !isUploadingPhoto && (
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
                    Select Semester (e.g. 3-2)
                  </label>
                  <select
                    value={editSemester}
                    onChange={(e) => setEditSemester(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
                  >
                    {semesters.map((s) => (
                      <option key={s} value={s}>
                        {s} Sem
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
                disabled={isSaving || isUploadingPhoto}
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
          MODAL: IMAGE CROPPER
         ════════════════════════════════════════════════════════ */}
      {isCropping && cropImageSrc && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900">Adjust Photo</h3>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">Drag and zoom to frame your picture.</p>
              </div>
              <button 
                onClick={() => { setIsCropping(false); setCropImageSrc(null); }} 
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="relative w-full h-72 bg-slate-900">
              <Cropper
                image={cropImageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_croppedArea, croppedAreaPixels) => {
                  setCroppedAreaPixels(croppedAreaPixels);
                }}
              />
            </div>
            
            <div className="p-5 space-y-5 bg-slate-50">
              <div className="flex items-center gap-4">
                 <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Zoom</span>
                 <input
                   type="range"
                   value={zoom}
                   min={1}
                   max={3}
                   step={0.05}
                   aria-label="Zoom"
                   onChange={(e) => setZoom(Number(e.target.value))}
                   className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                 />
              </div>
              
              <Button 
                onClick={handleCropComplete} 
                disabled={isUploadingPhoto} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 shadow-sm font-semibold flex items-center justify-center"
              >
                {isUploadingPhoto ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  "Apply & Verify"
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
                  Select Semester (e.g. 3-2)
                </label>
                <select
                  value={tempSem}
                  onChange={(e) => setTempSem(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
                >
                  {semesters.map((s) => (
                    <option key={s} value={s}>
                      {s} Sem
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
                  <select 
                    value={backlogYear}
                    onChange={(e) => setBacklogYear(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
                  >
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider ml-1">
                    Semester
                  </label>
                  <select 
                    value={backlogSem}
                    onChange={(e) => setBacklogSem(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
                  >
                    <option value="1">Sem 1</option>
                    <option value="2">Sem 2</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider ml-1 mb-1 block">
                  Select Subjects ({backlogOptions.length} available)
                </label>
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  {backlogOptions.length > 0 ? (
                    <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                      {backlogOptions.map((sub) => (
                        <label
                          key={sub}
                          className="flex items-center gap-3 p-3.5 hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedBacklogs.includes(sub)}
                            onChange={() => toggleBacklog(sub)}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-white"
                          />
                          <span className="text-sm font-medium text-slate-700">
                            {sub}
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-slate-500">
                      <p className="text-sm font-medium">No subjects found.</p>
                      <p className="text-xs mt-1">Check branch and semester mapping.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 bg-white">
              <Button
                onClick={handleSaveBacklogs}
                disabled={isSaving}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 shadow-sm font-semibold disabled:opacity-60"
              >
                {isSaving ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </span>
                ) : (
                  "Save & Update Dashboard"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification element */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.2)] backdrop-blur-md border ${
            toast.type === "success" 
              ? "bg-emerald-950/80 border-emerald-500/30 text-emerald-100" 
              : "bg-red-950/80 border-red-500/30 text-red-100"
          }`}>
            {toast.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400" />
            )}
            <span className="text-[13px] font-bold tracking-tight">{toast.message}</span>
          </div>
        </div>
      )}

      <LoginModal />
    </div>
  );
}
