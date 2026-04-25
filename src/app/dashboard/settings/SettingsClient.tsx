'use client';

import { useState } from 'react';
import { Settings, Bell, Shield, Key, Smartphone, Globe, Moon, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import toast from 'react-hot-toast';

export default function SettingsClient() {
  const { language, setLanguage, t } = useLanguage();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      toast.error('Please fill both fields');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await fetch('/api/settings/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Password changed successfully');
        setOldPassword('');
        setNewPassword('');
        setShowPasswordForm(false);
      } else {
        toast.error(data.error || 'Failed to change password');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ paddingBottom: '40px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 className="text-3xl font-black text-white" style={{ marginBottom: '8px' }}>Account <span className="gradient-text">{t('settings')}</span> ⚙️</h1>
        <p className="text-slate-400 text-lg">Manage your app preferences, notifications, and security settings.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Security */}
        <section className="glass-card border-white/5 relative overflow-hidden" style={{ padding: '32px' }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-[40px] pointer-events-none" />
          <h2 className="text-xl font-bold text-white flex items-center relative z-10" style={{ gap: '12px', marginBottom: '24px' }}>
            <Shield className="w-6 h-6 text-rose-400" /> Security & Privacy
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="relative z-10">
            {!showPasswordForm ? (
              <button onClick={() => setShowPasswordForm(true)} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors text-left w-full">
                <div className="flex items-center" style={{ gap: '16px' }}>
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <Key className="w-5 h-5 text-slate-300" />
                  </div>
                  <div>
                    <div className="text-white font-medium mb-1">Change Password</div>
                    <div className="text-slate-500 text-sm">Update your account password securely</div>
                  </div>
                </div>
              </button>
            ) : (
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 w-full">
                <h3 className="text-white font-bold mb-4">Change Password</h3>
                <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label className="text-slate-400 text-sm mb-1 block">Old Password</label>
                    <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="w-full bg-[#0a0e1a] border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-indigo-500 transition-colors" placeholder="Enter old password" />
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm mb-1 block">New Password</label>
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-[#0a0e1a] border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-indigo-500 transition-colors" placeholder="Enter new password" />
                  </div>
                  <div className="flex gap-4">
                    <button type="submit" disabled={isChangingPassword} className="btn-primary flex-1 py-2 justify-center flex items-center shadow-lg shadow-indigo-500/20">
                      {isChangingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Password'}
                    </button>
                    <button type="button" onClick={() => setShowPasswordForm(false)} className="btn-outline flex-1 py-2 justify-center bg-white/[0.02] border-white/10">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            <button className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors text-left w-full">
              <div className="flex items-center" style={{ gap: '16px' }}>
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-slate-300" />
                </div>
                <div>
                  <div className="text-white font-medium mb-1">Two-Factor Authentication</div>
                  <div className="text-slate-500 text-sm">Add an extra layer of security to your account</div>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 rounded-md text-[10px] font-bold uppercase tracking-wider border border-amber-500/20">Coming Soon</span>
            </button>
          </div>
        </section>

        {/* App Preferences */}
        <section className="glass-card border-white/5 relative overflow-hidden" style={{ padding: '32px' }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-[40px] pointer-events-none" />
          <h2 className="text-xl font-bold text-white flex items-center relative z-10" style={{ gap: '12px', marginBottom: '24px' }}>
            <Settings className="w-6 h-6 text-cyan-400" /> App Preferences
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="relative z-10">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center" style={{ gap: '16px' }}>
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                  <Moon className="w-5 h-5 text-slate-300" />
                </div>
                <div>
                  <div className="text-white font-medium mb-1">Theme</div>
                  <div className="text-slate-500 text-sm">Dark mode is currently active by default</div>
                </div>
              </div>
              <span className="text-slate-400 font-medium text-sm">Dark Mode</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center" style={{ gap: '16px' }}>
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-slate-300" />
                </div>
                <div>
                  <div className="text-white font-medium mb-1">Language</div>
                  <div className="text-slate-500 text-sm">Choose your preferred language</div>
                </div>
              </div>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'hi')}
                className="bg-[#0a0e1a] border border-white/10 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 outline-none"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
