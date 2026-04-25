'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { addStudentAdmin, updateStudentAdmin } from '@/app/actions/adminActions';

interface StudentFormProps {
  mode: 'create' | 'edit';
  student?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    isActive: boolean;
  };
}

const labelClassName = "text-[13px] font-medium text-slate-400 mb-1.5";
const inputClassName = "w-full bg-[#111827] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors";

export function StudentForm({ mode, student }: StudentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result =
      mode === 'create'
        ? await addStudentAdmin(formData)
        : await updateStudentAdmin(student!.id, formData);

    setLoading(false);

    if (!result.success) {
      toast.error(result.error || 'Unable to save student details.');
      return;
    }

    toast.success(result.message || 'Successfully saved');
    router.push(mode === 'create' ? '/admin/students' : `/admin/students/${student!.id}`);
    router.refresh();
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href={mode === 'create' ? '/admin/students' : `/admin/students/${student?.id}`}
          className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Link>
        <h1 className="text-[28px] font-semibold text-white tracking-tight">
          {mode === 'create' ? 'Add Student' : 'Edit Student'}
        </h1>
        <p className="text-base text-slate-400 mt-1">
          {mode === 'create'
            ? 'Create a new student account manually.'
            : 'Update contact, login, and account status for this student.'}
        </p>
      </div>

      {/* Form Card */}
      <div className="p-6 bg-[#0a0f1d] border border-white/10 rounded-2xl shadow-sm">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Full Name */}
          <div className="flex flex-col">
            <label className={labelClassName}>Full Name</label>
            <input
              name="name"
              type="text"
              required
              defaultValue={student?.name}
              placeholder="Student Name"
              className={inputClassName}
            />
          </div>

          {/* Email Address */}
          <div className="flex flex-col">
            <label className={labelClassName}>Email Address</label>
            <input
              name="email"
              type="email"
              required
              defaultValue={student?.email}
              placeholder="student@example.com"
              className={inputClassName}
            />
          </div>

          {/* Phone Number */}
          <div className="flex flex-col">
            <label className={labelClassName}>Phone Number</label>
            <input
              name="phone"
              type="tel"
              defaultValue={student?.phone}
              placeholder="10-digit number"
              className={inputClassName}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className={labelClassName}>
              {mode === 'create' ? 'Temporary Password' : 'Reset Password'}
            </label>
            <input
              name="password"
              type="text"
              required={mode === 'create'}
              defaultValue={mode === 'create' ? 'Student@123' : undefined}
              placeholder={mode === 'edit' ? 'Leave blank to keep current' : ''}
              className={inputClassName}
            />
            <p className="text-xs text-slate-500 mt-1.5">
              {mode === 'create'
                ? 'Default login password: Student@123'
                : 'Only fill this if they forgot their password.'}
            </p>
          </div>

          {mode === 'edit' && (
            <div className="col-span-full flex items-center justify-between py-4 border-t border-white/10 mt-2">
              <div>
                <div className="text-sm font-bold text-white">Account Status</div>
                <p className="text-xs text-slate-500 mt-1">
                  Active accounts can log in and access courses.
                </p>
              </div>
              <label className="relative flex cursor-pointer items-center">
                <input
                  name="isActive"
                  type="checkbox"
                  defaultChecked={student ? student.isActive : true}
                  className="peer sr-only"
                />
                <div className="h-6 w-11 rounded-full bg-slate-800 peer-checked:bg-indigo-600 transition-colors" />
                <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
              </label>
            </div>
          )}

          <div className="col-span-full flex items-center justify-end gap-3 mt-6 pt-6 border-t border-white/10">
            <Link
              href={mode === 'create' ? '/admin/students' : `/admin/students/${student?.id}`}
              className="bg-transparent border border-white/10 hover:bg-white/5 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </Link>
            <button 
              type="submit" 
              disabled={loading} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'create' ? 'Create Student' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
