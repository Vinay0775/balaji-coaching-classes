'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { recordPayment } from '@/app/actions/adminActions';
import { Loader2, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function RecordPaymentForm({
  students,
  courses,
  prefillStudent,
  prefillCourse
}: {
  students: { id: string; name: string; email: string }[];
  courses: { id: string; title: string; fees: number }[];
  prefillStudent?: string;
  prefillCourse?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(prefillCourse || '');

  const [receiptUrl, setReceiptUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setReceiptUrl(data.url);
        toast.success('Receipt uploaded successfully');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error('Failed to upload receipt');
    } finally {
      setIsUploading(false);
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    if (receiptUrl) {
      formData.append('receiptUrl', receiptUrl);
    }

    const res = await recordPayment(formData);

    setLoading(false);

    if (res.success) {
      toast.success(res.message || 'Payment recorded successfully');
      router.push('/admin/payments');
    } else {
      toast.error(res.error || 'Failed to record payment');
    }
  }

  const labelClassName = "text-[13px] font-medium text-slate-400 mb-1.5";
  const inputClassName = "w-full bg-[#111827] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors";

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-[28px] font-semibold text-white tracking-tight">
          Record Offline Fee
        </h1>
        <p className="text-base text-slate-400 mt-1">
          Manually log a cash or UPI payment received at the center.
        </p>
      </div>

      <div className="p-6 bg-[#0a0f1d] border border-white/10 rounded-2xl shadow-sm">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col">
            <label className={labelClassName}>Select Student</label>
            <select name="studentId" defaultValue={prefillStudent} required className={inputClassName}>
              <option value="" className="bg-[#0f172a]">-- Choose Student --</option>
              {students.map(s => <option key={s.id} value={s.id} className="bg-[#0f172a]">{s.name} ({s.email})</option>)}
            </select>
          </div>
          <div className="flex flex-col">
            <label className={labelClassName}>Select Course</label>
            <select name="courseId" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} required className={inputClassName}>
              <option value="" className="bg-[#0f172a]">-- Choose Course --</option>
              {courses.map(c => <option key={c.id} value={c.id} className="bg-[#0f172a]">{c.title} (₹{c.fees})</option>)}
            </select>
          </div>

          <div className="flex flex-col">
            <label className={labelClassName}>Received Amount (₹)</label>
            <input name="amount" type="number" min="1" required placeholder="e.g. 5000" className={inputClassName} />
          </div>
          <div className="flex flex-col">
            <label className={labelClassName}>Payment Method</label>
            <select name="method" required defaultValue="cash" className={inputClassName}>
              <option value="cash" className="bg-[#0f172a]">Cash</option>
              <option value="upi" className="bg-[#0f172a]">UPI / Scanner</option>
              <option value="bank_transfer" className="bg-[#0f172a]">Bank Transfer / NEFT</option>
              <option value="card" className="bg-[#0f172a]">Credit/Debit Card</option>
            </select>
          </div>

          <div className="col-span-full flex flex-col">
            <label className={labelClassName}>Upload Fee Receipt (Optional)</label>
            <div className="flex items-center gap-4">
              <label className="flex-1 border-2 border-dashed border-white/10 rounded-lg p-4 text-center cursor-pointer hover:bg-white/5 transition-colors relative">
                {isUploading ? (
                  <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                  </div>
                ) : receiptUrl ? (
                  <div className="text-emerald-400 text-sm font-medium">✅ Receipt Uploaded</div>
                ) : (
                  <div className="text-slate-400 text-sm">Click to browse image or PDF</div>
                )}
                <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileUpload} disabled={isUploading} />
              </label>
              {receiptUrl && (
                <button type="button" onClick={() => setReceiptUrl('')} className="bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Remove
                </button>
              )}
            </div>
          </div>

          <div className="col-span-full p-4 border border-indigo-500/20 bg-indigo-500/5 rounded-xl flex items-start gap-3 mt-2">
            <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-indigo-300">Important Note</h3>
              <p className="text-xs text-indigo-200/70 mt-1">
                The amount entered here will be added to the student's Total Paid amount. If they are paying the final installment, their status will automatically be updated to 'Fully Paid'.
              </p>
            </div>
          </div>

          <div className="col-span-full flex items-center justify-end gap-3 mt-6 pt-6 border-t border-white/10">
            <Link href="/admin/payments" className="bg-transparent border border-white/10 hover:bg-white/5 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Cancel
            </Link>
            <button type="submit" disabled={loading || isUploading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Confirm Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
