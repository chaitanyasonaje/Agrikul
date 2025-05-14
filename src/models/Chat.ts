import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage {
  sender: mongoose.Types.ObjectId;
  content: string;
  readBy: mongoose.Types.ObjectId[];
  createdAt: Date;
}

export interface IChat extends Document {
  users: mongoose.Types.ObjectId[];
  messages: IMessage[];
  product?: mongoose.Types.ObjectId;
  lastMessage?: {
    content: string;
    sender: mongoose.Types.ObjectId;
    createdAt: Date;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ChatSchema: Schema = new Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    messages: [MessageSchema],
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    lastMessage: {
      content: String,
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      createdAt: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
ChatSchema.index({ users: 1 });
ChatSchema.index({ product: 1 });
ChatSchema.index({ 'lastMessage.createdAt': -1 });

const Chat = (mongoose.models.Chat as Model<IChat>) || mongoose.model<IChat>('Chat', ChatSchema);

export default Chat; 