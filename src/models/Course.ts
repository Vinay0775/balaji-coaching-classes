import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRoadmapStep {
  week: string;
  title: string;
  desc: string;
}

export interface ICourse extends Document {

  slug: string;
  title: string;
  fullName: string;
  description: string;
  duration: string;
  fees: number;
  discountedFees: number;
  icon: string;
  color: string;
  category: string;
  topics: string[];
  roadmap: IRoadmapStep[];
  badge?: string;
  popular: boolean;
  isActive: boolean;
  thumbnail?: string;
  instructorId?: mongoose.Types.ObjectId;
  resources: { title: string; url: string; type: 'pdf' | 'video' | 'link' }[];
  createdAt: Date;
  updatedAt: Date;
}

const RoadmapStepSchema = new Schema<IRoadmapStep>({
  week: { type: String, required: true },
  title: { type: String, required: true },
  desc: { type: String, required: true },
});

const CourseSchema = new Schema<ICourse>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    fullName: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    fees: { type: Number, required: true },
    discountedFees: { type: Number, required: true },
    icon: { type: String, default: '📚' },
    color: { type: String, default: 'from-blue-500 to-purple-600' },
    category: { type: String, required: true },
    topics: [{ type: String }],
    roadmap: [RoadmapStepSchema],
    badge: { type: String },
    popular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    thumbnail: { type: String },
    instructorId: { type: Schema.Types.ObjectId, ref: 'User' },
    resources: [
      {
        title: String,
        url: String,
        type: { type: String, enum: ['pdf', 'video', 'link'] },
      },
    ],
  },
  { timestamps: true }
);

const Course: Model<ICourse> = mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);
export default Course;
