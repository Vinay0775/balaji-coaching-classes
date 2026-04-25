import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { StudentListClient } from '@/components/admin/StudentListClient';

export default async function StudentsPage() {
  const session = await auth();
  // @ts-ignore
  if (!session || session.user.role !== 'admin') redirect('/login');

  await dbConnect();

  // Fetch all students
  const students = await User.find({ role: 'student' }).sort({ createdAt: -1 }).lean();

  // Convert MongoDB documents to plain objects with string dates
  const studentData = students.map(student => ({
    _id: student._id.toString(),
    name: student.name,
    email: student.email,
    phone: student.phone || '',
    createdAt: student.createdAt.toISOString(),
    isActive: student.isActive,
  }));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <StudentListClient students={studentData} />
    </div>
  );
}
