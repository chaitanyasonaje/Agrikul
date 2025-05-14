import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

// Get all products with filtering
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')) : undefined;
    const organic = searchParams.get('organic') === 'true';
    
    // Connect to database
    await dbConnect();
    
    // Build query object
    const queryObj: any = { status: 'available' };
    if (category) queryObj.category = category;
    if (query) queryObj.$text = { $search: query };
    if (organic) queryObj['quality.organic'] = true;
    
    // Price range
    if (minPrice > 0 || maxPrice) {
      queryObj['price.amount'] = {};
      if (minPrice > 0) queryObj['price.amount'].$gte = minPrice;
      if (maxPrice) queryObj['price.amount'].$lte = maxPrice;
    }
    
    // Execute query with pagination
    const skip = (page - 1) * limit;
    const products = await Product.find(queryObj)
      .populate({
        path: 'farmer',
        select: 'name location.address ratings',
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const totalCount = await Product.countDocuments(queryObj);
    
    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// Create a new product
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Only farmers can add products
    if (session.user.userType !== 'farmer') {
      return NextResponse.json(
        { success: false, message: 'Only farmers can add products' },
        { status: 403 }
      );
    }
    
    const body = await req.json();
    
    // Connect to database
    await dbConnect();
    
    // Create product with farmer ID from session
    const product = await Product.create({
      ...body,
      farmer: session.user.id,
      status: 'available',
    });
    
    return NextResponse.json(
      { success: true, message: 'Product created successfully', product },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
} 