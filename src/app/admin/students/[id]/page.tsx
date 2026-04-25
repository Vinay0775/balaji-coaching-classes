import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, BookOpen, CreditCard, Edit3, Phone, Shield, UserRound } from 'lucide-react';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Enrollment from '@/models/Enrollment';
import Payment from '@/models/Payment';
import User from '@/models/User';
import { formatCurrency, formatDate } from '@/lib/utils';

type StudentRecord = {
  _id: { toString(): string };
  name: string;
  email: string;
  phone?: string;
  isActive: boolean;
  createdAt: Date | string;
};

type StudentPaymentRecord = {
  _id: { toString(): string };
  totalFees: number;
  paidAmount: number;
  pendingAmount: number;
  updatedAt: Date | string;
  courseId?: {
    title?: string;
  } | null;
};

type StudentEnrollmentRecord = {
  _id: { toString(): string };
  status: string;
  progress: number;
  courseId?: {
    title?: string;
    duration?: string;
  } | null;
};

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session || role !== 'admin') redirect('/login');

  const { id } = await params;

  await dbConnect();

  const student = await User.findOne({ _id: id, role: 'student' }).lean<StudentRecord | null>();
  if (!student) redirect('/admin/students');

  const payments = await Payment.find({ studentId: id })
    .populate('courseId', 'title color')
    .sort({ updatedAt: -1 })
    .lean<StudentPaymentRecord[]>();

  const enrollments = await Enrollment.find({ studentId: id })
    .populate('courseId', 'title duration color')
    .sort({ createdAt: -1 })
    .lean<StudentEnrollmentRecord[]>();

  const totalPaid = payments.reduce((sum, payment) => sum + payment.paidAmount, 0);
  const totalPending = payments.reduce((sum, payment) => sum + payment.pendingAmount, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/students"
            className="inline-flex items-center text-sm font-semibold text-slate-400 hover:text-indigo-400 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Students
          </Link>
          <h1 className="text-3xl font-black text-white mb-1">{student.name}</h1>
          <p className="text-slate-400">
            Student profile, fee history, and course access summary.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href={`/admin/payments/record?student=${student._id.toString()}`} className="btn-outline text-slate-300 border-white/10 justify-center">
            <CreditCard className="w-4 h-4" /> Record Payment
          </Link>
          <Link href={`/admin/students/${student._id.toString()}/edit`} className="btn-primary justify-center">
            <Edit3 className="w-4 h-4" /> Edit Student
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.05fr,0.95fr] gap-6">
        <div className="glass-card p-6 md:p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30 flex items-center justify-center text-2xl font-black text-indigo-300">
              {student.name?.[0]?.toUpperCase() || 'S'}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-xl">
                <UserRound className="w-5 h-5 text-indigo-400" /> {student.name}
              </div>
              <div className="text-slate-400">{student.email}</div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <Phone className="w-4 h-4" /> {student.phone || 'No phone provided'}
                </span>
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${
                    student.isActive
                      ? 'border-green-500/20 bg-green-500/10 text-green-400'
                      : 'border-red-500/20 bg-red-500/10 text-red-400'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  {student.isActive ? 'Active Account' : 'Suspended Account'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">
                Registration Date
              </div>
              <div className="text-lg font-bold text-white">{formatDate(student.createdAt)}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">
                Total Paid
              </div>
              <div className="text-lg font-bold text-green-400">{formatCurrency(totalPaid)}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">
                Pending Dues
              </div>
              <div className="text-lg font-bold text-red-400">{formatCurrency(totalPending)}</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 md:p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/15 flex items-center justify-center text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Enrolled Courses</h2>
              <p className="text-sm text-slate-400">
                {enrollments.length} active learning records linked to this student.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {enrollments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm text-slate-400">
                No enrollments found yet. Record a payment or create enrollment to begin.
              </div>
            ) : (
              enrollments.map((enrollment) => (
                <div
                  key={enrollment._id.toString()}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-white font-semibold">{enrollment.courseId?.title || 'Unknown Course'}</div>
                      <div className="text-sm text-slate-500 mt-1">
                        {enrollment.courseId?.duration || 'Duration not set'}
                      </div>
                    </div>
                    <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-300 border border-indigo-500/20">
                      {enrollment.status}
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span>Progress</span>
                      <span>{enrollment.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500"
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-6 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-white">Fee History</h2>
            <p className="text-sm text-slate-400">
              Payment records linked to this student account.
            </p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {payments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm text-slate-400">
              No payment records available yet.
            </div>
          ) : (
            payments.map((payment) => (
              <div
                key={payment._id.toString()}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="text-white font-semibold">{payment.courseId?.title || 'Unknown Course'}</div>
                  <div className="text-sm text-slate-500 mt-1">
                    Updated {formatDate(payment.updatedAt)}
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm min-w-0">
                  <div>
                    <div className="text-slate-500">Total</div>
                    <div className="text-white font-semibold">{formatCurrency(payment.totalFees)}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Paid</div>
                    <div className="text-green-400 font-semibold">{formatCurrency(payment.paidAmount)}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Pending</div>
                    <div className="text-red-400 font-semibold">{formatCurrency(payment.pendingAmount)}</div>
                  </div>
                </div>
                <Link href={`/admin/payments/${payment._id.toString()}`} className="btn-outline px-4 py-2 border-white/10 text-slate-300 justify-center">
                  View Record
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
