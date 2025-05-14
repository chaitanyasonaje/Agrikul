const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Store connected users
const connectedUsers = new Map();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });
  
  // Initialize Socket.IO
  const io = new Server(server);
  
  // Socket.IO events
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    
    // User login
    socket.on('user:login', (userId) => {
      console.log(`User ${userId} logged in with socket ${socket.id}`);
      connectedUsers.set(userId, socket.id);
      
      // Broadcast user online status
      io.emit('user:status', { userId, status: 'online' });
    });
    
    // User disconnection
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
    
    // Chat messages
    socket.on('message:send', (message) => {
      console.log('New message received:', message);
      
      // Broadcast to everyone in the chat room
      io.to(message.chatId).emit('message:received', message);
      
      // Store in database (would be implemented separately)
    });
    
    // Join chat room
    socket.on('chat:join', (chatId) => {
      console.log(`Socket ${socket.id} joining chat room: ${chatId}`);
      socket.join(chatId);
    });
    
    // Leave chat room
    socket.on('chat:leave', (chatId) => {
      console.log(`Socket ${socket.id} leaving chat room: ${chatId}`);
      socket.leave(chatId);
    });
    
    // Typing indicators
    socket.on('typing:start', ({ chatId, userId }) => {
      // Broadcast to everyone else in the room
      socket.to(chatId).emit('typing:update', { userId, isTyping: true });
    });
    
    socket.on('typing:stop', ({ chatId, userId }) => {
      // Broadcast to everyone else in the room
      socket.to(chatId).emit('typing:update', { userId, isTyping: false });
    });
  });
  
  // Start the server
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
}); 