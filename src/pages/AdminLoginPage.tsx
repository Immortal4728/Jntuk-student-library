import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Lock, Loader2, AlertCircle } from 'lucide-react';

const ADMIN_EMAIL = 'rishichowdary2099@gmail.com';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in as admin, redirect immediately
  if (user && isAdmin) {
    navigate('/admin', { replace: true });
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const emailTrimmed = email.trim();
    const passwordTrimmed = password.trim();

    console.log("Attempt login:", emailTrimmed);

    try {
      const cred = await signInWithEmailAndPassword(auth, emailTrimmed, passwordTrimmed);
      
      if (cred.user.email !== ADMIN_EMAIL) {
        await auth.signOut();
        throw new Error("Not authorized as admin");
      }

      navigate('/admin', { replace: true });
    } catch (error: any) {
      console.log(error.code);

      if (error.code === "auth/invalid-credential") {
        setError("Invalid email or password");
      } else if (error.message === "Not authorized as admin") {
        setError("Access denied: Admin only");
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-3.5rem)] flex items-start justify-center pt-20 px-5">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#0f172a] flex items-center justify-center">
            <Lock size={14} className="text-white" />
          </div>
          <span className="text-[0.9375rem] font-semibold text-[#0f172a]">Admin Login</span>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-sm font-semibold text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-[0.8125rem] font-medium text-[#0f172a] mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e7eb] bg-white text-[0.875rem] text-[#0f172a] placeholder:text-[#94a3b8] outline-none focus:border-[#0f172a] focus:ring-2 focus:ring-[#0f172a]/10 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#0f172a] text-white py-2.5 rounded-xl text-[0.875rem] font-semibold shadow-sm hover:bg-black active:scale-[0.97] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Authenticating...</> : 'Authenticate'}
          </button>
        </form>
      </div>
    </div>
  );
}
