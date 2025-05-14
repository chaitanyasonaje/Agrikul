import { NextRequest, NextResponse } from 'next/server';
import { Server as ServerIO } from 'socket.io';
import { createServer } from 'http';

// This is the core socket.io handler for Next.js App Router
export async function GET(req: NextRequest, { params }: { params: { socketio: string[] } }) {
  try {
    console.log('Socket.IO handler called with params:', params.socketio);
    
    return NextResponse.json({
      success: true,
      message: 'Socket.IO handler running',
      path: params.socketio.join('/'),
    });
  } catch (error) {
    console.error('Socket.IO handler error:', error);
    return NextResponse.json(
      { error: 'Socket.IO handler error' },
      { status: 500 }
    );
  }
}

// Handle all other methods
export async function POST(req: NextRequest) {
  return NextResponse.json({ message: 'Socket.IO is working' });
}

export async function PUT(req: NextRequest) {
  return NextResponse.json({ message: 'Socket.IO is working' });
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json({ message: 'Socket.IO is working' });
}

export async function PATCH(req: NextRequest) {
  return NextResponse.json({ message: 'Socket.IO is working' });
}

export async function OPTIONS(req: NextRequest) {
  return NextResponse.json({ message: 'Socket.IO is working' });
} 