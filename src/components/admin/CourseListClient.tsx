'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { BookOpen, Clock, Edit3, FilterX, Plus, Presentation, Search } from 'lucide-react';
import StatusToggleButton from '@/components/admin/StatusToggleButton';
import { formatCurrency } from '@/lib/utils';

interface Course {
  _id: string;
  title: string;
  fullName: string;
  description: string;
  duration: string;
  fees: number;
  discountedFees: number;
  color: string;
  icon: string;
  isActive: boolean;
  roadmap: Array<{ title: string }>;
}

interface CourseListProps {
  courses: Course[];
}

export function CourseListClient({ courses }: CourseListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'draft'>('all');

  const filteredCourses = useMemo(() => {
    return [...courses]
      .filter((course) => {
        const matchesSearch =
          !searchTerm ||
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          filterActive === 'all' ||
          (filterActive === 'active' && course.isActive) ||
          (filterActive === 'draft' && !course.isActive);

        return matchesSearch && matchesStatus;
      })
      .sort((left, right) => left.title.localeCompare(right.title));
  }, [courses, filterActive, searchTerm]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-semibold text-white tracking-tight">
            Course Management
          </h1>
          <p className="text-base text-slate-400 mt-1">
            Manage curriculum, pricing, and live status across all programs.
          </p>
        </div>
        <Link
          href="/admin/courses/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 w-fit"
        >
          <Plus className="w-4 h-4" /> Create Course
        </Link>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative group">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search courses by name, title..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full bg-[#111827] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <select
          value={filterActive}
          onChange={(event) => setFilterActive(event.target.value as 'all' | 'active' | 'draft')}
          className="w-full md:w-48 bg-[#111827] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
        >
          <option value="all">All Courses</option>
          <option value="active">Active Only</option>
          <option value="draft">Draft Only</option>
        </select>

        {(searchTerm || filterActive !== 'all') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterActive('all');
            }}
            className="bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg px-3 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <FilterX className="w-4 h-4" /> Reset
          </button>
        )}
      </div>

      {/* Grid Layout */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length === 0 ? (
          <div className="col-span-full bg-[#0a0f1d] border border-white/10 rounded-2xl p-12 text-center">
            <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <div className="text-slate-400 text-sm font-medium">
              {searchTerm || filterActive !== 'all'
                ? 'No courses match your filters.'
                : 'No courses have been created yet.'}
            </div>
          </div>
        ) : (
          filteredCourses.map((course) => (
            <div key={course._id} className="bg-[#0a0f1d] border border-white/10 rounded-xl flex flex-col group overflow-hidden hover:border-white/20 transition-colors shadow-sm">
              {/* Course Image / Icon placeholder */}
              <div className={`h-24 bg-gradient-to-br ${course.color} relative overflow-hidden flex items-center justify-between px-6`}>
                <div className="text-4xl relative z-10">{course.icon}</div>
                <span
                  className={`relative z-10 px-2 py-1 rounded text-[10px] font-medium uppercase tracking-wider ${
                    course.isActive ? 'bg-white/20 text-white' : 'bg-black/40 text-slate-300'
                  }`}
                >
                  {course.isActive ? 'Live' : 'Draft'}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="mb-4">
                  <h2 className="text-lg font-medium text-white mb-0.5 group-hover:text-indigo-300 transition-colors line-clamp-1">
                    {course.title}
                  </h2>
                  <p className="text-xs text-slate-500 line-clamp-1">{course.fullName}</p>
                  <p className="text-sm text-slate-400 mt-2 line-clamp-2 leading-relaxed">{course.description}</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mb-6 mt-auto">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> {course.duration}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Presentation className="w-3.5 h-3.5" /> {course.roadmap?.length || 0} Modules
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-white font-medium text-base">
                      {formatCurrency(course.discountedFees || course.fees)}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Total Fees
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/courses/${course._id}/edit`}
                      className="w-8 h-8 rounded-lg bg-[#111827] border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                      title="Edit Course"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>
                    <div className="bg-[#111827] border border-white/5 p-1 rounded-lg">
                      <StatusToggleButton entity="course" entityId={course._id} isActive={course.isActive} compact />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
