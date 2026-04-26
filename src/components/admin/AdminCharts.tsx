'use client';

import { LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#6366f1', '#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

interface ChartDataProps {
  monthlyRevenue: Array<{ month: string; revenue: number; target: number }>;
  coursePopularity: Array<{ name: string; enrollments: number }>;
  feesStatus: Array<{ month: string; collected: number; pending: number }>;
}

export function AdminCharts({ monthlyRevenue, coursePopularity, feesStatus }: ChartDataProps) {
  // We'll combine revenue and collected fees into one sleek chart to save space
  const combinedData = monthlyRevenue.map((rev, index) => ({
    month: rev.month,
    target: rev.target,
    revenue: rev.revenue,
    collected: feesStatus[index]?.collected || 0,
    pending: feesStatus[index]?.pending || 0,
  }));

  const totalEnrollments = coursePopularity.reduce((sum, c) => sum + c.enrollments, 0);

  return (
    <div className="grid lg:grid-cols-3" style={{ gap: '24px' }}>
      {/* Main Financial Chart */}
      <div className="lg:col-span-2 glass-card flex flex-col border border-white/5 shadow-xl relative overflow-hidden" style={{ padding: '24px' }}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between relative z-10" style={{ marginBottom: '24px' }}>
          <div>
            <h3 className="text-lg font-bold text-white">Financial Overview</h3>
            <p className="text-sm text-slate-400">Revenue & Collections (Last 12 Months)</p>
          </div>
          <div className="flex text-xs font-semibold" style={{ gap: '16px' }}>
            <div className="flex items-center" style={{ gap: '6px' }}><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Target</div>
            <div className="flex items-center" style={{ gap: '6px' }}><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Revenue</div>
          </div>
        </div>
        
        <div className="flex-1 min-h-[280px] w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={combinedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '11px', fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis stroke="#64748b" style={{ fontSize: '11px', fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} dx={-10} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)' }}
                itemStyle={{ fontSize: '13px', fontWeight: 600 }}
                labelStyle={{ color: '#94a3b8', fontSize: '12px', marginBottom: '8px' }}
                formatter={(value: any) => `₹${value?.toLocaleString('en-IN') || 0}`}
              />
              <Area type="monotone" dataKey="target" stroke="#6366f1" strokeWidth={2} strokeDasharray="5 5" fill="url(#colorTarget)" name="Target" />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fill="url(#colorRevenue)" name="Revenue" activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Courses Progress Bars (Replaces bulky Pie Chart) */}
      <div className="glass-card border border-white/5 shadow-xl flex flex-col relative overflow-hidden" style={{ padding: '24px' }}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-[50px] pointer-events-none" />
        
        <h3 className="text-lg font-bold text-white mb-1 relative z-10">Top Courses</h3>
        <p className="text-sm text-slate-400 relative z-10" style={{ marginBottom: '24px' }}>By student enrollment</p>
        
        <div className="flex-1 relative z-10" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {coursePopularity.map((course, index) => {
            const percentage = totalEnrollments > 0 ? Math.round((course.enrollments / totalEnrollments) * 100) : 0;
            return (
              <div key={course.name}>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-semibold text-slate-200">{course.name}</span>
                  <span className="text-xs font-bold text-cyan-400">{course.enrollments} std.</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#0a0e1a] overflow-hidden border border-white/5">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 relative"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: COLORS[index % COLORS.length]
                    }}
                  >
                    <div className="absolute top-0 right-0 bottom-0 w-10 bg-white/20 -skew-x-12 animate-[shimmer_2s_infinite]" />
                  </div>
                </div>
              </div>
            );
          })}
          
          {coursePopularity.length === 0 && (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm">
              No enrollment data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
