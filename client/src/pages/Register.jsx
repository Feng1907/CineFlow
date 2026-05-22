import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const [form, setForm]     = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const { register }  = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handle = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return setError('Mật khẩu xác nhận không khớp');
    setError(''); setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      showToast('🎉 Tạo tài khoản thành công!', 'success');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Đăng ký thất bại');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-surface">
      <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-transparent pointer-events-none" />

      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <Film className="text-brand" size={32} />
          <span className="text-2xl font-extrabold">Cine<span className="text-brand">Flow</span></span>
        </Link>

        <div className="bg-surface-card border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-center mb-6">Tạo tài khoản</h1>

          {error && (
            <div className="bg-brand/10 border border-brand/30 text-brand text-sm rounded-xl px-4 py-3 mb-4">{error}</div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Họ và tên</label>
              <input type="text" name="name" value={form.name} onChange={handle} required placeholder="Nguyễn Văn A"
                className="w-full bg-surface-elevated border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand transition-all" />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Email</label>
              <input type="email" name="email" value={form.email} onChange={handle} required placeholder="example@email.com"
                className="w-full bg-surface-elevated border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand transition-all" />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Mật khẩu</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} name="password" value={form.password} onChange={handle} required placeholder="Ít nhất 6 ký tự"
                  className="w-full bg-surface-elevated border border-white/10 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand transition-all" />
                <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Xác nhận mật khẩu</label>
              <input type="password" name="confirm" value={form.confirm} onChange={handle} required placeholder="Nhập lại mật khẩu"
                className="w-full bg-surface-elevated border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand transition-all" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full btn-primary justify-center py-3 text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'Đang tạo tài khoản...' : <><UserPlus size={18} /> Đăng ký</>}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-500 mt-6">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-brand hover:underline font-medium">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
