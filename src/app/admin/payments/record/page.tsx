import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Course from '@/models/Course';
import RecordPaymentForm from './RecordPaymentForm';

export default async function RecordPaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ student?: string; course?: string }>;
}) {
  const { student, course } = await searchParams;
  const session = await auth();
  // @ts-ignore
  if (!session || session.user.role !== 'admin') redirect('/login');

  await dbConnect();

  // Fetch all students and courses to populate dropdowns
  const students = await User.find({ role: 'student' }).select('name email').lean();
  const courses = await Course.find({ isActive: true }).select('title fees discountedFees').lean();

  const serializedStudents = students.map((s: any) => ({
    id: s._id.toString(),
    name: s.name,
    email: s.email,
  }));

  const serializedCourses = courses.map((c: any) => ({
    id: c._id.toString(),
    title: c.title,
    fees: c.discountedFees || c.fees,
  }));

  return (
    <RecordPaymentForm 
       students={serializedStudents} 
       courses={serializedCourses} 
       prefillStudent={student}
       prefillCourse={course}
    />
  );
}
