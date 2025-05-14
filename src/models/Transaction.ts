import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITransaction extends Document {
  sender: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  transactionType: 'deposit' | 'withdrawal' | 'transfer' | 'payment' | 'refund';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description: string;
  reference: string;
  paymentMethod?: string;
  fee?: number;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender is required'],
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be positive'],
    },
    currency: {
      type: String,
      default: 'INR',
      required: [true, 'Currency is required'],
    },
    transactionType: {
      type: String,
      enum: ['deposit', 'withdrawal', 'transfer', 'payment', 'refund'],
      required: [true, 'Transaction type is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'cancelled'],
      default: 'pending',
    },
    description: {
      type: String,
      default: '',
    },
    reference: {
      type: String,
      default: '',
    },
    paymentMethod: {
      type: String,
    },
    fee: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Helper method to generate transaction reference
TransactionSchema.pre('save', function(next) {
  if (!this.reference) {
    const timestamp = Date.now().toString();
    const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.reference = `TXN-${timestamp.substring(timestamp.length - 6)}-${randomChars}`;
  }
  next();
});

// Delete the mongoose model if it exists to prevent OverwriteModelError
const Transaction = (mongoose.models.Transaction as Model<ITransaction>) || mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction; 