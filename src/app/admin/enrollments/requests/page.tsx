import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import EnrollmentRequest from '@/models/EnrollmentRequest';
import User from '@/models/User';
import Course from '@/models/Course';
import EnrollmentRequestListClient from '@/components/admin/EnrollmentRequestListClient';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

export default async function EnrollmentRequestsPage() {
  const session = await auth();

  if (!session || (session.user as any)?.role !== 'admin') {
    return <div>Unauthorized</div>;
  }

  await dbConnect();

  const requests = await EnrollmentRequest.find()
    .populate({
      path: 'studentId',
      model: User,
      select: 'name email phone photo',
    })
    .populate({
      path: 'courseId',
      model: Course,
      select: 'title slug discountedFees fees color',
    })
    .sort({ requestDate: -1 })
    .lean();

  const requestsData = requests.map((req: any) => ({
    _id: req._id.toString(),
    studentId: req.studentId?._id?.toString(),
    studentName: req.studentId?.name || 'N/A',
    studentEmail: req.studentId?.email || 'N/A',
    studentPhone: req.studentId?.phone || 'N/A',
    courseId: req.courseId?._id?.toString(),
    courseName: req.courseId?.title || 'N/A',
    courseSlug: req.courseId?.slug || '',
    courseColor: req.courseId?.color || 'from-indigo-500 to-cyan-500',
    courseFees: req.courseId?.discountedFees || req.courseId?.fees || 0,
    status: req.status,
    requestDate: req.requestDate?.toISOString() || '',
    approvalDate: req.approvalDate?.toISOString() || null,
    rejectionReason: req.rejectionReason || '',
    approvedBy: req.approvedBy?.toString() || '',
  }));

  const pendingRequests = requestsData.filter((r) => r.status === 'pending');
  const approvedRequests = requestsData.filter((r) => r.status === 'approved');
  const rejectedRequests = requestsData.filter((r) => r.status === 'rejected');

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 px-6 sm:px-8 py-10">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0a0f1d]/80 p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-white mb-2">Enrollment <span className="gradient-text">Requests</span></h1>
          <p className="text-slate-400 text-sm font-medium">
            Review, approve, or decline student applications for active courses.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-white/5 hover:border-amber-500/30 transition-all group shadow-lg">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
               <Clock className="w-6 h-6 text-amber-400" />
             </div>
             <div>
               <div className="text-3xl font-black text-white leading-none">{pendingRequests.length}</div>
               <div className="text-[10px] text-amber-500 uppercase tracking-widest font-bold mt-1">Pending</div>
             </div>
          </div>
        </div>
        <div className="glass-card p-6 border-white/5 hover:border-emerald-500/30 transition-all group shadow-lg">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
               <CheckCircle className="w-6 h-6 text-emerald-400" />
             </div>
             <div>
               <div className="text-3xl font-black text-white leading-none">{approvedRequests.length}</div>
               <div className="text-[10px] text-emerald-500 uppercase tracking-widest font-bold mt-1">Approved</div>
             </div>
          </div>
        </div>
        <div className="glass-card p-6 border-white/5 hover:border-rose-500/30 transition-all group shadow-lg">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center">
               <XCircle className="w-6 h-6 text-rose-400" />
             </div>
             <div>
               <div className="text-3xl font-black text-white leading-none">{rejectedRequests.length}</div>
               <div className="text-[10px] text-rose-500 uppercase tracking-widest font-bold mt-1">Rejected</div>
             </div>
          </div>
        </div>
      </div>

      {pendingRequests.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-black text-white flex items-center gap-2"><Clock className="w-5 h-5 text-amber-400"/> Action Required</h2>
          <EnrollmentRequestListClient requests={pendingRequests} />
        </div>
      )}

      {pendingRequests.length === 0 && (
        <div className="glass-card p-12 text-center border-white/5 border-dashed">
          <CheckCircle className="w-12 h-12 text-emerald-500/50 mx-auto mb-4" />
          <p className="text-emerald-400 font-black text-lg tracking-wide">All Caught Up!</p>
          <p className="text-slate-500 text-sm mt-2">There are no pending enrollment requests.</p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {approvedRequests.length > 0 && (
          <div className="glass-card border-white/5 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/5 bg-[#0a0f1d]/40">
              <h2 className="text-lg font-black text-white flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-400"/> Recently Approved</h2>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left min-w-[500px]">
                <thead className="bg-[#0a0f1d]/60 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                  <tr>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Course</th>
                    <th className="px-6 py-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {approvedRequests.slice(0, 10).map((req) => (
                    <tr key={req._id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-white text-sm">{req.studentName}</div>
                        <div className="text-slate-500 text-xs font-medium">{req.studentEmail}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-gradient-to-r ${req.courseColor || 'from-indigo-500 to-cyan-500'} text-white shadow-lg`}>
                          {req.courseName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-400 text-xs font-bold">
                        {req.approvalDate ? new Date(req.approvalDate).toLocaleDateString('en-IN') : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {rejectedRequests.length > 0 && (
          <div className="glass-card border-white/5 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/5 bg-[#0a0f1d]/40">
              <h2 className="text-lg font-black text-white flex items-center gap-2"><XCircle className="w-5 h-5 text-rose-400"/> Recently Rejected</h2>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left min-w-[500px]">
                <thead className="bg-[#0a0f1d]/60 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                  <tr>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Course</th>
                    <th className="px-6 py-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {rejectedRequests.slice(0, 10).map((req) => (
                    <tr key={req._id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-white text-sm">{req.studentName}</div>
                        <div className="text-slate-500 text-xs font-medium">{req.studentEmail}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-300 text-xs font-bold truncate max-w-[150px]">{req.courseName}</div>
                        <div className="text-rose-400 text-[10px] font-medium mt-1 truncate max-w-[150px]">{req.rejectionReason || 'No reason'}</div>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-400 text-xs font-bold">
                        {req.approvalDate ? new Date(req.approvalDate).toLocaleDateString('en-IN') : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
