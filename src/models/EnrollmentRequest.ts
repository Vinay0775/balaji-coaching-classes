import mongoose from 'mongoose';

export interface IEnrollmentRequest {
  studentId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  requestDate: Date;
  approvalDate?: Date;
  rejectionReason?: string;
  approvedBy?: mongoose.Types.ObjectId; // Admin who approved/rejected
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const enrollmentRequestSchema = new mongoose.Schema<IEnrollmentRequest>(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled'],
      default: 'pending',
      index: true,
    },
    requestDate: {
      type: Date,
      default: () => new Date(),
      index: true,
    },
    approvalDate: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    notes: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Compound index for efficient queries
enrollmentRequestSchema.index({ studentId: 1, status: 1 });
enrollmentRequestSchema.index({ courseId: 1, status: 1 });

export default mongoose.models.EnrollmentRequest ||
  mongoose.model('EnrollmentRequest', enrollmentRequestSchema);
