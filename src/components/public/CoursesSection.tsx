import Link from 'next/link';
import { ArrowRight, Clock, IndianRupee } from 'lucide-react';
import { COURSES } from '@/lib/constants';

export default function CoursesSection() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-14">
          <div className="badge mb-4">Our Programs</div>
          <h2 className="section-title">
            Courses That <span className="gradient-text">Launch Careers</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Industry-aligned curriculum designed by professionals. From government certification to cutting-edge tech skills.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSES.map((course) => (
            <div key={course.slug} className="course-card group">
              {course.popular && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  🔥 Popular
                </div>
              )}
              {!course.popular && course.badge && (
                <div className="absolute top-4 right-4 badge text-xs">{course.badge}</div>
              )}

              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${course.color} flex items-center justify-center text-2xl mb-5 shadow-lg`}
              >
                {course.icon}
              </div>

              <h3 className="text-white font-bold text-xl mb-2 group-hover:text-indigo-300 transition-colors">
                {course.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-5 line-clamp-2">
                {course.description}
              </p>

              {/* Details */}
              <div className="flex items-center gap-4 mb-5 text-sm">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  {course.duration}
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <IndianRupee className="w-4 h-4 text-green-400" />
                  {course.discountedFees.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Topics preview */}
              <div className="flex flex-wrap gap-2 mb-6">
                {course.topics.slice(0, 3).map((topic) => (
                  <span
                    key={topic}
                    className="text-xs px-2.5 py-1 rounded-full bg-[rgba(99,102,241,0.1)] text-slate-300 border border-[rgba(99,102,241,0.15)]"
                  >
                    {topic}
                  </span>
                ))}
                {course.topics.length > 3 && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[rgba(99,102,241,0.1)] text-indigo-400">
                    +{course.topics.length - 3} more
                  </span>
                )}
              </div>

              <Link
                href={`/courses/${course.slug}`}
                className="flex items-center justify-between text-indigo-400 font-semibold text-sm group/link"
              >
                <span>View Course Details</span>
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/courses" className="btn-outline">
            View All Courses <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
