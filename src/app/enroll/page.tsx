import { redirect } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import EnrollmentRequestForm from '@/components/public/EnrollmentRequestForm';
import AnimatedSection from '@/components/public/AnimatedSection';

interface Props {
  searchParams: Promise<{ courseId?: string }>;
}

export default async function EnrollmentPage({ searchParams }: Props) {
  await dbConnect();

  const { courseId } = await searchParams;

  // If courseId is provided, fetch that specific course
  let selectedCourseRaw = null;
  let selectedCourse = null;
  if (courseId) {
    selectedCourseRaw = await Course.findById(courseId).select(
      'title slug discountedFees fees'
    ).lean();

    if (!selectedCourseRaw) {
      redirect('/courses');
    }
    selectedCourse = {
      ...selectedCourseRaw,
      _id: selectedCourseRaw._id.toString()
    };
  }

  // Fetch all active courses for the dropdown
  const courses = await Course.find({ isActive: true })
    .select('_id title slug discountedFees fees')
    .sort({ title: 1 })
    .lean();

  return (
    <>
      <section className="page-hero relative pb-16 grid-bg min-h-[calc(100vh-300px)]">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 to-cyan-900/5 pointer-events-none" />

        <div className="container-custom relative z-10 max-w-xl">
          <AnimatedSection variant="fadeInUp" className="text-center mb-10">
            <div className="badge mb-4">Start Learning</div>
            <h1 className="section-title mb-4">
              <span className="gradient-text">Enrollment</span> Request
            </h1>
            <p className="text-slate-400 max-w-xl" style={{ marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}>
              Submit your details. Our admin team will review and approve your request shortly.
            </p>
          </AnimatedSection>

          <AnimatedSection variant="scaleIn" delay={0.2} className="glass-card p-6 sm:p-10 shadow-2xl border-indigo-500/20">
            <EnrollmentRequestForm
              selectedCourse={selectedCourse}
              courses={courses.map((c: any) => ({
                _id: c._id.toString(),
                title: c.title,
                slug: c.slug,
                discountedFees: c.discountedFees,
                fees: c.fees,
              }))}
            />
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
