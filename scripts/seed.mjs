/**
 * ============================================================
 * SEED SCRIPT — Populate database with sample data
 * ============================================================
 * Run:  node --env-file=.env.local scripts/seed.mjs
 * Or:   npm run seed
 *
 * This creates:
 *   - 1 Admin user
 *   - 3 Staff/Teachers
 *   - 6 Courses (all from constants)
 *   - 10 Sample Students
 *   - Enrollments for each student
 *   - Payment records with installments
 * ============================================================
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env.local');
  process.exit(1);
}

// ── Schema definitions (inline for standalone script) ────────
const UserSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true }, password: String,
  role: { type: String, enum: ['student', 'admin', 'staff'], default: 'student' },
  phone: String, photo: String, isActive: { type: Boolean, default: true },
}, { timestamps: true });

const CourseSchema = new mongoose.Schema({
  slug: { type: String, unique: true }, title: String, fullName: String,
  description: String, duration: String, fees: Number, discountedFees: Number,
  icon: String, color: String, category: String, topics: [String],
  roadmap: [{ week: String, title: String, desc: String }],
  badge: String, popular: Boolean, isActive: { type: Boolean, default: true },
}, { timestamps: true });

const StaffSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  role: String, assignedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  qualification: String, experience: String, bio: String, isActive: { type: Boolean, default: true },
}, { timestamps: true });

const EnrollmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  progress: { type: Number, default: 0 }, enrollDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'completed', 'dropped'], default: 'active' },
  completedSteps: [Number],
}, { timestamps: true });

const PaymentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  totalFees: Number, paidAmount: Number, pendingAmount: Number,
  installments: [{ amount: Number, date: Date, method: String, note: String, receiptNo: String }],
  status: { type: String, enum: ['pending', 'partial', 'paid'], default: 'pending' },
  admissionDate: { type: Date, default: Date.now },
}, { timestamps: true });

// ── Models ────────────────────────────────────────────────────
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);
const Staff = mongoose.models.Staff || mongoose.model('Staff', StaffSchema);
const Enrollment = mongoose.models.Enrollment || mongoose.model('Enrollment', EnrollmentSchema);
const Payment = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);

// ── Seed Data ─────────────────────────────────────────────────
const COURSES_DATA = [
  {
    slug: 'rs-cit', title: 'RS-CIT', fullName: 'Rajasthan State Certificate in Information Technology',
    description: 'Government certified computer literacy course. Learn essential computer skills.',
    duration: '3 Months', fees: 3600, discountedFees: 3200, icon: '🖥️',
    color: 'from-blue-500 to-cyan-500', category: 'Government Certified', popular: false,
    badge: 'Govt. Certified',
    topics: ['Computer Basics', 'Windows OS', 'MS Word', 'MS Excel', 'MS PowerPoint', 'Internet', 'Digital Payments'],
    roadmap: [
      { week: 'Week 1-2', title: 'Computer Fundamentals', desc: 'Hardware, Software, OS basics' },
      { week: 'Week 3-4', title: 'MS Office Suite', desc: 'Word, Excel, PowerPoint' },
      { week: 'Week 5-6', title: 'Internet & Email', desc: 'Browsing, Gmail, Online tools' },
      { week: 'Week 7-12', title: 'Practice & Exam Prep', desc: 'Mock tests, Revision' },
    ],
  },
  {
    slug: 'web-development', title: 'Web Development', fullName: 'Full Stack Web Development',
    description: 'Learn HTML, CSS, JavaScript, React and Node.js to build modern web applications.',
    duration: '6 Months', fees: 15000, discountedFees: 12000, icon: '🌐',
    color: 'from-violet-500 to-purple-600', category: 'Technical', popular: true, badge: 'Most Popular',
    topics: ['HTML5 & CSS3', 'JavaScript ES6+', 'React.js', 'Node.js', 'MongoDB', 'REST APIs', 'Git'],
    roadmap: [
      { week: 'Month 1', title: 'HTML & CSS', desc: 'Structure, styling, responsive design' },
      { week: 'Month 2', title: 'JavaScript', desc: 'Programming basics to advanced JS' },
      { week: 'Month 3', title: 'React.js', desc: 'Components, Hooks, State management' },
      { week: 'Month 4', title: 'Backend Node.js', desc: 'Express, APIs, Authentication' },
      { week: 'Month 5', title: 'Database MongoDB', desc: 'CRUD, Mongoose, Deployment' },
      { week: 'Month 6', title: 'Projects & Portfolio', desc: '3 real-world projects built' },
    ],
  },
  {
    slug: 'digital-marketing', title: 'Digital Marketing', fullName: 'Complete Digital Marketing',
    description: 'Master SEO, Social Media, Google Ads, and Analytics to grow businesses online.',
    duration: '3 Months', fees: 8000, discountedFees: 6500, icon: '📱',
    color: 'from-orange-500 to-red-500', category: 'Marketing', popular: false, badge: 'High Demand',
    topics: ['SEO & SEM', 'Social Media Marketing', 'Google Ads', 'Meta Ads', 'Email Marketing'],
    roadmap: [
      { week: 'Week 1-2', title: 'Digital Marketing Basics', desc: 'Channels, strategy, mindset' },
      { week: 'Week 3-4', title: 'Social Media Marketing', desc: 'Instagram, Facebook, LinkedIn' },
      { week: 'Week 5-6', title: 'SEO & Google Tools', desc: 'Search optimization, Analytics' },
      { week: 'Week 7-12', title: 'Live Campaigns', desc: 'Real campaigns, portfolio' },
    ],
  },
  {
    slug: 'graphic-designing', title: 'Graphic Designing', fullName: 'Professional Graphic Design',
    description: 'Learn Adobe Photoshop, Illustrator, and Canva to create stunning visuals.',
    duration: '4 Months', fees: 10000, discountedFees: 8000, icon: '🎨',
    color: 'from-pink-500 to-rose-500', category: 'Creative', popular: false, badge: 'Creative',
    topics: ['Design Principles', 'Adobe Photoshop', 'Adobe Illustrator', 'Canva Pro', 'Logo Design'],
    roadmap: [
      { week: 'Month 1', title: 'Design Fundamentals', desc: 'Color, typography, composition' },
      { week: 'Month 2', title: 'Adobe Photoshop', desc: 'Photo editing, manipulation' },
      { week: 'Month 3', title: 'Adobe Illustrator', desc: 'Vector design, logo creation' },
      { week: 'Month 4', title: 'Brand Projects', desc: 'Real client projects, portfolio' },
    ],
  },
  {
    slug: 'video-editing', title: 'Video Editing', fullName: 'Professional Video Editing & Production',
    description: 'Master Adobe Premiere Pro, After Effects and CapCut to create cinematic videos.',
    duration: '3 Months', fees: 9000, discountedFees: 7500, icon: '🎬',
    color: 'from-green-500 to-teal-500', category: 'Creative', popular: false, badge: 'Trending',
    topics: ['Premiere Pro', 'After Effects', 'CapCut', 'Color Grading', 'Motion Graphics'],
    roadmap: [
      { week: 'Week 1-2', title: 'Video Editing Basics', desc: 'Timeline, cuts, transitions' },
      { week: 'Week 3-4', title: 'Adobe Premiere Pro', desc: 'Professional video editing' },
      { week: 'Week 5-6', title: 'After Effects', desc: 'Motion graphics, VFX basics' },
      { week: 'Week 7-12', title: 'YouTube & Reels Projects', desc: 'Real content creation' },
    ],
  },
  {
    slug: 'ai-tools', title: 'Learn AI Tools', fullName: 'AI Tools Mastery for Professionals',
    description: 'Learn ChatGPT, Midjourney, and automation tools to supercharge productivity.',
    duration: '2 Months', fees: 6000, discountedFees: 5000, icon: '🤖',
    color: 'from-cyan-500 to-blue-600', category: 'AI & Tech', popular: true, badge: 'Future Ready',
    topics: ['ChatGPT Mastery', 'Prompt Engineering', 'Midjourney', 'Canva AI', 'Automation'],
    roadmap: [
      { week: 'Week 1-2', title: 'AI Fundamentals', desc: 'What is AI, tools overview' },
      { week: 'Week 3-4', title: 'ChatGPT & Prompting', desc: 'Advanced prompt engineering' },
      { week: 'Week 5-6', title: 'AI Image & Design', desc: 'Midjourney, Canva AI, DALL-E' },
      { week: 'Week 7-8', title: 'AI for Business', desc: 'Workflows, productivity, careers' },
    ],
  },
];

const STUDENTS = [
  { name: 'Priya Sharma', email: 'priya@student.com', phone: '9876543001' },
  { name: 'Rahul Verma', email: 'rahul@student.com', phone: '9876543002' },
  { name: 'Anjali Meena', email: 'anjali@student.com', phone: '9876543003' },
  { name: 'Deepak Joshi', email: 'deepak@student.com', phone: '9876543004' },
  { name: 'Sunita Kumari', email: 'sunita@student.com', phone: '9876543005' },
  { name: 'Vikram Singh', email: 'vikram@student.com', phone: '9876543006' },
  { name: 'Pooja Rajput', email: 'pooja@student.com', phone: '9876543007' },
  { name: 'Mohit Sharma', email: 'mohit@student.com', phone: '9876543008' },
  { name: 'Kavita Devi', email: 'kavita@student.com', phone: '9876543009' },
  { name: 'Ravi Gupta', email: 'ravi@student.com', phone: '9876543010' },
];

const TEACHERS = [
  { name: 'Rajesh Kumar', email: 'rajesh@staff.com', phone: '9111111001', qualification: 'B.Tech Computer Science', experience: '5 Years', bio: 'Web Development & Programming expert' },
  { name: 'Meena Sharma', email: 'meena@staff.com', phone: '9111111002', qualification: 'MCA', experience: '4 Years', bio: 'Digital Marketing & Social Media specialist' },
  { name: 'Anil Verma', email: 'anil@staff.com', phone: '9111111003', qualification: 'BCA + Adobe Certified', experience: '6 Years', bio: 'Graphic Design & Video Editing expert' },
];

// ── Main Seed Function ────────────────────────────────────────
async function seed() {
  console.log('\n🌱 Starting database seed...');
  console.log(`📡 Connecting to: ${MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}\n`);

  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB\n');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Course.deleteMany({}),
    Staff.deleteMany({}),
    Enrollment.deleteMany({}),
    Payment.deleteMany({}),
  ]);
  console.log('   Done.\n');

  // ── 1. Create Admin ──────────────────────────────────────
  console.log('👤 Creating admin user...');
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const admin = await User.create({
    name: 'Admin User', email: 'admin@techvidya.in',
    password: adminPassword, role: 'admin', phone: '9876543210',
  });
  console.log(`   Admin: admin@techvidya.in / Admin@123`);

  // ── 2. Create Courses ────────────────────────────────────
  console.log('\n📚 Creating courses...');
  const courses = await Course.insertMany(COURSES_DATA);
  courses.forEach(c => console.log(`   ✓ ${c.title}`));

  // ── 3. Create Teachers ───────────────────────────────────
  console.log('\n👨‍🏫 Creating teachers...');
  const teacherPassword = await bcrypt.hash('Staff@123', 12);
  const teacherUsers = await User.insertMany(
    TEACHERS.map(t => ({ ...t, password: teacherPassword, role: 'staff' }))
  );

  const staffRecords = await Staff.insertMany([
    {
      userId: teacherUsers[0]._id, role: 'teacher',
      assignedCourses: [courses[1]._id, courses[5]._id], // Web Dev + AI Tools
      qualification: TEACHERS[0].qualification, experience: TEACHERS[0].experience,
      bio: TEACHERS[0].bio,
    },
    {
      userId: teacherUsers[1]._id, role: 'teacher',
      assignedCourses: [courses[2]._id], // Digital Marketing
      qualification: TEACHERS[1].qualification, experience: TEACHERS[1].experience,
      bio: TEACHERS[1].bio,
    },
    {
      userId: teacherUsers[2]._id, role: 'teacher',
      assignedCourses: [courses[3]._id, courses[4]._id], // Graphic + Video
      qualification: TEACHERS[2].qualification, experience: TEACHERS[2].experience,
      bio: TEACHERS[2].bio,
    },
  ]);
  console.log(`   Created ${staffRecords.length} teachers`);

  // ── 4. Create Students ───────────────────────────────────
  console.log('\n🎓 Creating students...');
  const studentPassword = await bcrypt.hash('Student@123', 12);
  const students = await User.insertMany(
    STUDENTS.map(s => ({ ...s, password: studentPassword, role: 'student' }))
  );
  console.log(`   Created ${students.length} students`);

  // ── 5. Create Enrollments & Payments ────────────────────
  console.log('\n💳 Creating enrollments and payments...');
  const coursesList = [
    { course: courses[0], progress: 100, status: 'completed', paidFull: true },
    { course: courses[1], progress: 75, status: 'active', paidFull: false },
    { course: courses[2], progress: 40, status: 'active', paidFull: false },
    { course: courses[3], progress: 0, status: 'active', paidFull: false },
    { course: courses[4], progress: 60, status: 'active', paidFull: true },
    { course: courses[5], progress: 90, status: 'active', paidFull: false },
    { course: courses[1], progress: 20, status: 'active', paidFull: false },
    { course: courses[0], progress: 50, status: 'active', paidFull: true },
    { course: courses[2], progress: 80, status: 'active', paidFull: false },
    { course: courses[3], progress: 30, status: 'active', paidFull: false },
  ];

  const enrollments = [];
  const payments = [];

  for (let i = 0; i < students.length; i++) {
    const { course, progress, status, paidFull } = coursesList[i];
    const totalFees = course.discountedFees;
    const paidAmount = paidFull ? totalFees : Math.floor(totalFees * 0.5);
    const pendingAmount = totalFees - paidAmount;

    enrollments.push({
      studentId: students[i]._id, courseId: course._id,
      progress, status,
      enrollDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
    });

    const installments = [{ amount: paidAmount, date: new Date(), method: 'cash', note: 'Seed data', receiptNo: `REC${1000 + i}` }];
    if (!paidFull && Math.random() > 0.5) {
      installments.push({ amount: Math.floor(paidAmount * 0.3), date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), method: 'upi', note: 'Second installment' });
    }

    payments.push({
      studentId: students[i]._id, courseId: course._id,
      totalFees, paidAmount, pendingAmount,
      status: paidFull ? 'paid' : paidAmount > 0 ? 'partial' : 'pending',
      installments,
      admissionDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
    });
  }

  await Enrollment.insertMany(enrollments);
  await Payment.insertMany(payments);
  console.log(`   Created ${enrollments.length} enrollments and ${payments.length} payment records`);

  // ── Summary ──────────────────────────────────────────────
  console.log('\n' + '═'.repeat(50));
  console.log('✅ DATABASE SEEDED SUCCESSFULLY!');
  console.log('═'.repeat(50));
  console.log('📊 Summary:');
  console.log(`   👤 Admin:    1  (admin@techvidya.in / Admin@123)`);
  console.log(`   👨‍🏫 Teachers: ${teacherUsers.length}  (Staff@123)`);
  console.log(`   🎓 Students: ${students.length}  (Student@123)`);
  console.log(`   📚 Courses:  ${courses.length}`);
  console.log(`   📝 Enrollments: ${enrollments.length}`);
  console.log(`   💳 Payments: ${payments.length}`);
  console.log('═'.repeat(50) + '\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
