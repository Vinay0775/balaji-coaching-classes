import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { User, Mail, Phone, Shield, Award, Calendar, MapPin, Edit3, ExternalLink, Info, Lock } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import UserModel from '@/models/User';
import ProfileAvatarUpload from '@/components/dashboard/ProfileAvatarUpload';
import Link from 'next/link';

export default async function ProfilePage() {
  const session = await auth();
  if (!session) redirect('/login');

  await dbConnect();
  const user = await UserModel.findById(session?.user?.id).lean() as any;
  if (!user) redirect('/login');

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  const infoFields = [
    { icon: User,    label: 'Full Name',     value: user.name,                  color: 'text-indigo-400' },
    { icon: Mail,    label: 'Email Address', value: user.email,                 color: 'text-cyan-400' },
    { icon: Phone,   label: 'Phone Number',  value: user.phone || 'Not added',  color: 'text-emerald-400' },
    { icon: MapPin,  label: 'Location',      value: user.address || 'Rajasthan, India', color: 'text-rose-400' },
  ];

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* ── Profile Hero Card ── */}
      <div className="relative rounded-3xl overflow-hidden bg-[#0a0e1a] border border-white/5 p-8 md:p-10 mb-10 shadow-2xl">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-cyan-500/8 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-8">
          {/* Avatar */}
          <div className="shrink-0 relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 opacity-20 blur-md" />
            <ProfileAvatarUpload initialPhoto={user.photo} name={user.name} />
          </div>

          {/* Name & meta */}
          <div className="flex-1 text-center sm:text-left space-y-3">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">{user.name}</h1>
              <span className="text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {user.role}
              </span>
            </div>

            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-lg">
              Member of Balaji Computer Classes since <span className="text-white font-bold">{memberSince}</span>. Continuing the journey of digital excellence.
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <Shield className="w-4 h-4" /> Verified Account
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                <Calendar className="w-4 h-4" /> Joined {memberSince}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Two-Column Layout ── */}
      <div className="grid lg:grid-cols-3 gap-8">

        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-8">

          {/* Badges Card */}
          <div className="bg-[#0a0e1a] border border-white/5 rounded-3xl p-7 shadow-xl">
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-black text-white uppercase tracking-wider">Achievements</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Top Performer', sub: 'RS-CIT Batch 2024', badge: 'A+', color: 'amber' },
                { label: 'Code Master',   sub: 'Web Dev Enthusiast',  badge: 'JS', color: 'indigo' },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                  <div className={`w-11 h-11 rounded-xl bg-${b.color}-500/10 text-${b.color}-400 flex items-center justify-center text-xs font-black border border-${b.color}-500/20 shrink-0`}>
                    {b.badge}
                  </div>
                  <div className="min-w-0">
                    <div className="text-white font-bold text-sm leading-tight">{b.label}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{b.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Card */}
          <div className="bg-[#0a0e1a] border border-white/5 rounded-3xl p-7 shadow-xl">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="w-5 h-5 text-slate-400" />
              <h3 className="text-base font-black text-white uppercase tracking-wider">Security</h3>
            </div>
            <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all group">
              <span className="text-sm font-bold text-white">Change Password</span>
              <svg className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">

          {/* Personal Details Card */}
          <div className="bg-[#0a0e1a] border border-white/5 rounded-3xl p-7 md:p-8 shadow-xl">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">Personal Details</h3>
                <p className="text-slate-500 text-xs mt-1 font-medium">Your registered information</p>
              </div>
              <button className="flex items-center gap-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border border-indigo-500/20">
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {infoFields.map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="space-y-2">
                  <label className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.15em] ${color}`}>
                    <Icon className="w-3.5 h-3.5" /> {label}
                  </label>
                  <div className="text-white font-semibold text-sm bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 leading-relaxed break-all hover:border-white/10 transition-all">
                    {value}
                  </div>
                </div>
              ))}
            </div>

            {/* Help Banner */}
            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                  <Info className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Need to update your info?</p>
                  <p className="text-slate-500 text-xs mt-0.5">Contact admin for verified changes.</p>
                </div>
              </div>
              <Link href="/dashboard" className="flex items-center gap-1.5 text-indigo-400 font-bold text-xs hover:underline whitespace-nowrap">
                Support <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
