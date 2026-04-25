import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Staff from '@/models/Staff';
import Link from 'next/link';
import { Plus, BookOpen, Briefcase, Edit3, Users } from 'lucide-react';
import StatusToggleButton from '@/components/admin/StatusToggleButton';

type StaffMemberRecord = {
  _id: { toString(): string };
  role: 'teacher' | 'coordinator' | 'receptionist' | 'manager';
  qualification: string;
  joinDate: Date | string;
  isActive: boolean;
  userId?: {
    name?: string;
    email?: string;
    phone?: string;
  } | null;
  assignedCourses?: Array<{ title: string }>;
};

const ROLE_COLORS = {
  teacher: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  coordinator: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  receptionist: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  manager: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

const ROLE_LABELS = {
  teacher: 'Teacher',
  coordinator: 'Coordinator',
  receptionist: 'Receptionist',
  manager: 'Manager',
};

export default async function StaffPage() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session || role !== 'admin') redirect('/login');

  await dbConnect();

  const staffMembers = await Staff.find()
    .populate('userId', 'name email phone photo')
    .populate('assignedCourses', 'title')
    .sort({ createdAt: -1 })
    .lean<StaffMemberRecord[]>();

  const totalStaff = staffMembers.length;
  const activeStaff = staffMembers.filter((staffMember) => staffMember.isActive).length;
  const teachers = staffMembers.filter((staffMember) => staffMember.role === 'teacher').length;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-semibold text-white tracking-tight">
            Staff Management
          </h1>
          <p className="text-base text-slate-400 mt-1">
            Manage teachers, coordinators, and admin staff.
          </p>
        </div>
        <Link href="/admin/staff/new" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 w-fit">
          <Plus className="w-4 h-4" /> Add Staff Member
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#0a0f1d] border border-white/10 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-white mb-1">{totalStaff}</div>
          <div className="text-slate-400 text-sm">Total Staff Members</div>
        </div>

        <div className="bg-[#0a0f1d] border border-white/10 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-white mb-1">{activeStaff}</div>
          <div className="text-slate-400 text-sm">Active Members</div>
        </div>

        <div className="bg-[#0a0f1d] border border-white/10 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-white mb-1">{teachers}</div>
          <div className="text-slate-400 text-sm">Teachers</div>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffMembers.length === 0 ? (
          <div className="col-span-full bg-[#0a0f1d] border border-white/10 rounded-2xl p-12 text-center">
            <Users className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <div className="text-slate-400 text-sm font-medium mb-2">No staff members added yet.</div>
            <Link href="/admin/staff/new" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium inline-block transition-colors">
              Add the first staff member →
            </Link>
          </div>
        ) : (
          staffMembers.map((staff) => (
            <div
              key={staff._id.toString()}
              className="bg-[#0a0f1d] border border-white/10 rounded-xl overflow-hidden flex flex-col group hover:border-white/20 transition-colors shadow-sm"
            >
              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-base font-medium text-white mb-0.5">
                      {staff.userId?.name || 'Unknown Staff'}
                    </h3>
                    <p className="text-sm text-slate-500">{staff.userId?.email || 'N/A'}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-medium uppercase tracking-wider border ${ROLE_COLORS[staff.role as keyof typeof ROLE_COLORS]}`}>
                    {ROLE_LABELS[staff.role as keyof typeof ROLE_LABELS]}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-slate-400 mb-4 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">📞</span> {staff.userId?.phone || 'No phone'}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">🎓</span> {staff.qualification}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">📅</span> Join:{' '}
                    {new Date(staff.joinDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                </div>

                {/* Assigned Courses */}
                {staff.assignedCourses && staff.assignedCourses.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs font-medium text-slate-500 mb-2">Assigned Courses</div>
                    <div className="flex flex-wrap gap-1.5">
                      {staff.assignedCourses.map((course) => (
                        <span
                          key={course.title}
                          className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#111827] text-slate-300 border border-white/10"
                        >
                          {course.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status */}
                <div className="pt-4 border-t border-white/10">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium border ${
                      staff.isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${staff.isActive ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                    {staff.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="px-5 py-3 bg-[#111827] border-t border-white/10 flex items-center gap-2">
                <Link
                  href={`/admin/staff/${staff._id}/edit`}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition-colors"
                >
                  <Edit3 className="w-4 h-4" /> Edit
                </Link>
                <div className="bg-white/5 p-1 rounded-lg">
                  <StatusToggleButton entity="staff" entityId={staff._id.toString()} isActive={staff.isActive} compact />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
