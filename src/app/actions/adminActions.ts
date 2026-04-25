'use server';

import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import EnrollmentRequest from '@/models/EnrollmentRequest';
import Enrollment from '@/models/Enrollment';
import InstituteSettings from '@/models/InstituteSettings';
import Payment from '@/models/Payment';
import Staff from '@/models/Staff';
import User from '@/models/User';
import AdmissionCode from '@/models/AdmissionCode';

interface AdminSession {
  user: {
    id: string;
    role?: string;
    name?: string | null;
    email?: string | null;
  };
}

type PaymentMethod = 'cash' | 'upi' | 'bank_transfer' | 'cheque' | 'card';
type StaffRole = 'teacher' | 'coordinator' | 'receptionist' | 'manager';
type DashboardFocus = 'overview' | 'students' | 'payments' | 'courses';

const paymentMethods = new Set<PaymentMethod>([
  'cash',
  'upi',
  'bank_transfer',
  'cheque',
  'card',
]);

const staffRoles = new Set<StaffRole>([
  'teacher',
  'coordinator',
  'receptionist',
  'manager',
]);

const dashboardFocusValues = new Set<DashboardFocus>([
  'overview',
  'students',
  'payments',
  'courses',
]);

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Something went wrong.';
}

async function requireAdmin(): Promise<AdminSession> {
  const session = await auth();
  const userMeta = session?.user as { id?: string; role?: string } | undefined;

  if (!session || userMeta?.role !== 'admin' || !userMeta.id) {
    throw new Error('Unauthorized access.');
  }

  return session as AdminSession;
}

function getTextValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function getBooleanValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return value === 'on' || value === 'true';
}

function getNumberValue(formData: FormData, key: string, fallback = 0) {
  const value = getTextValue(formData, key);
  if (!value) return fallback;

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid value supplied for ${key}.`);
  }

  return parsed;
}

function getOptionalNumberValue(formData: FormData, key: string) {
  const value = getTextValue(formData, key);
  if (!value) return undefined;

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid value supplied for ${key}.`);
  }

  return parsed;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parsePaymentMethod(value: string): PaymentMethod {
  if (!paymentMethods.has(value as PaymentMethod)) {
    throw new Error('Unsupported payment method.');
  }

  return value as PaymentMethod;
}

function parseStaffRole(value: string): StaffRole {
  if (!staffRoles.has(value as StaffRole)) {
    throw new Error('Unsupported staff role.');
  }

  return value as StaffRole;
}

function parseDashboardFocus(value: string): DashboardFocus {
  if (!dashboardFocusValues.has(value as DashboardFocus)) {
    return 'overview';
  }

  return value as DashboardFocus;
}

async function ensureUniqueUserEmail(email: string, excludeUserId?: string) {
  const query: Record<string, unknown> = { email };
  if (excludeUserId) {
    query._id = { $ne: excludeUserId };
  }

  const existingUser = await User.findOne(query);
  if (existingUser) {
    throw new Error('A user with this email already exists.');
  }
}

async function ensureUniqueCourseSlug(slug: string, excludeCourseId?: string) {
  const query: Record<string, unknown> = { slug };
  if (excludeCourseId) {
    query._id = { $ne: excludeCourseId };
  }

  const existingCourse = await Course.findOne(query);
  if (existingCourse) {
    throw new Error('This course slug is already in use.');
  }
}

function parseTopics(formData: FormData) {
  return getTextValue(formData, 'topics')
    .split(/\r?\n/)
    .map((topic) => topic.trim())
    .filter(Boolean);
}

function parseRoadmap(formData: FormData) {
  const weeks = formData.getAll('roadmapWeek').map((value) =>
    typeof value === 'string' ? value.trim() : ''
  );
  const titles = formData.getAll('roadmapTitle').map((value) =>
    typeof value === 'string' ? value.trim() : ''
  );
  const descriptions = formData.getAll('roadmapDesc').map((value) =>
    typeof value === 'string' ? value.trim() : ''
  );

  return weeks
    .map((week, index) => ({
      week,
      title: titles[index] || '',
      desc: descriptions[index] || '',
    }))
    .filter((step) => step.week && step.title && step.desc);
}

function revalidateAdminPaths(paths: string[]) {
  for (const path of new Set(paths.filter(Boolean))) {
    revalidatePath(path);
  }
}

