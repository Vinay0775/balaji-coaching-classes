import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { PaymentEditForm } from '@/components/admin/forms/PaymentEditForm';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import Payment from '@/models/Payment';
import User from '@/models/User';

type PaymentRecord = {
  _id: { toString(): string };
  studentId: { toString(): string };
  courseId: { toString(): string };
  totalFees: number;
  paidAmount: number;
  pendingAmount: number;
  admissionDate: Date | string;
};

type StudentOption = {
  _id: { toString(): string };
  name: string;
  email: string;
};

type CourseOption = {
  _id: { toString(): string };
  title: string;
};

export default async function EditPaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session || role !== 'admin') redirect('/login');

  const { id } = await params;
  await dbConnect();

  const [payment, students, courses] = await Promise.all([
    Payment.findById(id).lean<PaymentRecord | null>(),
    User.find({ role: 'student' }).select('name email').sort({ name: 1 }).lean<StudentOption[]>(),
    Course.find().select('title').sort({ title: 1 }).lean<CourseOption[]>(),
  ]);

  if (!payment) redirect('/admin/payments');

  return (
    <PaymentEditForm
      payment={{
        id: payment._id.toString(),
        studentId: payment.studentId.toString(),
        courseId: payment.courseId.toString(),
        totalFees: payment.totalFees,
        paidAmount: payment.paidAmount,
        pendingAmount: payment.pendingAmount,
        admissionDate: new Date(payment.admissionDate).toISOString().slice(0, 10),
      }}
      students={students.map((student) => ({
        id: student._id.toString(),
        name: student.name,
        email: student.email,
      }))}
      courses={courses.map((course) => ({
        id: course._id.toString(),
        title: course.title,
      }))}
    />
  );
}
