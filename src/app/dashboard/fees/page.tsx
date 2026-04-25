import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { IndianRupee, History, AlertCircle, ArrowRight, Download, CheckCircle, FileText } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Course from '@/models/Course';

export default async function FeesPage() {
  const session = await auth();
  if (!session) redirect('/login');

  await dbConnect();
  
  const rawPayments = await Payment.find({ studentId: session?.user?.id })
    .populate({ path: 'courseId', model: Course, select: 'title fullName icon color' })
    .sort({ createdAt: -1 })
    .lean();

  const payments = rawPayments.map((p: any) => ({
    _id: p._id.toString(),
    courseTitle: p.courseId.title,
    courseFullName: p.courseId.fullName,
    courseIcon: p.courseId.icon,
    courseColor: p.courseId.color,
    totalFees: p.totalFees,
    paidAmount: p.paidAmount,
    pendingAmount: p.pendingAmount,
    status: p.status,
    installments: p.installments.map((inst: any) => ({
      amount: inst.amount,
      date: inst.date.toISOString(),
      method: inst.method,
      receiptNo: inst.receiptNo,
      receiptUrl: inst.receiptUrl,
    })),
  }));

  const overallTotal = payments.reduce((acc: number, p: any) => acc + p.totalFees, 0);
  const overallPaid = payments.reduce((acc: number, p: any) => acc + p.paidAmount, 0);
  const overallPending = payments.reduce((acc: number, p: any) => acc + p.pendingAmount, 0);

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 className="text-3xl font-black text-white" style={{ marginBottom: '8px' }}>Fees &amp; <span className="gradient-text">Payments</span> 💳</h1>
        <p className="text-slate-400 text-lg">Manage your course fees, view transaction history, and download receipts.</p>
      </div>

      {payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center glass-card text-center" style={{ padding: '48px' }}>
          <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center" style={{ marginBottom: '24px' }}>
             <IndianRupee className="w-10 h-10 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-white" style={{ marginBottom: '12px' }}>No Payment Records</h2>
          <p className="text-slate-400 max-w-md mx-auto text-lg" style={{ marginBottom: '24px' }}>Aapka koi fee record nahi mila. Jab aap kisi course mein enroll karenge, toh fees yahan dikhegi.</p>
          <a href="/courses" className="btn-outline">Browse Courses</a>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '24px', marginBottom: '32px' }}>
             <div className="glass-card border-indigo-500/30 bg-gradient-to-br from-[rgba(15,22,40,0.8)] to-[rgba(99,102,241,0.1)]" style={{ padding: '24px' }}>
               <div className="text-slate-400 text-sm font-semibold uppercase tracking-wider" style={{ marginBottom: '8px' }}>Total Fees</div>
               <div className="text-4xl font-black text-white flex items-center" style={{ gap: '4px' }}>
                 <span className="text-indigo-400">₹</span>{overallTotal.toLocaleString('en-IN')}
               </div>
             </div>
             <div className="glass-card border-green-500/30 bg-gradient-to-br from-[rgba(15,22,40,0.8)] to-[rgba(34,197,94,0.1)]" style={{ padding: '24px' }}>
               <div className="text-slate-400 text-sm font-semibold uppercase tracking-wider" style={{ marginBottom: '8px' }}>Total Paid</div>
               <div className="text-4xl font-black text-white flex items-center" style={{ gap: '4px' }}>
                 <span className="text-green-400">₹</span>{overallPaid.toLocaleString('en-IN')}
               </div>
             </div>
             <div className="glass-card border-red-500/30 bg-gradient-to-br from-[rgba(15,22,40,0.8)] to-[rgba(239,68,68,0.1)]" style={{ padding: '24px' }}>
               <div className="text-slate-400 text-sm font-semibold uppercase tracking-wider" style={{ marginBottom: '8px' }}>Total Pending</div>
               <div className="text-4xl font-black text-white flex items-center" style={{ gap: '4px' }}>
                 <span className="text-red-400">₹</span>{overallPending.toLocaleString('en-IN')}
               </div>
             </div>
          </div>

          {/* Payment Details Per Course */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {payments.map((payment: any) => (
              <div key={payment._id} className="glass-card overflow-hidden">
                {/* Course Header */}
                <div className="bg-white/[0.02] border-b border-white/[0.05] flex flex-col md:flex-row justify-between items-start md:items-center" style={{ padding: '32px', gap: '24px' }}>
                  <div className="flex items-center" style={{ gap: '20px' }}>
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${payment.courseColor} flex items-center justify-center text-3xl shadow-lg flex-shrink-0`}>
                      {payment.courseIcon}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white" style={{ marginBottom: '6px' }}>{payment.courseTitle}</h2>
                      <div className="flex items-center" style={{ gap: '12px' }}>
                         <span className={`rounded-md text-xs font-bold uppercase tracking-wider ${
                           payment.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                           payment.status === 'partial' ? 'bg-yellow-500/20 text-yellow-400' : 
                           'bg-red-500/20 text-red-400'
                         }`} style={{ padding: '4px 12px' }}>
                           {payment.status === 'paid' ? 'Fully Paid' : payment.status === 'partial' ? 'Partially Paid' : 'Unpaid'}
                         </span>
                         <span className="text-slate-500 text-sm">{payment.courseFullName}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Fee Breakdown */}
                  <div className="flex items-center w-full md:w-auto bg-[#060910] rounded-xl border border-white/5" style={{ gap: '32px', padding: '16px' }}>
                     <div className="text-center">
                        <div className="text-slate-500 text-xs font-semibold" style={{ marginBottom: '4px' }}>Total</div>
                        <div className="text-white font-bold text-lg">₹{payment.totalFees.toLocaleString()}</div>
                     </div>
                     <div className="w-px h-10 bg-white/10" />
                     <div className="text-center">
                        <div className="text-slate-500 text-xs font-semibold" style={{ marginBottom: '4px' }}>Paid</div>
                        <div className="text-green-400 font-bold text-lg">₹{payment.paidAmount.toLocaleString()}</div>
                     </div>
                     <div className="w-px h-10 bg-white/10" />
                     <div className="text-center">
                        <div className="text-slate-500 text-xs font-semibold" style={{ marginBottom: '4px' }}>Due</div>
                        <div className="text-red-400 font-bold text-lg">₹{payment.pendingAmount.toLocaleString()}</div>
                     </div>
                  </div>
                </div>

                {/* Transaction History */}
                <div style={{ padding: '32px' }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
                    <h3 className="text-lg font-bold text-white flex items-center" style={{ gap: '8px' }}>
                       <History className="w-5 h-5 text-indigo-400" /> Payment History
                    </h3>
                    <button className="text-indigo-400 text-sm font-semibold hover:text-indigo-300 flex items-center transition-colors" style={{ gap: '4px' }}>
                       <Download className="w-4 h-4" /> Download All Receipts
                    </button>
                  </div>
                  
                  {payment.installments.length === 0 ? (
                     <div className="bg-[#0a0e1a] p-6 rounded-xl border border-white/5 text-center flex flex-col justify-center items-center">
                        <AlertCircle className="w-8 h-8 text-slate-500 mb-3" />
                        <div className="text-white font-medium mb-1">No Payments Yet</div>
                        <div className="text-slate-500 text-sm">Aapne is course ke liye abhi koi fees pay nahi ki hai.</div>
                     </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                            <th className="pb-4 pl-4">Date</th>
                            <th className="pb-4">Amount</th>
                            <th className="pb-4">Method</th>
                            <th className="pb-4">Receipt No.</th>
                            <th className="pb-4 text-right pr-4">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.05]">
                          {payment.installments.map((inst: any, idx: number) => (
                            <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                              <td className="py-4 pl-4 text-white font-medium text-sm">
                                {new Date(inst.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </td>
                              <td className="py-4 text-green-400 font-bold">
                                ₹{inst.amount.toLocaleString()}
                              </td>
                              <td className="py-4">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 text-slate-300 text-xs font-semibold capitalize border border-white/10">
                                   <FileText className="w-3 h-3" /> {inst.method.replace('_', ' ')}
                                </span>
                              </td>
                              <td className="py-4 text-slate-400 font-mono text-xs">
                                {inst.receiptNo || 'N/A'}
                              </td>
                              <td className="py-4 text-right pr-4">
                                {inst.receiptUrl ? (
                                  <a href={inst.receiptUrl} target="_blank" rel="noreferrer" className="inline-block p-2 rounded-lg hover:bg-white/10 text-indigo-400 hover:text-indigo-300 transition-colors" title="Download Receipt">
                                     <Download className="w-4 h-4" />
                                  </a>
                                ) : (
                                  <button disabled className="p-2 rounded-lg text-slate-600 cursor-not-allowed" title="No Receipt Available">
                                     <Download className="w-4 h-4" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Pay Now Button (if pending) */}
                  {payment.pendingAmount > 0 && (
                     <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                        <button className="btn-primary py-3 px-8 shadow-indigo-500/20 shadow-lg">
                           Pay Due Amount (₹{payment.pendingAmount.toLocaleString()}) <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                     </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
