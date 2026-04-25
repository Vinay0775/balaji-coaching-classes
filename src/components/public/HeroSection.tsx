'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle, Star, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { INSTITUTE_INFO } from '@/lib/constants';
import { buildWhatsAppUrl } from '@/lib/utils';

const highlights = [
  'RS-CIT and job-focused courses',
  'Daily practical training',
  'Flexible weekday and weekend batches',
  'Placement support and guidance',
];

export default function HeroSection() {
  const whatsappHref = buildWhatsAppUrl(
    INSTITUTE_INFO.whatsapp,
    'Hello Balaji Computer Classes, mujhe free demo class aur available batches ke baare mein batayiye.'
  );

  return (
    <section className="page-hero relative flex min-h-[100dvh] items-center overflow-hidden pb-12">
      <div className="absolute inset-0 z-0">
        <Image src="/hero-bg-dark.png" alt="" fill className="object-cover opacity-25" priority />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(7,17,31,0.98),rgba(7,17,31,0.92),rgba(7,17,31,0.58))]" />
      </div>

      <motion.div
        className="pointer-events-none absolute left-[-4rem] top-[12%] h-72 w-72 rounded-full bg-amber-500/20 blur-[110px]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.18, 0.28, 0.18] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-[8%] right-[8%] h-80 w-80 rounded-full bg-teal-400/16 blur-[120px]"
        animate={{ scale: [1, 1.12, 1], opacity: [0.14, 0.22, 0.14] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="container-custom relative z-10 py-10 lg:py-16">
        <div className="grid items-center gap-16 xl:grid-cols-2 xl:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="max-w-2xl mx-auto text-center xl:mx-0 xl:text-left"
          >
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-amber-300/20 bg-amber-400/10 px-5 py-2 text-sm font-semibold text-amber-100">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              New batch is open. Limited seats available.
            </div>

            <h1 className="mb-6 text-5xl font-black leading-[1.03] text-white md:text-6xl lg:text-7xl">
              Build Skills.
              <br />
              <span className="gradient-text">Start Your Career.</span>
            </h1>

            <p className="mb-10 max-w-xl mx-auto xl:mx-0 text-lg leading-8 text-slate-300 lg:text-xl">
              {INSTITUTE_INFO.name} mein practical computer training milti hai jisse students sirf course complete nahi karte,
              balki confidently job-ready bhi bante hain.
            </p>

            <div className="mb-10 grid gap-4 sm:grid-cols-2 text-left">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-white/6 bg-white/[0.03] px-4 py-3 text-sm text-slate-200"
                >
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-emerald-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mb-12 flex flex-col gap-6 sm:flex-row justify-center xl:justify-start">
              <Link href="/courses" className="btn-primary justify-center px-8 py-4 text-base lg:text-lg">
                Courses Dekhein <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline justify-center px-8 py-4 text-base lg:text-lg"
              >
                Free Demo Class
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center xl:justify-start gap-8 border-t border-white/10 pt-8">
              <div className="flex items-center gap-3 text-left">
                <div className="flex -space-x-3">
                  {['RK', 'PS', 'AM', 'DV'].map((value, index) => (
                    <div
                      key={value}
                      className={`flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#07111f] text-xs font-bold text-white ${['bg-amber-500', 'bg-teal-500', 'bg-sky-500', 'bg-rose-500'][index]
                        }`}
                    >
                      {value}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-lg font-bold text-white">{INSTITUTE_INFO.totalStudents}</div>
                  <div className="text-sm text-slate-400">Students trained</div>
                </div>
              </div>
              <div className="hidden h-10 w-px bg-white/10 sm:block" />
              <div className="flex items-center gap-3 text-left">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-5 w-5 fill-amber-300 text-amber-300" />
                  ))}
                </div>
                <div>
                  <div className="text-lg font-bold text-white">4.9/5</div>
                  <div className="text-sm text-slate-400">Average rating</div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="relative hidden xl:block">
            <motion.div
              className="relative ml-auto h-[640px] w-full max-w-[600px]"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75 }}
            >
              <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] border border-white/10 shadow-[0_32px_80px_rgba(2,8,23,0.45)]">
                <Image src="/hero-students.png" alt="Students learning at Balaji Computer Classes" fill className="object-cover" priority />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(7,17,31,0.85))]" />
              </div>

              <div className="absolute left-[-2.5rem] top-10 rounded-3xl border border-amber-300/20 bg-[#112239]/92 px-6 py-4 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/12 text-amber-300">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">Govt. Certified</div>
                    <div className="text-sm text-slate-400">RS-CIT and practical labs</div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-24 right-[-2rem] rounded-3xl border border-teal-300/20 bg-[#112239]/92 px-6 py-4 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-400/12 text-teal-300">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">{INSTITUTE_INFO.totalStudents}</div>
                    <div className="text-sm text-slate-400">Students successfully trained</div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 left-8 flex max-w-[82%] flex-wrap gap-3">
                {['RS-CIT', 'Web Dev', 'AI Tools', 'Design Lab'].map((badge) => (
                  <div
                    key={badge}
                    className="rounded-2xl border border-white/10 bg-[#07111f]/80 px-4 py-2 text-sm font-semibold text-white backdrop-blur"
                  >
                    {badge}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,transparent,rgba(7,17,31,1))]" />
    </section>
  );
}
