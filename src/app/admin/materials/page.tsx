import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import Note from '@/models/Note';
import Assignment from '@/models/Assignment';
import User from '@/models/User';
import MaterialsClient from './MaterialsClient';

export default async function AdminMaterialsPage() {
  const session = await auth();
  if (!session || (session.user as any).role !== 'admin') redirect('/login');

  await dbConnect();
  
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

  const rawNotes = await Note.find()
    .populate({ path: 'courseId', select: 'title' })
    .populate({ path: 'studentId', select: 'name email' })
    .sort({ createdAt: -1 }).lean();
  const notes = rawNotes.map((n: any) => ({
    _id: n._id.toString(),
    title: n.title,
    fileUrl: n.fileUrl,
    courseId: {
      _id: n.courseId?._id?.toString() || '',
      title: n.courseId?.title || 'Unknown Course'
    },
    studentId: n.studentId ? {
      _id: n.studentId._id?.toString() || '',
      name: n.studentId.name || 'Unknown'
    } : null,
    createdAt: n.createdAt.toISOString()
  }));

  const rawAssignments = await Assignment.find()
    .populate({ path: 'courseId', select: 'title' })
    .populate({ path: 'studentId', select: 'name email' })
    .sort({ createdAt: -1 }).lean();
  const assignments = rawAssignments.map((a: any) => ({
    _id: a._id.toString(),
    title: a.title,
    fileUrl: a.fileUrl,
    dueDate: a.dueDate?.toISOString() || '',
    courseId: {
      _id: a.courseId?._id?.toString() || '',
      title: a.courseId?.title || 'Unknown Course'
    },
    studentId: a.studentId ? {
      _id: a.studentId._id?.toString() || '',
      name: a.studentId.name || 'Unknown'
    } : null,
    createdAt: a.createdAt.toISOString()
  }));

  return <MaterialsClient courses={courses} students={students} initialNotes={notes} initialAssignments={assignments} />;
}
