import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INote extends Document {
  title: string;
  description?: string;
  fileUrl: string;
  courseId?: mongoose.Types.ObjectId;
  studentId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    title: { type: String, required: true },
    description: { type: String },
    fileUrl: { type: String, required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    studentId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.Note;
}

const Note: Model<INote> = mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);
export default Note;
