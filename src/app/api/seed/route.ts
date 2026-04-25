import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await dbConnect();
    
    // Check if admin exists
    const existingAdmin = await User.findOne({ email: 'admin@techvidya.in' });
    if (existingAdmin) {
      if (existingAdmin.role !== 'admin') {
         existingAdmin.role = 'admin';
         await existingAdmin.save();
         return NextResponse.json({ message: 'Updated existing admin user role to admin.', user: existingAdmin });
      }
      return NextResponse.json({ message: 'Admin already exists', user: existingAdmin });
    }

    // Create admin
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    const newAdmin = await User.create({
      name: 'BCC Admin',
      email: 'admin@techvidya.in',
      password: hashedPassword,
      phone: '9876543210',
      role: 'admin',
      isActive: true,
    });

    return NextResponse.json({ message: 'Admin created successfully', user: newAdmin }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
