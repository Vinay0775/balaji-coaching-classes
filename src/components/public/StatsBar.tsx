import { INSTITUTE_INFO } from '@/lib/constants';
import { Users, BookOpen, TrendingUp, Calendar } from 'lucide-react';

const stats = [
  { icon: Users, value: INSTITUTE_INFO.totalStudents, label: 'Happy Students', color: 'text-indigo-400' },
  { icon: BookOpen, value: INSTITUTE_INFO.courses, label: 'Expert Courses', color: 'text-cyan-400' },
  { icon: TrendingUp, value: INSTITUTE_INFO.placementRate, label: 'Placement Rate', color: 'text-violet-400' },
  { icon: Calendar, value: INSTITUTE_INFO.founded, label: 'Est. Year', color: 'text-pink-400' },
];

export default function StatsBar() {
  return (
    <section className="py-10 border-y border-[rgba(99,102,241,0.15)] bg-[rgba(19,25,41,0.5)]">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-4 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-xl bg-[rgba(99,102,241,0.1)] flex items-center justify-center flex-shrink-0">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <div className="text-white font-bold text-2xl">{stat.value}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
