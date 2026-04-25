'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, CreditCard, User, LogOut, Settings } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { INSTITUTE_INFO } from '@/lib/constants';

const studentNav = [
  { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
  { icon: BookOpen, label: 'My Courses', href: '/dashboard/courses' },
  { icon: CreditCard, label: 'Fees & Payments', href: '/dashboard/fees' },
  { icon: User, label: 'My Profile', href: '/dashboard/profile' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 h-screen bg-[rgba(15,22,40,0.95)] border-r border-[rgba(99,102,241,0.15)] shadow-2xl backdrop-blur-xl">
      {/* Brand */}
      <div className="h-20 flex items-center px-6 border-b border-[rgba(99,102,241,0.15)] bg-[#0a0e1a]/50">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-black text-sm text-white leading-none whitespace-nowrap">{INSTITUTE_INFO.name}</div>
            <div className="text-indigo-400 text-[10px] tracking-widest uppercase mt-0.5 font-medium">Dashboard</div>
          </div>
        </Link>
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto custom-scrollbar" style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Menu</div>
        {studentNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onClose?.()}
              className={`flex items-center px-4 py-3 rounded-xl transition-all font-medium text-sm w-full relative ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-500/15 to-transparent text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
              style={{ gap: '12px' }}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-indigo-500 to-cyan-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
              )}
              <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
              {item.label}
            </Link>
          );
        })}

        {/* Space Filler Banner */}
        <div style={{ marginTop: 'auto', paddingTop: '32px' }}>
          <div className="rounded-xl bg-gradient-to-br from-indigo-500/10 to-cyan-500/5 border border-indigo-500/20 relative overflow-hidden" style={{ padding: '20px' }}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/20 rounded-full blur-[30px] pointer-events-none" />
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="text-white font-bold text-sm mb-1">Need Help?</h4>
            <p className="text-slate-400 text-xs mb-3">Check our support center for answers.</p>
            <button className="w-full py-2 rounded-lg bg-indigo-500 text-white text-xs font-bold hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/20">
              Help Center
            </button>
          </div>
        </div>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-[rgba(99,102,241,0.15)] bg-[#0a0e1a]/30">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm w-full text-red-400 hover:bg-red-500/10 hover:text-red-300 border border-transparent hover:border-red-500/20"
        >
          <LogOut className="w-5 h-5 text-red-400" />
          Logout
        </button>
      </div>
    </div>
  );
}
