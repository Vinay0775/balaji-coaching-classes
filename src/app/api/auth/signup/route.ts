import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function POST(req: Request) {
  try {
    const { name, email, password, phone, registrationCode } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    await dbConnect();
    // Check registration code
    const AdmissionCode = (await import('@/models/AdmissionCode')).default;
    if (!registrationCode) {
      return NextResponse.json({ error: 'Unique Enrollment Code is required' }, { status: 400 });
    }

    const codeRecord = await AdmissionCode.findOne({ code: registrationCode.toUpperCase(), isUsed: false });
    if (!codeRecord) {
      return NextResponse.json({ error: 'Invalid or already used Enrollment Code. Please contact admin.' }, { status: 403 });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: 'Account already exists with this email' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone?.trim() || codeRecord.phone, // fallback to phone from admission code
      role: 'student',
    });

    codeRecord.isUsed = true;
    codeRecord.usedBy = user._id as mongoose.Types.ObjectId;
    await codeRecord.save();

    return NextResponse.json(
      {
        message: 'Account created successfully',
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
