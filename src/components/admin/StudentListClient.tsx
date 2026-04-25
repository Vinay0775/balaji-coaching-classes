'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  Edit,
  Eye,
  FilterX,
  Mail,
  Phone,
  Plus,
  Search,
  Shield,
  User as UserIcon,
  MoreVertical
} from 'lucide-react';
import StatusToggleButton from '@/components/admin/StatusToggleButton';

interface Student {
  _id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  isActive: boolean;
}

interface StudentListProps {
  students: Student[];
}

export function StudentListClient({ students }: StudentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date'>('date');

  const filteredStudents = useMemo(() => {
    return [...students]
      .filter((student) => {
        const matchesSearch =
          !searchTerm ||
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.phone?.includes(searchTerm);

        const matchesStatus =
          filterStatus === 'all' ||
          (filterStatus === 'active' && student.isActive) ||
          (filterStatus === 'suspended' && !student.isActive);

        return matchesSearch && matchesStatus;
      })
      .sort((left, right) =>
        sortBy === 'name'
          ? left.name.localeCompare(right.name)
          : new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
      );
  }, [filterStatus, searchTerm, sortBy, students]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-semibold text-white tracking-tight">
            Student Directory
          </h1>
          <p className="text-base text-slate-400 mt-1">
            Access and manage all {filteredStudents.length} student profiles.
          </p>
        </div>
        <Link href="/admin/students/new" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 w-fit">
          <Plus className="w-4 h-4" /> New Registration
        </Link>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative group">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full bg-[#111827] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(event) => setFilterStatus(event.target.value as 'all' | 'active' | 'suspended')}
          className="w-full md:w-48 bg-[#111827] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
        >
          <option value="all">All Profiles</option>
          <option value="active">Active Members</option>
          <option value="suspended">Suspended Accounts</option>
        </select>

        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value as 'name' | 'date')}
          className="w-full md:w-48 bg-[#111827] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
        >
          <option value="date">Admission Date (Newest)</option>
          <option value="name">Alphabetical (A-Z)</option>
        </select>

        {(searchTerm || filterStatus !== 'all') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterStatus('all');
            }}
            className="bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg px-3 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <FilterX className="w-4 h-4" /> Reset
          </button>
        )}
      </div>

      {/* Main Content Area */}
      {filteredStudents.length === 0 ? (
        <div className="bg-[#0a0f1d] border border-white/10 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
             <UserIcon className="w-8 h-8 text-slate-500" />
          </div>
          <p className="text-slate-400 text-sm font-medium max-w-xs mx-auto">
            {searchTerm || filterStatus !== 'all'
              ? 'No matches found for your current filters.'
              : 'The student directory is currently empty.'}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Card Layout */}
          <div className="grid gap-4 md:hidden">
            {filteredStudents.map((student) => (
              <div key={student._id} className="bg-[#0a0f1d] border border-white/10 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                        {student.name[0]}
                      </div>
                      <div className="min-w-0">
                         <div className="text-white font-medium text-sm truncate">{student.name}</div>
                         <div className="text-xs text-slate-500 mt-0.5">ID: {student._id.slice(-6)}</div>
                      </div>
                   </div>
                   <div className={`px-2 py-1 rounded text-xs font-medium border ${
                      student.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                   }`}>
                     {student.isActive ? 'Active' : 'Suspended'}
                   </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/10">
                   <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Mail className="w-3.5 h-3.5" />
                      <span className="truncate">{student.email}</span>
                   </div>
                   <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{student.phone || 'N/A'}</span>
                   </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Link href={`/admin/students/${student._id}`} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg py-2 text-white text-center text-xs font-medium transition-colors">
                    View
                  </Link>
                  <Link href={`/admin/students/${student._id}/edit`} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg py-2 text-white text-center text-xs font-medium transition-colors">
                    Edit
                  </Link>
                  <StatusToggleButton entity="student" entityId={student._id} isActive={student.isActive} compact />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden md:block bg-[#0a0f1d] border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#111827] text-slate-400 text-xs font-medium border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 font-medium">Identity</th>
                    <th className="px-6 py-4 font-medium">Communication</th>
                    <th className="px-6 py-4 font-medium">Registration</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredStudents.map((student) => (
                    <tr key={student._id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                            {student.name[0]}
                          </div>
                          <div>
                            <div className="text-white font-medium text-sm mb-0.5">
                              {student.name}
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-1">
                              <Shield className="w-3 h-3" /> UID: {student._id.slice(-8).toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-300 text-sm flex items-center gap-2 mb-1">
                          <Mail className="w-3.5 h-3.5 text-slate-500" /> {student.email}
                        </div>
                        <div className="text-slate-500 text-xs flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5" /> {student.phone || 'Private Number'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="text-slate-300 text-sm mb-0.5">{new Date(student.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                         <div className="text-xs text-slate-500">Enrolled on server</div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${
                            student.isActive
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${student.isActive ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                          {student.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/admin/students/${student._id}`}
                            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                            title="Quick View"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/students/${student._id}/edit`}
                            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-indigo-400 flex items-center justify-center transition-colors"
                            title="Edit Record"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <StatusToggleButton entity="student" entityId={student._id} isActive={student.isActive} compact />
                        </div>
                        <div className="group-hover:hidden text-slate-600 flex justify-end">
                           <MoreVertical className="w-4 h-4" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
