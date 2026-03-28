import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Lock, LogIn, Loader2 } from 'lucide-react';
import { useLoginModal } from '../context/LoginModalContext';
import { insforge } from '../lib/insforge';

export default function LoginModal() {
  const { isOpen, close } = useLoginModal();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && emailRef.current) {
      setTimeout(() => emailRef.current?.focus(), 200);
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) close();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, close]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: authError } = await insforge.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message || 'Invalid credentials');
        setLoading(false);
        return;
      }

      if (data) {
        // Check user role from user_roles table
        const { data: roleData } = await insforge.database
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .maybeSingle();

        close();
        setEmail('');
        setPassword('');

        if (roleData?.role === 'admin' || roleData?.role === 'faculty') {
          navigate('/control-center');
        }
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Welcome back</h2>
            <p className="text-sm text-text-secondary mt-0.5">Sign in to continue</p>
          </div>
          <button
            onClick={close}
            className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-background transition-all duration-200"
            aria-label="Close login modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="login-email" className="text-sm font-medium text-text-primary">
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              <input
                ref={emailRef}
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field pl-10"
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="login-password" className="text-sm font-medium text-text-primary">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field pl-10"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg animate-fade-in">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-magnetic btn-primary w-full mt-2 h-11 text-[0.9375rem]"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <LogIn size={16} />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Subtle footer text */}
        <p className="text-xs text-text-muted text-center mt-5">
          Admin & Faculty access only
        </p>
      </div>
    </div>
  );
}
