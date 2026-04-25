'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Power } from 'lucide-react';
import {
  toggleCourseActive,
  toggleStaffStatus,
  toggleStudentStatus,
} from '@/app/actions/adminActions';

interface StatusToggleButtonProps {
  entity: 'student' | 'course' | 'staff';
  entityId: string;
  isActive: boolean;
  compact?: boolean;
}

export default function StatusToggleButton({
  entity,
  entityId,
  isActive,
  compact = false,
}: StatusToggleButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const labels = {
    student: isActive ? 'Suspend' : 'Activate',
    course: isActive ? 'Move to Draft' : 'Activate',
    staff: isActive ? 'Deactivate' : 'Activate',
  };

  function handleClick() {
    startTransition(async () => {
      const result =
        entity === 'student'
          ? await toggleStudentStatus(entityId, !isActive)
          : entity === 'staff'
            ? await toggleStaffStatus(entityId, !isActive)
            : await toggleCourseActive(entityId, isActive);

      if (!result.success) {
        toast.error(result.error || 'Unable to update status.');
        return;
      }

      toast.success(result.message || 'Status updated.');
      router.refresh();
    });
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={`p-2 rounded-lg transition-colors ${
          isActive
            ? 'hover:bg-red-500/10 text-slate-400 hover:text-red-400'
            : 'hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400'
        }`}
        title={labels[entity]}
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Power className="w-4 h-4" />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
        isActive
          ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
          : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
      }`}
    >
      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Power className="w-4 h-4" />}
      {labels[entity]}
    </button>
  );
}
