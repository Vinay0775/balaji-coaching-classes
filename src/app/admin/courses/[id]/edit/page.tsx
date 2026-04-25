import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { CourseForm } from '@/components/admin/forms/CourseForm';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';

type CourseRecord = {
  _id: { toString(): string };
  title: string;
  fullName: string;
  slug: string;
  description: string;
  duration: string;
  category: string;
  fees: number;
  discountedFees: number;
  icon?: string;
  color?: string;
  badge?: string;
  popular: boolean;
  isActive: boolean;
  topics?: string[];
  roadmap?: Array<{ week: string; title: string; desc: string }>;
};

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session || role !== 'admin') redirect('/login');

  const { id } = await params;
  await dbConnect();

  const course = await Course.findById(id).lean<CourseRecord | null>();
  if (!course) redirect('/admin/courses');

  return (
    <CourseForm
      mode="edit"
      course={{
        id: course._id.toString(),
        title: course.title,
        fullName: course.fullName,
        slug: course.slug,
        description: course.description,
        duration: course.duration,
        category: course.category,
        fees: course.fees,
        discountedFees: course.discountedFees,
        icon: course.icon || '💻',
        color: course.color || 'from-indigo-500 to-cyan-500',
        badge: course.badge,
        popular: course.popular,
        isActive: course.isActive,
        topics: course.topics || [],
        roadmap: (course.roadmap || []).map((step) => ({
          id: crypto.randomUUID(),
          week: step.week,
          title: step.title,
          desc: step.desc,
        })),
      }}
    />
  );
}
