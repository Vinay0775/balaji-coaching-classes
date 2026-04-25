import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, CreditCard, Edit3, Receipt } from 'lucide-react';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Payment from '@/models/Payment';
import { formatCurrency, formatDate } from '@/lib/utils';

type InstallmentRecord = {
  amount: number;
  date: Date | string;
  method: string;
  note?: string;
  receiptNo?: string;
};

type PaymentDetailRecord = {
  _id: { toString(): string };
  totalFees: number;
  paidAmount: number;
  pendingAmount: number;
  status: 'pending' | 'partial' | 'paid';
  admissionDate: Date | string;
  studentId?: {
    _id?: { toString(): string };
    name?: string;
    email?: string;
  } | null;
  courseId?: {
    _id?: { toString(): string };
    title?: string;
    duration?: string;
  } | null;
  installments?: InstallmentRecord[];
};

export default async function PaymentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session || role !== 'admin') redirect('/login');

  const { id } = await params;
  await dbConnect();

  const payment = await Payment.findById(id)
    .populate('studentId', 'name email phone')
    .populate('courseId', 'title color duration')
    .lean<PaymentDetailRecord | null>();

  if (!payment) redirect('/admin/payments');

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/payments"
            className="inline-flex items-center text-sm font-semibold text-slate-400 hover:text-green-400 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Payments
          </Link>
          <h1 className="text-3xl font-black text-white mb-1">
            {payment.studentId?.name || 'Unknown Student'}
          </h1>
          <p className="text-slate-400">
            {payment.courseId?.title || 'Unknown Course'} fee ledger with installment history.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/admin/payments/record?student=${payment.studentId?._id?.toString?.() || ''}&course=${payment.courseId?._id?.toString?.() || ''}`}
            className="btn-outline text-slate-300 border-white/10 justify-center"
          >
            <CreditCard className="w-4 h-4" /> Add Installment
          </Link>
          <Link href={`/admin/payments/${payment._id.toString()}/edit`} className="btn-primary justify-center bg-gradient-to-r from-green-500 to-emerald-500 border-none">
            <Edit3 className="w-4 h-4" /> Edit Record
          </Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <div className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">Total Fees</div>
          <div className="text-2xl font-black text-white">{formatCurrency(payment.totalFees)}</div>
        </div>
        <div className="glass-card p-5">
          <div className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">Collected</div>
          <div className="text-2xl font-black text-green-400">{formatCurrency(payment.paidAmount)}</div>
        </div>
        <div className="glass-card p-5">
          <div className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">Pending</div>
          <div className="text-2xl font-black text-red-400">{formatCurrency(payment.pendingAmount)}</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[0.9fr,1.1fr] gap-6">
        <div className="glass-card p-6 md:p-8 space-y-5">
          <div>
            <h2 className="text-lg font-bold text-white">Payment Summary</h2>
            <p className="text-sm text-slate-400 mt-1">
              Admission date, linked student, and current payment status.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">Student</div>
              <div className="text-white font-semibold">{payment.studentId?.name || 'Unknown Student'}</div>
              <div className="text-sm text-slate-500 mt-1">{payment.studentId?.email || 'N/A'}</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">Course</div>
              <div className="text-white font-semibold">{payment.courseId?.title || 'Unknown Course'}</div>
              <div className="text-sm text-slate-500 mt-1">Admission: {formatDate(payment.admissionDate)}</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">Status</div>
              <div
                className={`inline-flex rounded-full px-3 py-1 text-xs font-bold border ${
                  payment.status === 'paid'
                    ? 'border-green-500/20 bg-green-500/10 text-green-400'
                    : payment.status === 'partial'
                      ? 'border-yellow-500/20 bg-yellow-500/10 text-yellow-400'
                      : 'border-red-500/20 bg-red-500/10 text-red-400'
                }`}
              >
                {payment.status}
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-green-500/15 flex items-center justify-center text-green-400">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Installment Timeline</h2>
              <p className="text-sm text-slate-400">
                {payment.installments?.length || 0} entries captured for this record.
              </p>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {payment.installments?.length ? (
              [...payment.installments]
                .sort(
                  (left, right) =>
                    new Date(right.date).getTime() - new Date(left.date).getTime()
                )
                .map((installment, index: number) => (
                  <div
                    key={
                      installment.receiptNo ||
                      `${payment._id.toString()}-${new Date(installment.date).getTime()}-${index}`
                    }
                    className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="text-white font-semibold">{formatCurrency(installment.amount)}</div>
                      <div className="text-sm text-slate-500 mt-1">
                        {formatDate(installment.date)} via {String(installment.method).replace('_', ' ')}
                      </div>
                    </div>
                    <div className="text-sm text-slate-400">
                      <div>Receipt: {installment.receiptNo || 'N/A'}</div>
                      <div className="mt-1">{installment.note || 'Manual admin entry'}</div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm text-slate-400">
                No installments recorded yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
