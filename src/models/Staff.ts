import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStaff extends Document {

  userId: mongoose.Types.ObjectId;
  role: 'teacher' | 'coordinator' | 'receptionist' | 'manager';
  assignedCourses: mongoose.Types.ObjectId[];
  qualification: string;
  experience: string;
  bio?: string;
  photo?: string;
  salary?: number;
  joinDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StaffSchema = new Schema<IStaff>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: {
      type: String,
      enum: ['teacher', 'coordinator', 'receptionist', 'manager'],
      default: 'teacher',
    },
    assignedCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    qualification: { type: String, required: true },
    experience: { type: String, required: true },
    bio: { type: String },
    photo: { type: String },
    salary: { type: Number },
    joinDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Staff: Model<IStaff> = mongoose.models.Staff || mongoose.model<IStaff>('Staff', StaffSchema);
export default Staff;
