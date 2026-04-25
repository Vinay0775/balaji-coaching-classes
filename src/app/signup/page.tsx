'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
  GraduationCap, Eye, EyeOff, Mail, Lock, User, Phone,
  ArrowRight, Loader2, CheckCircle, Rocket, Star, Shield, BookOpen, Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import { COURSES } from '@/lib/constants';

const PERKS = [
  { icon: BookOpen,  text: 'Industry-ready Curriculum' },
  { icon: Star,      text: 'Expert Faculty Guidance' },
  { icon: Rocket,    text: 'Placement Assistance' },
  { icon: CheckCircle, text: 'Certificate on Completion' },
  { icon: Shield,    text: 'Lifetime Community Access' },
];

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '', course: '', registrationCode: '' });
  const [showPass, setShowPass]   = useState(false);
  const [showConf, setShowConf]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);
  const [focused, setFocused]     = useState<string | null>(null);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.registrationCode) {
      toast.error('Saari details aur Unique Code zaruri hai'); return;
    }
    if (form.password.length < 6) {
      toast.error('Password kam se kam 6 characters ka hona chahiye'); return;
    }
    if (form.password !== form.confirm) {
      toast.error('Passwords match nahi kar rahe'); return;
    }
    setLoading(true);
    try {
      const res  = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password, registrationCode: form.registrationCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(true);
      toast.success('Account ban gaya! Logging you in...');
      
      const signInResult = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (!signInResult?.error) {
        setTimeout(() => router.push('/dashboard'), 1500);
      } else {
        setTimeout(() => router.push('/login'), 2200);
      }
    } catch (err: any) {
      toast.error(err.message || 'Kuch gadbad ho gayi');
    } finally {
      setLoading(false);
    }
  };

  /* ────────────────────────────────────── JSX ─────────────────────────────── */
  return (
    <div className="su-root">
      {/* Blobs */}
      <div className="su-blob su-b1" />
      <div className="su-blob su-b2" />
      <div className="su-blob su-b3" />
      <div className="su-grid" />

      <div className="su-layout">

        {/* ── LEFT PANEL ── */}
        <div className="su-left">
          {/* Logo */}
          <Link href="/" className="su-logo">
            <div className="su-logo-icon">
              <GraduationCap size={26} strokeWidth={2.2} />
            </div>
            <div>
              <div className="su-logo-name">Balaji Computer</div>
              <div className="su-logo-sub">Classes</div>
            </div>
          </Link>

          {/* Hero copy */}
          <div className="su-left-body">
            <span className="su-badge">🚀 New Admission Open</span>
            <h1 className="su-heading">
              Apna Career<br />
              <span className="su-grad">Shuru Karo Aaj!</span>
            </h1>
            <p className="su-desc">
              Enroll karo aur paao complete dashboard, course roadmap, fees tracking, aur bahut kuch — bilkul free.
            </p>

            <ul className="su-perks">
              {PERKS.map(({ icon: Icon, text }) => (
                <li key={text} className="su-perk">
                  <div className="su-perk-dot"><Icon size={13} /></div>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Floating badge */}
          <div className="su-trust">
            <div className="su-trust-row">
              <div className="su-avatars">
                {['A','B','C','D'].map(l => <div key={l} className="su-av">{l}</div>)}
              </div>
              <div>
                <div className="su-trust-val">2,000+ Students</div>
                <div className="su-trust-label">ne pehle se enroll kiya hai ✅</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="su-right">
          <div className="su-card">
            {/* Accent bar */}
            <div className="su-bar" />

            {/* Mobile logo */}
            <Link href="/" className="su-mob-logo">
              <div className="su-logo-icon" style={{ width:38, height:38 }}>
                <GraduationCap size={19} />
              </div>
              <span className="su-logo-name" style={{ fontSize:17 }}>Balaji Computer Classes</span>
            </Link>

            {/* ── SUCCESS STATE ── */}
            {success ? (
              <div className="su-success">
                <div className="su-success-ring">
                  <CheckCircle size={44} strokeWidth={1.8} />
                </div>
                <h2 className="su-success-title">Account Ban Gaya! 🎉</h2>
                <p className="su-success-sub">Login page pe le ja rahe hain…</p>
                <div className="su-success-bar"><div className="su-success-fill" /></div>
              </div>
            ) : (
              <>
                {/* Heading */}
                <div className="su-form-hd">
                  <h2 className="su-form-title">Enroll Karo</h2>
                  <p className="su-form-sub">Free account banao aur apna dashboard access karo</p>
                </div>

                {/* ── TWO-COLUMN ROW (name + phone) ── */}
                <form onSubmit={handleSubmit} className="su-form">
                  <div className="su-row2">
                    {/* Full name */}
                    <div className={`su-field ${focused==='name' ? 'su-focused':''}`}>
                      <label className="su-label">Poora Naam</label>
                      <div className="su-wrap">
                        <User size={15} className="su-fi" />
                        <input
                          id="signup-name" type="text"
                          value={form.name} onChange={e => set('name', e.target.value)}
                          onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                          placeholder="Apna naam" className="su-input"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className={`su-field ${focused==='phone' ? 'su-focused':''}`}>
                      <label className="su-label">Phone <span className="su-opt">(optional)</span></label>
                      <div className="su-wrap">
                        <Phone size={15} className="su-fi" />
                        <input
                          id="signup-phone" type="tel"
                          value={form.phone} onChange={e => set('phone', e.target.value)}
                          onFocus={() => setFocused('phone')} onBlur={() => setFocused(null)}
                          placeholder="98765 43210" className="su-input"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className={`su-field ${focused==='email' ? 'su-focused':''}`}>
                    <label className="su-label">Email Address</label>
                    <div className="su-wrap">
                      <Mail size={15} className="su-fi" />
                      <input
                        id="signup-email" type="email"
                        value={form.email} onChange={e => set('email', e.target.value)}
                        onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                        placeholder="apni@email.com" className="su-input"
                      />
                    </div>
                  </div>

                  {/* Course */}
                  <div className={`su-field ${focused==='course' ? 'su-focused':''}`}>
                    <label className="su-label">Course Interest <span className="su-opt">(optional)</span></label>
                    <div className="su-wrap">
                      <BookOpen size={15} className="su-fi" />
                      <select
                        id="signup-course"
                        value={form.course} onChange={e => set('course', e.target.value)}
                        onFocus={() => setFocused('course')} onBlur={() => setFocused(null)}
                        className="su-input su-select"
                      >
                        <option value="">Course select karo</option>
                        {COURSES.map(c => (
                          <option key={c.slug} value={c.slug}>{c.icon} {c.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Registration Code */}
                  <div className={`su-field ${focused==='registrationCode' ? 'su-focused':''}`}>
                    <label className="su-label">Unique Enrollment Code *</label>
                    <div className="su-wrap">
                      <Shield size={15} className="su-fi" />
                      <input
                        id="signup-registrationCode" type="text"
                        value={form.registrationCode} onChange={e => set('registrationCode', e.target.value)}
                        onFocus={() => setFocused('registrationCode')} onBlur={() => setFocused(null)}
                        placeholder="e.g. BCC-XXXXXX" className="su-input"
                        required
                      />
                    </div>
                  </div>

                  {/* Password row */}
                  <div className="su-row2">
                    <div className={`su-field ${focused==='password' ? 'su-focused':''}`}>
                      <label className="su-label">Password</label>
                      <div className="su-wrap">
                        <Lock size={15} className="su-fi" />
                        <input
                          id="signup-password" type={showPass ? 'text' : 'password'}
                          value={form.password} onChange={e => set('password', e.target.value)}
                          onFocus={() => setFocused('password')} onBlur={() => setFocused(null)}
                          placeholder="Min 6 chars" className="su-input su-pr"
                        />
                        <button type="button" onClick={() => setShowPass(v => !v)} className="su-eye">
                          {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    <div className={`su-field ${focused==='confirm' ? 'su-focused':''}`}>
                      <label className="su-label">Confirm Password</label>
                      <div className="su-wrap">
                        <Lock size={15} className="su-fi" />
                        <input
                          id="signup-confirm" type={showConf ? 'text' : 'password'}
                          value={form.confirm} onChange={e => set('confirm', e.target.value)}
                          onFocus={() => setFocused('confirm')} onBlur={() => setFocused(null)}
                          placeholder="Dobara likho" className="su-input su-pr"
                        />
                        <button type="button" onClick={() => setShowConf(v => !v)} className="su-eye">
                          {showConf ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Password strength indicator */}
                  {form.password.length > 0 && (
                    <div className="su-strength">
                      <div className="su-strength-bars">
                        {[1,2,3,4].map(i => (
                          <div
                            key={i}
                            className={`su-sbar ${
                              form.password.length >= i * 2
                                ? form.password.length >= 8 ? 'su-sbar-strong'
                                : form.password.length >= 4 ? 'su-sbar-mid'
                                : 'su-sbar-weak'
                                : ''
                            }`}
                          />
                        ))}
                      </div>
                      <span className="su-strength-txt">
                        {form.password.length < 4 ? 'Bohot weak' : form.password.length < 8 ? 'Theek hai' : 'Strong 💪'}
                      </span>
                    </div>
                  )}

                  <button id="signup-submit" type="submit" disabled={loading} className="su-btn">
                    {loading
                      ? <><Loader2 size={18} className="su-spin" /> Account ban raha hai…</>
                      : <><Zap size={18} /> Account Banao <ArrowRight size={16} /></>
                    }
                  </button>
                </form>

                <p className="su-switch">
                  Pehle se account hai?{' '}
                  <Link href="/login" className="su-switch-link">Login Karo →</Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ─────────────────────── STYLES ─────────────────────── */}
      <style>{`
        /* ROOT */
        .su-root {
          min-height: 100vh;
          background: #060910;
          position: relative; overflow-x: hidden; overflow-y: auto;
          display: flex; align-items: stretch;
        }

        /* BLOBS */
        .su-blob {
          position: fixed; border-radius: 50%;
          filter: blur(130px); pointer-events: none; z-index: 0; opacity: 0.3;
        }
        .su-b1 {
          width: 550px; height: 550px;
          background: radial-gradient(circle, #06b6d4 0%, transparent 70%);
          top: -180px; right: -120px;
          animation: suFloat 13s ease-in-out infinite;
        }
        .su-b2 {
          width: 480px; height: 480px;
          background: radial-gradient(circle, #6366f1 0%, transparent 70%);
          bottom: -160px; left: -100px;
          animation: suFloat 10s ease-in-out infinite reverse;
        }
        .su-b3 {
          width: 280px; height: 280px;
          background: radial-gradient(circle, #8b5cf6 0%, transparent 70%);
          top: 40%; right: 40%;
          animation: suFloat 8s ease-in-out infinite 2s;
        }
        @keyframes suFloat {
          0%,100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(-25px,25px) scale(1.04); }
          66% { transform: translate(20px,-20px) scale(0.96); }
        }

        /* GRID */
        .su-grid {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(6,182,212,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        /* LAYOUT */
        .su-layout {
          position: relative; z-index: 1;
          display: flex; width: 100%; min-height: 100vh;
        }

        /* ── LEFT ── */
        .su-left {
          display: none;
          flex-direction: column;
          padding: 48px 52px;
          width: 44%;
          background: linear-gradient(150deg, rgba(6,182,212,0.07) 0%, rgba(99,102,241,0.05) 100%);
          border-right: 1px solid rgba(6,182,212,0.12);
          position: relative; overflow: hidden;
        }
        @media (min-width: 1024px) { .su-left { display: flex; } }

        .su-left::after {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 70% 40%, rgba(6,182,212,0.1) 0%, transparent 60%);
          pointer-events: none;
        }

        /* Logo */
        .su-logo {
          display: flex; align-items: center; gap: 14px;
          text-decoration: none; margin-bottom: auto;
          position: relative; z-index: 1;
        }
        .su-logo-icon {
          width: 52px; height: 52px; border-radius: 16px; flex-shrink: 0;
          background: linear-gradient(135deg, #06b6d4, #6366f1);
          display: flex; align-items: center; justify-content: center;
          color: white;
          box-shadow: 0 8px 28px rgba(6,182,212,0.4);
        }
        .su-logo-name { color: #f8fafc; font-weight: 900; font-size: 20px; line-height: 1; }
        .su-logo-sub  { color: #06b6d4; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; margin-top: 3px; }

        /* Left body */
        .su-left-body {
          flex: 1; display: flex; flex-direction: column;
          justify-content: center; padding: 56px 0 36px;
          position: relative; z-index: 1;
        }

        .su-badge {
          display: inline-flex; align-items: center;
          padding: 6px 16px; border-radius: 50px; width: fit-content;
          font-size: 13px; font-weight: 600;
          background: rgba(6,182,212,0.15); border: 1px solid rgba(6,182,212,0.35);
          color: #67e8f9; margin-bottom: 22px;
        }

        .su-heading {
          font-size: clamp(36px, 4vw, 54px);
          font-weight: 900; line-height: 1.12; letter-spacing: -0.03em;
          color: #f8fafc; margin-bottom: 18px;
        }
        .su-grad {
          background: linear-gradient(135deg, #06b6d4 0%, #6366f1 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .su-desc {
          color: #94a3b8; font-size: 16px; line-height: 1.75;
          max-width: 380px; margin-bottom: 32px;
        }

        .su-perks { list-style: none; display: flex; flex-direction: column; gap: 13px; }
        .su-perk  { display: flex; align-items: center; gap: 13px; color: #cbd5e1; font-size: 14px; }
        .su-perk-dot {
          width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
          background: rgba(6,182,212,0.15); border: 1px solid rgba(6,182,212,0.35);
          display: flex; align-items: center; justify-content: center; color: #22d3ee;
        }

        /* Trust row */
        .su-trust {
          position: relative; z-index: 1;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; padding: 18px 20px;
        }
        .su-trust-row { display: flex; align-items: center; gap: 14px; }
        .su-avatars { display: flex; }
        .su-av {
          width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          border: 2px solid #060910;
          margin-left: -8px; first-child { margin-left: 0; }
          display: flex; align-items: center; justify-content: center;
          color: white; font-size: 11px; font-weight: 700;
        }
        .su-av:first-child { margin-left: 0; }
        .su-trust-val   { color: #f8fafc; font-weight: 700; font-size: 14px; }
        .su-trust-label { color: #64748b; font-size: 12px; margin-top: 2px; }

        /* ── RIGHT ── */
        .su-right {
          flex: 1; display: flex;
          align-items: center; justify-content: center;
          padding: 28px 20px;
          position: relative; z-index: 1;
          overflow-y: auto;
        }

        /* ── CARD ── */
        .su-card {
          width: 100%; max-width: 560px;
          background: rgba(15, 22, 40, 0.72);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(6,182,212,0.18);
          border-radius: 28px;
          padding: 42px 40px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05);
          position: relative; overflow: hidden;
        }

        .su-bar {
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(135deg, #06b6d4, #6366f1);
          border-radius: 28px 28px 0 0;
        }

        /* Mobile logo */
        .su-mob-logo {
          display: flex; align-items: center; gap: 12px;
          text-decoration: none; margin-bottom: 28px;
        }
        @media (min-width: 1024px) { .su-mob-logo { display: none; } }

        /* Form header */
        .su-form-hd  { margin-bottom: 28px; }
        .su-form-title { font-size: 30px; font-weight: 900; color: #f8fafc; letter-spacing: -0.02em; margin-bottom: 6px; }
        .su-form-sub   { color: #64748b; font-size: 14px; }

        /* Form */
        .su-form { display: flex; flex-direction: column; gap: 18px; }
        .su-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 520px) { .su-row2 { grid-template-columns: 1fr; } }

        /* Field */
        .su-field { display: flex; flex-direction: column; gap: 7px; }
        .su-label {
          color: #94a3b8; font-size: 11px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
        }
        .su-opt { color: #334155; font-weight: 500; text-transform: none; letter-spacing: 0; font-size: 11px; }

        .su-wrap { position: relative; }
        .su-fi {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          color: #475569; pointer-events: none; transition: color 0.3s;
        }
        .su-focused .su-fi { color: #22d3ee; }

        .su-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1.5px solid rgba(6,182,212,0.16);
          border-radius: 12px;
          padding: 12px 14px 12px 40px;
          color: #f8fafc; font-size: 14px;
          outline: none; transition: all 0.3s;
          appearance: none;
        }
        .su-input::placeholder { color: #334155; }
        .su-input:focus {
          border-color: #06b6d4;
          background: rgba(6,182,212,0.05);
          box-shadow: 0 0 0 3px rgba(6,182,212,0.1);
        }
        .su-select { cursor: pointer; }
        .su-select option { background: #0f1628; }
        .su-pr { padding-right: 44px !important; }

        .su-eye {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #475569; display: flex; align-items: center;
          padding: 4px; transition: color 0.2s;
        }
        .su-eye:hover { color: #94a3b8; }

        /* Strength */
        .su-strength { display: flex; align-items: center; gap: 10px; margin-top: -4px; }
        .su-strength-bars { display: flex; gap: 5px; flex: 1; max-width: 120px; }
        .su-sbar {
          height: 3px; flex: 1; border-radius: 9px;
          background: rgba(255,255,255,0.08); transition: background 0.3s;
        }
        .su-sbar-weak   { background: #ef4444; }
        .su-sbar-mid    { background: #f59e0b; }
        .su-sbar-strong { background: #22c55e; }
        .su-strength-txt { color: #64748b; font-size: 11px; }

        /* Submit */
        .su-btn {
          width: 100%; margin-top: 4px;
          background: linear-gradient(135deg, #06b6d4, #6366f1);
          color: white; font-weight: 700; font-size: 15px;
          padding: 14px 24px; border-radius: 14px; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: all 0.3s ease;
          box-shadow: 0 8px 28px rgba(6,182,212,0.3);
          letter-spacing: 0.01em;
        }
        .su-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 14px 40px rgba(6,182,212,0.45);
        }
        .su-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        @keyframes suSpin { to { transform: rotate(360deg); } }
        .su-spin { animation: suSpin 1s linear infinite; }

        /* Switch */
        .su-switch { text-align: center; color: #475569; font-size: 13px; margin-top: 18px; }
        .su-switch-link {
          color: #22d3ee; font-weight: 600; text-decoration: none; transition: color 0.2s;
        }
        .su-switch-link:hover { color: #67e8f9; }

        /* ── SUCCESS STATE ── */
        .su-success {
          display: flex; flex-direction: column;
          align-items: center; text-align: center; padding: 40px 0;
        }
        .su-success-ring {
          width: 96px; height: 96px; border-radius: 50%;
          background: rgba(34,197,94,0.15);
          border: 2px solid rgba(34,197,94,0.4);
          display: flex; align-items: center; justify-content: center;
          color: #22c55e;
          margin-bottom: 24px;
          animation: suPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes suPop {
          from { transform: scale(0.4); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        .su-success-title { font-size: 26px; font-weight: 900; color: #f8fafc; margin-bottom: 8px; }
        .su-success-sub   { color: #64748b; font-size: 14px; margin-bottom: 28px; }
        .su-success-bar {
          width: 200px; height: 3px; border-radius: 9px;
          background: rgba(255,255,255,0.08); overflow: hidden;
        }
        .su-success-fill {
          height: 100%; width: 0; border-radius: 9px;
          background: linear-gradient(135deg, #06b6d4, #6366f1);
          animation: suProgress 2.2s ease-out forwards;
        }
        @keyframes suProgress { from { width: 0; } to { width: 100%; } }

        /* RESPONSIVE */
        @media (max-width: 640px) {
          .su-card { padding: 28px 20px; border-radius: 20px; }
          .su-form-title { font-size: 24px; }
        }
      `}</style>
    </div>
  );
}
