import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiRequest } from 'next';
import { NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
};

// This object will store all connected clients and their socket IDs
export const connectedUsers = new Map<string, string>();

export default function initSocket(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (!res.socket.server.io) {
    console.log('*First use, initializing socket.io server...');
    
    // Create a new Socket.IO server instance
    const io = new SocketIOServer(res.socket.server);
    
    // Save the socket server instance
    res.socket.server.io = io;

    // Handle socket connections
    io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);
      
      // Handle user login/authentication
      socket.on('user:login', (userId: string) => {
        console.log(`User ${userId} logged in with socket ${socket.id}`);
        connectedUsers.set(userId, socket.id);
        
        // Broadcast user online status
        io.emit('user:status', { userId, status: 'online' });
      });
      
      // Handle user disconnection
      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        
        // Find and remove the disconnected user
        for (const [userId, socketId] of connectedUsers.entries()) {
          if (socketId === socket.id) {
            connectedUsers.delete(userId);
            
            // Broadcast user offline status
            io.emit('user:status', { userId, status: 'offline' });
            break;
          }
        }
      });
      
      // Handle chat messages
      socket.on('message:send', (message) => {
        console.log('New message received:', message);
        
        // Broadcast to everyone in the chat room
        io.to(message.chatId).emit('message:received', message);
        
        // Store message in database (would be implemented separately)
      });
      
      // Handle joining a chat room
      socket.on('chat:join', (chatId: string) => {
        console.log(`Socket ${socket.id} joining chat room: ${chatId}`);
        socket.join(chatId);
      });
      
      // Handle leaving a chat room
      socket.on('chat:leave', (chatId: string) => {
        console.log(`Socket ${socket.id} leaving chat room: ${chatId}`);
        socket.leave(chatId);
      });
      
      // Handle typing indicators
      socket.on('typing:start', ({ chatId, userId }) => {
        // Broadcast to everyone else in the room
        socket.to(chatId).emit('typing:update', { userId, isTyping: true });
      });
      
      socket.on('typing:stop', ({ chatId, userId }) => {
        // Broadcast to everyone else in the room
        socket.to(chatId).emit('typing:update', { userId, isTyping: false });
      });
    });
  }
  
  return res.socket.server.io;
} 