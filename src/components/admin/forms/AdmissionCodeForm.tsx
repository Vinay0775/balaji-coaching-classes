'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { ArrowLeft, Loader2, Copy } from 'lucide-react';
import { createAdmissionCodeAdmin } from '@/app/actions/adminActions';

interface AdmissionCodeFormProps {
  courses: { _id: string; title: string }[];
}

const labelClassName = "text-[13px] font-medium text-slate-400 mb-1.5";
const inputClassName = "w-full bg-[#111827] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors";

export function AdmissionCodeForm({ courses }: AdmissionCodeFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setGeneratedCode(null);

    const formData = new FormData(event.currentTarget);
    const result = await createAdmissionCodeAdmin(formData);

    setLoading(false);

    if (!result.success) {
      toast.error(result.error || 'Unable to generate code.');
      return;
    }

    toast.success(result.message || 'Code generated successfully');
    if (result.code) {
      setGeneratedCode(result.code);
      event.currentTarget.reset();
    }
  }

  const copyToClipboard = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      toast.success('Code copied to clipboard!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/students"
          className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Students
        </Link>
        <h1 className="text-[28px] font-semibold text-white tracking-tight">
          New Student Registration (Offline)
        </h1>
        <p className="text-base text-slate-400 mt-1">
          Generate a unique enrollment code for a student. The student will use this code to create their account on the website.
        </p>
      </div>

      {generatedCode && (
        <div className="mb-8 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
          <div>
            <h3 className="text-emerald-400 font-bold mb-1">Code Generated Successfully!</h3>
            <p className="text-sm text-emerald-200/70">Share this code with the student so they can register online.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-[#0a0f1d] px-4 py-2 rounded-lg font-mono text-xl font-bold text-white border border-white/10 tracking-widest">
              {generatedCode}
            </div>
            <button
              onClick={copyToClipboard}
              className="p-2.5 bg-[#0a0f1d] hover:bg-white/5 border border-white/10 rounded-lg text-slate-300 hover:text-white transition-colors"
              title="Copy Code"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Form Card */}
      <div className="p-6 bg-[#0a0f1d] border border-white/10 rounded-2xl shadow-sm">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          <div className="flex flex-col">
            <label className={labelClassName}>Student Full Name *</label>
            <input
              name="name"
              type="text"
              required
              placeholder="e.g. Ramesh Kumar"
              className={inputClassName}
            />
          </div>

          <div className="flex flex-col">
            <label className={labelClassName}>Mobile Number *</label>
            <input
              name="phone"
              type="tel"
              required
              placeholder="10-digit number"
              className={inputClassName}
            />
          </div>

          <div className="flex flex-col">
            <label className={labelClassName}>Course *</label>
            <select name="courseId" required className={inputClassName}>
              <option value="">Select a course...</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id} className="bg-[#0f172a]">
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className={labelClassName}>Custom Code (Optional)</label>
            <input
              name="code"
              type="text"
              placeholder="Leave blank to auto-generate"
              className={inputClassName}
            />
            <p className="text-xs text-slate-500 mt-1.5">
              Enter a specific code or leave empty and the system will generate one.
            </p>
          </div>

          <div className="col-span-full flex items-center justify-end gap-3 mt-6 pt-6 border-t border-white/10">
            <Link
              href="/admin/students"
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
              Generate Registration Code
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
