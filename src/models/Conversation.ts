import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage {
  sender: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  lastMessage?: {
    content: string;
    createdAt: Date;
  };
  unreadCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema: Schema = new Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    lastMessage: {
      content: String,
      createdAt: Date,
    },
    unreadCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ updatedAt: -1 });

// Delete the mongoose model if it exists to prevent OverwriteModelError
const Conversation = (mongoose.models.Conversation as Model<IConversation>) || mongoose.model<IConversation>('Conversation', ConversationSchema);

export default Conversation; 