export async function addStudentAdmin(formData: FormData) {
  try {
    await requireAdmin();
    await dbConnect();

    const name = getTextValue(formData, 'name');
    const email = getTextValue(formData, 'email').toLowerCase();
    const phone = getTextValue(formData, 'phone');
    const password = getTextValue(formData, 'password');

    if (!name || !email || !password) {
      throw new Error('Name, email, and password are required.');
    }

    await ensureUniqueUserEmail(email);

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'student',
      isActive: true,
    });

    revalidateAdminPaths(['/admin', '/admin/students']);
    return { success: true, message: 'Student created successfully.' };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function createAdmissionCodeAdmin(formData: FormData) {
  try {
    await requireAdmin();
    await dbConnect();

    const name = getTextValue(formData, 'name');
    const phone = getTextValue(formData, 'phone');
    const courseId = getTextValue(formData, 'courseId');
    let code = getTextValue(formData, 'code').toUpperCase();

    if (!name || !phone || !courseId) {
      throw new Error('Name, Phone, and Course are required.');
    }

    // Generate random code if not provided
    if (!code) {
      code = `BCC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }

    // Check if code already exists
    const existingCode = await AdmissionCode.findOne({ code });
    if (existingCode) {
      throw new Error('This code already exists. Please use a different one or generate automatically.');
    }

    await AdmissionCode.create({
      name,
      phone,
      courseId,
      code,
      isUsed: false,
    });

    revalidateAdminPaths(['/admin', '/admin/students']);
    return { success: true, message: 'Admission code generated successfully.', code };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function updateStudentAdmin(studentId: string, formData: FormData) {
  try {
    await requireAdmin();
    await dbConnect();

    const student = await User.findOne({ _id: studentId, role: 'student' });
    if (!student) {
      throw new Error('Student not found.');
    }

    const name = getTextValue(formData, 'name');
    const email = getTextValue(formData, 'email').toLowerCase();
    const phone = getTextValue(formData, 'phone');
    const password = getTextValue(formData, 'password');
    const isActive = getBooleanValue(formData, 'isActive');

    if (!name || !email) {
      throw new Error('Name and email are required.');
    }

    await ensureUniqueUserEmail(email, studentId);

    student.name = name;
    student.email = email;
    student.phone = phone;
    student.isActive = isActive;

    if (password) {
      student.password = await bcrypt.hash(password, 10);
    }

    await student.save();

    revalidateAdminPaths(['/admin', '/admin/students', `/admin/students/${studentId}`]);
    return { success: true, message: 'Student updated successfully.' };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function toggleStudentStatus(studentId: string, nextStatus: boolean) {
  try {
    await requireAdmin();
    await dbConnect();

    const student = await User.findOneAndUpdate(
      { _id: studentId, role: 'student' },
      { isActive: nextStatus },
      { new: true }
    );

    if (!student) {
      throw new Error('Student not found.');
    }

    revalidateAdminPaths(['/admin', '/admin/students', `/admin/students/${studentId}`]);
    return {
      success: true,
      message: nextStatus ? 'Student activated.' : 'Student suspended.',
    };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function createCourseAdmin(formData: FormData) {
  try {
    await requireAdmin();
    await dbConnect();

    const title = getTextValue(formData, 'title');
    const fullName = getTextValue(formData, 'fullName');
    const description = getTextValue(formData, 'description');
    const duration = getTextValue(formData, 'duration');
    const category = getTextValue(formData, 'category');
    const icon = getTextValue(formData, 'icon') || '💻';
    const color = getTextValue(formData, 'color') || 'from-indigo-500 to-cyan-500';
    const badge = getTextValue(formData, 'badge');
    const customSlug = getTextValue(formData, 'slug');
    const fees = getNumberValue(formData, 'fees');
    const discountedFees = getNumberValue(formData, 'discountedFees', fees);
    const popular = getBooleanValue(formData, 'popular');
    const isActive = getBooleanValue(formData, 'isActive');

    if (!title || !fullName || !description || !duration || !category || fees <= 0) {
      throw new Error('Please fill all required course details.');
    }

    if (discountedFees <= 0) {
      throw new Error('Discounted fees must be greater than 0.');
    }

    const slug = slugify(customSlug || title);
    if (!slug) {
      throw new Error('Please enter a valid course title or slug.');
    }

    await ensureUniqueCourseSlug(slug);

    const course = await Course.create({
      slug,
      title,
      fullName,
      description,
      duration,
      fees,
      discountedFees,
      icon,
      color,
      category,
      topics: parseTopics(formData),
      roadmap: parseRoadmap(formData),
      badge: badge || undefined,
      popular,
      isActive,
    });

    revalidateAdminPaths(['/admin', '/admin/courses', '/courses', `/courses/${course.slug}`]);
    return { success: true, message: 'Course created successfully.' };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function updateCourseAdmin(courseId: string, formData: FormData) {
  try {
    await requireAdmin();
    await dbConnect();

    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found.');
    }

    const title = getTextValue(formData, 'title');
    const fullName = getTextValue(formData, 'fullName');
    const description = getTextValue(formData, 'description');
    const duration = getTextValue(formData, 'duration');
    const category = getTextValue(formData, 'category');
    const icon = getTextValue(formData, 'icon') || '💻';
    const color = getTextValue(formData, 'color') || 'from-indigo-500 to-cyan-500';
    const badge = getTextValue(formData, 'badge');
    const customSlug = getTextValue(formData, 'slug');
    const fees = getNumberValue(formData, 'fees');
    const discountedFees = getNumberValue(formData, 'discountedFees', fees);
    const popular = getBooleanValue(formData, 'popular');
    const isActive = getBooleanValue(formData, 'isActive');

    if (!title || !fullName || !description || !duration || !category || fees <= 0) {
      throw new Error('Please fill all required course details.');
    }

    const slug = slugify(customSlug || title);
    if (!slug) {
      throw new Error('Please enter a valid course title or slug.');
    }

    await ensureUniqueCourseSlug(slug, courseId);

    const previousSlug = course.slug;

    course.slug = slug;
    course.title = title;
    course.fullName = fullName;
    course.description = description;
    course.duration = duration;
    course.fees = fees;
    course.discountedFees = discountedFees;
    course.icon = icon;
    course.color = color;
    course.category = category;
    course.topics = parseTopics(formData);
    course.roadmap = parseRoadmap(formData);
    course.badge = badge || undefined;
    course.popular = popular;
    course.isActive = isActive;

    await course.save();

    revalidateAdminPaths([
      '/admin',
      '/admin/courses',
      '/courses',
      `/courses/${previousSlug}`,
      `/courses/${slug}`,
    ]);

    return { success: true, message: 'Course updated successfully.' };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function toggleCourseActive(courseId: string, currentStatus: boolean) {
  try {
    await requireAdmin();
    await dbConnect();

    const course = await Course.findByIdAndUpdate(
      courseId,
      { isActive: !currentStatus },
      { new: true }
    ).select('slug');

    if (!course) {
      throw new Error('Course not found.');
    }

    revalidateAdminPaths(['/admin', '/admin/courses', '/courses', `/courses/${course.slug}`]);
    return {
      success: true,
      message: currentStatus ? 'Course moved to draft.' : 'Course activated.',
    };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function recordPayment(formData: FormData) {
  try {
    await requireAdmin();
    await dbConnect();

    const studentId = getTextValue(formData, 'studentId');
    const courseId = getTextValue(formData, 'courseId');
    const amount = getNumberValue(formData, 'amount');
    const method = parsePaymentMethod(getTextValue(formData, 'method'));

    if (!studentId || !courseId || amount <= 0) {
      throw new Error('Invalid input data.');
    }

    let paymentDoc = await Payment.findOne({ studentId, courseId });
    if (!paymentDoc) {
      const course = await Course.findById(courseId);
      if (!course) {
        throw new Error('Course not found.');
      }

      paymentDoc = new Payment({
        studentId,
        courseId,
        totalFees: course.discountedFees || course.fees,
        pendingAmount: course.discountedFees || course.fees,
        installments: [],
      });
    }

    const remainingBalance = Math.max(paymentDoc.totalFees - paymentDoc.paidAmount, 0);
    if (remainingBalance === 0) {
      throw new Error('This payment is already fully settled.');
    }

    if (amount > remainingBalance) {
      throw new Error(`Amount exceeds the remaining balance of Rs. ${remainingBalance}.`);
    }

    const receiptUrl = getTextValue(formData, 'receiptUrl');

    paymentDoc.installments.push({
      amount,
      date: new Date(),
      method,
      receiptNo: `BCC-${Date.now().toString().slice(-6)}`,
      receiptUrl: receiptUrl || undefined,
      note: 'Offline administration manual entry',
    });

    await paymentDoc.save();

    revalidateAdminPaths([
      '/admin',
      '/admin/payments',
      `/admin/payments/${paymentDoc._id.toString()}`,
      '/admin/students',
      `/admin/students/${studentId}`,
    ]);

    return { success: true, message: 'Fee recorded successfully.' };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function updatePaymentAdmin(paymentId: string, formData: FormData) {
  try {
    await requireAdmin();
    await dbConnect();

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new Error('Payment record not found.');
    }

    const studentId = getTextValue(formData, 'studentId');
    const courseId = getTextValue(formData, 'courseId');
    const totalFees = getNumberValue(formData, 'totalFees');
    const admissionDate = getTextValue(formData, 'admissionDate');

    if (!studentId || !courseId || totalFees <= 0 || !admissionDate) {
      throw new Error('Please complete all required payment details.');
    }

    const amountAlreadyCollected = payment.installments.reduce(
      (sum, installment) => sum + installment.amount,
      0
    );

    if (totalFees < amountAlreadyCollected) {
      throw new Error('Total fees cannot be less than the amount already collected.');
    }

    payment.studentId = studentId as unknown as typeof payment.studentId;
    payment.courseId = courseId as unknown as typeof payment.courseId;
    payment.totalFees = totalFees;
    payment.admissionDate = new Date(admissionDate);

    await payment.save();

    revalidateAdminPaths([
      '/admin',
      '/admin/payments',
      `/admin/payments/${paymentId}`,
      `/admin/students/${studentId}`,
    ]);

    return { success: true, message: 'Payment record updated successfully.' };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function createStaffAdmin(formData: FormData) {
  try {
    await requireAdmin();
    await dbConnect();

    const name = getTextValue(formData, 'name');
    const email = getTextValue(formData, 'email').toLowerCase();
    const phone = getTextValue(formData, 'phone');
    const password = getTextValue(formData, 'password');
    const role = parseStaffRole(getTextValue(formData, 'role'));
    const qualification = getTextValue(formData, 'qualification');
    const experience = getTextValue(formData, 'experience');
    const bio = getTextValue(formData, 'bio');
    const salary = getOptionalNumberValue(formData, 'salary');
    const joinDate = getTextValue(formData, 'joinDate');
    const isActive = getBooleanValue(formData, 'isActive');
    const assignedCourses = formData
      .getAll('assignedCourses')
      .map((value) => (typeof value === 'string' ? value : ''))
      .filter(Boolean);

    if (!name || !email || !password || !qualification || !experience || !joinDate) {
      throw new Error('Please fill all required staff details.');
    }

    await ensureUniqueUserEmail(email);

    const user = await User.create({
      name,
      email,
      phone,
      password: await bcrypt.hash(password, 10),
      role: 'staff',
      isActive,
    });

    await Staff.create({
      userId: user._id,
      role,
      assignedCourses,
      qualification,
      experience,
      bio: bio || undefined,
      salary,
      joinDate: new Date(joinDate),
      isActive,
    });

    revalidateAdminPaths(['/admin', '/admin/staff']);
    return { success: true, message: 'Staff member created successfully.' };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function updateStaffAdmin(staffId: string, formData: FormData) {
  try {
    await requireAdmin();
    await dbConnect();

    const staff = await Staff.findById(staffId);
    if (!staff) {
      throw new Error('Staff member not found.');
    }

    const user = await User.findById(staff.userId);
    if (!user) {
      throw new Error('Linked staff user not found.');
    }

    const name = getTextValue(formData, 'name');
    const email = getTextValue(formData, 'email').toLowerCase();
    const phone = getTextValue(formData, 'phone');
    const password = getTextValue(formData, 'password');
    const role = parseStaffRole(getTextValue(formData, 'role'));
    const qualification = getTextValue(formData, 'qualification');
    const experience = getTextValue(formData, 'experience');
    const bio = getTextValue(formData, 'bio');
    const salary = getOptionalNumberValue(formData, 'salary');
    const joinDate = getTextValue(formData, 'joinDate');
    const isActive = getBooleanValue(formData, 'isActive');
    const assignedCourses = formData
      .getAll('assignedCourses')
      .map((value) => (typeof value === 'string' ? value : ''))
      .filter(Boolean);

    if (!name || !email || !qualification || !experience || !joinDate) {
      throw new Error('Please fill all required staff details.');
    }

    await ensureUniqueUserEmail(email, user._id.toString());

    user.name = name;
    user.email = email;
    user.phone = phone;
    user.isActive = isActive;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    staff.role = role;
    staff.assignedCourses = assignedCourses as unknown as typeof staff.assignedCourses;
    staff.qualification = qualification;
    staff.experience = experience;
    staff.bio = bio || undefined;
    staff.salary = salary;
    staff.joinDate = new Date(joinDate);
    staff.isActive = isActive;

    await Promise.all([user.save(), staff.save()]);

    revalidateAdminPaths(['/admin', '/admin/staff', `/admin/staff/${staffId}/edit`]);
    return { success: true, message: 'Staff member updated successfully.' };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function toggleStaffStatus(staffId: string, nextStatus: boolean) {
  try {
    await requireAdmin();
    await dbConnect();

    const staff = await Staff.findById(staffId);
    if (!staff) {
      throw new Error('Staff member not found.');
    }

    staff.isActive = nextStatus;
    await staff.save();
    await User.findByIdAndUpdate(staff.userId, { isActive: nextStatus });

    revalidateAdminPaths(['/admin', '/admin/staff', `/admin/staff/${staffId}/edit`]);
    return {
      success: true,
      message: nextStatus ? 'Staff member activated.' : 'Staff member deactivated.',
    };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function saveInstituteSettings(formData: FormData) {
  try {
    await requireAdmin();
    await dbConnect();

    const payload = {
      instituteName: getTextValue(formData, 'instituteName'),
      shortName: getTextValue(formData, 'shortName'),
      tagline: getTextValue(formData, 'tagline'),
      email: getTextValue(formData, 'email').toLowerCase(),
      supportEmail: getTextValue(formData, 'supportEmail').toLowerCase() || undefined,
      phone: getTextValue(formData, 'phone'),
      whatsapp: getTextValue(formData, 'whatsapp') || undefined,
      address: getTextValue(formData, 'address'),
      timings: getTextValue(formData, 'timings'),
      dashboardFocus: parseDashboardFocus(getTextValue(formData, 'dashboardFocus')),
      studentSignupAlerts: getBooleanValue(formData, 'studentSignupAlerts'),
      paymentAlerts: getBooleanValue(formData, 'paymentAlerts'),
      dailyDigest: getBooleanValue(formData, 'dailyDigest'),
      lowCollectionAlert: getNumberValue(formData, 'lowCollectionAlert', 5000),
    };

    if (
      !payload.instituteName ||
      !payload.shortName ||
      !payload.tagline ||
      !payload.email ||
      !payload.phone ||
      !payload.address ||
      !payload.timings
    ) {
      throw new Error('Please complete the institute profile fields.');
    }

    await InstituteSettings.findOneAndUpdate(
      { slug: 'default' },
      { slug: 'default', ...payload },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    revalidateAdminPaths(['/admin', '/admin/settings']);
    return { success: true, message: 'Settings saved successfully.' };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function updateAdminProfileSettings(formData: FormData) {
  try {
    const session = await requireAdmin();
    await dbConnect();

    const name = getTextValue(formData, 'name');
    const phone = getTextValue(formData, 'phone');
    const password = getTextValue(formData, 'password');

    if (!name) {
      throw new Error('Admin name is required.');
    }

    const admin = await User.findById(session.user.id);
    if (!admin) {
      throw new Error('Admin account not found.');
    }

    admin.name = name;
    admin.phone = phone;

    if (password) {
      admin.password = await bcrypt.hash(password, 10);
    }

    await admin.save();

    revalidateAdminPaths(['/admin', '/admin/settings']);
    return { success: true, message: 'Admin profile updated successfully.' };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

// ============= ENROLLMENT REQUEST ACTIONS =============

export async function submitEnrollmentRequest(formData: FormData) {
  try {
    await dbConnect();

    const studentName = getTextValue(formData, 'name');
    const email = getTextValue(formData, 'email').toLowerCase();
    const phone = getTextValue(formData, 'phone');
    const courseId = getTextValue(formData, 'courseId');

    if (!studentName || !email || !phone || !courseId) {
      throw new Error('Please fill all required fields.');
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found.');
    }

    const registrationCode = getTextValue(formData, 'registrationCode');
    const password = getTextValue(formData, 'password');

    if (!registrationCode) {
      throw new Error('Unique Enrollment Code is required.');
    }
    if (!password || password.length < 6) {
      throw new Error('Password is required and must be at least 6 characters.');
    }

    const AdmissionCode = (await import('@/models/AdmissionCode')).default;
    const codeRecord = await AdmissionCode.findOne({ code: registrationCode.toUpperCase(), isUsed: false });
    if (!codeRecord) {
      throw new Error('Invalid or already used Enrollment Code. Please contact admin.');
    }

    // Check if user already exists
    let student = await User.findOne({ email });

    if (!student) {
      // Create new student user with their chosen password
      const hashedPassword = await bcrypt.hash(password, 12);
      student = await User.create({
        name: studentName,
        email,
        password: hashedPassword,
        phone: phone || codeRecord.phone,
        role: 'student',
        isActive: true, // Active because they used a valid admin-generated code
      });

      codeRecord.isUsed = true;
      codeRecord.usedBy = student._id;
      await codeRecord.save();
    }

    // Check if there's already a pending request for this student/course combo
    const existingRequest = await EnrollmentRequest.findOne({
      studentId: student._id,
      courseId,
      status: 'pending',
    });

    if (existingRequest) {
      throw new Error('You already have a pending enrollment request for this course.');
    }

    // Create enrollment request
    await EnrollmentRequest.create({
      studentId: student._id,
      courseId,
      status: 'pending',
      requestDate: new Date(),
    });

    revalidateAdminPaths(['/admin', '/admin/enrollments/requests']);
    return { success: true, message: 'Enrollment request submitted successfully.' };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function approveEnrollmentRequest(
  requestId: string,
  password: string = 'Student@123'
) {
  try {
    const session = await requireAdmin();
    await dbConnect();

    const request = await EnrollmentRequest.findById(requestId);
    if (!request) {
      throw new Error('Enrollment request not found.');
    }

    if (request.status !== 'pending') {
      throw new Error('Only pending requests can be approved.');
    }

    // Update student account
    const student = await User.findById(request.studentId);
    if (!student) {
      throw new Error('Student not found.');
    }

    // If student doesn't have a password, set it
    if (!student.password) {
      student.password = await bcrypt.hash(password, 10);
    }

    student.isActive = true;
    await student.save();

    // Create enrollment record
    const enrollment = await Enrollment.findOne({
      studentId: request.studentId,
      courseId: request.courseId,
    });

    if (!enrollment) {
      await Enrollment.create({
        studentId: request.studentId,
        courseId: request.courseId,
        status: 'active',
        enrollDate: new Date(),
      });
    } else if (enrollment.status !== 'active') {
      enrollment.status = 'active';
      enrollment.enrollDate = new Date();
      await enrollment.save();
    }

    // Create/update payment record
    const course = await Course.findById(request.courseId);
    const totalFees = course?.discountedFees || course?.fees || 0;

    let payment = await Payment.findOne({
      studentId: request.studentId,
      courseId: request.courseId,
    });

    if (!payment) {
      payment = await Payment.create({
        studentId: request.studentId,
        courseId: request.courseId,
        totalFees,
        pendingAmount: totalFees,
        installments: [],
      });
    }

    // Update request status
    request.status = 'approved';
    request.approvalDate = new Date();
    request.approvedBy = session.user.id as unknown as typeof request.approvedBy;
    await request.save();

    revalidateAdminPaths([
      '/admin',
      '/admin/enrollments/requests',
      `/admin/students/${request.studentId}`,
      '/admin/payments',
    ]);

    return {
      success: true,
      message: `Enrollment approved. Student password: ${password}`,
    };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function rejectEnrollmentRequest(
  requestId: string,
  rejectionReason: string
) {
  try {
    const session = await requireAdmin();
    await dbConnect();

    const request = await EnrollmentRequest.findById(requestId);
    if (!request) {
      throw new Error('Enrollment request not found.');
    }

    if (request.status !== 'pending') {
      throw new Error('Only pending requests can be rejected.');
    }

    request.status = 'rejected';
    request.approvalDate = new Date();
    request.rejectionReason = rejectionReason;
    request.approvedBy = session.user.id as unknown as typeof request.approvedBy;
    await request.save();

    revalidateAdminPaths(['/admin', '/admin/enrollments/requests']);

    return { success: true, message: 'Enrollment request rejected.' };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}
