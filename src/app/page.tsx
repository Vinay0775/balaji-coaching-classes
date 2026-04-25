import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Award, BookOpen, CheckCircle, Clock3, Phone, Shield, Star, Users, Zap } from 'lucide-react';
import type { Metadata } from 'next';
import HeroSection from '@/components/public/HeroSection';
import AnimatedSection, { StaggerContainer, StaggerItem } from '@/components/public/AnimatedSection';
import { COURSES, INSTITUTE_INFO } from '@/lib/constants';
import { formatCurrency, getPhoneHref } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Balaji Computer Classes - Best Computer Coaching in Rajasthan',
  description:
    'Join Balaji Computer Classes for RS-CIT, Web Development, Digital Marketing, Graphic Design, Video Editing and AI Tools courses.',
};

const stats = [
  { icon: Users, value: INSTITUTE_INFO.totalStudents, label: 'Students trained', color: 'text-amber-300', bg: 'bg-amber-400/10' },
  { icon: BookOpen, value: INSTITUTE_INFO.courses, label: 'Career-focused tracks', color: 'text-sky-300', bg: 'bg-sky-400/10' },
  { icon: Award, value: INSTITUTE_INFO.placementRate, label: 'Placement support', color: 'text-emerald-300', bg: 'bg-emerald-400/10' },
  { icon: Star, value: '4.9/5', label: 'Student satisfaction', color: 'text-rose-300', bg: 'bg-rose-400/10' },
];

