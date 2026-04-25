import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, BookOpen, CheckCircle, ChevronRight, Clock, Users } from 'lucide-react';
import type { Metadata } from 'next';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import { COURSES, INSTITUTE_INFO } from '@/lib/constants';
import { buildWhatsAppUrl, formatCurrency } from '@/lib/utils';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = COURSES.find((item) => item.slug === slug);
  if (!course) return { title: 'Course Not Found' };

  return {
    title: `${course.title} - Balaji Computer Classes`,
    description: course.description,
  };
}

export async function generateStaticParams() {
  return COURSES.map((course) => ({ slug: course.slug }));
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = COURSES.find((item) => item.slug === slug);
  if (!course) notFound();

  await dbConnect();
  const dbCourse = await Course.findOne({ slug }).select('_id').lean();
  const courseId = dbCourse?._id?.toString() || '';
  const enquiryHref = buildWhatsAppUrl(
    INSTITUTE_INFO.whatsapp,
    `Hello ${INSTITUTE_INFO.name}, mujhe ${course.title} course ke baare mein details chahiye.`
  );
  const relatedCourses = COURSES.filter((item) => item.slug !== slug).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-32">
        <div className={`absolute inset-0 bg-gradient-to-br ${course.color} opacity-10`} />
        <div className="absolute inset-0 grid-bg" />
        <div className="container-custom relative z-10">
          <div className="mb-6 flex items-center gap-2 text-sm text-slate-400">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/courses" className="hover:text-white">
              Courses
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-amber-300">{course.title}</span>
          </div>

          <div className="grid items-start gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              {course.badge ? <div className="badge mb-4">{course.badge}</div> : null}
              <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br ${course.color} text-sm font-black tracking-[0.2em] text-white`}>
                {course.icon}
              </div>
              <h1 className="mb-4 text-4xl font-black text-white md:text-5xl">{course.title}</h1>
              <p className="mb-7 max-w-2xl text-lg leading-8 text-slate-300">{course.description}</p>

              <div className="mb-8 flex flex-wrap gap-4 text-sm text-slate-300">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-4 py-2">
                  <Clock className="h-4 w-4 text-amber-300" /> {course.duration}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-4 py-2">
                  <Users className="h-4 w-4 text-sky-300" /> 500+ students enrolled
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-4 py-2">
                  <BookOpen className="h-4 w-4 text-emerald-300" /> {course.topics.length} modules
                </span>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href={`/enroll?courseId=${courseId}`} className="btn-primary justify-center px-8 py-4 text-base">
                  Enroll Now <ArrowRight className="h-5 w-5" />
                </Link>
                <a href={enquiryHref} target="_blank" rel="noopener noreferrer" className="btn-outline justify-center px-8 py-4 text-base">
                  Ask on WhatsApp
                </a>
              </div>
            </div>

            <div className="glass-card p-8">
              <div className="mb-6 text-center">
                <div className="mb-1 text-sm uppercase tracking-[0.18em] text-slate-500">Course Fees</div>
                <div className="text-4xl font-black text-white">{formatCurrency(course.discountedFees)}</div>
                <div className="mt-2 text-sm text-slate-500 line-through">{formatCurrency(course.fees)}</div>
                <div className="mt-2 text-sm font-semibold text-emerald-300">
                  Save {formatCurrency(course.fees - course.discountedFees)}
                </div>
              </div>

              <div className="mb-6 space-y-3">
                {[
                  'Free first demo class',
                  'Practical lab sessions',
                  'Certificate on completion',
                  'Faculty guidance and support',
                  'Placement assistance',
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>

              <Link href={`/enroll?courseId=${courseId}`} className="btn-primary w-full justify-center py-3.5">
                Start Enrollment <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-3 text-center text-xs text-slate-500">Installments are available. No hidden fees.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-[rgba(11,21,36,0.55)]">
        <div className="container-custom">
          <h2 className="mb-8 text-2xl font-bold text-white">What you will learn</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {course.topics.map((topic) => (
              <div key={topic} className="glass-card flex items-center gap-3 px-4 py-3">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span className="text-sm text-slate-300">{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <h2 className="mb-10 text-2xl font-bold text-white">Course roadmap</h2>
          <div className="space-y-5">
            {course.roadmap.map((step, index) => (
              <div key={step.title} className="glass-card flex gap-5 p-6">
                <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${course.color} font-bold text-white`}>
                  {index + 1}
                </div>
                <div>
                  <div className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-amber-300">{step.week}</div>
                  <div className="mb-1 text-lg font-bold text-white">{step.title}</div>
                  <div className="text-sm leading-7 text-slate-400">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-[rgba(11,21,36,0.55)]">
        <div className="container-custom">
          <h2 className="mb-8 text-2xl font-bold text-white">Related courses</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {relatedCourses.map((item) => (
              <Link key={item.slug} href={`/courses/${item.slug}`} className="course-card p-5">
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-xs font-black tracking-[0.2em] text-white`}>
                  {item.icon}
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">{item.title}</h3>
                <p className="mb-4 text-sm leading-7 text-slate-400">{item.description}</p>
                <div className="flex items-center justify-between border-t border-white/8 pt-4">
                  <span className="text-sm text-slate-400">{item.duration}</span>
                  <span className="text-sm font-bold text-white">{formatCurrency(item.discountedFees)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
