import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { User, Shield, BarChart2, Eye, EyeOff, Save } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useFavorites } from '../hooks/useFavorites';
import { useWatchlist } from '../hooks/useWatchlist';
import { useWatchHistory } from '../hooks/useWatchHistory';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TABS = [
  { key: 'info',     label: 'Thông tin',  icon: User    },
  { key: 'security', label: 'Bảo mật',    icon: Shield  },
  { key: 'stats',    label: 'Thống kê',   icon: BarChart2 },
];

export default function Profile() {
  const { user, getToken, loading } = useAuth();
  const { showToast } = useToast();
  const { favorites }  = useFavorites();
  const { watchlist }  = useWatchlist();
  const { history }    = useWatchHistory();

  const [tab, setTab]   = useState('info');
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const [pw, setPw] = useState({ current: '', newPw: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  useEffect(() => { if (user) setName(user.name || ''); }, [user]);

  if (loading) return null;
  if (!user)   return <Navigate to="/login" replace />;

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.patch(`${API}/user/profile`, { name }, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      showToast('✓ Cập nhật thông tin thành công', 'success');
    } catch (err) {
      showToast(err.response?.data?.error || 'Có lỗi xảy ra', 'error');
    } finally { setSaving(false); }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (pw.newPw !== pw.confirm) return showToast('Mật khẩu xác nhận không khớp', 'error');
    setChangingPw(true);
    try {
      await axios.patch(`${API}/user/password`, {
        currentPassword: pw.current,
        newPassword: pw.newPw,
      }, { headers: { Authorization: `Bearer ${getToken()}` } });
      showToast('✓ Đổi mật khẩu thành công', 'success');
      setPw({ current: '', newPw: '', confirm: '' });
    } catch (err) {
      showToast(err.response?.data?.error || 'Có lỗi xảy ra', 'error');
    } finally { setChangingPw(false); }
  };

  return (
    <div className="fade-in max-w-2xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      {/* Avatar + header */}
      <div className="flex items-center gap-5 mb-8">
        <div className="w-16 h-16 rounded-full bg-brand flex items-center justify-center text-2xl font-extrabold shadow-lg shrink-0">
          {user.name?.charAt(0)?.toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold">{user.name}</h1>
          <p className="text-zinc-400 text-sm">{user.email}</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-surface-card border border-white/5 rounded-xl p-1 mb-6">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-colors ${
              tab === key ? 'bg-brand text-white' : 'text-zinc-400 hover:text-white'
            }`}>
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* Tab: Thông tin */}
      {tab === 'info' && (
        <form onSubmit={saveProfile} className="bg-surface-card border border-white/5 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">Họ và tên</label>
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              required className="w-full bg-surface-elevated border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand transition-all"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">Email</label>
            <input type="email" value={user.email} readOnly
              className="w-full bg-surface border border-white/5 rounded-xl px-4 py-3 text-sm text-zinc-500 cursor-not-allowed" />
          </div>
          <button type="submit" disabled={saving}
            className="btn-primary justify-center w-full py-3 disabled:opacity-60">
            <Save size={16} /> {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </form>
      )}

      {/* Tab: Bảo mật */}
      {tab === 'security' && (
        <form onSubmit={savePassword} className="bg-surface-card border border-white/5 rounded-2xl p-6 space-y-4">
          {[
            { label: 'Mật khẩu hiện tại', key: 'current' },
            { label: 'Mật khẩu mới',      key: 'newPw'   },
            { label: 'Xác nhận mật khẩu mới', key: 'confirm' },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-sm text-zinc-400 mb-1.5">{label}</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={pw[key]}
                  onChange={(e) => setPw((p) => ({ ...p, [key]: e.target.value }))}
                  required placeholder="••••••••"
                  className="w-full bg-surface-elevated border border-white/10 rounded-xl px-4 py-3 pr-11 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand transition-all"
                />
                {key === 'current' && (
                  <button type="button" onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                )}
              </div>
            </div>
          ))}
          <button type="submit" disabled={changingPw} className="btn-primary justify-center w-full py-3 disabled:opacity-60">
            <Shield size={16} /> {changingPw ? 'Đang đổi...' : 'Đổi mật khẩu'}
          </button>
        </form>
      )}

      {/* Tab: Thống kê */}
      {tab === 'stats' && (
        <div className="bg-surface-card border border-white/5 rounded-2xl p-6 grid grid-cols-3 gap-4">
          {[
            { label: 'Yêu thích', value: favorites.length,  color: 'text-brand'   },
            { label: 'Danh sách', value: watchlist.length,  color: 'text-green-400' },
            { label: 'Đã xem',    value: history.length,    color: 'text-blue-400'  },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-center py-4">
              <p className={`text-4xl font-extrabold ${color}`}>{value}</p>
              <p className="text-sm text-zinc-400 mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
