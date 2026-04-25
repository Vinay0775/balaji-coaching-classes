import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdmissionCode extends Document {
  name: string;
  phone: string;
  courseId?: mongoose.Types.ObjectId;
  code: string;
  isUsed: boolean;
  usedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AdmissionCodeSchema = new Schema<IAdmissionCode>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    isUsed: { type: Boolean, default: false },
    usedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const AdmissionCode: Model<IAdmissionCode> =
  mongoose.models.AdmissionCode || mongoose.model<IAdmissionCode>('AdmissionCode', AdmissionCodeSchema);

export default AdmissionCode;
