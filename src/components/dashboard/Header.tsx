'use client';

import { useSession } from 'next-auth/react';
import { Bell, Search, Menu } from 'lucide-react';
import Image from 'next/image';

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { data: session } = useSession();
  const userName = session?.user?.name || 'Student';
  const role = (session?.user as any)?.role === 'admin' ? 'Administrator' : 
               (session?.user as any)?.role === 'staff' ? 'Staff Member' : 
               'Student Account';
  const initial = userName[0]?.toUpperCase() || 'S';

  return (
    <header className="h-20 bg-[rgba(15,22,40,0.8)] backdrop-blur-md border-b border-[rgba(99,102,241,0.1)] flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30 shadow-sm">
      {/* Left items / Mobile trigger */}
      <div className="flex items-center gap-4">
        <button 
          className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden md:flex relative group">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search resources, topics..." 
            className="bg-[#0a0e1a] border border-[rgba(99,102,241,0.2)] rounded-full pl-10 pr-4 py-2 w-64 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 focus:bg-indigo-500/5 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Right items */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <button className="relative p-2.5 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-400 rounded-full border-2 border-[rgba(15,22,40,1)] animate-pulse" />
          </button>
        </div>
        
        <div className="h-8 w-px bg-white/10" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-bold text-white leading-none mb-1">{userName}</div>
            <div className="text-xs text-indigo-400 font-medium">{role}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 p-0.5 shadow-lg">
            <div className="w-full h-full bg-[#0a0e1a] rounded-[10px] flex items-center justify-center text-white font-bold overflow-hidden relative">
              {session?.user?.image ? (
                <Image src={session.user.image} alt={userName} fill className="object-cover" />
              ) : (
                 initial
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
