import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  userType: 'farmer' | 'buyer';
  location: {
    address: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  phone: string;
  profileImage?: string;
  bio?: string;
  companyName?: string;
  farmSize?: number;
  farmType?: string[];
  crops?: string[];
  verified: boolean;
  ratings: {
    average: number;
    count: number;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },
    userType: {
      type: String,
      enum: ['farmer', 'buyer'],
      required: [true, 'Please specify user type'],
    },
    location: {
      address: {
        type: String,
        required: [true, 'Please provide an address'],
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: '2dsphere',
      },
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
    },
    profileImage: {
      type: String,
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot be more than 500 characters'],
    },
    companyName: {
      type: String,
    },
    farmSize: {
      type: Number, // in acres/hectares
    },
    farmType: {
      type: [String], // e.g., ['organic', 'conventional']
    },
    crops: {
      type: [String], // e.g., ['wheat', 'corn', 'soybeans']
    },
    verified: {
      type: Boolean,
      default: false,
    },
    ratings: {
      average: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Delete the mongoose model if it exists to prevent OverwriteModelError
const User = (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema);

export default User; 