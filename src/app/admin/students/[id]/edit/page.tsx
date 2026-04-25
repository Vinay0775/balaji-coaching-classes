import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { StudentForm } from '@/components/admin/forms/StudentForm';

export default async function EditStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session || role !== 'admin') redirect('/login');

  const { id } = await params;
  await dbConnect();

  const student = await User.findOne({ _id: id, role: 'student' }).lean();
  if (!student) redirect('/admin/students');

  return (
    <StudentForm
      mode="edit"
      student={{
        id: student._id.toString(),
        name: student.name,
        email: student.email,
        phone: student.phone || '',
        isActive: student.isActive,
      }}
    />
  );
}
