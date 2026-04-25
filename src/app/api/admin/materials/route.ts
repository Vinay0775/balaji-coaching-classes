import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Note from '@/models/Note';
import Assignment from '@/models/Assignment';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { type, courseId, studentId, title, fileUrl, dueDate } = body;

    if (!courseId || !title || !fileUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();
    
    let doc;
    if (type === 'notes') {
      doc = await Note.create({ courseId, studentId, title, fileUrl });
      doc = await doc.populate([
        { path: 'courseId', select: 'title' },
        { path: 'studentId', select: 'name email' }
      ]);
    } else if (type === 'assignments') {
      if (!dueDate) return NextResponse.json({ error: 'Missing due date' }, { status: 400 });
      doc = await Assignment.create({ courseId, studentId, title, fileUrl, dueDate: new Date(dueDate) });
      doc = await doc.populate([
        { path: 'courseId', select: 'title' },
        { path: 'studentId', select: 'name email' }
      ]);
    } else {
      return NextResponse.json({ error: 'Invalid material type' }, { status: 400 });
    }

    return NextResponse.json({ success: true, doc });
  } catch (error) {
    console.error('Create material error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');

    if (!id || !type) {
      return NextResponse.json({ error: 'Missing id or type' }, { status: 400 });
    }

    await dbConnect();
    
    if (type === 'notes') {
      await Note.findByIdAndDelete(id);
    } else if (type === 'assignments') {
      await Assignment.findByIdAndDelete(id);
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete material error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
