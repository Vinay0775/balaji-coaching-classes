import { Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from '@/lib/constants';

export default function TestimonialsSection() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-14">
          <div className="badge mb-4">Student Stories</div>
          <h2 className="section-title">
            What Our <span className="gradient-text">Students Say</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Real students, real results. Yeh unki kahaniyan hain jo apna career badal chuke hain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className={`glass-card p-7 hover:-translate-y-1 transition-all duration-300 ${i === 0 ? 'md:col-span-1' : ''}`}
            >
              <div className="flex items-start gap-4 mb-5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {t.avatar}
                </div>
                <div className="flex-1">
                  <div className="text-white font-semibold">{t.name}</div>
                  <div className="text-indigo-400 text-sm">{t.course}</div>
                  <div className="flex items-center gap-0.5 mt-1">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
                <Quote className="w-8 h-8 text-indigo-500/40 flex-shrink-0" />
              </div>

              <p className="text-slate-300 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.2)]">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className="text-green-400 text-xs font-medium">{t.placed}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
