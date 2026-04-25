import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Schedule from '@/models/Schedule';
import Course from '@/models/Course';
import User from '@/models/User';
import { revalidatePath } from 'next/cache';
import ScheduleClient from './ScheduleClient';

export default async function AdminSchedulePage() {
  const session = await auth();
  if (!session || (session.user as any).role !== 'admin') redirect('/login');

  await dbConnect();
  
  const rawSchedules = await Schedule.find()
    .populate({ path: 'courseId', select: 'title' })
    .populate({ path: 'studentId', select: 'name' })
    .sort({ order: 1, time: 1 }).lean();
    
  const schedules = rawSchedules.map((s: any) => ({
    _id: s._id.toString(),
    time: s.time,
    title: s.title,
    duration: s.duration,
    isActive: s.isActive,
    order: s.order || 0,
    courseId: s.courseId ? { _id: s.courseId._id.toString(), title: s.courseId.title } : null,
    studentId: s.studentId ? { _id: s.studentId._id.toString(), name: s.studentId.name } : null,
  }));

  const rawCourses = await Course.find({}, 'title _id').lean();
  const courses = rawCourses.map((c: any) => ({
    _id: c._id.toString(),
    title: c.title,
  }));

  const rawStudents = await User.find({ role: 'student' }, 'name email _id').sort({ name: 1 }).lean();
  const students = rawStudents.map((s: any) => ({
    _id: s._id.toString(),
    name: s.name,
    email: s.email,
  }));

  // Server Actions
  async function addSchedule(formData: FormData) {
    'use server';
    await dbConnect();
    const targetType = formData.get('targetType');
    const courseId = (targetType === 'course' && formData.get('courseId')) ? formData.get('courseId') : undefined;
    const studentId = (targetType === 'student' && formData.get('studentId')) ? formData.get('studentId') : undefined;

    await Schedule.create({
      time: formData.get('time'),
      title: formData.get('title'),
      duration: formData.get('duration'),
      isActive: formData.get('isActive') === 'on',
      order: Number(formData.get('order') || 0),
      courseId: courseId || undefined,
      studentId: studentId || undefined,
    });
    revalidatePath('/admin/schedule');
  }

  async function toggleStatus(id: string, currentStatus: boolean) {
    'use server';
    await dbConnect();
    await Schedule.findByIdAndUpdate(id, { isActive: !currentStatus });
    revalidatePath('/admin/schedule');
  }

  async function deleteSchedule(id: string) {
    'use server';
    await dbConnect();
    await Schedule.findByIdAndDelete(id);
    revalidatePath('/admin/schedule');
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <ScheduleClient 
        schedules={schedules} 
        courses={courses} 
        students={students}
        addAction={addSchedule}
        toggleAction={toggleStatus}
        deleteAction={deleteSchedule}
      />
    </div>
  );
}
