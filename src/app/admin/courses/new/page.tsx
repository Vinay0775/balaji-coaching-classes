import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { CourseForm } from '@/components/admin/forms/CourseForm';

export default async function NewCoursePage() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session || role !== 'admin') redirect('/login');

  return <CourseForm mode="create" />;
}
