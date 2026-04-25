'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Info } from 'lucide-react';
import {
  saveInstituteSettings,
  updateAdminProfileSettings,
} from '@/app/actions/adminActions';

interface SettingsFormProps {
  settings: {
    instituteName: string;
    shortName: string;
    tagline: string;
    email: string;
    supportEmail: string;
    phone: string;
    whatsapp: string;
    address: string;
    timings: string;
    dashboardFocus: 'overview' | 'students' | 'payments' | 'courses';
    studentSignupAlerts: boolean;
    paymentAlerts: boolean;
    dailyDigest: boolean;
    lowCollectionAlert: number;
  };
  adminProfile: {
    name: string;
    email: string;
    phone: string;
  };
  totals: {
    students: number;
    staff: number;
    pending: number;
  };
}

const labelClassName = "text-[13px] font-medium text-slate-400 mb-1.5";
const inputClassName = "w-full bg-[#111827] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors";

export function SettingsForm({ settings, adminProfile, totals }: SettingsFormProps) {
  const [savingInstitute, setSavingInstitute] = useState(false);
  const [savingAdmin, setSavingAdmin] = useState(false);

  async function handleInstituteSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingInstitute(true);

    const result = await saveInstituteSettings(new FormData(event.currentTarget));

    setSavingInstitute(false);

    if (!result.success) {
      toast.error(result.error || 'Unable to save institute settings.');
      return;
    }

    toast.success(result.message || 'Successfully saved');
  }

  async function handleAdminSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingAdmin(true);

    const result = await updateAdminProfileSettings(new FormData(event.currentTarget));

    setSavingAdmin(false);

    if (!result.success) {
      toast.error(result.error || 'Unable to update admin profile.');
      return;
    }

    toast.success(result.message || 'Successfully saved');
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Top Stat Cards */}
      <div className="grid md:grid-cols-3 gap-5 mb-8">
        <div className="p-5 border border-white/10 rounded-xl bg-[#0a0f1d]">
          <div className="text-[13px] font-medium text-slate-400 mb-1 uppercase tracking-wider">Institute Profile</div>
          <div className="text-xl font-bold text-white mb-2">{settings.shortName}</div>
          <p className="text-xs text-slate-500">{settings.tagline}</p>
        </div>

        <div className="p-5 border border-white/10 rounded-xl bg-[#0a0f1d]">
          <div className="text-[13px] font-medium text-slate-400 mb-3 uppercase tracking-wider">Notifications</div>
          <div className="space-y-2 text-sm text-slate-300">
             <div className="flex items-center justify-between">
               <span>Student Signups</span> 
               <span className={settings.studentSignupAlerts ? 'text-indigo-400 font-medium' : 'text-slate-600'}>
                 {settings.studentSignupAlerts ? 'ON' : 'OFF'}
               </span>
             </div>
             <div className="flex items-center justify-between">
               <span>Payment Alerts</span> 
               <span className={settings.paymentAlerts ? 'text-indigo-400 font-medium' : 'text-slate-600'}>
                 {settings.paymentAlerts ? 'ON' : 'OFF'}
               </span>
             </div>
          </div>
        </div>

        <div className="p-5 border border-white/10 rounded-xl bg-[#0a0f1d]">
          <div className="text-[13px] font-medium text-slate-400 mb-1 uppercase tracking-wider">Total Accounts</div>
          <div className="text-xl font-bold text-white mb-2">{totals.students + totals.staff}</div>
          <p className="text-xs text-slate-500">
            Low collection threshold: Rs. {settings.lowCollectionAlert.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Institute Settings */}
        <div className="lg:col-span-2 p-6 bg-[#0a0f1d] border border-white/10 rounded-2xl shadow-sm h-fit">
          <form onSubmit={handleInstituteSubmit} className="space-y-6">
            <div className="border-b border-white/10 pb-4 mb-6">
              <h2 className="text-lg font-semibold text-white tracking-tight">Institute Settings</h2>
              <p className="text-sm text-slate-400 mt-1">
                Define what your admin team cares about: details, operational alerts, and dashboard focus.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="flex flex-col">
                <label className={labelClassName}>Institute Name</label>
                <input name="instituteName" required defaultValue={settings.instituteName} className={inputClassName} />
              </div>
              <div className="flex flex-col">
                <label className={labelClassName}>Short Name</label>
                <input name="shortName" required defaultValue={settings.shortName} className={inputClassName} />
              </div>

              <div className="col-span-full flex flex-col">
                <label className={labelClassName}>Tagline</label>
                <input name="tagline" required defaultValue={settings.tagline} className={inputClassName} />
              </div>

              <div className="flex flex-col">
                <label className={labelClassName}>Main Email</label>
                <input name="email" type="email" required defaultValue={settings.email} className={inputClassName} />
              </div>
              <div className="flex flex-col">
                <label className={labelClassName}>Support Email</label>
                <input name="supportEmail" type="email" defaultValue={settings.supportEmail} className={inputClassName} />
              </div>

              <div className="flex flex-col">
                <label className={labelClassName}>Phone</label>
                <input name="phone" required defaultValue={settings.phone} className={inputClassName} />
              </div>
              <div className="flex flex-col">
                <label className={labelClassName}>WhatsApp</label>
                <input name="whatsapp" defaultValue={settings.whatsapp} className={inputClassName} />
              </div>

              <div className="col-span-full flex flex-col">
                <label className={labelClassName}>Address</label>
                <textarea name="address" rows={3} required defaultValue={settings.address} className={`${inputClassName} resize-none`} />
              </div>

              <div className="flex flex-col">
                <label className={labelClassName}>Operating Hours</label>
                <input name="timings" required defaultValue={settings.timings} className={inputClassName} />
              </div>
              <div className="flex flex-col">
                <label className={labelClassName}>Dashboard Focus</label>
                <select name="dashboardFocus" defaultValue={settings.dashboardFocus} className={inputClassName}>
                  <option value="overview" className="bg-[#0f172a]">Overview</option>
                  <option value="students" className="bg-[#0f172a]">Students first</option>
                  <option value="payments" className="bg-[#0f172a]">Payments first</option>
                  <option value="courses" className="bg-[#0f172a]">Courses first</option>
                </select>
              </div>

              <div className="col-span-full flex flex-col">
                <label className={labelClassName}>Low Collection Alert Threshold (Rs)</label>
                <input
                  name="lowCollectionAlert"
                  type="number"
                  min="0"
                  defaultValue={settings.lowCollectionAlert}
                  className={inputClassName}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
              <div className="flex flex-col gap-2">
                <div className="text-sm font-medium text-white">New Students</div>
                <label className="relative flex cursor-pointer items-center">
                  <input name="studentSignupAlerts" type="checkbox" defaultChecked={settings.studentSignupAlerts} className="peer sr-only" />
                  <div className="h-6 w-11 rounded-full bg-slate-800 peer-checked:bg-indigo-600 transition-colors" />
                  <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
                </label>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-sm font-medium text-white">Payments</div>
                <label className="relative flex cursor-pointer items-center">
                  <input name="paymentAlerts" type="checkbox" defaultChecked={settings.paymentAlerts} className="peer sr-only" />
                  <div className="h-6 w-11 rounded-full bg-slate-800 peer-checked:bg-indigo-600 transition-colors" />
                  <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
                </label>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-sm font-medium text-white">Daily Digest</div>
                <label className="relative flex cursor-pointer items-center">
                  <input name="dailyDigest" type="checkbox" defaultChecked={settings.dailyDigest} className="peer sr-only" />
                  <div className="h-6 w-11 rounded-full bg-slate-800 peer-checked:bg-indigo-600 transition-colors" />
                  <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex justify-end">
              <button type="submit" disabled={savingInstitute} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                {savingInstitute && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Settings
              </button>
            </div>
          </form>
        </div>

        {/* Admin Account */}
        <div className="p-6 bg-[#0a0f1d] border border-white/10 rounded-2xl shadow-sm h-fit">
          <form onSubmit={handleAdminSubmit} className="space-y-6">
            <div className="border-b border-white/10 pb-4 mb-6">
              <h2 className="text-lg font-semibold text-white tracking-tight">Admin Account</h2>
              <p className="text-sm text-slate-400 mt-1">
                Keep the lead admin contact current and rotate the password whenever needed.
              </p>
            </div>

            <div className="flex flex-col">
              <label className={labelClassName}>Admin Name</label>
              <input name="name" required defaultValue={adminProfile.name} className={inputClassName} />
            </div>

            <div className="flex flex-col">
              <label className={labelClassName}>Login Email</label>
              <input value={adminProfile.email} disabled className={`${inputClassName} opacity-50 cursor-not-allowed bg-slate-900`} />
            </div>

            <div className="flex flex-col">
              <label className={labelClassName}>Phone Number</label>
              <input name="phone" defaultValue={adminProfile.phone} className={inputClassName} />
            </div>

            <div className="flex flex-col">
              <label className={labelClassName}>New Password</label>
              <input
                name="password"
                type="text"
                placeholder="Leave blank to keep current password"
                className={inputClassName}
              />
            </div>

            <div className="p-4 border border-indigo-500/20 bg-indigo-500/5 rounded-xl flex items-start gap-3 mt-2">
               <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
               <div>
                 <h3 className="text-sm font-semibold text-indigo-300">Live Status</h3>
                 <p className="text-xs text-indigo-200/70 mt-1">
                   Current live counters: {totals.students} students, {totals.staff} staff members, and Rs. {totals.pending.toLocaleString('en-IN')} pending collection.
                 </p>
               </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex justify-end">
              <button type="submit" disabled={savingAdmin} className="bg-slate-800 hover:bg-slate-700 border border-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed w-full justify-center">
                {savingAdmin && <Loader2 className="w-4 h-4 animate-spin" />}
                Update Admin
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
