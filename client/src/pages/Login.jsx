import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const [form, setForm]     = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const { login }  = useAuth();
  const { showToast } = useToast();
  const navigate   = useNavigate();
  const location   = useLocation();
  const from = location.state?.from || '/';

  const handle = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(form.email, form.password);
      showToast('👋 Đăng nhập thành công!', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Đăng nhập thất bại');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-surface">
      {/* Background blur effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-transparent pointer-events-none" />

      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <Film className="text-brand" size={32} />
          <span className="text-2xl font-extrabold">Cine<span className="text-brand">Flow</span></span>
        </Link>

        <div className="bg-surface-card border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-center mb-6">Đăng nhập</h1>

          {error && (
            <div className="bg-brand/10 border border-brand/30 text-brand text-sm rounded-xl px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Email</label>
              <input
                type="email" name="email" value={form.email} onChange={handle}
                required placeholder="example@email.com"
                className="w-full bg-surface-elevated border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand transition-all"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'} name="password" value={form.password} onChange={handle}
                  required placeholder="••••••••"
                  className="w-full bg-surface-elevated border border-white/10 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand transition-all"
                />
                <button type="button" onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full btn-primary justify-center py-3 text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'Đang đăng nhập...' : <><LogIn size={18} /> Đăng nhập</>}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-500 mt-6">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-brand hover:underline font-medium">Đăng ký ngay</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
