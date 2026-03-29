import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  onAuthStateChanged,
  User,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { normalizeSemester } from "../lib/utils";

// ─── User Profile Type ───
export interface UserProfile {
  name: string;
  college: string;
  branch: string;
  semester: string;
  photoURL: string;
  backlogs?: string[];
  backlogSemester?: string;
  cgpa?: number;
  percentage?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  profileLoading: boolean;
  isAdmin: boolean;
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  signOut: () => Promise<void>;
}

const defaultProfile: UserProfile = {
  name: "",
  college: "",
  branch: "CSE",
  semester: "3-2",
  photoURL: "",
  backlogs: [],
  backlogSemester: "",
  cgpa: undefined,
  percentage: undefined,
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  profileLoading: true,
  isAdmin: false,
  profile: defaultProfile,
  updateProfile: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  // ─── Fetch or create Firestore user document ───
  const loadProfile = useCallback(async (currentUser: User) => {
    setProfileLoading(true);
    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        // Document exists → load it
        const data = docSnap.data() as Partial<UserProfile>;
        const normalizedSem = normalizeSemester(data.semester || "3-2");

        // Silent migration: fix legacy semester in Firestore
        if (data.semester && data.semester !== normalizedSem) {
          await setDoc(userDocRef, { semester: normalizedSem }, { merge: true });
        }

        setProfile({
          name: data.name || currentUser.displayName || currentUser.email?.split("@")[0] || "",
          college: data.college || "",
          branch: data.branch || "CSE",
          semester: normalizedSem,
          photoURL: data.photoURL || currentUser.photoURL || "",
          backlogs: data.backlogs || [],
          backlogSemester: data.backlogSemester || "",
          cgpa: data.cgpa,
          percentage: data.percentage,
        });
      } else {
        // First login → auto-create doc
        const newProfile: UserProfile = {
          name: currentUser.displayName || currentUser.email?.split("@")[0] || "",
          college: "",
          branch: "CSE",
          semester: "3-2",
          photoURL: currentUser.photoURL || "",
          backlogs: [],
          backlogSemester: "",
        };
        await setDoc(userDocRef, {
          uid: currentUser.uid,
          ...newProfile,
          createdAt: new Date().toISOString(),
        });
        setProfile(newProfile);
      }
    } catch (error) {
      console.error("Failed to load profile from Firestore:", error);
      // Fallback to auth data so the UI doesn't break
      setProfile({
        name: currentUser.displayName || currentUser.email?.split("@")[0] || "",
        college: "",
        branch: "CSE",
        semester: "3-2",
        photoURL: currentUser.photoURL || "",
        backlogs: [],
        backlogSemester: "",
      });
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        await loadProfile(currentUser);
      } else {
        setProfile(defaultProfile);
        setProfileLoading(false);
      }
    });
    return unsubscribe;
  }, [loadProfile]);

  const isAdmin = user?.email === "rishichowdary2099@gmail.com";

  // ─── Persist profile updates to Firestore ───
  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      // Sanitize semester before saving
      if (updates.semester) {
        updates.semester = normalizeSemester(updates.semester);
      }

      // Optimistic UI update
      setProfile((prev) => ({ ...prev, ...updates }));

      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          await setDoc(userDocRef, {
            ...updates,
            email: user.email,
            updatedAt: new Date().toISOString(),
          }, { merge: true });
        } catch (error) {
          console.error("Failed to save profile to Firestore:", error);
          throw error;
        }
      }
    },
    [user]
  );

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
    setProfile(defaultProfile);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        profileLoading,
        isAdmin,
        profile,
        updateProfile,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
