'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Facebook, Instagram, Mail, MapPin, MessageCircle, Phone, Youtube } from 'lucide-react';
import { COURSES, INSTITUTE_INFO } from '@/lib/constants';
import { buildWhatsAppUrl, getPhoneHref } from '@/lib/utils';

export default function Footer() {
  const pathname = usePathname();

  if (
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/staff') ||
    pathname?.startsWith('/login') ||
    pathname?.startsWith('/signup') ||
    pathname?.startsWith('/enroll')
  ) {
    return null;
  }

  const whatsappHref = buildWhatsAppUrl(
    INSTITUTE_INFO.whatsapp,
    `Hello ${INSTITUTE_INFO.name}, mujhe courses ki details chahiye.`
  );

  return (
    <footer className="relative overflow-hidden border-t border-white/8 bg-[#040a15] pb-8 pt-24 lg:pt-32">
      <div className="absolute inset-x-0 bottom-0 h-64 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08),transparent_70%)]" />

      <div className="container-custom relative z-10">
        <div className="mb-16 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-16">
          <div>
            <Link href="/" className="group mb-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#f59e0b,#0ea5a6,#38bdf8)] text-white shadow-[0_18px_38px_rgba(14,165,166,0.22)]">
                <BookOpen className="h-7 w-7" />
              </div>
              <div>
                <div className="logo-name text-lg font-bold text-white group-hover:text-amber-200">Balaji Computer</div>
                <div className="mt-1.5 text-[12px] font-extrabold uppercase tracking-[0.24em] text-amber-300">Classes</div>
              </div>
            </Link>
            <p className="mb-8 max-w-sm text-base leading-8 text-slate-400">
              Shaping digital futures with practical computer education, industry-focused batches, and consistent student support.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Instagram, href: INSTITUTE_INFO.socialMedia.instagram, label: 'Instagram' },
                { Icon: Youtube, href: INSTITUTE_INFO.socialMedia.youtube, label: 'YouTube' },
                { Icon: Facebook, href: INSTITUTE_INFO.socialMedia.facebook, label: 'Facebook' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-400 transition-all hover:scale-105 hover:border-amber-300/30 hover:bg-white/10 hover:text-white"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-extrabold uppercase tracking-[0.2em] text-white">Quick Links</h3>
            <ul className="space-y-4 text-base text-slate-400">
              {[
                { label: 'Home', href: '/' },
                { label: 'Courses', href: '/courses' },
                { label: 'About Us', href: '/about' },
                { label: 'Contact', href: '/contact' },
                { label: 'Student Login', href: '/login' },
                { label: 'Enroll Now', href: '/enroll' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-extrabold uppercase tracking-[0.2em] text-white">Popular Courses</h3>
            <ul className="space-y-4 text-base text-slate-400">
              {COURSES.slice(0, 6).map((course) => (
                <li key={course.slug}>
                  <Link href={`/courses/${course.slug}`} className="flex items-center gap-3 transition-colors hover:text-white">
                    <span className="inline-flex min-w-10 justify-center rounded-lg bg-white/5 px-2.5 py-1.5 text-[12px] font-bold text-amber-300">
                      {course.icon}
                    </span>
                    <span>{course.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-extrabold uppercase tracking-[0.2em] text-white">Contact Info</h3>
            <div className="space-y-5 text-base text-slate-400">
              <a href={getPhoneHref(INSTITUTE_INFO.phone)} className="flex items-start gap-4 transition-colors hover:text-white">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400/10 text-amber-300">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="mt-1">{INSTITUTE_INFO.phone}</span>
              </a>
              <a href={`mailto:${INSTITUTE_INFO.email}`} className="flex items-start gap-4 transition-colors hover:text-white">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-400/10 text-teal-300">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="mt-1">{INSTITUTE_INFO.email}</span>
              </a>
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-400/10 text-sky-300">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="mt-1 leading-relaxed">{INSTITUTE_INFO.address}</span>
              </div>
            </div>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-5 py-4 text-base font-bold text-emerald-300 transition-all hover:bg-emerald-500/18 hover:scale-[1.02]"
            >
              <MessageCircle className="h-5 w-5" />
              Chat on WhatsApp
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-center text-sm text-slate-500 md:flex-row md:text-left">
          <p>&copy; {new Date().getFullYear()} Balaji Computer Classes. All rights reserved.</p>
          <p className="font-medium text-slate-400">Built for practical skills and real confidence.</p>
        </div>
      </div>
    </footer>
  );
}
