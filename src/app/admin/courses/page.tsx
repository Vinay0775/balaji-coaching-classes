import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import { CourseListClient } from '@/components/admin/CourseListClient';

export default async function AdminCoursesPage() {
  const session = await auth();
  // @ts-ignore
  if (!session || session.user.role !== 'admin') redirect('/login');

  await dbConnect();
  const courses = await Course.find().sort({ createdAt: -1 }).lean();

  // Convert to plain objects
  const courseData = courses.map((c: any) => ({
    _id: c._id.toString(),
    title: c.title,
    fullName: c.fullName,
    description: c.description,
    duration: c.duration,
    fees: c.fees,
    discountedFees: c.discountedFees,
    color: c.color || 'from-indigo-500 to-purple-500',
    icon: c.icon || '📚',
    isActive: c.isActive,
    roadmap: c.roadmap || [],
  }));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <CourseListClient courses={courseData} />
    </div>
  );
}
