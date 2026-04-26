import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Clock, BookOpen, Award, CheckCircle, PlayCircle, FileText, ArrowRight } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import Enrollment from '@/models/Enrollment';
import EnrollmentRequest from '@/models/EnrollmentRequest';
import Course from '@/models/Course';
export default async function DashboardPage() {
  const session = await auth();
  if (!session || !session.user) redirect('/login');
  // Admin & Staff should go to their respective dashboards
  if ((session.user as any).role === 'admin') redirect('/admin');
  if ((session.user as any).role === 'staff') redirect('/staff');

  await dbConnect();
  
  // Fetch enrollment requests
  const rawRequests = await EnrollmentRequest.find({ studentId: (session.user as any).id })
    .populate({ path: 'courseId', model: Course, select: 'title icon color discountedFees fees' })
    .sort({ requestDate: -1 })
    .lean();

  const enrollmentRequests = rawRequests.map((r: any) => ({
    _id: r._id.toString(),
    courseId: r.courseId._id?.toString(),
    courseTitle: r.courseId?.title || 'N/A',
    courseIcon: r.courseId?.icon || '📚',
    courseColor: r.courseId?.color || 'from-indigo-500 to-cyan-500',
    courseFees: r.courseId?.discountedFees || r.courseId?.fees || 0,
    status: r.status,
    requestDate: r.requestDate,
    approvalDate: r.approvalDate,
    rejectionReason: r.rejectionReason,
  }));

  // Fetch active enrollments with course details
  const rawEnrollments = await Enrollment.find({ studentId: (session.user as any).id })
    .populate({ path: 'courseId', model: Course, select: 'title color icon fullName' })
    .sort({ createdAt: -1 })
    .lean();

  // Safely parse populated data to avoid passing raw docs to Client Components
  const enrollments = rawEnrollments.map((e: any) => ({
    _id: e._id.toString(),
    courseId: e.courseId._id.toString(),
    courseTitle: e.courseId.title,
    courseFullName: e.courseId.fullName,
    courseColor: e.courseId.color,
    courseIcon: e.courseId.icon,
    progress: e.progress || 0,
    status: e.status,
  }));

  const overallProgress = enrollments.length > 0 
    ? Math.round(enrollments.reduce((acc: number, e: any) => acc + e.progress, 0) / enrollments.length)
    : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900/60 to-cyan-900/30 border border-[rgba(99,102,241,0.2)] p-8 lg:p-10 shadow-2xl">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px]" />
        
        <div className="relative z-10 grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
              Welcome back, <span className="gradient-text">{session.user.name?.split(' ')[0]}!</span> 👋
            </h1>
            <p className="text-slate-300 mb-6 text-lg">You've completed <strong className="text-white">{overallProgress}%</strong> of your overall learning goals. Keep it up!</p>
            <div className="flex gap-4">
              <button className="btn-primary py-3 px-6 shadow-indigo-500/25 shadow-lg">Resume Learning <ArrowRight className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="hidden md:flex justify-center">
            {/* Circular Progress Ring */}
            <div className="relative w-40 h-40">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" className="stroke-indigo-500/20 fill-none" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" className="stroke-cyan-400 fill-none" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * overallProgress) / 100} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-white">{overallProgress}%</span>
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Progress</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN (Courses & Activity) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Enrollment Requests */}
          {enrollmentRequests.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-400" /> Your Enrollment Requests
                </h2>
              </div>
              <div className="space-y-4">
                {enrollmentRequests.map((request: any) => (
                  <div key={request._id} className={`glass-card p-5 group transition-all border-l-4 ${
                    request.status === 'pending' ? 'border-l-yellow-400 border-yellow-500/20 bg-yellow-500/5' :
                    request.status === 'approved' ? 'border-l-green-400 border-green-500/20 bg-green-500/5' :
                    'border-l-red-400 border-red-500/20 bg-red-500/5'
                  }`}>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      <div className="flex gap-4 items-start flex-1">
                        {/* Course Icon */}
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${request.courseColor} flex items-center justify-center text-xl shadow-lg flex-shrink-0`}>
                          {request.courseIcon}
                        </div>
                        
                        {/* Request Info */}
                        <div className="flex-1 text-sm sm:text-base">
                          <h3 className="text-white font-bold mb-1">{request.courseTitle}</h3>
                          <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                            <span>Fee: ₹{request.courseFees}</span>
                            <span>•</span>
                            <span>Requested: {new Date(request.requestDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex flex-col items-end gap-2">
                        {request.status === 'pending' && (
                          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-semibold border border-yellow-500/40">
                            ⏳ Pending Review
                          </span>
                        )}
                        {request.status === 'approved' && (
                          <div className="text-right">
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold border border-green-500/40 block mb-1">
                              ✅ Approved
                            </span>
                            <p className="text-xs text-slate-400">
                              Approved: {new Date(request.approvalDate).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                        {request.status === 'rejected' && (
                          <div className="text-right">
                            <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold border border-red-500/40 block mb-1">
                              ❌ Rejected
                            </span>
                            {request.rejectionReason && (
                              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                                Reason: {request.rejectionReason}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Active Courses */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" /> My Active Courses
              </h2>
            </div>

            {enrollments.length === 0 ? (
              <div className="glass-card p-10 text-center border-dashed border-white/20">
                <p className="text-slate-400 mb-4">Aapne abhi tak kisi course mein enroll nahi kiya hai.</p>
                <a href="/courses" className="btn-outline">Browse Courses</a>
              </div>
            ) : (
              <div className="space-y-4">
                {enrollments.map((enrollment: any) => (
                  <div key={enrollment._id} className="glass-card p-5 group hover:border-indigo-500/30 transition-all flex flex-col sm:flex-row gap-5 items-center">
                    {/* Course Icon */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${enrollment.courseColor} flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}>
                      {enrollment.courseIcon}
                    </div>
                    
                    {/* Course Info */}
                    <div className="flex-1 w-full text-center sm:text-left">
                      <h3 className="text-white font-bold text-lg mb-1">{enrollment.courseTitle}</h3>
                      <p className="text-slate-500 text-xs mb-3 truncate">{enrollment.courseFullName}</p>
                      
                      {/* Progress Bar */}
                      <div className="w-full h-2 rounded-full bg-white/5 mb-1.5 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full transition-all duration-1000 relative"
                          style={{ width: `${enrollment.progress}%` }}
                        >
                          <div className="absolute top-0 right-0 bottom-0 w-8 bg-white/20 -skew-x-12 animate-[shimmer_2s_infinite]" />
                        </div>
                      </div>
                      <div className="flex justify-between text-[11px] font-semibold">
                        <span className="text-indigo-400">{enrollment.progress}% Completed</span>
                        <span className="text-slate-500">100%</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/5 hover:bg-indigo-500/10 text-slate-300 hover:text-white border border-white/10 hover:border-indigo-500/30 text-sm font-medium transition-all group-hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                      Continue
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Quick Actions / Up Next */}
          <section>
            <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-cyan-400" /> Up Next for You
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="glass-card p-5 hover:-translate-y-1 transition-transform cursor-pointer border-l-2 border-l-cyan-500">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-3">
                  <PlayCircle className="w-4 h-4 text-cyan-400" />
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">Watch Next Lesson</h3>
                <p className="text-slate-400 text-xs">Introduction to Next.js Routing</p>
              </div>
              <div className="glass-card p-5 hover:-translate-y-1 transition-transform cursor-pointer border-l-2 border-l-violet-500">
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center mb-3">
                  <FileText className="w-4 h-4 text-violet-400" />
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">Pending Assignment</h3>
                <p className="text-slate-400 text-xs">Build a responsive layout using Tailwind</p>
              </div>
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN (Announcements & Schedule) */}
        <div className="space-y-8">
          
          {/* Schedule */}
          <section className="glass-card p-6">
            <h2 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-green-400" /> Today's Schedule
            </h2>
            <div className="space-y-4">
              {[
                { time: '10:00 AM', title: 'Live Class: React Basics', duration: '1.5 hrs', active: true },
                { time: '02:00 PM', title: 'Doubt Session', duration: '45 mins', active: false },
              ].map((s, i) => (
                <div key={i} className={`relative pl-4 border-l-2 ${s.active ? 'border-green-400' : 'border-white/10'}`}>
                  {s.active && <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-green-400 animate-ping" />}
                  <div className={`text-xs font-bold mb-0.5 ${s.active ? 'text-green-400' : 'text-slate-500'}`}>{s.time}</div>
                  <div className="text-white text-sm font-semibold">{s.title}</div>
                  <div className="text-slate-400 text-xs">{s.duration}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Achievements */}
          <section className="glass-card p-6 bg-gradient-to-b from-[rgba(19,25,41,0.8)] to-[#0a0e1a]">
            <h2 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-400" /> Achievements
            </h2>
            <div className="flex flex-col items-center justify-center text-center py-4">
              <div className="w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center mb-3">
                <Award className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-white font-bold text-sm mb-1">Fast Learner</h3>
              <p className="text-slate-400 text-xs text-balance">Completed 5 lessons in a single day!</p>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
