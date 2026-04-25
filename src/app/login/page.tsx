'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2, BookOpen, CheckCircle, Zap, Users, Award } from 'lucide-react';
import toast from 'react-hot-toast';

const FEATURES = [
  { icon: CheckCircle, text: 'Course Progress Tracker' },
  { icon: CheckCircle, text: 'Fees & Payment History' },
  { icon: CheckCircle, text: 'Study Material Downloads' },
  { icon: CheckCircle, text: 'Certificate Access' },
];

const STATS = [
  { icon: Users, value: '2000+', label: 'Students Enrolled' },
  { icon: BookOpen, value: '6+', label: 'Expert Courses' },
  { icon: Award, value: '85%', label: 'Placement Rate' },
];

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Email aur password dono zaroori hain'); return; }
    setLoading(true);
    const result = await signIn('credentials', { email: form.email, password: form.password, redirect: false });
    setLoading(false);
    if (result?.error) {
      toast.error('Email ya password galat hai');
    } else {
      toast.success('Login ho gaya! 🎉');
      router.push('/dashboard');
      router.refresh();
    }
  };

  const quickLogin = (email: string, pass: string) => setForm({ email, password: pass });

  return (
    <div className="login-root">
      {/* Animated background blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div className="grid-overlay" />

      <div className="login-layout">
        {/* ── LEFT PANEL ── */}
        <div className="left-panel">
          {/* Logo */}
          <Link href="/" className="logo-link">
            <div className="logo-icon">
              <BookOpen size={26} strokeWidth={2.2} />
            </div>
            <div>
              <div className="logo-name">Balaji Computer</div>
              <div className="logo-sub">Classes</div>
            </div>
          </Link>

          {/* Hero copy */}
          <div className="left-content">
            <span className="badge">Welcome Back 👋</span>
            <h1 className="left-heading">
              Your Learning<br />
              <span className="gradient-text">Journey Awaits</span>
            </h1>
            <p className="left-desc">
              Dashboard se course track karo, fees dekhiye, aur study material instantly access karo.
            </p>

            {/* Feature list */}
            <ul className="feature-list">
              {FEATURES.map(({ icon: Icon, text }) => (
                <li key={text} className="feature-item">
                  <div className="feature-dot"><Icon size={13} /></div>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Stats row */}
          <div className="stats-row">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="stat-block">
                <Icon size={16} className="stat-icon" />
                <div className="stat-value gradient-text">{value}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="right-panel">
          <div className="form-card">
            {/* Mobile logo */}
            <Link href="/" className="mobile-logo">
              <div className="logo-icon" style={{ width: 40, height: 40 }}>
                <BookOpen size={20} />
              </div>
              <span className="logo-name" style={{ fontSize: 18 }}>Balaji Computer Classes</span>
            </Link>

            {/* Heading */}
            <div className="form-header">
              <h2 className="form-title">Login Karo</h2>
              <p className="form-subtitle">Apne student account mein sign in karein</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {/* Email */}
              <div className={`field-group ${focused === 'email' ? 'field-focused' : ''}`}>
                <label className="field-label">Email Address</label>
                <div className="field-wrap">
                  <Mail size={16} className="field-icon" />
                  <input
                    id="login-email"
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    placeholder="apni@email.com"
                    className="field-input"
                  />
                </div>
              </div>

              {/* Password */}
              <div className={`field-group ${focused === 'password' ? 'field-focused' : ''}`}>
                <label className="field-label">Password</label>
                <div className="field-wrap">
                  <Lock size={16} className="field-icon" />
                  <input
                    id="login-password"
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                    placeholder="••••••••"
                    className="field-input pr-12"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="eye-btn">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button id="login-submit" type="submit" disabled={loading} className="submit-btn">
                {loading
                  ? <><Loader2 size={18} className="spin" /> Login ho raha hai...</>
                  : <><Zap size={18} /> Login Karo <ArrowRight size={16} /></>}
              </button>
            </form>

            {/* Quick demo login */}
            <div className="demo-box">
              <p className="demo-title">🔑 Quick Demo Login</p>
              <div className="demo-list">
                {[
                  { role: '👤 Admin', email: 'admin@techvidya.in', pass: 'Admin@123' },
                  { role: '🎓 Student', email: 'priya@student.com', pass: 'Student@123' },
                ].map(({ role, email, pass }) => (
                  <button key={email} onClick={() => quickLogin(email, pass)} className="demo-btn">
                    <span className="demo-role">{role}:</span>
                    <span className="demo-email">{email}</span>
                    <span className="demo-use">Use →</span>
                  </button>
                ))}
              </div>
            </div>

            <p className="switch-link">
              Account nahi hai?{' '}
              <Link href="/signup" className="switch-anchor">Abhi Enroll Karo →</Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        /* ─── ROOT ─── */
        .login-root {
          min-height: 100dvh;
          background: #060910;
          position: relative;
          overflow-x: hidden;
          overflow-y: auto;
          display: flex;
          align-items: stretch;
        }

        /* ─── BLOBS ─── */
        .blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          z-index: 0;
          opacity: 0.35;
        }
        .blob-1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, #6366f1 0%, transparent 70%);
          top: -200px; left: -150px;
          animation: blobFloat 12s ease-in-out infinite;
        }
        .blob-2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, #06b6d4 0%, transparent 70%);
          bottom: -150px; right: -100px;
          animation: blobFloat 15s ease-in-out infinite reverse;
        }
        .blob-3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, #8b5cf6 0%, transparent 70%);
          top: 50%; left: 45%;
          animation: blobFloat 9s ease-in-out infinite 3s;
        }
        @keyframes blobFloat {
          0%,100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(30px,-30px) scale(1.05); }
          66% { transform: translate(-20px,20px) scale(0.95); }
        }

        /* ─── GRID ─── */
        .grid-overlay {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        /* ─── LAYOUT ─── */
        .login-layout {
          position: relative; z-index: 1;
          display: flex; width: 100%; min-height: 100dvh;
        }

        /* ─── LEFT PANEL ─── */
        .left-panel {
          display: none;
          flex-direction: column;
          padding: 48px 56px;
          width: 55%;
          background: linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(6,182,212,0.04) 100%);
          border-right: 1px solid rgba(99,102,241,0.12);
          position: relative;
          overflow: hidden;
        }
        @media (min-width: 1024px) { .left-panel { display: flex; } }

        .left-panel::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 30% 60%, rgba(99,102,241,0.12) 0%, transparent 60%);
          pointer-events: none;
        }

        /* Logo */
        .logo-link {
          display: flex; align-items: center; gap: 14px;
          text-decoration: none; margin-bottom: auto;
          position: relative; z-index: 1;
        }
        .logo-icon {
          width: 52px; height: 52px; border-radius: 16px;
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          display: flex; align-items: center; justify-content: center;
          color: white;
          box-shadow: 0 8px 28px rgba(99,102,241,0.4);
          flex-shrink: 0;
        }
        .logo-name { color: #f8fafc; font-weight: 900; font-size: 20px; line-height: 1; }
        .logo-sub { color: #6366f1; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; margin-top: 3px; }

        /* Left content */
        .left-content {
          flex: 1; display: flex; flex-direction: column;
          justify-content: center; padding: 60px 0 40px;
          position: relative; z-index: 1;
        }

        .badge {
          display: inline-flex; align-items: center;
          padding: 6px 16px; border-radius: 50px;
          font-size: 13px; font-weight: 600;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.35);
          color: #a5b4fc;
          margin-bottom: 24px;
          width: fit-content;
        }

        .left-heading {
          font-size: clamp(38px, 4.5vw, 58px);
          font-weight: 900; line-height: 1.12;
          color: #f8fafc;
          margin-bottom: 20px;
          letter-spacing: -0.03em;
        }
        .gradient-text {
          background: linear-gradient(135deg, #6366f1 0%, #06b6d4 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .left-desc {
          color: #94a3b8; font-size: 17px; line-height: 1.75;
          max-width: 420px; margin-bottom: 36px;
        }

        .feature-list { list-style: none; display: flex; flex-direction: column; gap: 14px; }
        .feature-item {
          display: flex; align-items: center; gap: 14px;
          color: #cbd5e1; font-size: 15px;
        }
        .feature-dot {
          width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
          background: rgba(99,102,241,0.18); border: 1px solid rgba(99,102,241,0.35);
          display: flex; align-items: center; justify-content: center; color: #818cf8;
        }

        /* Stats */
        .stats-row {
          display: grid; grid-template-columns: repeat(3,1fr); gap: 20px;
          padding-top: 36px; border-top: 1px solid rgba(255,255,255,0.07);
          position: relative; z-index: 1;
        }
        .stat-block { text-align: center; }
        .stat-icon { color: #6366f1; margin: 0 auto 6px; display: block; }
        .stat-value { font-size: 26px; font-weight: 900; }
        .stat-label { color: #64748b; font-size: 12px; margin-top: 2px; }

        /* ─── RIGHT PANEL ─── */
        .right-panel {
          flex: 1; display: flex;
          align-items: center; justify-content: center;
          padding: 32px 24px;
          position: relative; z-index: 1;
        }

        /* ─── FORM CARD ─── */
        .form-card {
          width: 100%; max-width: 460px;
          background: rgba(15, 22, 40, 0.7);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 28px;
          padding: 44px 40px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05);
          position: relative; overflow: hidden;
        }
        .form-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          border-radius: 28px 28px 0 0;
        }

        /* Mobile logo — hidden on desktop */
        .mobile-logo {
          display: flex; align-items: center; gap: 12px;
          text-decoration: none; margin-bottom: 32px;
        }
        @media (min-width: 1024px) { .mobile-logo { display: none; } }

        /* Form header */
        .form-header { margin-bottom: 32px; }
        .form-title {
          font-size: 32px; font-weight: 900; color: #f8fafc;
          letter-spacing: -0.02em; margin-bottom: 6px;
        }
        .form-subtitle { color: #64748b; font-size: 15px; }

        /* Form */
        .auth-form { display: flex; flex-direction: column; gap: 20px; }

        /* Field */
        .field-group { display: flex; flex-direction: column; gap: 8px; }
        .field-label {
          color: #94a3b8; font-size: 12px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
        }
        .field-wrap {
          position: relative;
          transition: all 0.3s ease;
        }
        .field-icon {
          position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
          color: #475569; pointer-events: none; transition: color 0.3s;
        }
        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1.5px solid rgba(99,102,241,0.18);
          border-radius: 14px;
          padding: 14px 16px 14px 46px;
          color: #f8fafc;
          font-size: 15px;
          transition: all 0.3s ease;
          outline: none;
        }
        .field-input::placeholder { color: #334155; }
        .field-input:focus {
          border-color: #6366f1;
          background: rgba(99,102,241,0.06);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }
        .field-focused .field-icon { color: #818cf8; }
        .pr-12 { padding-right: 48px !important; }

        /* Eye button */
        .eye-btn {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          color: #475569; background: none; border: none; cursor: pointer;
          display: flex; align-items: center; transition: color 0.2s;
          padding: 4px;
        }
        .eye-btn:hover { color: #94a3b8; }

        /* Submit button */
        .submit-btn {
          width: 100%; margin-top: 8px;
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          color: white; font-weight: 700; font-size: 16px;
          padding: 15px 24px; border-radius: 14px; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: all 0.3s ease;
          box-shadow: 0 8px 28px rgba(99,102,241,0.35);
          letter-spacing: 0.01em;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 14px 40px rgba(99,102,241,0.5);
        }
        .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Demo box */
        .demo-box {
          margin-top: 24px;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 16px 18px;
        }
        .demo-title {
          color: #475569; font-size: 11px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px;
        }
        .demo-list { display: flex; flex-direction: column; gap: 6px; }
        .demo-btn {
          width: 100%; display: flex; align-items: center; gap: 8px;
          background: none; border: none; cursor: pointer; text-align: left;
          padding: 8px 10px; border-radius: 10px;
          transition: background 0.2s; color: inherit;
        }
        .demo-btn:hover { background: rgba(255,255,255,0.05); }
        .demo-role { color: #64748b; font-size: 12px; font-weight: 600; flex-shrink: 0; }
        .demo-email { color: #94a3b8; font-size: 12px; flex: 1; }
        .demo-use { color: #6366f1; font-size: 11px; font-weight: 700; opacity: 0; transition: opacity 0.2s; }
        .demo-btn:hover .demo-use { opacity: 1; }

        /* Switch link */
        .switch-link {
          text-align: center; color: #475569; font-size: 14px; margin-top: 20px;
        }
        .switch-anchor {
          color: #818cf8; font-weight: 600; text-decoration: none; transition: color 0.2s;
        }
        .switch-anchor:hover { color: #a5b4fc; }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 640px) {
          .form-card { padding: 32px 24px; border-radius: 20px; }
          .form-title { font-size: 26px; }
        }
      `}</style>
    </div>
  );
}
