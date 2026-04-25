import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { BookOpen, Clock, PlayCircle, FileText, CheckCircle, Trophy } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import Enrollment from '@/models/Enrollment';
import Course from '@/models/Course';

export default async function StudentCoursesPage() {
  const session = await auth();
  if (!session) redirect('/login');

  await dbConnect();
  
  const userId = session?.user?.id;
  if (!userId) { return <div>User not logged in.</div>; }

  const rawEnrollments = await Enrollment.find({ studentId: userId })
    .populate({ path: 'courseId', model: Course })
    .sort({ createdAt: -1 })
    .lean();

  const enrollments = rawEnrollments.map((e: any) => ({
    _id: e._id.toString(),
    courseId: e.courseId._id.toString(),
    title: e.courseId.title,
    fullName: e.courseId.fullName,
    color: e.courseId.color,
    icon: e.courseId.icon,
    progress: e.progress || 0,
    status: e.status,
    roadmap: e.courseId.roadmap || [],
  }));

  if (enrollments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center max-w-md mx-auto">
        <div className="w-24 h-24 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6 border border-indigo-500/20 shadow-lg">
          <BookOpen className="w-10 h-10 text-indigo-400" />
        </div>
        <h2 className="text-2xl font-black text-white mb-3">No Active Courses</h2>
        <p className="text-slate-400 mb-8 text-lg">Aapne abhi tak kisi course mein enroll nahi kiya hai. Apni learning journey aaj hi start karein!</p>
        <a href="/courses" className="btn-primary text-lg px-8 py-3 w-full sm:w-auto shadow-xl shadow-indigo-500/20">
          Browse Courses
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ paddingBottom: '40px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 className="text-3xl font-black text-white" style={{ marginBottom: '8px' }}>My Learning <span className="gradient-text">Journey</span> 🎓</h1>
        <p className="text-slate-400 text-lg">Track your progress and access course materials.</p>
      </div>

      <div className="grid" style={{ gap: '32px' }}>
        {enrollments.map((enrollment: any) => (
          <div key={enrollment._id} className="glass-card overflow-hidden border border-[rgba(99,102,241,0.2)] shadow-xl relative">
            {/* Background Glow */}
            <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${enrollment.color} opacity-10 blur-[80px] pointer-events-none`} />
            
            <div style={{ padding: '32px' }}>
              <div className="flex flex-col md:flex-row items-start md:items-center relative z-10" style={{ gap: '32px' }}>
                {/* Course Icon */}
                <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${enrollment.color} flex items-center justify-center text-5xl shadow-lg flex-shrink-0 animate-float`}>
                  {enrollment.icon}
                </div>
                
                {/* Course Details */}
                <div className="flex-1 w-full">
                  <div className="flex flex-wrap items-center justify-between" style={{ gap: '16px', marginBottom: '8px' }}>
                    <h2 className="text-2xl font-black text-white">{enrollment.title}</h2>
                    <span className={`rounded-full text-xs font-bold uppercase tracking-wider ${
                      enrollment.status === 'completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    }`} style={{ padding: '6px 16px' }}>
                       {enrollment.status === 'completed' ? 'Graduated' : 'In Progress'}
                    </span>
                  </div>
                  <p className="text-slate-400 text-base" style={{ marginBottom: '24px' }}>{enrollment.fullName}</p>
                  
                  {/* Progress Bar Container */}
                  <div>
                    <div className="flex justify-between items-end" style={{ marginBottom: '8px' }}>
                      <span className="text-sm font-bold text-white flex items-center" style={{ gap: '8px' }}>
                        {enrollment.progress === 100 ? <Trophy className="w-4 h-4 text-yellow-400" /> : <Clock className="w-4 h-4 text-indigo-400" />}
                        Course Progress
                      </span>
                      <span className="text-xl font-black gradient-text">{enrollment.progress}%</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-[#0a0e1a] border border-white/10 overflow-hidden shadow-inner">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 relative ${
                          enrollment.progress === 100 ? 'bg-gradient-to-r from-green-400 to-teal-400' : 'bg-gradient-to-r from-indigo-500 to-cyan-500'
                        }`}
                        style={{ width: `${enrollment.progress}%` }}
                      >
                        <div className="absolute top-0 right-0 bottom-0 w-8 bg-white/30 -skew-x-12 animate-[shimmer_2s_infinite]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col w-full md:w-auto" style={{ gap: '12px' }}>
                  <a href={`/courses/${enrollment.courseId}`} className="btn-primary shadow-lg shadow-indigo-500/20 w-full justify-center flex items-center text-center" style={{ padding: '14px 32px' }}>
                    <PlayCircle className="w-5 h-5" style={{ marginRight: '8px' }} /> Continue
                  </a>
                  <a href={`/courses/${enrollment.courseId}`} className="btn-outline border-white/10 text-slate-300 w-full justify-center bg-white/[0.02] flex items-center text-center" style={{ padding: '14px 32px' }}>
                    Course Details
                  </a>
                </div>
              </div>

              {/* Course Content / Syllabus Quick View */}
              {enrollment.roadmap && enrollment.roadmap.length > 0 && (
                <div className="border-t border-white/10 relative z-10" style={{ marginTop: '32px', paddingTop: '32px' }}>
                  <h3 className="text-lg font-bold text-white flex items-center" style={{ gap: '8px', marginBottom: '20px' }}>
                    <CheckCircle className="w-5 h-5 text-green-400" /> Syllabus Modules
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: '16px' }}>
                    {enrollment.roadmap.slice(0, 4).map((mod: any, idx: number) => {
                      const isComplete = (enrollment.progress / 100) * enrollment.roadmap.length > idx;
                      const isActive = (enrollment.progress / 100) * enrollment.roadmap.length <= idx && (enrollment.progress / 100) * enrollment.roadmap.length > idx - 1;
                      
                      return (
                        <div key={idx} className={`rounded-xl border ${
                          isComplete ? 'bg-green-500/5 border-green-500/20' : 
                          isActive ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-white/[0.02] border-white/5'
                        }`} style={{ padding: '16px' }}>
                          <div className={`text-xs font-bold ${isComplete ? 'text-green-400' : isActive ? 'text-indigo-400' : 'text-slate-500'}`} style={{ marginBottom: '8px' }}>
                            {mod.week}
                          </div>
                          <div className={`text-sm font-bold ${isComplete ? 'text-slate-200' : 'text-slate-400'} line-clamp-1`}>{mod.title}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
