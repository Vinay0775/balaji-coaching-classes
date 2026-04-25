import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISchedule extends Document {
  time: string;
  title: string;
  duration: string;
  isActive: boolean;
  order: number;
  courseId?: mongoose.Types.ObjectId;
  studentId?: mongoose.Types.ObjectId;
}

const ScheduleSchema = new Schema<ISchedule>(
  {
    time: { type: String, required: true },
    title: { type: String, required: true },
    duration: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    studentId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// Delete the model if it exists to force schema update in development
if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.Schedule;
}

const Schedule: Model<ISchedule> = mongoose.models.Schedule || mongoose.model<ISchedule>('Schedule', ScheduleSchema);
export default Schedule;
