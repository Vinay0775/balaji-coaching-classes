'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { ArrowLeft, Loader2, Plus, Trash2, CheckCircle } from 'lucide-react';
import { createCourseAdmin, updateCourseAdmin } from '@/app/actions/adminActions';

interface RoadmapStep {
  id: string;
  week: string;
  title: string;
  desc: string;
}

interface CourseFormProps {
  mode: 'create' | 'edit';
  course?: {
    id: string;
    title: string;
    fullName: string;
    slug: string;
    description: string;
    duration: string;
    category: string;
    fees: number;
    discountedFees: number;
    icon: string;
    color: string;
    badge?: string;
    popular: boolean;
    isActive: boolean;
    topics: string[];
    roadmap: RoadmapStep[];
  };
}

const colorOptions = [
  'from-indigo-500 to-cyan-500',
  'from-cyan-500 to-blue-500',
  'from-orange-500 to-red-500',
  'from-pink-500 to-rose-500',
  'from-green-500 to-emerald-500',
  'from-violet-500 to-purple-600',
];

const labelClassName = "text-[13px] font-medium text-slate-400 mb-1.5";
const inputClassName = "w-full bg-[#111827] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors";

function createRoadmapStep(step?: Partial<RoadmapStep>): RoadmapStep {
  return {
    id: step?.id || globalThis.crypto?.randomUUID?.() || `roadmap-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    week: step?.week || '',
    title: step?.title || '',
    desc: step?.desc || '',
  };
}

export function CourseForm({ mode, course }: CourseFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<RoadmapStep[]>(
    course?.roadmap?.length
      ? course.roadmap.map((step) => createRoadmapStep(step))
      : [createRoadmapStep()]
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result =
      mode === 'create'
        ? await createCourseAdmin(formData)
        : await updateCourseAdmin(course!.id, formData);

    setLoading(false);

    if (!result.success) {
      toast.error(result.error || 'Unable to save course.');
      return;
    }

    toast.success(result.message || 'Successfully saved');
    router.push('/admin/courses');
    router.refresh();
  }

  function updateRoadmap(index: number, key: keyof RoadmapStep, value: string) {
    setRoadmap((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      )
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-6">
        <Link
          href="/admin/courses"
          className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Courses
        </Link>
        <h1 className="text-[28px] font-semibold text-white tracking-tight">
          {mode === 'create' ? 'Deploy Course' : 'Edit Course'}
        </h1>
        <p className="text-base text-slate-400 mt-1">
          Build a course profile with pricing, curriculum, and roadmap modules.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 bg-[#0a0f1d] border border-white/10 rounded-2xl shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col">
              <label className={labelClassName}>Course Title</label>
              <input name="title" required defaultValue={course?.title} placeholder="e.g. RS-CIT" className={inputClassName} />
            </div>
            
            <div className="flex flex-col">
              <label className={labelClassName}>Full Name</label>
              <input name="fullName" required defaultValue={course?.fullName} placeholder="Rajasthan State Certificate in IT" className={inputClassName} />
            </div>

            <div className="flex flex-col">
              <label className={labelClassName}>Custom Slug</label>
              <input name="slug" defaultValue={course?.slug} placeholder="rs-cit" className={inputClassName} />
            </div>

            <div className="flex flex-col">
              <label className={labelClassName}>Duration</label>
              <input name="duration" required defaultValue={course?.duration} placeholder="3 Months" className={inputClassName} />
            </div>

            <div className="flex flex-col">
              <label className={labelClassName}>Category</label>
              <input name="category" required defaultValue={course?.category} placeholder="Technical / Creative" className={inputClassName} />
            </div>

            <div className="col-span-full flex flex-col">
              <label className={labelClassName}>Description</label>
              <textarea
                name="description"
                required
                rows={4}
                defaultValue={course?.description}
                placeholder="Explain what students will learn..."
                className={`${inputClassName} resize-none`}
              />
            </div>

            <div className="flex flex-col">
              <label className={labelClassName}>Fees</label>
              <input name="fees" type="number" min="1" required defaultValue={course?.fees} placeholder="5000" className={inputClassName} />
            </div>

            <div className="flex flex-col">
              <label className={labelClassName}>Discounted Fees</label>
              <input name="discountedFees" type="number" min="1" required defaultValue={course?.discountedFees} placeholder="4500" className={inputClassName} />
            </div>

            <div className="flex flex-col">
              <label className={labelClassName}>Icon</label>
              <input name="icon" defaultValue={course?.icon} placeholder="💻" className={inputClassName} />
            </div>

            <div className="flex flex-col">
              <label className={labelClassName}>Badge</label>
              <input name="badge" defaultValue={course?.badge} placeholder="Most Popular" className={inputClassName} />
            </div>

            <div className="flex flex-col">
              <label className={labelClassName}>Theme Gradient</label>
              <select name="color" defaultValue={course?.color || colorOptions[0]} className={inputClassName}>
                {colorOptions.map((option) => (
                  <option key={option} value={option} className="bg-[#0f172a]">
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-full flex flex-col mt-2">
              <label className={labelClassName}>Topics</label>
              <textarea
                name="topics"
                rows={4}
                defaultValue={course?.topics?.join('\n')}
                placeholder={'Enter one topic per line\nHTML Basics\nCSS Flexbox'}
                className={`${inputClassName} resize-none`}
              />
            </div>

            <div className="col-span-full flex items-center justify-between py-4 border-t border-white/10 mt-2">
              <div>
                <div className="text-sm font-bold text-white">Live Status</div>
                <p className="text-xs text-slate-500 mt-1">Make this course visible to students.</p>
              </div>
              <label className="relative flex cursor-pointer items-center">
                <input name="isActive" type="checkbox" defaultChecked={course ? course.isActive : true} className="peer sr-only" />
                <div className="h-6 w-11 rounded-full bg-slate-800 peer-checked:bg-indigo-600 transition-colors" />
                <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
              </label>
            </div>

            <div className="col-span-full flex items-center justify-between py-4 border-t border-white/10">
              <div>
                <div className="text-sm font-bold text-white">Popular Status</div>
                <p className="text-xs text-slate-500 mt-1">Highlight this course on the homepage.</p>
              </div>
              <label className="relative flex cursor-pointer items-center">
                <input name="popular" type="checkbox" defaultChecked={course?.popular} className="peer sr-only" />
                <div className="h-6 w-11 rounded-full bg-slate-800 peer-checked:bg-amber-500 transition-colors" />
                <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
              </label>
            </div>
          </div>
        </div>

        {/* Roadmap Module */}
        <div className="p-6 bg-[#0a0f1d] border border-white/10 rounded-2xl shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white tracking-tight">Course Roadmap</h2>
              <p className="text-sm text-slate-400 mt-1">Add the modules or milestones students will follow.</p>
            </div>
            <button
              type="button"
              onClick={() => setRoadmap((current) => [...current, createRoadmapStep()])}
              className="bg-transparent border border-white/10 hover:bg-white/5 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Milestone
            </button>
          </div>

          <div className="space-y-4">
            {roadmap.map((step, index) => (
              <div key={step.id} className="p-5 border border-white/10 bg-[#111827] rounded-xl relative group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-xs">{index + 1}</span>
                    <span className="text-sm font-bold text-white">Milestone</span>
                  </div>
                  {roadmap.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setRoadmap((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                      className="text-slate-500 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <input
                      name="roadmapWeek"
                      value={step.week}
                      onChange={(event) => updateRoadmap(index, 'week', event.target.value)}
                      placeholder="e.g. Week 1-2"
                      className={inputClassName}
                    />
                  </div>
                  <div className="flex flex-col">
                    <input
                      name="roadmapTitle"
                      value={step.title}
                      onChange={(event) => updateRoadmap(index, 'title', event.target.value)}
                      placeholder="Module title"
                      className={inputClassName}
                    />
                  </div>
                  <div className="col-span-full flex flex-col">
                    <textarea
                      name="roadmapDesc"
                      rows={2}
                      value={step.desc}
                      onChange={(event) => updateRoadmap(index, 'desc', event.target.value)}
                      placeholder="Describe what students complete in this step."
                      className={`${inputClassName} resize-none`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-white/10">
            <Link href="/admin/courses" className="bg-transparent border border-white/10 hover:bg-white/5 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Cancel
            </Link>
            <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'create' ? 'Create Course' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
