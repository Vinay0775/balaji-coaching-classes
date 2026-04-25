'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { 
  LayoutDashboard, Users, BookOpen, CreditCard, Settings, 
  LogOut, ShieldAlert, Briefcase, Calendar, FolderOpen, 
  ChevronRight
} from 'lucide-react';

const adminNav = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Users, label: 'Students', href: '/admin/students' },
  { icon: Briefcase, label: 'Staff members', href: '/admin/staff' },
  { icon: BookOpen, label: 'Course Library', href: '/admin/courses' },
  { icon: Calendar, label: 'Daily Schedule', href: '/admin/schedule' },
  { icon: FolderOpen, label: 'Study Materials', href: '/admin/materials' },
  { icon: CreditCard, label: 'Fees & Revenue', href: '/admin/payments' },
  { icon: Settings, label: 'Admin Settings', href: '/admin/settings' },
];

export default function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="flex flex-col w-72 h-screen bg-[#0a0e1a] border-r border-white/5 shadow-2xl relative z-20">
      {/* Brand */}
      <div className="h-20 flex items-center px-8 border-b border-white/5 bg-[#060910]">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="font-black text-base text-white tracking-tight">BCC Admin</div>
        </Link>
      </div>

      {/* Nav Area */}
      <div className="flex-1 py-8 px-4 overflow-y-auto custom-scrollbar flex flex-col gap-1.5">
        {adminNav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onClose?.()}
              className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all font-bold text-sm group ${
                isActive
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-500 hover:text-white hover:bg-white/[0.03] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-4">
                <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-slate-600 group-hover:text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {isActive && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />}
            </Link>
          );
        })}
      </div>

      {/* Footer Area */}
      <div className="p-6 border-t border-white/5 bg-[#060910]/50 space-y-4">
        {session?.user && (
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-xs border border-indigo-500/20">
              {session.user.name?.[0] || 'A'}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-white font-bold text-sm truncate">{session.user.name}</div>
              <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Admin Access</div>
            </div>
          </div>
        )}
        
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-[11px] uppercase tracking-widest w-full text-slate-500 hover:bg-red-500/10 hover:text-red-400 border border-white/5 hover:border-red-500/20 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
