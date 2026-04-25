import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { AdmissionCodeForm } from '@/components/admin/forms/AdmissionCodeForm';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';

export default async function NewStudentPage() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session || role !== 'admin') redirect('/login');

  await dbConnect();
  const coursesRaw = await Course.find({ isActive: true }).select('_id title').sort({ title: 1 }).lean();
  const courses = coursesRaw.map((c: any) => ({
    _id: c._id.toString(),
    title: c.title,
  }));

  return <AdmissionCodeForm courses={courses} />;
}
