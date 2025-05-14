import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, userType, location, phone } = body;

    // Basic validation
    if (!name || !email || !password || !userType || !location || !phone) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      userType,
      location,
      phone,
      verified: false,
      // Add any other fields from the request body as needed
      ...(body.companyName && { companyName: body.companyName }),
      ...(body.bio && { bio: body.bio }),
      ...(body.farmSize && { farmSize: body.farmSize }),
      ...(body.farmType && { farmType: body.farmType }),
      ...(body.crops && { crops: body.crops }),
    });

    // Return success response without password
    const newUser = user.toObject();
    delete newUser.password;

    return NextResponse.json(
      { success: true, message: 'User registered successfully', user: newUser },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
} 