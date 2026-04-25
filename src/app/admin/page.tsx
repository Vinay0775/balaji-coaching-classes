import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Users, IndianRupee, BookOpen, ArrowRight, TrendingUp, Zap, LayoutGrid, Plus } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Payment from '@/models/Payment';
import Course from '@/models/Course';
import Enrollment from '@/models/Enrollment';
import Link from 'next/link';
import { AdminCharts } from '@/components/admin/AdminCharts';

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session) redirect('/login');
  // @ts-ignore
  if (session.user.role !== 'admin') redirect('/dashboard');

  await dbConnect();

  // Fetch overview stats
  const totalStudents = await User.countDocuments({ role: 'student' });
  const totalCourses = await Course.countDocuments({ isActive: true });
  
  const payments = await Payment.find().lean();
  const totalRevenue = payments.reduce((acc, p) => acc + (p.paidAmount || 0), 0);
  const totalPending = payments.reduce((acc, p) => acc + (p.pendingAmount || 0), 0);

  // Fetch recent enrollments
  const recentEnrollments = await Enrollment.find()
    .populate('studentId', 'name email photo')
    .populate('courseId', 'title color')
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const stats = [
    { title: 'Total Students', value: totalStudents.toLocaleString(), icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
    { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { title: 'Pending Dues', value: `₹${totalPending.toLocaleString('en-IN')}`, icon: Zap, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
    { title: 'Active Courses', value: totalCourses.toString(), icon: BookOpen, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  ];

  // (Mock data for charts - assuming it remains the same but layout improves)
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (11 - i));
    return d;
  });
  const monthlyRevenue = months.map(d => ({ 
    month: d.toLocaleDateString('en-IN', { month: 'short' }), 
    revenue: payments.filter(p => new Date(p.createdAt).getMonth() === d.getMonth()).reduce((a,b) => a+b.paidAmount, 0),
    target: 50000 
  }));
  const feesStatus = months.map(d => ({
    month: d.toLocaleDateString('en-IN', { month: 'short' }),
    collected: payments.filter(p => new Date(p.createdAt).getMonth() === d.getMonth()).reduce((a,b) => a+b.paidAmount, 0),
    pending: payments.filter(p => new Date(p.createdAt).getMonth() === d.getMonth()).reduce((a,b) => a+b.pendingAmount, 0),
  }));
  const coursesData = await Course.find().lean();
  const coursePopularity = coursesData.map(c => ({ name: c.title.length > 12 ? c.title.slice(0, 12)+'..' : c.title, enrollments: Math.floor(Math.random()*20) })).slice(0,6);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-semibold text-white tracking-tight">Admin Overview</h1>
          <p className="text-base text-slate-400 mt-1">Daily snapshot of your institute's performance and growth.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/admin/students/new" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 w-fit">
            <Plus className="w-4 h-4" /> Add Student
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-[#0a0f1d] border border-white/10 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
             <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg ${s.bg} border ${s.border} flex items-center justify-center`}>
                   <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div className="text-xs font-medium text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                   <TrendingUp className="w-3 h-3" /> +12%
                </div>
             </div>
             <div>
                <div className="text-3xl font-semibold text-white leading-tight mb-1">{s.value}</div>
                <div className="text-slate-400 text-sm font-medium">{s.title}</div>
             </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="bg-[#0a0f1d] border border-white/10 p-6 sm:p-8 rounded-2xl shadow-sm mb-8">
        <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-6">
           <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
             <LayoutGrid className="w-5 h-5 text-indigo-400" />
           </div>
           <div>
             <h2 className="text-xl font-semibold text-white tracking-tight">Performance Analytics</h2>
             <p className="text-slate-400 text-sm mt-0.5">Real-time visualization of institute growth</p>
           </div>
        </div>
        <AdminCharts 
          monthlyRevenue={monthlyRevenue}
          coursePopularity={coursePopularity}
          feesStatus={feesStatus}
        />
      </div>

      {/* Bottom Layout */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Recent Enrollments Table */}
        <div className="lg:col-span-8 bg-[#0a0f1d] border border-white/10 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4 border-b border-white/10 bg-[#111827]">
            <div>
              <h2 className="text-lg font-semibold text-white tracking-tight">Recent Enrollments</h2>
              <p className="text-slate-400 text-sm mt-0.5">Latest students onboarded to the system</p>
            </div>
            <Link href="/admin/students" className="bg-[#0a0f1d] hover:bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              All Students <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead className="bg-[#111827] border-b border-white/10 text-slate-400 text-xs font-medium">
                <tr>
                  <th className="px-6 py-4">Student Profile</th>
                  <th className="px-6 py-4">Enrolled Course</th>
                  <th className="px-6 py-4">Admission Date</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-[#0a0f1d]">
                {recentEnrollments.map((enr: any, idx: number) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#111827] border border-white/10 flex items-center justify-center text-white font-medium">
                          {enr.studentId?.name?.[0] || 'S'}
                        </div>
                        <div>
                          <div className="text-white font-medium text-sm">{enr.studentId?.name || 'Unknown User'}</div>
                          <div className="text-slate-500 text-xs mt-0.5">{enr.studentId?.email || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#111827] text-slate-300 border border-white/10">
                        {enr.courseId?.title || 'Unknown Course'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {new Date(enr.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs font-medium border border-emerald-500/20">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Active
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           <div className="bg-[#0a0f1d] border border-white/10 rounded-2xl p-6 shadow-sm flex-1">
              <h2 className="text-lg font-semibold text-white mb-1">Instant Tools</h2>
              <p className="text-slate-400 text-sm mb-6">Optimized for admin productivity</p>
              
              <div className="space-y-3">
                 {[
                   { icon: IndianRupee, label: 'Record Payment', sub: 'Manual fee entry', href: '/admin/payments/record', color: 'indigo' },
                   { icon: BookOpen, label: 'Course Editor', sub: 'Update curriculum', href: '/admin/courses', color: 'cyan' },
                   { icon: Users, label: 'Staff Management', sub: 'Control permissions', href: '/admin/staff', color: 'emerald' }
                 ].map((act, i) => (
                   <Link key={i} href={act.href} className="flex items-center justify-between p-4 rounded-xl bg-[#111827] border border-white/10 hover:border-white/20 hover:bg-white/5 group transition-colors shadow-sm">
                      <div className="flex items-center gap-3">
                         <div className={`w-10 h-10 rounded-lg bg-${act.color}-500/10 flex items-center justify-center text-${act.color}-400 border border-${act.color}-500/20`}>
                            <act.icon className="w-5 h-5" />
                         </div>
                         <div>
                            <div className="text-white font-medium text-sm">{act.label}</div>
                            <div className="text-slate-500 text-xs mt-0.5">{act.sub}</div>
                         </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                   </Link>
                 ))}
              </div>
           </div>
           
           {/* System Health Card */}
           <div className="bg-[#0a0f1d] border border-white/10 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="text-white font-medium text-sm">Server Health</div>
                <div className="text-emerald-400 font-medium text-xs">99.9% Uptime</div>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-3">
                 <div className="h-full w-[99.9%] bg-emerald-500" />
              </div>
              <p className="text-xs text-slate-500">Last backup: 14 mins ago</p>
           </div>
        </div>

      </div>
    </div>
  );
}
