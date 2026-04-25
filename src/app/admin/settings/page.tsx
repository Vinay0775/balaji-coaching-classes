import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { SettingsForm } from '@/components/admin/forms/SettingsForm';
import dbConnect from '@/lib/mongodb';
import { INSTITUTE_INFO } from '@/lib/constants';
import InstituteSettings from '@/models/InstituteSettings';
import Payment from '@/models/Payment';
import Staff from '@/models/Staff';
import User from '@/models/User';

type PendingPaymentRecord = {
  pendingAmount?: number;
};

export default async function AdminSettingsPage() {
  const session = await auth();
  const userMeta = session?.user as { id?: string; role?: string } | undefined;
  if (!session || userMeta?.role !== 'admin' || !userMeta.id) redirect('/login');

  await dbConnect();

  const [settingsDoc, admin, studentCount, staffCount, payments] = await Promise.all([
    InstituteSettings.findOne({ slug: 'default' }).lean(),
    User.findById(userMeta.id).lean(),
    User.countDocuments({ role: 'student' }),
    Staff.countDocuments(),
    Payment.find().select('pendingAmount').lean<PendingPaymentRecord[]>(),
  ]);

  if (!admin) redirect('/admin');

  const pending = payments.reduce((sum, payment) => sum + (payment.pendingAmount || 0), 0);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-4">
        <h1 className="text-2xl font-black text-white mb-1">
          Admin <span className="gradient-text">Settings</span>
        </h1>
        <p className="text-slate-400 text-sm">
          Institute profile, alert preferences, and lead admin account controls.
        </p>
      </div>

      <SettingsForm
        settings={{
          instituteName: settingsDoc?.instituteName || INSTITUTE_INFO.name,
          shortName: settingsDoc?.shortName || INSTITUTE_INFO.shortName,
          tagline: settingsDoc?.tagline || INSTITUTE_INFO.tagline,
          email: settingsDoc?.email || INSTITUTE_INFO.email,
          supportEmail: settingsDoc?.supportEmail || '',
          phone: settingsDoc?.phone || INSTITUTE_INFO.phone,
          whatsapp: settingsDoc?.whatsapp || INSTITUTE_INFO.whatsapp,
          address: settingsDoc?.address || INSTITUTE_INFO.address,
          timings: settingsDoc?.timings || INSTITUTE_INFO.timings,
          dashboardFocus: settingsDoc?.dashboardFocus || 'overview',
          studentSignupAlerts: settingsDoc?.studentSignupAlerts ?? true,
          paymentAlerts: settingsDoc?.paymentAlerts ?? true,
          dailyDigest: settingsDoc?.dailyDigest ?? false,
          lowCollectionAlert: settingsDoc?.lowCollectionAlert ?? 5000,
        }}
        adminProfile={{
          name: admin.name,
          email: admin.email,
          phone: admin.phone || '',
        }}
        totals={{
          students: studentCount,
          staff: staffCount,
          pending,
        }}
      />
    </div>
  );
}
