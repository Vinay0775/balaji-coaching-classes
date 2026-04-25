import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAssignment extends Document {
  title: string;
  description?: string;
  fileUrl: string;
  dueDate?: Date;
  courseId?: mongoose.Types.ObjectId;
  studentId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true },
    description: { type: String },
    fileUrl: { type: String, required: true },
    dueDate: { type: Date },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    studentId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.Assignment;
}

const Assignment: Model<IAssignment> = mongoose.models.Assignment || mongoose.model<IAssignment>('Assignment', AssignmentSchema);
export default Assignment;
