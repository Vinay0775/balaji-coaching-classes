import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Award, Eye, Heart, Target } from 'lucide-react';
import type { Metadata } from 'next';
import AnimatedSection, { StaggerContainer, StaggerItem } from '@/components/public/AnimatedSection';
import { INSTITUTE_INFO } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'About Us - Balaji Computer Classes',
  description: 'Learn about Balaji Computer Classes, our mission, vision, team and student-first teaching approach.',
};

const values = [
  {
    icon: Target,
    title: 'Mission',
    desc: 'Har student ko practical aur industry-ready computer skills dena jo unhe apna career build karne mein help kare.',
    color: 'text-amber-300',
    bg: 'bg-amber-400/10',
  },
  {
    icon: Eye,
    title: 'Vision',
    desc: 'Affordable aur quality computer education ko itna useful banana ki har learner confidently digital world mein grow kare.',
    color: 'text-sky-300',
    bg: 'bg-sky-400/10',
  },
  {
    icon: Heart,
    title: 'Values',
    desc: 'Student-first support, transparent communication, practical labs aur respectful teaching hamari core identity hai.',
    color: 'text-rose-300',
    bg: 'bg-rose-400/10',
  },
];

const faculty = [
  { name: 'Rajesh Kumar', role: 'Web Development Instructor', exp: '5+ Years', courses: 'Web Dev and AI Tools', initials: 'RK', color: 'from-amber-500 to-orange-500' },
  { name: 'Meena Sharma', role: 'Digital Marketing Mentor', exp: '4+ Years', courses: 'Digital Marketing', initials: 'MS', color: 'from-sky-500 to-cyan-500' },
  { name: 'Anil Verma', role: 'Design and Video Expert', exp: '6+ Years', courses: 'Graphic Design and Video Editing', initials: 'AV', color: 'from-emerald-500 to-teal-500' },
  { name: 'Pradeep Singh', role: 'RS-CIT Coordinator', exp: '3+ Years', courses: 'RS-CIT and Office Skills', initials: 'PS', color: 'from-violet-500 to-indigo-500' },
];

export default function AboutPage() {
  return (
    <>
      <section className="page-hero relative overflow-hidden pb-16 grid-bg">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(245,158,11,0.08),transparent)]" />
        <AnimatedSection className="container-custom relative z-10 text-center" variant="fadeInUp">
          <div className="badge mb-6">Our Story</div>
          <h1 className="section-title mb-6">
            About <span className="gradient-text-warm">{INSTITUTE_INFO.name}</span>
          </h1>
          <p className="section-subtitle mx-auto text-center">
            {INSTITUTE_INFO.founded} se lekar aaj tak hum students ko sirf course nahi, balki practical confidence dene par focus kar rahe hain.
          </p>
        </AnimatedSection>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <AnimatedSection variant="fadeInLeft" className="text-center lg:text-left">
              <h2 className="mb-6 text-3xl font-bold text-white">
                Hamari <span className="gradient-text-warm">kahani</span>
              </h2>
              <div className="space-y-5 text-base leading-8 text-slate-300">
                <p>
                  {INSTITUTE_INFO.name} ki shuruaat {INSTITUTE_INFO.founded} mein ek focused classroom setup ke saath hui thi. Hamara simple aim tha:
                  quality computer education ko approachable aur useful banana.
                </p>
                <p>
                  Aaj institute ne {INSTITUTE_INFO.totalStudents} se zyada students ko train kiya hai. Hamare courses beginners aur career switchers dono ko dhyan mein rakhkar banaye gaye hain.
                </p>
                <p>
                  Placement support, daily practice aur approachable teachers ki wajah se students ka learning journey smoother hota hai.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                  { label: 'Students', value: INSTITUTE_INFO.totalStudents },
                  { label: 'Courses', value: INSTITUTE_INFO.courses },
                  { label: 'Support', value: INSTITUTE_INFO.placementRate },
                ].map((stat) => (
                  <div key={stat.label} className="stat-card">
                    <div className="text-2xl font-black gradient-text">{stat.value}</div>
                    <div className="mt-2 text-xs uppercase tracking-[0.15em] text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection variant="fadeInRight" className="relative">
              <div className="overflow-hidden rounded-[2rem] border border-white/10">
                <Image src="/about-team.png" alt="Balaji Computer Classes team" width={900} height={700} className="h-[430px] w-full object-cover md:h-[520px]" />
              </div>
              <div className="glass-card absolute -bottom-5 left-5 px-5 py-4">
                <div className="font-bold text-white">Established in {INSTITUTE_INFO.founded}</div>
                <div className="text-sm text-slate-400">Consistent classroom growth</div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="section-padding bg-[rgba(11,21,36,0.55)]">
        <div className="container-custom">
          <AnimatedSection className="mb-12 text-center" variant="fadeInUp">
            <h2 className="section-title">
              Mission, vision, and <span className="gradient-text-warm">student values</span>
            </h2>
          </AnimatedSection>
          <StaggerContainer className="grid gap-6 md:grid-cols-3">
            {values.map((value) => (
              <StaggerItem key={value.title} className="glass-card h-full p-7">
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${value.bg}`}>
                  <value.icon className={`h-6 w-6 ${value.color}`} />
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">{value.title}</h3>
                <p className="text-sm leading-7 text-slate-400">{value.desc}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <AnimatedSection className="mb-12 text-center" variant="fadeInUp">
            <div className="badge mb-4">Faculty</div>
            <h2 className="section-title">
              Meet the <span className="gradient-text-warm">teaching team</span>
            </h2>
            <p className="section-subtitle mx-auto">
              Hamare mentors theory ko practical examples aur real tools ke saath simplify karte hain.
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {faculty.map((member) => (
              <StaggerItem key={member.name} className="glass-card h-full p-6 text-center">
                <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${member.color} text-2xl font-black text-white`}>
                  {member.initials}
                </div>
                <h3 className="mb-1 text-lg font-bold text-white">{member.name}</h3>
                <p className="mb-3 text-sm text-amber-300">{member.role}</p>
                <div className="mb-2 text-xs uppercase tracking-[0.15em] text-slate-500">{member.exp} Experience</div>
                <div className="text-sm text-slate-400">{member.courses}</div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="section-padding bg-[rgba(11,21,36,0.55)]">
        <AnimatedSection variant="scaleIn" className="container-custom text-center">
          <h2 className="section-title mb-4">
            Ready to learn with <span className="gradient-text-warm">Balaji?</span>
          </h2>
          <p className="section-subtitle mx-auto mb-8">Courses dekhiye, free guidance lijiye, aur apne liye right batch choose kariye.</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/courses" className="btn-primary justify-center">
              Explore Courses <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="btn-outline justify-center">
              Contact Us
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </>
  );
}
