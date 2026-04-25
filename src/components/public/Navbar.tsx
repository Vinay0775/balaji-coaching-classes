'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, ChevronDown, Info, LayoutDashboard, LogOut, Menu, PhoneCall, X } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/courses', label: 'Courses' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact', icon: PhoneCall },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    setIsOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDashboardLink = () => {
    const role = (session?.user as { role?: string } | undefined)?.role;
    if (role === 'admin') return '/admin';
    if (role === 'staff') return '/admin/staff';
    return '/dashboard';
  };

  if (
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/staff') ||
    pathname?.startsWith('/login') ||
    pathname?.startsWith('/signup')
  ) {
    return null;
  }

  return (
    <nav
      className={`fixed left-0 right-0 top-0 w-full z-[100] border-b transition-all duration-300 ${scrolled
          ? 'border-amber-400/10 bg-[rgba(7,17,31,0.88)] backdrop-blur-2xl shadow-[0_18px_40px_rgba(2,8,23,0.28)]'
          : 'border-white/6 bg-[rgba(7,17,31,0.55)] backdrop-blur-lg'
        }`}
    >
      <div className="container-custom">
        <div className="flex h-[74px] items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group relative z-[120]">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#f59e0b,#0ea5a6,#38bdf8)] text-white shadow-[0_16px_35px_rgba(14,165,166,0.28)] transition-transform duration-300 group-hover:scale-105">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="logo-name text-[1.02rem] font-bold leading-none text-white">Balaji Computer</div>
              <div className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.28em] text-amber-300">Classes</div>
            </div>
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative text-[15px] font-semibold ${active ? 'text-white' : 'text-slate-300 hover:text-white'
                    }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-2 left-0 h-[2px] bg-[linear-gradient(90deg,#f59e0b,#38bdf8)] transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                  />
                </Link>
              );
            })}
          </div>

          <div className="hidden items-center gap-4 lg:flex">
            {session ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((value) => !value)}
                  className="flex items-center gap-3 rounded-full border border-sky-300/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f59e0b,#0ea5a6)] text-xs font-bold text-white">
                    {session.user?.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                  <span className="max-w-[120px] truncate">{session.user?.name?.split(' ')[0]}</span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 ${userMenuOpen ? 'rotate-180 text-white' : ''}`} />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-14 z-50 w-60 rounded-3xl border border-white/10 bg-[#112239] p-2 shadow-2xl">
                      <div className="border-b border-white/8 px-4 py-3">
                        <div className="font-semibold text-white">{session.user?.name}</div>
                        <div className="truncate text-xs text-slate-400">{session.user?.email}</div>
                      </div>
                      <Link
                        href={getDashboardLink()}
                        className="mt-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 hover:bg-white/5"
                      >
                        <LayoutDashboard className="h-4 w-4 text-amber-300" /> Dashboard
                      </Link>
                      <button
                        type="button"
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="mt-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-rose-300 hover:bg-rose-500/10"
                      >
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="rounded-2xl px-5 py-2.5 text-sm font-bold text-slate-300 hover:bg-white/5 hover:text-white">
                  Login
                </Link>
                <Link href="/enroll" className="btn-primary px-6 py-3 text-sm shadow-lg shadow-amber-500/10">
                  Enroll Now
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="relative z-[120] rounded-2xl border border-white/10 bg-white/5 p-2.5 text-slate-200 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
          }`}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`fixed right-0 top-0 z-[130] flex h-[100dvh] w-[86vw] max-w-[360px] flex-col border-l border-white/10 bg-[#07111f] shadow-2xl transition-transform duration-300 lg:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#f59e0b,#0ea5a6)] text-white">
              <Info className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-white">Menu</div>
              <div className="text-xs text-slate-400">Quick navigation</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-full bg-white/5 p-2 text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          <div className="mb-7 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Pages</div>
          <div className="space-y-2">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3.5 text-sm font-semibold ${active
                      ? 'border-amber-400/20 bg-amber-400/10 text-white'
                      : 'border-transparent bg-white/[0.03] text-slate-300'
                    }`}
                >
                  <span>{link.label}</span>
                  {link.icon ? <link.icon className="h-4 w-4 text-amber-300" /> : null}
                </Link>
              );
            })}
          </div>

          <div className="mt-10 border-t border-white/10 pt-8">
            <div className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Account</div>
            {session ? (
              <div className="space-y-3">
                <Link
                  href={getDashboardLink()}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-2xl bg-white/[0.03] px-4 py-3.5 text-sm font-semibold text-slate-200"
                >
                  <LayoutDashboard className="h-4 w-4 text-amber-300" /> Go to Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex w-full items-center gap-3 rounded-2xl bg-rose-500/8 px-4 py-3.5 text-left text-sm font-semibold text-rose-300"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link href="/login" onClick={() => setIsOpen(false)} className="btn-outline w-full justify-center py-3.5">
                  Login
                </Link>
                <Link href="/enroll" onClick={() => setIsOpen(false)} className="btn-primary w-full justify-center py-3.5">
                  Enroll Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
