import { ShieldCheck, Users2, Clock3, Trophy, Laptop, HeartHandshake } from 'lucide-react';

const features = [
  {
    icon: Laptop,
    title: 'Practical Learning',
    desc: 'Har cheez hands-on practice ke saath seekhi jaati hai. Theory se zyada practical pe focus.',
    color: 'text-indigo-400',
    bg: 'bg-[rgba(99,102,241,0.1)]',
  },
  {
    icon: Users2,
    title: 'Expert Faculty',
    desc: 'Industry-experienced teachers jo real-world knowledge share karte hain students ke saath.',
    color: 'text-cyan-400',
    bg: 'bg-[rgba(6,182,212,0.1)]',
  },
  {
    icon: Trophy,
    title: '85% Placement',
    desc: 'Hamare students top companies aur freelance mein successful hain. Placement support milti hai.',
    color: 'text-yellow-400',
    bg: 'bg-[rgba(234,179,8,0.1)]',
  },
  {
    icon: Clock3,
    title: 'Flexible Timings',
    desc: 'Morning aur evening batches available hain. Apni convenience ke hisaab se class choose karo.',
    color: 'text-green-400',
    bg: 'bg-[rgba(34,197,94,0.1)]',
  },
  {
    icon: ShieldCheck,
    title: 'Certified Courses',
    desc: 'Government aur industry recognized certificates jo aapki CV ko strong banate hain.',
    color: 'text-violet-400',
    bg: 'bg-[rgba(139,92,246,0.1)]',
  },
  {
    icon: HeartHandshake,
    title: 'Lifetime Support',
    desc: 'Course complete hone ke baad bhi technical help aur career guidance milti rehti hai.',
    color: 'text-pink-400',
    bg: 'bg-[rgba(236,72,153,0.1)]',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-[rgba(15,22,40,0.5)]">
      <div className="container-custom">
        <div className="text-center mb-14">
          <div className="badge mb-4">Why Tech Vidya</div>
          <h2 className="section-title">
            Why Students <span className="gradient-text">Choose Us</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Sirf padhai nahi — ek complete learning experience jo aapki life change kare.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="glass-card p-7 hover:border-[rgba(99,102,241,0.4)] transition-all duration-300 group hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-5`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-white font-bold text-lg mb-2 group-hover:text-indigo-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
