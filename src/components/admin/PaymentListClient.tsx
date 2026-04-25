'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Edit, Eye, FilterX, History, IndianRupee, Plus, Search } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface Payment {
  _id: string;
  studentId: {
    name: string;
    email: string;
  };
  courseId: {
    title: string;
    color: string;
  };
  totalFees: number;
  paidAmount: number;
  pendingAmount: number;
  status: 'pending' | 'partial' | 'paid';
  installments: Array<{ amount: number; date: string; method: string }>;
  updatedAt: string;
}

interface PaymentListProps {
  payments: Payment[];
}

export function PaymentListClient({ payments }: PaymentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'partial' | 'paid'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'amount' | 'student'>('recent');

  const filteredPayments = useMemo(() => {
    return [...payments]
      .filter((payment) => {
        const matchesSearch =
          !searchTerm ||
          payment.studentId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.studentId?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.courseId?.title.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
        return matchesSearch && matchesStatus;
      })
      .sort((left, right) => {
        if (sortBy === 'amount') return right.pendingAmount - left.pendingAmount;
        if (sortBy === 'student') {
          return left.studentId?.name.localeCompare(right.studentId?.name || '');
        }
        return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
      });
  }, [filterStatus, payments, searchTerm, sortBy]);

  const stats = {
    totalFees: filteredPayments.reduce((sum, payment) => sum + payment.totalFees, 0),
    collected: filteredPayments.reduce((sum, payment) => sum + payment.paidAmount, 0),
    pending: filteredPayments.reduce((sum, payment) => sum + payment.pendingAmount, 0),
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-semibold text-white tracking-tight">
            Fees & Revenue
          </h1>
          <p className="text-base text-slate-400 mt-1">
            Track payments, dues, and manual collection entries from the center.
          </p>
        </div>
        <Link
          href="/admin/payments/record"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 w-fit"
        >
          <Plus className="w-4 h-4" /> Record Payment
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#0a0f1d] border border-white/10 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-white mb-1">{formatCurrency(stats.totalFees)}</div>
          <div className="text-slate-400 text-sm">Total Fees</div>
        </div>

        <div className="bg-[#0a0f1d] border border-white/10 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-white mb-1">{formatCurrency(stats.collected)}</div>
          <div className="text-slate-400 text-sm">Collected / Paid</div>
        </div>

        <div className="bg-[#0a0f1d] border border-white/10 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-rose-400" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-white mb-1">{formatCurrency(stats.pending)}</div>
          <div className="text-slate-400 text-sm">Pending Dues</div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative group">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student, email, course..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full bg-[#111827] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(event) => setFilterStatus(event.target.value as 'all' | 'pending' | 'partial' | 'paid')}
          className="w-full md:w-48 bg-[#111827] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
        >
          <option value="all">All Statuses</option>
          <option value="paid">Paid Only</option>
          <option value="partial">Partial Payment</option>
          <option value="pending">Pending Payment</option>
        </select>

        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value as 'recent' | 'amount' | 'student')}
          className="w-full md:w-48 bg-[#111827] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
        >
          <option value="recent">Most Recent</option>
          <option value="amount">Highest Pending</option>
          <option value="student">Student Name</option>
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

      {filteredPayments.length === 0 ? (
        <div className="bg-[#0a0f1d] border border-white/10 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <IndianRupee className="w-8 h-8 text-slate-500" />
          </div>
          <p className="text-slate-400 text-sm font-medium max-w-xs mx-auto">
            {searchTerm || filterStatus !== 'all'
              ? 'No payment records match your filters.'
              : 'No payment records found.'}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Card Layout */}
          <div className="grid gap-4 md:hidden">
            {filteredPayments.map((payment) => (
              <div key={payment._id} className="bg-[#0a0f1d] border border-white/10 rounded-xl p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-white font-medium text-sm">{payment.studentId?.name || 'Unknown Student'}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{payment.studentId?.email || 'N/A'}</div>
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#111827] text-slate-300 border border-white/10 mt-2"
                    >
                      {payment.courseId?.title || 'Unknown Course'}
                    </span>
                  </div>
                  <span
                    className={`inline-flex rounded px-2 py-1 text-xs font-medium border ${
                      payment.status === 'paid'
                        ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                        : payment.status === 'partial'
                          ? 'border-yellow-500/20 bg-yellow-500/10 text-yellow-400'
                          : 'border-rose-500/20 bg-rose-500/10 text-rose-400'
                    }`}
                  >
                    {payment.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm pt-2 border-t border-white/10">
                  <div>
                    <div className="text-slate-500 text-xs mb-1">Total</div>
                    <div className="text-white font-medium">{formatCurrency(payment.totalFees)}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs mb-1">Paid</div>
                    <div className="text-emerald-400 font-medium">{formatCurrency(payment.paidAmount)}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs mb-1">Pending</div>
                    <div className="text-rose-400 font-medium">{formatCurrency(payment.pendingAmount)}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-white/10">
                  <span className="inline-flex items-center gap-1">
                    <History className="w-3.5 h-3.5" /> {payment.installments?.length || 0} trx
                  </span>
                  <span>{new Date(payment.updatedAt).toLocaleDateString('en-IN')}</span>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Link href={`/admin/payments/${payment._id}`} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg py-2 text-white text-center text-xs font-medium transition-colors">
                    View
                  </Link>
                  <Link href={`/admin/payments/${payment._id}/edit`} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg py-2 text-white text-center text-xs font-medium transition-colors">
                    Edit
                  </Link>
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
                    <th className="px-6 py-4 font-medium">Student & Course</th>
                    <th className="px-6 py-4 font-medium">Total Fees</th>
                    <th className="px-6 py-4 font-medium">Paid Amount</th>
                    <th className="px-6 py-4 font-medium">Pending Dues</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredPayments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-white mb-0.5">
                            {payment.studentId?.name || 'Unknown Student'}
                          </div>
                          <div className="text-xs text-slate-500 mb-2">{payment.studentId?.email || 'N/A'}</div>
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium w-fit bg-[#111827] text-slate-300 border border-white/10"
                          >
                            {payment.courseId?.title || 'Unknown Course'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white text-sm">{formatCurrency(payment.totalFees)}</td>
                      <td className="px-6 py-4">
                        <span className="text-emerald-400 text-sm font-medium">{formatCurrency(payment.paidAmount)}</span>
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <History className="w-3 h-3" />
                          {payment.installments?.length || 0} Trx
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${payment.pendingAmount > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                          {formatCurrency(payment.pendingAmount)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${
                            payment.status === 'paid'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : payment.status === 'partial'
                                ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}
                        >
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/admin/payments/${payment._id}`}
                            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/payments/${payment._id}/edit`}
                            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-indigo-400 flex items-center justify-center transition-colors"
                            title="Edit Payment"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
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
