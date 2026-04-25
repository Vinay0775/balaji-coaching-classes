import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IInstituteSettings extends Document {

  slug: string;
  instituteName: string;
  shortName: string;
  tagline: string;
  email: string;
  supportEmail?: string;
  phone: string;
  whatsapp?: string;
  address: string;
  timings: string;
  dashboardFocus: 'overview' | 'students' | 'payments' | 'courses';
  studentSignupAlerts: boolean;
  paymentAlerts: boolean;
  dailyDigest: boolean;
  lowCollectionAlert: number;
  createdAt: Date;
  updatedAt: Date;
}

const InstituteSettingsSchema = new Schema<IInstituteSettings>(
  {
    slug: { type: String, required: true, unique: true, default: 'default' },
    instituteName: { type: String, required: true, trim: true },
    shortName: { type: String, required: true, trim: true },
    tagline: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    supportEmail: { type: String, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    whatsapp: { type: String, trim: true },
    address: { type: String, required: true, trim: true },
    timings: { type: String, required: true, trim: true },
    dashboardFocus: {
      type: String,
      enum: ['overview', 'students', 'payments', 'courses'],
      default: 'overview',
    },
    studentSignupAlerts: { type: Boolean, default: true },
    paymentAlerts: { type: Boolean, default: true },
    dailyDigest: { type: Boolean, default: false },
    lowCollectionAlert: { type: Number, default: 5000, min: 0 },
  },
  { timestamps: true }
);

const InstituteSettings: Model<IInstituteSettings> =
  mongoose.models.InstituteSettings ||
  mongoose.model<IInstituteSettings>('InstituteSettings', InstituteSettingsSchema);

export default InstituteSettings;
