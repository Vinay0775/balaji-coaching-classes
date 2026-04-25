import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { StaffForm } from '@/components/admin/forms/StaffForm';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';

type CourseOption = {
  _id: { toString(): string };
  title: string;
};

export default async function NewStaffPage() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session || role !== 'admin') redirect('/login');

  await dbConnect();
  const courses = await Course.find().select('title').sort({ title: 1 }).lean<CourseOption[]>();

  return (
    <StaffForm
      mode="create"
      courses={courses.map((course) => ({
        id: course._id.toString(),
        title: course.title,
      }))}
    />
  );
}
