import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Payment from '@/models/Payment';
import User from '@/models/User';
import Course from '@/models/Course';
import { PaymentListClient } from '@/components/admin/PaymentListClient';

export default async function AdminPaymentsPage() {
  const session = await auth();
  // @ts-ignore
  if (!session || session.user.role !== 'admin') redirect('/login');

  await dbConnect();

  // Fetch payments with populated student and course data
  const payments = await Payment.find()
    .populate({ path: 'studentId', model: User, select: 'name email' })
    .populate({ path: 'courseId', model: Course, select: 'title color' })
    .sort({ updatedAt: -1 })
    .lean();

  // Convert to plain objects
  const paymentData = payments.map((p: any) => ({
    _id: p._id.toString(),
    studentId: {
      name: p.studentId?.name || 'Unknown',
      email: p.studentId?.email || 'N/A',
    },
    courseId: {
      title: p.courseId?.title || 'Unknown',
      color: p.courseId?.color || 'from-slate-500 to-slate-400',
    },
    totalFees: p.totalFees,
    paidAmount: p.paidAmount,
    pendingAmount: p.pendingAmount,
    status: p.status,
    installments: p.installments || [],
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PaymentListClient payments={paymentData} />
    </div>
  );
}
