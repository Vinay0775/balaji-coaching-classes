import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { StaffForm } from '@/components/admin/forms/StaffForm';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import Staff from '@/models/Staff';

type CourseOption = {
  _id: { toString(): string };
  title: string;
};

type StaffUser = {
  name: string;
  email: string;
  phone?: string;
};

type StaffRecord = {
  _id: { toString(): string };
  role: string;
  qualification: string;
  experience: string;
  bio?: string;
  salary?: number;
  joinDate: Date | string;
  isActive: boolean;
  userId?: StaffUser | null;
  assignedCourses?: Array<{ toString(): string }>;
};

export default async function EditStaffPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session || role !== 'admin') redirect('/login');

  const { id } = await params;
  await dbConnect();

  const [staff, courses] = await Promise.all([
    Staff.findById(id).populate('userId', 'name email phone').lean<StaffRecord | null>(),
    Course.find().select('title').sort({ title: 1 }).lean<CourseOption[]>(),
  ]);

  if (!staff || !staff.userId) redirect('/admin/staff');

  return (
    <StaffForm
      mode="edit"
      courses={courses.map((course) => ({
        id: course._id.toString(),
        title: course.title,
      }))}
      staff={{
        id: staff._id.toString(),
        name: staff.userId.name,
        email: staff.userId.email,
        phone: staff.userId.phone || '',
        role: staff.role,
        qualification: staff.qualification,
        experience: staff.experience,
        bio: staff.bio || '',
        salary: staff.salary,
        joinDate: staff.joinDate ? new Date(staff.joinDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        isActive: staff.isActive,
        assignedCourses: (staff.assignedCourses || []).map((course) => course.toString()),
      }}
    />
  );
}
