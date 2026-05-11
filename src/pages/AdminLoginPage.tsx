import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  Shield, Lock, Loader2, AlertCircle, ArrowRight, Eye, EyeOff,
  Users, BookOpen, BarChart3, Activity, Zap
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

/* ── Floating stat card for left panel ── */
function FloatingCard({ icon: Icon, label, value, color, delay, y }: {
  icon: any; label: string; value: string; color: string; delay: number; y: number[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.8 + delay, ease: [0.22, 1, 0.36, 1] as const }}
    >
      <motion.div
        animate={{ y }}
        transition={{ duration: 5 + delay * 2, repeat: Infinity, ease: 'easeInOut' }}
        className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}25` }}>
            <Icon size={16} style={{ color }} />
          </div>
          <div>
            <div className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>{label}</div>
            <div className="text-sm font-bold" style={{ color: '#ffffff' }}>{value}</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

    if (!emailTrimmed || !passwordTrimmed) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, emailTrimmed, passwordTrimmed);
      navigate('/admin', { replace: true });
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential') {
        setError('Invalid email or password');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.');
      } else {
        setError('Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans selection:bg-violet-500/20 selection:text-violet-900">

      {/* ═══════════════════════════════════════════
          LEFT PANEL — Branding & Visuals
          ═══════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-10"
        style={{ background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 40%, #312e81 70%, #1e1b4b 100%)' }}>

        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px),
              linear-gradient(to bottom, #fff 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }} />
          {/* Animated orbs */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.2, 0.12] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.15, 0.08] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
            className="absolute bottom-0 -left-20 w-[400px] h-[400px] bg-violet-500 rounded-full blur-[120px]"
          />
          {/* Orbital rings */}
          <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full border border-white/5"
            animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: 'linear' }} />
          <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-white/5"
            animate={{ rotate: -360 }} transition={{ duration: 35, repeat: Infinity, ease: 'linear' }} />
          {/* Floating particles */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div key={i}
              className="absolute rounded-full"
              style={{
                left: `${10 + (i * 7) % 80}%`, top: `${10 + (i * 11) % 80}%`,
                width: 2 + (i % 3), height: 2 + (i % 3),
                backgroundColor: `rgba(255,255,255,${0.1 + (i % 4) * 0.05})`,
              }}
              animate={{ y: [0, -20 + (i % 3) * 10, 0], opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
            />
          ))}
        </div>

        {/* Top branding */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Shield size={20} style={{ color: '#a5b4fc' }} />
            </div>
            <span className="text-[15px] font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>
              JNTUK Admin Center
            </span>
          </div>
        </motion.div>

        {/* Center content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}>
            <h2 className="text-3xl xl:text-4xl font-bold tracking-tight leading-tight mb-4"
              style={{ color: '#ffffff' }}>
              Platform{' '}
              <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-indigo-300 bg-clip-text text-transparent">
                Administration
              </span>
            </h2>
            <p className="text-base max-w-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Manage users, materials, analytics, and platform operations from a single secure dashboard.
            </p>
          </motion.div>

          {/* Floating cards grid */}
          <div className="mt-10 grid grid-cols-2 gap-3 max-w-sm">
            <FloatingCard icon={Users} label="Total Users" value="2,547" color="#6366f1" delay={0} y={[0, -8, 0]} />
            <FloatingCard icon={BookOpen} label="Materials" value="512" color="#8b5cf6" delay={0.15} y={[0, -6, 0]} />
            <FloatingCard icon={BarChart3} label="CGPA Analytics" value="18.2K" color="#0ea5e9" delay={0.3} y={[0, -10, 0]} />
            <FloatingCard icon={Activity} label="Active Now" value="143" color="#10b981" delay={0.45} y={[0, -7, 0]} />
          </div>
        </div>

        {/* Bottom */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="relative z-10 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-medium tracking-wider uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Systems Operational
          </span>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════
          RIGHT PANEL — Login Form
          ═══════════════════════════════════════════ */}
      <div className="flex-1 flex items-center justify-center bg-[#f8fafc] relative overflow-hidden p-6 sm:p-8">
        {/* Subtle background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-violet-100/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-indigo-50/40 rounded-full blur-[80px]" />
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `linear-gradient(to right, #6366f1 1px, transparent 1px),
              linear-gradient(to bottom, #6366f1 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }} />
        </div>

        <motion.div variants={stagger} initial="hidden" animate="show"
          className="w-full max-w-[420px] relative z-10">

          {/* Mobile branding (shown only on mobile) */}
          <motion.div variants={fadeUp} className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
              <Shield size={20} className="text-indigo-600" />
            </div>
            <span className="text-[15px] font-semibold text-slate-900">JNTUK Admin Center</span>
          </motion.div>

          {/* Auth Card */}
          <motion.div variants={fadeUp}
            className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-7 sm:p-8 relative overflow-hidden"
            style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.04), 0 0 0 1px rgba(99,102,241,0.03)' }}>

            {/* Top accent */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

            <div className="text-center mb-7">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
                className="w-14 h-14 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-indigo-100/60"
                style={{ boxShadow: '0 4px 16px rgba(99,102,241,0.08)' }}
              >
                <Lock className="w-6 h-6 text-indigo-600" />
              </motion.div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-1.5">
                Secure Admin Access
              </h2>
              <p className="text-sm font-medium text-slate-500">
                Authenticate to enter the control center
              </p>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-3.5 mb-6 bg-red-50/80 backdrop-blur-sm border border-red-100/80 rounded-xl"
              >
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-[13px] font-medium text-red-700 leading-snug">{error}</p>
              </motion.div>
            )}

            <form className="space-y-4" onSubmit={handleLogin}>
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider ml-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter admin email"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[14px] font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200"
                  style={{ boxShadow: 'none' }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6366f1';
                    e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider ml-1">
                  Master Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter secure password"
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 bg-white text-[14px] font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200"
                    style={{ boxShadow: 'none' }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#6366f1';
                      e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl text-[14px] font-bold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                  style={{
                    background: loading
                      ? '#94a3b8'
                      : 'linear-gradient(135deg, #312e81 0%, #4338ca 50%, #6366f1 100%)',
                    color: '#ffffff',
                    boxShadow: loading
                      ? 'none'
                      : '0 4px 20px rgba(67,56,202,0.3), 0 0 0 1px rgba(99,102,241,0.1)',
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                      (e.target as HTMLElement).style.boxShadow = '0 8px 30px rgba(67,56,202,0.4), 0 0 0 1px rgba(99,102,241,0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.transform = 'translateY(0)';
                    (e.target as HTMLElement).style.boxShadow = '0 4px 20px rgba(67,56,202,0.3), 0 0 0 1px rgba(99,102,241,0.1)';
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'rgba(255,255,255,0.7)' }} />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <Shield size={15} />
                      <span>Enter Admin Center</span>
                      <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Bottom security badge */}
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-1.5">
              <Lock size={10} className="text-slate-400" />
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
                256-bit Encrypted
              </span>
            </div>
            <div className="w-px h-3 bg-slate-200" />
            <div className="flex items-center gap-1.5">
              <Zap size={10} className="text-slate-400" />
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
                Firebase Auth
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
