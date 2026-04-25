'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { createStaffAdmin, updateStaffAdmin } from '@/app/actions/adminActions';

interface StaffFormProps {
  mode: 'create' | 'edit';
  courses: { id: string; title: string }[];
  staff?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    qualification: string;
    experience: string;
    bio?: string;
    salary?: number;
    joinDate: string;
    isActive: boolean;
    assignedCourses: string[];
  };
}

const labelClassName = "text-[13px] font-medium text-slate-400 mb-1.5";
const inputClassName = "w-full bg-[#111827] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors";

export function StaffForm({ mode, courses, staff }: StaffFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result =
      mode === 'create'
        ? await createStaffAdmin(formData)
        : await updateStaffAdmin(staff!.id, formData);

    setLoading(false);

    if (!result.success) {
      toast.error(result.error || 'Unable to save staff member.');
      return;
    }

    toast.success(result.message || 'Successfully saved');
    router.push('/admin/staff');
    router.refresh();
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/staff"
          className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Staff
        </Link>
        <h1 className="text-[28px] font-semibold text-white tracking-tight">
          {mode === 'create' ? 'Add Staff Member' : 'Edit Staff Member'}
        </h1>
        <p className="text-base text-slate-400 mt-1">
          Manage team roles, login access, and assigned courses.
        </p>
      </div>

      {/* Form Card */}
      <div className="p-6 bg-[#0a0f1d] border border-white/10 rounded-2xl shadow-sm">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Full Name */}
          <div className="flex flex-col">
            <label className={labelClassName}>Full Name</label>
            <input name="name" required defaultValue={staff?.name} placeholder="Staff Name" className={inputClassName} />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className={labelClassName}>Email Address</label>
            <input name="email" type="email" required defaultValue={staff?.email} placeholder="staff@institute.com" className={inputClassName} />
          </div>

          {/* Phone */}
          <div className="flex flex-col">
            <label className={labelClassName}>Phone Number</label>
            <input name="phone" defaultValue={staff?.phone} placeholder="10-digit number" className={inputClassName} />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className={labelClassName}>{mode === 'create' ? 'Temporary Password' : 'Reset Password'}</label>
            <input
              name="password"
              type="text"
              required={mode === 'create'}
              defaultValue={mode === 'create' ? 'Staff@123' : undefined}
              placeholder={mode === 'edit' ? 'Leave blank to keep current' : ''}
              className={inputClassName}
            />
            <p className="text-xs text-slate-500 mt-1.5">
              {mode === 'create' ? 'Default login password: Staff@123' : 'Only fill this to reset their password.'}
            </p>
          </div>

          {/* Role */}
          <div className="flex flex-col">
            <label className={labelClassName}>Role</label>
            <select name="role" required defaultValue={staff?.role || 'teacher'} className={inputClassName}>
              <option value="teacher" className="bg-[#0f172a]">Teacher</option>
              <option value="coordinator" className="bg-[#0f172a]">Coordinator</option>
              <option value="receptionist" className="bg-[#0f172a]">Receptionist</option>
              <option value="manager" className="bg-[#0f172a]">Manager</option>
            </select>
          </div>

          {/* Qualification */}
          <div className="flex flex-col">
            <label className={labelClassName}>Qualification</label>
            <input name="qualification" required defaultValue={staff?.qualification} placeholder="e.g. MCA, B.Tech" className={inputClassName} />
          </div>

          {/* Experience */}
          <div className="flex flex-col">
            <label className={labelClassName}>Experience</label>
            <input name="experience" required defaultValue={staff?.experience} placeholder="e.g. 5 Years" className={inputClassName} />
          </div>

          {/* Salary */}
          <div className="flex flex-col">
            <label className={labelClassName}>Salary</label>
            <input name="salary" type="number" min="0" defaultValue={staff?.salary} placeholder="Monthly Salary" className={inputClassName} />
          </div>

          {/* Join Date */}
          <div className="flex flex-col">
            <label className={labelClassName}>Join Date</label>
            <input
              name="joinDate"
              type="date"
              required
              defaultValue={staff?.joinDate}
              className={inputClassName}
            />
          </div>

          {/* Bio */}
          <div className="col-span-full flex flex-col mt-2">
            <label className={labelClassName}>Bio / Notes</label>
            <textarea
              name="bio"
              rows={4}
              defaultValue={staff?.bio}
              placeholder="Teaching expertise, responsibilities, or management notes."
              className={`${inputClassName} resize-none`}
            />
          </div>

          {/* Assigned Courses */}
          <div className="col-span-full mt-4">
            <label className="text-[14px] font-semibold text-white mb-1 block">Assigned Courses</label>
            <p className="text-xs text-slate-500 mb-4">
              Select the courses this staff member manages or teaches.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {courses.map((course) => (
                <label
                  key={course.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-[#111827] hover:bg-white/5 transition-all cursor-pointer group"
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      name="assignedCourses"
                      type="checkbox"
                      value={course.id}
                      defaultChecked={staff?.assignedCourses.includes(course.id)}
                      className="peer w-4 h-4 appearance-none rounded border border-white/20 checked:border-indigo-500 checked:bg-indigo-500 transition-all cursor-pointer"
                    />
                    <CheckCircle className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{course.title}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="col-span-full flex items-center justify-between py-4 border-t border-white/10 mt-6">
            <div>
              <div className="text-sm font-bold text-white">Account Status</div>
              <p className="text-xs text-slate-500 mt-1">
                Active staff can log in and access the dashboard.
              </p>
            </div>
            <label className="relative flex cursor-pointer items-center">
              <input
                name="isActive"
                type="checkbox"
                defaultChecked={staff ? staff.isActive : true}
                className="peer sr-only"
              />
              <div className="h-6 w-11 rounded-full bg-slate-800 peer-checked:bg-indigo-600 transition-colors" />
              <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
            </label>
          </div>

          {/* Actions */}
          <div className="col-span-full flex items-center justify-end gap-3 mt-2 pt-6 border-t border-white/10">
            <Link
              href="/admin/staff"
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
              {mode === 'create' ? 'Create Staff' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
