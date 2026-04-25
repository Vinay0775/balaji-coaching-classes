import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPaymentInstallment {
  amount: number;
  date: Date;
  method: 'cash' | 'upi' | 'bank_transfer' | 'cheque' | 'card';
  note?: string;
  receiptNo?: string;
  receiptUrl?: string;
}

export interface IPayment extends Document {

  studentId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  totalFees: number;
  paidAmount: number;
  pendingAmount: number;
  installments: IPaymentInstallment[];
  status: 'pending' | 'partial' | 'paid';
  admissionDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InstallmentSchema = new Schema<IPaymentInstallment>({
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  method: { type: String, enum: ['cash', 'upi', 'bank_transfer', 'cheque', 'card'], default: 'cash' },
  note: { type: String },
  receiptNo: { type: String },
  receiptUrl: { type: String },
});

const PaymentSchema = new Schema<IPayment>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    totalFees: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    pendingAmount: { type: Number, required: true },
    installments: [InstallmentSchema],
    status: { type: String, enum: ['pending', 'partial', 'paid'], default: 'pending' },
    admissionDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Auto-calculate paidAmount and pendingAmount
PaymentSchema.pre('save', function (next) {
  this.paidAmount = this.installments.reduce((sum, inst) => sum + inst.amount, 0);
  this.pendingAmount = Math.max(this.totalFees - this.paidAmount, 0);
  if (this.paidAmount >= this.totalFees) this.status = 'paid';
  else if (this.paidAmount > 0) this.status = 'partial';
  else this.status = 'pending';
  next();
});

const Payment: Model<IPayment> = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
export default Payment;
