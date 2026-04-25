'use client';

import { useState } from 'react';
import { Calendar, Plus, Trash2, CheckCircle, XCircle, User, BookOpen, Clock, Tag, GraduationCap, ArrowRight, Zap, Play } from 'lucide-react';

export default function ScheduleClient({ schedules, courses, students, addAction, toggleAction, deleteAction }: any) {
  const [targetType, setTargetType] = useState<'all' | 'course' | 'student'>('all');

  const globalSchedules = schedules.filter((s: any) => !s.courseId && !s.studentId);
  const courseSchedules = schedules.filter((s: any) => s.courseId);
  const studentSchedules = schedules.filter((s: any) => s.studentId);

  const ScheduleItem = ({ s }: { s: any }) => (
    <div key={s._id} className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-[#111827] border border-white/5 hover:border-white/20 transition-colors mb-4">
      
      {/* Content Area */}
      <div className="flex items-start gap-4 min-w-0">
        <div className={`shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
          s.studentId ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
        }`}>
          {s.studentId ? <GraduationCap className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> {s.time}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span className="text-xs font-medium text-slate-500">{s.duration}</span>
          </div>
          <h4 className="text-base font-medium text-white group-hover:text-indigo-300 transition-colors truncate">
            {s.title}
          </h4>
          <div className="mt-2">
             <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${
               s.studentId ? 'text-amber-400 border-amber-500/20 bg-amber-500/5' : 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5'
             }`}>
               {s.studentId ? `Student: ${s.studentId.name}` : s.courseId ? `Batch: ${s.courseId.title}` : 'General Session'}
             </span>
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="flex items-center gap-2 pt-4 md:pt-0 border-t border-white/5 md:border-0 md:pl-4">
        <form action={toggleAction.bind(null, s._id, s.isActive)}>
          <button type="submit" className={`p-2 rounded-lg border transition-colors flex items-center justify-center ${
            s.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
          }`} title={s.isActive ? "Deactivate" : "Activate"}>
            {s.isActive ? <CheckCircle className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </form>
        <form action={deleteAction.bind(null, s._id)}>
          <button type="submit" className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors flex items-center justify-center" title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-semibold text-white tracking-tight">Class Scheduler</h1>
          <p className="text-base text-slate-400 mt-1">Precision timing and individualized student session management.</p>
        </div>
        <div className="hidden lg:block text-right">
           <div className="text-3xl font-semibold text-white mb-0.5">{schedules.length}</div>
           <div className="text-xs text-slate-500 font-medium">Active Sessions</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Premium Form Card */}
        <div className="lg:col-span-4">
          <div className="bg-[#0a0f1d] border border-white/10 p-6 rounded-2xl sticky top-8 shadow-sm">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-400" /> New Entry
            </h3>

            <form action={addAction} className="space-y-5">
              <div className="space-y-4">
                {[
                  { name: 'time', placeholder: '10:30 AM', label: 'Timing' },
                  { name: 'title', placeholder: 'Data Analytics Pro', label: 'Topic Name' },
                  { name: 'duration', placeholder: '1.5 Hours', label: 'Duration' }
                ].map((field) => (
                  <div key={field.name} className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-400 ml-1">{field.label}</label>
                    <input name={field.name} type="text" placeholder={field.placeholder} required className="w-full bg-[#111827] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition-colors" />
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-xs font-medium text-slate-400 ml-1">Target Distribution</label>
                <div className="flex gap-2 p-1.5 bg-[#111827] border border-white/10 rounded-lg">
                  {['all', 'course', 'student'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTargetType(t as any)}
                      className={`flex-1 py-2 rounded-md text-[11px] font-medium transition-colors ${
                        targetType === t 
                        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      {t === 'all' ? 'Global' : t === 'course' ? 'Batch' : 'Student'}
                    </button>
                  ))}
                  <input type="hidden" name="targetType" value={targetType} />
                </div>

                {targetType === 'course' && (
                  <select name="courseId" required className="w-full bg-[#111827] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500 appearance-none">
                    <option value="" className="bg-[#0f172a]">-- Select Batch --</option>
                    {courses.map((c: any) => <option key={c._id} value={c._id} className="bg-[#0f172a]">{c.title}</option>)}
                  </select>
                )}
                {targetType === 'student' && (
                  <select name="studentId" required className="w-full bg-[#111827] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500 appearance-none">
                    <option value="" className="bg-[#0f172a]">-- Select Student --</option>
                    {students.map((s: any) => <option key={s._id} value={s._id} className="bg-[#0f172a]">{s.name}</option>)}
                  </select>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-[#111827] rounded-xl border border-white/10 mt-4">
                <label className="flex items-center gap-3 cursor-pointer group/check">
                  <div className="w-5 h-5 rounded border border-white/20 flex items-center justify-center group-hover/check:border-indigo-500 transition-colors bg-white/5">
                    <input name="isActive" type="checkbox" className="absolute opacity-0 cursor-pointer peer" />
                    <div className="w-2.5 h-2.5 bg-indigo-500 rounded-[2px] opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-slate-300 font-medium text-sm">Go Live</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Order</span>
                  <input name="order" type="number" defaultValue="0" className="w-12 bg-white/5 border border-white/10 rounded p-1 text-center text-white text-sm outline-none focus:border-indigo-500" />
                </div>
              </div>

              <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2 mt-4">
                <Zap className="w-4 h-4" /> Deploy Schedule
              </button>
            </form>
          </div>
        </div>

        {/* Right: Premium Timeline Sections */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="bg-[#0a0f1d] border border-white/10 rounded-2xl p-6 shadow-sm overflow-hidden relative">
             <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                   <User className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="text-lg font-semibold text-white tracking-tight">Individual Mentorship</h3>
                   <p className="text-slate-400 text-xs mt-0.5">Customized student learning paths</p>
                </div>
             </div>
             
             <div className="relative">
                {studentSchedules.length === 0 ? (
                  <div className="py-12 bg-[#111827] border border-white/5 rounded-xl text-center text-slate-500 text-sm font-medium">No individualized sessions found.</div>
                ) : (
                  studentSchedules.map((s: any) => <ScheduleItem key={s._id} s={s} />)
                )}
             </div>
          </div>

          <div className="bg-[#0a0f1d] border border-white/10 rounded-2xl p-6 shadow-sm overflow-hidden relative">
             <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                   <BookOpen className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="text-lg font-semibold text-white tracking-tight">Batch Schedules</h3>
                   <p className="text-slate-400 text-xs mt-0.5">Standard curriculum deliveries</p>
                </div>
             </div>
             
             <div className="relative">
                {courseSchedules.length === 0 ? (
                  <div className="py-12 bg-[#111827] border border-white/5 rounded-xl text-center text-slate-500 text-sm font-medium">No batch schedules active.</div>
                ) : (
                  courseSchedules.map((s: any) => <ScheduleItem key={s._id} s={s} />)
                )}
             </div>
          </div>

          <div className="bg-[#0a0f1d] border border-white/10 rounded-2xl p-6 shadow-sm overflow-hidden relative">
             <div className="absolute top-0 left-0 w-1 h-full bg-slate-500" />
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-slate-500/10 flex items-center justify-center text-slate-400 border border-slate-500/20">
                   <Tag className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="text-lg font-semibold text-white tracking-tight">Public Sessions</h3>
                   <p className="text-slate-400 text-xs mt-0.5">Visible to all institute members</p>
                </div>
             </div>
             
             <div className="relative">
                {globalSchedules.length === 0 ? (
                  <div className="py-12 bg-[#111827] border border-white/5 rounded-xl text-center text-slate-500 text-sm font-medium">No public announcements.</div>
                ) : (
                  globalSchedules.map((s: any) => <ScheduleItem key={s._id} s={s} />)
                )}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
