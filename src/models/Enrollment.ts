import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEnrollment extends Document {

  studentId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  progress: number; // 0-100
  enrollDate: Date;
  completionDate?: Date;
  status: 'active' | 'completed' | 'dropped';
  completedSteps: number[];
  certificateUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    enrollDate: { type: Date, default: Date.now },
    completionDate: { type: Date },
    status: { type: String, enum: ['active', 'completed', 'dropped'], default: 'active' },
    completedSteps: [{ type: Number }],
    certificateUrl: { type: String },
  },
  { timestamps: true }
);

const Enrollment: Model<IEnrollment> =
  mongoose.models.Enrollment || mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);
export default Enrollment;
