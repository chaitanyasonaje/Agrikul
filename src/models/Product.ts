import mongoose, { Schema, Document, Model } from 'mongoose';
import slugGenerator from 'mongoose-slug-generator';

mongoose.plugin(slugGenerator);

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  category: string;
  subCategory?: string;
  images: string[];
  price: {
    amount: number;
    currency: string;
    unit: string; // e.g., 'kg', 'ton', 'bushel'
    negotiable: boolean;
  };
  quantity: {
    available: number;
    unit: string;
    minimum: number;
  };
  quality: {
    grade?: string;
    certification?: string[];
    organic: boolean;
  };
  harvest: {
    date?: Date;
    season?: string;
  };
  location: {
    address: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  farmer: mongoose.Types.ObjectId;
  status: 'available' | 'low-stock' | 'sold-out' | 'archived';
  featured: boolean;
  ratings: {
    average: number;
    count: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
    },
    slug: {
      type: String,
      slug: 'name',
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      index: true,
    },
    subCategory: {
      type: String,
    },
    images: {
      type: [String],
      default: [],
    },
    price: {
      amount: {
        type: Number,
        required: [true, 'Please provide a price'],
      },
      currency: {
        type: String,
        required: [true, 'Please provide a currency'],
        default: 'USD',
      },
      unit: {
        type: String,
        required: [true, 'Please provide a unit'],
      },
      negotiable: {
        type: Boolean,
        default: true,
      },
    },
    quantity: {
      available: {
        type: Number,
        required: [true, 'Please provide available quantity'],
      },
      unit: {
        type: String,
        required: [true, 'Please provide a unit for quantity'],
      },
      minimum: {
        type: Number,
        default: 1,
      },
    },
    quality: {
      grade: {
        type: String,
      },
      certification: {
        type: [String],
      },
      organic: {
        type: Boolean,
        default: false,
      },
    },
    harvest: {
      date: {
        type: Date,
      },
      season: {
        type: String,
      },
    },
    location: {
      address: {
        type: String,
        required: [true, 'Please provide an address'],
      },
      coordinates: {
        type: [Number],
        index: '2dsphere',
      },
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a farmer ID'],
    },
    status: {
      type: String,
      enum: ['available', 'low-stock', 'sold-out', 'archived'],
      default: 'available',
    },
    featured: {
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

// Create indexes for better query performance
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ 'price.amount': 1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ status: 1 });

const Product = (mongoose.models.Product as Model<IProduct>) || mongoose.model<IProduct>('Product', ProductSchema);

export default Product; 