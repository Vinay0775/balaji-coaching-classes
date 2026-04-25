'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { ArrowLeft, Loader2, Info } from 'lucide-react';
import { updatePaymentAdmin } from '@/app/actions/adminActions';
import { formatCurrency } from '@/lib/utils';

interface PaymentEditFormProps {
  payment: {
    id: string;
    studentId: string;
    courseId: string;
    totalFees: number;
    paidAmount: number;
    pendingAmount: number;
    admissionDate: string;
  };
  students: { id: string; name: string; email: string }[];
  courses: { id: string; title: string }[];
}

const labelClassName = "text-[13px] font-medium text-slate-400 mb-1.5";
const inputClassName = "w-full bg-[#111827] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors";

export function PaymentEditForm({ payment, students, courses }: PaymentEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await updatePaymentAdmin(payment.id, formData);

    setLoading(false);

    if (!result.success) {
      toast.error(result.error || 'Unable to update payment record.');
      return;
    }

    toast.success(result.message || 'Successfully saved');
    router.push(`/admin/payments/${payment.id}`);
    router.refresh();
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-6">
        <Link
          href={`/admin/payments/${payment.id}`}
          className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Payment
        </Link>
        <h1 className="text-[28px] font-semibold text-white tracking-tight">
          Edit Payment Record
        </h1>
        <p className="text-base text-slate-400 mt-1">
          Correct the linked student/course or update the total fee structure.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-5 mb-6">
        <div className="p-5 border border-white/10 rounded-xl bg-[#0a0f1d]">
          <div className="text-[13px] font-medium text-slate-400 mb-1">Total Fees</div>
          <div className="text-2xl font-bold text-white">{formatCurrency(payment.totalFees)}</div>
        </div>
        <div className="p-5 border border-white/10 rounded-xl bg-[#0a0f1d]">
          <div className="text-[13px] font-medium text-emerald-500/80 mb-1">Collected</div>
          <div className="text-2xl font-bold text-emerald-400">{formatCurrency(payment.paidAmount)}</div>
        </div>
        <div className="p-5 border border-white/10 rounded-xl bg-[#0a0f1d]">
          <div className="text-[13px] font-medium text-rose-500/80 mb-1">Pending</div>
          <div className="text-2xl font-bold text-rose-400">{formatCurrency(payment.pendingAmount)}</div>
        </div>
      </div>

      <div className="p-6 bg-[#0a0f1d] border border-white/10 rounded-2xl shadow-sm">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col">
            <label className={labelClassName}>Student</label>
            <select name="studentId" defaultValue={payment.studentId} required className={inputClassName}>
              {students.map((student) => (
                <option key={student.id} value={student.id} className="bg-[#0f172a]">
                  {student.name} ({student.email})
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-col">
            <label className={labelClassName}>Course</label>
            <select name="courseId" defaultValue={payment.courseId} required className={inputClassName}>
              {courses.map((course) => (
                <option key={course.id} value={course.id} className="bg-[#0f172a]">
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className={labelClassName}>Total Fees</label>
            <input
              name="totalFees"
              type="number"
              min={payment.paidAmount}
              required
              defaultValue={payment.totalFees}
              className={inputClassName}
            />
          </div>
          
          <div className="flex flex-col">
            <label className={labelClassName}>Admission Date</label>
            <input
              name="admissionDate"
              type="date"
              required
              defaultValue={payment.admissionDate}
              className={inputClassName}
            />
          </div>

          <div className="col-span-full p-4 border border-indigo-500/20 bg-indigo-500/5 rounded-xl flex items-start gap-3 mt-2">
            <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-indigo-300">Preserved Installments</h3>
              <p className="text-xs text-indigo-200/70 mt-1">
                Installments are preserved automatically. If you need to collect another payment, use the
                record payment flow from the detail page.
              </p>
            </div>
          </div>

          <div className="col-span-full flex items-center justify-end gap-3 mt-6 pt-6 border-t border-white/10">
            <Link href={`/admin/payments/${payment.id}`} className="bg-transparent border border-white/10 hover:bg-white/5 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Cancel
            </Link>
            <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
