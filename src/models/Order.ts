import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  price: {
    amount: number;
    currency: string;
    unit: string;
  };
  quantity: number;
  subtotal: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  buyer: mongoose.Types.ObjectId;
  farmer: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  currency: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  paymentMethod: string;
  paymentId?: string;
  shipping: {
    address: string;
    coordinates?: [number, number]; // [longitude, latitude]
    contactName: string;
    contactPhone: string;
    instructions?: string;
  };
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema: Schema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  subtotal: {
    type: Number,
    required: true,
  },
});

const OrderSchema: Schema = new Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [OrderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: 'USD',
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'canceled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'failed'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
    },
    shipping: {
      address: {
        type: String,
        required: true,
      },
      coordinates: {
        type: [Number],
        index: '2dsphere',
      },
      contactName: {
        type: String,
        required: true,
      },
      contactPhone: {
        type: String,
        required: true,
      },
      instructions: {
        type: String,
      },
    },
    estimatedDelivery: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Create order number before saving
OrderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Find the last order to increment the counter
    const lastOrder = await mongoose.models.Order.findOne({}, {}, { sort: { 'createdAt': -1 } });
    
    let counter = 1;
    if (lastOrder && lastOrder.orderNumber) {
      // Extract the counter part (last 4 digits) and increment
      const lastCounter = parseInt(lastOrder.orderNumber.substr(-4));
      if (!isNaN(lastCounter)) {
        counter = lastCounter + 1;
      }
    }
    
    // Format: YY-MM-DD-XXXX (where XXXX is a sequential number)
    this.orderNumber = `${year}-${month}-${day}-${counter.toString().padStart(4, '0')}`;
  }
  next();
});

// Create indexes for better query performance
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ buyer: 1 });
OrderSchema.index({ farmer: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ createdAt: -1 });

const Order = (mongoose.models.Order as Model<IOrder>) || mongoose.model<IOrder>('Order', OrderSchema);

export default Order; 