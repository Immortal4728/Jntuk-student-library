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
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

// ─── User Profile Type ───
export interface UserProfile {
  name: string;
  college: string;
  branch: string;
  semester: string;
  photoURL: string;
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
  semester: "S6",
  photoURL: "",
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
        setProfile({
          name: data.name || currentUser.displayName || currentUser.email?.split("@")[0] || "",
          college: data.college || "",
          branch: data.branch || "CSE",
          semester: data.semester || "S6",
          photoURL: data.photoURL || currentUser.photoURL || "",
        });
      } else {
        // First login → auto-create doc
        const newProfile: UserProfile = {
          name: currentUser.displayName || currentUser.email?.split("@")[0] || "",
          college: "",
          branch: "CSE",
          semester: "S6",
          photoURL: currentUser.photoURL || "",
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
        semester: "S6",
        photoURL: currentUser.photoURL || "",
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

  const isAdmin = user?.email === "admin@email.com";

  // ─── Persist profile updates to Firestore ───
  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      // Optimistic UI update
      setProfile((prev) => ({ ...prev, ...updates }));

      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          await updateDoc(userDocRef, {
            ...updates,
            updatedAt: new Date().toISOString(),
          });
        } catch (error) {
          console.error("Failed to save profile to Firestore:", error);
          // Rollback could be added here if needed
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
