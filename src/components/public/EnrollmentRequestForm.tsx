'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { ArrowRight, CheckCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { submitEnrollmentRequest } from '@/app/actions/adminActions';
import { formatCurrency } from '@/lib/utils';

interface Course {
  _id: string;
  title: string;
  slug: string;
  discountedFees: number;
  fees: number;
}

interface Props {
  selectedCourse: Course | null;
  courses: Course[];
}

export default function EnrollmentRequestForm({ selectedCourse, courses }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    courseId: selectedCourse?._id || '',
    registrationCode: '',
  });
  const [selectedCourseDetails, setSelectedCourseDetails] = useState<Course | null>(selectedCourse);

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const courseId = e.target.value;
    const course = courses.find((item) => item._id === courseId) || null;
    setSelectedCourseDetails(course);
    setFormData({ ...formData, courseId });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.courseId) {
      setError('Please select a course.');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('email', formData.email);
      fd.append('password', formData.password);
      fd.append('phone', formData.phone);
      fd.append('courseId', formData.courseId);
      fd.append('registrationCode', formData.registrationCode);

      const result = await submitEnrollmentRequest(fd);

      if (result.success) {
        setSuccess(true);
        
        // Auto-login after successful enrollment
        const signInResult = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (!signInResult?.error) {
          router.push('/dashboard');
          router.refresh();
        } else {
          // Fallback if login fails
          setFormData({ name: '', email: '', phone: '', password: '', confirmPassword: '', courseId: '', registrationCode: '' });
          setSelectedCourseDetails(null);
          setTimeout(() => router.push('/login'), 3000);
        }
      } else {
        setError(result.error || 'Failed to submit request.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/35 bg-emerald-500/15">
          <CheckCircle className="h-10 w-10 text-emerald-400" />
        </div>
        <h3 className="mb-3 text-2xl font-bold text-white">Enrollment Successful!</h3>
        <p className="mx-auto mb-6 max-w-sm text-slate-400">
          Aapka account create ho gaya hai. Hum aapko dashboard par le jaa rahe hain...
        </p>
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-400/10 px-4 py-2 text-sm font-medium text-amber-200">
          <Loader2 className="h-4 w-4 animate-spin" /> Redirecting to dashboard...
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error ? <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm font-medium text-rose-300">{error}</div> : null}

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">Select Course *</label>
        <select
          value={formData.courseId}
          onChange={handleCourseChange}
          required
          className="w-full rounded-2xl border border-white/10 bg-[#091425] px-4 py-3.5 text-white focus:border-amber-300/35 focus:outline-none"
        >
          <option value="">Choose a course...</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title} ({formatCurrency(course.discountedFees || course.fees)})
            </option>
          ))}
        </select>
      </div>

      {selectedCourseDetails ? (
        <div className="rounded-2xl border border-amber-300/18 bg-[linear-gradient(135deg,rgba(245,158,11,0.12),rgba(14,165,166,0.08))] p-4">
          <div className="font-bold text-white">{selectedCourseDetails.title}</div>
          <div className="mt-1 text-sm text-slate-300">
            Course fee: <span className="font-bold text-emerald-300">{formatCurrency(selectedCourseDetails.discountedFees || selectedCourseDetails.fees)}</span>
          </div>
        </div>
      ) : null}

      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-300">
          Full Name *
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full rounded-2xl border border-white/10 bg-[#091425] px-4 py-3.5 text-white placeholder:text-slate-600 focus:border-amber-300/35 focus:outline-none"
          placeholder="e.g. John Doe"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-300">
          Email Address *
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="w-full rounded-2xl border border-white/10 bg-[#091425] px-4 py-3.5 text-white placeholder:text-slate-600 focus:border-amber-300/35 focus:outline-none"
          placeholder="e.g. john@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-300">
          Create Password *
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            minLength={6}
            className="w-full rounded-2xl border border-white/10 bg-[#091425] px-4 py-3.5 pr-12 text-white placeholder:text-slate-600 focus:border-amber-300/35 focus:outline-none"
            placeholder="Minimum 6 characters"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-slate-300">
          Confirm Password *
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
            minLength={6}
            className="w-full rounded-2xl border border-white/10 bg-[#091425] px-4 py-3.5 pr-12 text-white placeholder:text-slate-600 focus:border-amber-300/35 focus:outline-none"
            placeholder="Re-enter password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="mb-2 block text-sm font-medium text-slate-300">
          Phone Number *
        </label>
        <input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
          className="w-full rounded-2xl border border-white/10 bg-[#091425] px-4 py-3.5 text-white placeholder:text-slate-600 focus:border-amber-300/35 focus:outline-none"
          placeholder="e.g. 9876543210"
        />
      </div>

      <div>
        <label htmlFor="registrationCode" className="mb-2 block text-sm font-medium text-slate-300">
          Unique Enrollment Code *
        </label>
        <input
          id="registrationCode"
          type="text"
          value={formData.registrationCode}
          onChange={(e) => setFormData({ ...formData, registrationCode: e.target.value })}
          className="w-full rounded-2xl border border-white/10 bg-[#091425] px-4 py-3.5 text-white placeholder:text-slate-600 focus:border-amber-300/35 focus:outline-none"
          placeholder="e.g. BALAJI2026"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full justify-center py-4 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Submitting Request...
          </>
        ) : (
          <>
            Submit Enrollment Request <ArrowRight className="h-5 w-5" />
          </>
        )}
      </button>

      <p className="text-center text-xs leading-6 text-slate-500">
        By submitting this form, your request goes to the admin team for review and account approval.
      </p>
    </form>
  );
}