const features = [
  {
    icon: Zap,
    title: 'Practical classes every week',
    desc: 'Students work on real assignments so confidence build hota hai from day one.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Trusted and certified learning',
    desc: 'RS-CIT aur job-focused programs dono hi structured aur useful hain.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Users,
    title: 'Supportive faculty',
    desc: 'Small batches, doubt support aur mentoring se pace maintain rehta hai.',
    color: 'from-sky-500 to-cyan-500',
  },
  {
    icon: Clock3,
    title: 'Flexible batch timings',
    desc: 'Morning, evening aur weekend options students aur working learners dono ke liye.',
    color: 'from-violet-500 to-indigo-500',
  },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    course: 'Web Development',
    text: 'Yahan practical training itni strong thi ki mera confidence genuinely improve hua aur mujhe job mil gayi.',
    initials: 'PS',
  },
  {
    name: 'Rahul Verma',
    course: 'Digital Marketing',
    text: 'Faculty supportive hai aur classes theory ke saath actual tools par focus karti hain. Kaafi useful experience raha.',
    initials: 'RV',
  },
  {
    name: 'Anjali Meena',
    course: 'RS-CIT',
    text: 'Clear guidance, simple explanation aur regular practice ki wajah se exam smooth ho gaya.',
    initials: 'AM',
  },
];

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <section className="border-y border-white/8 bg-[rgba(11,21,36,0.55)] py-12 lg:py-16">
        <AnimatedSection className="container-custom" variant="fadeInUp">
          <StaggerContainer className="grid grid-cols-2 gap-5 lg:grid-cols-4 lg:gap-8">
            {stats.map((item) => (
              <StaggerItem key={item.label} className="rounded-[26px] border border-white/8 bg-white/[0.03] p-5 text-center shadow-[0_18px_40px_rgba(2,8,23,0.18)]">
                <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${item.bg}`}>
                  <item.icon className={`h-8 w-8 ${item.color}`} />
                </div>
                <div className={`text-3xl font-black ${item.color}`}>{item.value}</div>
                <div className="mt-2 text-sm text-slate-400">{item.label}</div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </AnimatedSection>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <AnimatedSection className="mb-16 text-center" variant="fadeInUp">
            <div className="badge mb-6">Top Programs</div>
            <h2 className="section-title mb-5">
              Skill-based <span className="gradient-text">Courses</span> for real growth
            </h2>
            <p className="section-subtitle mx-auto text-center">
              Practical syllabus, clear mentoring aur affordable fees ke saath programs jo students ko next step ke liye ready karte hain.
            </p>
          </AnimatedSection>

          <AnimatedSection variant="fadeInUp" className="relative mb-10 overflow-hidden rounded-[2rem] border border-white/10">
            <Image src="/computer-lab.png" alt="Balaji Computer Classes computer lab" width={1400} height={560} className="h-[240px] w-full object-cover md:h-[320px]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,17,31,0.94),rgba(7,17,31,0.38),transparent)]" />
            <div className="absolute inset-0 flex items-center justify-between px-6 md:px-10">
              <div className="max-w-xl">
                <div className="mb-2 text-2xl font-black text-white md:text-4xl">Modern lab. Focused batches. Better learning.</div>
                <div className="max-w-md text-sm leading-7 text-slate-300 md:text-base">
                  Updated systems, guided lab practice, and a classroom setup designed for attention and progress.
                </div>
              </div>
              <Link href="/courses" className="btn-primary hidden md:inline-flex">
                All Courses <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </AnimatedSection>

          <StaggerContainer className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {COURSES.map((course) => (
              <StaggerItem key={course.slug}>
                <Link href={`/courses/${course.slug}`} className="course-card flex h-full flex-col p-5 sm:p-6">
                  <div className={`mb-5 flex h-28 items-center justify-between rounded-[1.4rem] bg-gradient-to-br ${course.color} p-5 text-white`}>
                    <span className="rounded-xl bg-black/15 px-3 py-2 text-sm font-black tracking-[0.2em]">{course.icon}</span>
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold">{course.duration}</span>
                  </div>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <h3 className="text-xl font-bold text-white">{course.title}</h3>
                    {course.popular ? <span className="rounded-full bg-amber-400/10 px-3 py-1 text-[11px] font-bold text-amber-300">Popular</span> : null}
                  </div>
                  <p className="mb-3 text-sm text-slate-400">{course.fullName}</p>
                  <p className="mb-6 flex-1 text-sm leading-7 text-slate-300">{course.description}</p>
                  <div className="mb-5 flex flex-wrap gap-2">
                    {course.topics.slice(0, 3).map((topic) => (
                      <span key={topic} className="rounded-lg border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-slate-300">
                        {topic}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto flex items-center justify-between border-t border-white/8 pt-4">
                    <div>
                      <div className="text-lg font-black text-white">{formatCurrency(course.discountedFees)}</div>
                      <div className="text-xs text-slate-500 line-through">{formatCurrency(course.fees)}</div>
                    </div>
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-amber-300">
                      Details <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]" />
        <div className="container-custom relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <AnimatedSection variant="fadeInLeft" className="relative order-2 lg:order-1">
              <div className="overflow-hidden rounded-[2rem] border border-white/10">
                <Image src="/hero-students.png" alt="Students learning at Balaji Computer Classes" width={900} height={900} className="h-[420px] w-full object-cover md:h-[560px]" />
              </div>
              <div className="glass-card absolute -bottom-6 right-4 px-5 py-4">
                <div className="text-2xl font-black text-white">{INSTITUTE_INFO.placementRate}</div>
                <div className="text-sm text-emerald-300">Placement assistance focus</div>
              </div>
            </AnimatedSection>

            <AnimatedSection variant="fadeInRight" className="order-1 lg:order-2">
              <div className="badge mb-6">Why Students Choose Us</div>
              <h2 className="section-title mb-6">
                Simple teaching, strong practice, and <span className="gradient-text">better results</span>
              </h2>
              <p className="mb-10 max-w-xl text-base leading-8 text-slate-300">
                Sirf enrollment nahi, balki actual improvement hamara focus hai. Hum students ko pace, support aur structure dono dete hain.
              </p>
              <StaggerContainer className="grid gap-4 sm:grid-cols-2">
                {features.map((feature) => (
                  <StaggerItem key={feature.title} className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-5">
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color}`}>
                      <feature.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="mb-2 text-lg font-bold text-white">{feature.title}</div>
                    <div className="text-sm leading-7 text-slate-400">{feature.desc}</div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="section-padding border-y border-white/8 bg-[rgba(11,21,36,0.55)]">
        <div className="container-custom">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <AnimatedSection variant="fadeInLeft">
              <div className="badge mb-6">Student Outcomes</div>
              <h2 className="section-title mb-6">
                Learning that moves toward <span className="gradient-text">jobs and confidence</span>
              </h2>
              <p className="mb-10 max-w-xl text-base leading-8 text-slate-300">
                Courses is tarah design kiye gaye hain ki student ko skill, portfolio aur basic interview readiness ek saath mil sake.
              </p>
              <div className="space-y-4">
                {[
                  'Software and IT support roles',
                  'Digital marketing and freelance work',
                  'Design and video editing projects',
                  'RS-CIT and computer literacy confidence',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                    <span className="text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/contact" className="btn-primary mt-8">
                Free Counselling <ArrowRight className="h-5 w-5" />
              </Link>
            </AnimatedSection>

            <AnimatedSection variant="fadeInRight" className="relative overflow-hidden rounded-[2rem] border border-white/10">
              <Image src="/placement-success.png" alt="Balaji student success" width={900} height={900} className="h-[420px] w-full object-cover md:h-[520px]" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(7,17,31,0.92))]" />
              <div className="glass-card absolute bottom-6 left-6 right-6 p-5">
                <div className="mb-2 flex gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-5 w-5 fill-amber-300 text-amber-300" />
                  ))}
                </div>
                <div className="text-xl font-bold text-white">Rated highly by students</div>
                <div className="mt-1 text-sm text-slate-300">500+ reviews and a strong classroom reputation.</div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <AnimatedSection className="mb-16 text-center" variant="fadeInUp">
            <div className="badge mb-6">Student Voices</div>
            <h2 className="section-title mb-5">
              What our <span className="gradient-text">students say</span>
            </h2>
            <p className="section-subtitle mx-auto text-center">Real experiences from learners who completed classes and gained confidence.</p>
          </AnimatedSection>

          <StaggerContainer className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <StaggerItem key={testimonial.name} className="glass-card h-full p-7">
                <div className="mb-5 flex gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-amber-300 text-amber-300" />
                  ))}
                </div>
                <p className="mb-8 text-sm leading-8 text-slate-300">"{testimonial.text}"</p>
                <div className="flex items-center gap-3 border-t border-white/8 pt-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f59e0b,#0ea5a6)] font-bold text-white">
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className="font-bold text-white">{testimonial.name}</div>
                    <div className="text-sm text-amber-300">{testimonial.course}</div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="section-padding pt-0">
        <AnimatedSection variant="scaleIn" className="container-custom">
          <div className="relative overflow-hidden rounded-[2.4rem] border border-white/10 bg-[linear-gradient(135deg,rgba(245,158,11,0.12),rgba(14,165,166,0.12),rgba(56,189,248,0.08))] px-6 py-12 text-center shadow-[0_32px_80px_rgba(2,8,23,0.36)] md:px-12 md:py-16">
            <div className="absolute inset-0 opacity-15">
              <Image src="/hero-bg-dark.png" alt="" fill className="object-cover" />
            </div>
            <div className="relative z-10">
              <div className="badge mb-6">Limited Seats</div>
              <h2 className="mb-5 text-4xl font-black text-white md:text-5xl">
                Ready to start your <span className="gradient-text">digital journey?</span>
              </h2>
              <p className="mx-auto mb-10 max-w-3xl text-lg leading-8 text-slate-200">
                Free guidance, clear course selection aur supportive admission process ke saath aap apna next step aaj hi le sakte hain.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link href="/enroll" className="btn-primary justify-center px-8 py-4 text-base">
                  Start Enrollment <ArrowRight className="h-5 w-5" />
                </Link>
                <a href={getPhoneHref(INSTITUTE_INFO.phone)} className="btn-outline justify-center px-8 py-4 text-base">
                  <Phone className="h-5 w-5" /> Call Now
                </a>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </>
  );
}
