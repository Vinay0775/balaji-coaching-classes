import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, Star } from 'lucide-react';
import type { Metadata } from 'next';
import AnimatedSection, { StaggerContainer, StaggerItem } from '@/components/public/AnimatedSection';
import { COURSES } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'All Courses - Balaji Computer Classes',
  description: 'Explore RS-CIT, Web Development, Digital Marketing, Graphic Design, Video Editing and AI Tools courses.',
};

export default function CoursesPage() {
  return (
    <>
      <section className="page-hero relative overflow-hidden pb-16 grid-bg">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,165,166,0.08),transparent)]" />
        <AnimatedSection variant="fadeInUp" className="container-custom relative z-10 text-center">
          <div className="badge mb-6">Our Programs</div>
          <h1 className="section-title mb-6">
            All <span className="gradient-text-cool">Courses</span>
          </h1>
          <p className="section-subtitle mx-auto text-center">
            Choose from structured computer courses designed for beginners, upskillers, and students preparing for job-ready work.
          </p>
        </AnimatedSection>
      </section>

      <AnimatedSection variant="fadeInUp" delay={0.15} className="container-custom mb-12">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10">
          <Image src="/hero-banner.png" alt="Balaji Computer Classes courses" width={1400} height={560} className="h-[230px] w-full object-cover md:h-[300px]" />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center md:px-10">
            <div className="max-w-3xl">
              <div className="mb-2 text-2xl font-black text-white md:text-4xl">From basic confidence to advanced digital skills</div>
              <div className="text-sm leading-7 text-slate-300 md:text-base">Flexible duration, practical training, and guided support across every batch.</div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <section className="pb-20">
        <div className="container-custom">
          <StaggerContainer className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {COURSES.map((course) => (
              <StaggerItem key={course.slug}>
                <div className="course-card flex h-full flex-col p-5 sm:p-6">
                  <div className={`mb-5 flex h-32 items-center justify-between rounded-[1.5rem] bg-gradient-to-br ${course.color} p-5 text-white`}>
                    <div className="rounded-2xl bg-black/15 px-3 py-2 text-sm font-black tracking-[0.2em]">{course.icon}</div>
                    <div className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold">{course.badge}</div>
                  </div>

                  <h2 className="mb-1 text-xl font-bold text-white">{course.title}</h2>
                  <p className="mb-3 text-sm text-slate-400">{course.fullName}</p>
                  <p className="mb-4 flex-1 text-sm leading-7 text-slate-300">{course.description}</p>

                  <div className="mb-4 flex flex-wrap gap-3 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-amber-300" />
                      {course.duration}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                      4.9 rated
                    </span>
                  </div>

                  <div className="mb-5 flex flex-wrap gap-2">
                    {course.topics.slice(0, 4).map((topic) => (
                      <span key={topic} className="rounded-lg border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-slate-300">
                        {topic}
                      </span>
                    ))}
                  </div>

                  <div className="mb-5 flex items-center justify-between border-t border-white/8 pt-4">
                    <div>
                      <div className="text-lg font-black text-white">{formatCurrency(course.discountedFees)}</div>
                      <div className="text-xs text-slate-500 line-through">{formatCurrency(course.fees)}</div>
                    </div>
                    <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-300">
                      {Math.round(((course.fees - course.discountedFees) / course.fees) * 100)}% off
                    </div>
                  </div>

                  <Link href={`/courses/${course.slug}`} className="btn-primary mt-auto w-full justify-center py-3">
                    View Course <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </>
  );
}
