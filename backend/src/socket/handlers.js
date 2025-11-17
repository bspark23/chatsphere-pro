import jwt from 'jsonwebtoken';
import Message from '../models/Message.js';
import User from '../models/User.js';

export const setupSocketHandlers = (io, redisClient) => {
  // Redis pub/sub for multi-instance support
  const pubClient = redisClient.duplicate();
  const subClient = redisClient.duplicate();
  
  Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
    subClient.subscribe('chat-messages', (message) => {
      const data = JSON.parse(message);
      io.to(data.room).emit(data.event, data.payload);
    });
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (!user) return next(new Error('Authentication error'));
      
      socket.userId = user._id.toString();
      socket.username = user.username;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    console.log(`User connected: ${socket.username}`);
    
    // Update user status
    await User.findByIdAndUpdate(socket.userId, { status: 'online' });
    socket.broadcast.emit('user-status', { userId: socket.userId, status: 'online' });

    // Join user's personal room
    socket.join(socket.userId);

    // WebRTC signaling for video/audio calls
    socket.on('call-user', (data) => {
      io.to(data.to).emit('incoming-call', {
        from: socket.userId,
        username: socket.username,
        signal: data.signal,
        callType: data.callType
      });
    });

    socket.on('accept-call', (data) => {
      io.to(data.to).emit('call-accepted', {
        signal: data.signal,
        from: socket.userId
      });
    });

    socket.on('reject-call', (data) => {
      io.to(data.to).emit('call-rejected', {
        from: socket.userId
      });
    });

    socket.on('end-call', (data) => {
      io.to(data.to).emit('call-ended', {
        from: socket.userId
      });
    });

    // Send message
    socket.on('send-message', async (data) => {
      try {
        const message = new Message({
          sender: socket.userId,
          content: data.content,
          chatType: data.chatType,
          recipient: data.recipient,
          group: data.group
        });
        
        await message.save();
        await message.populate('sender', 'username avatar');

        const room = data.chatType === 'direct' ? data.recipient : data.group;
        
        // Publish to Redis for multi-instance support
        await pubClient.publish('chat-messages', JSON.stringify({
          room,
          event: 'new-message',
          payload: message
        }));

        // Emit to current instance
        io.to(room).emit('new-message', message);
        socket.emit('new-message', message);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Typing indicator
    socket.on('typing', (data) => {
      const room = data.chatType === 'direct' ? data.recipient : data.group;
      socket.to(room).emit('user-typing', {
        userId: socket.userId,
        username: socket.username,
        isTyping: data.isTyping
      });
    });

    // Read receipt
    socket.on('mark-read', async (data) => {
      try {
        await Message.updateMany(
          { _id: { $in: data.messageIds } },
          { $addToSet: { readBy: { user: socket.userId } } }
        );
        
        socket.to(data.room).emit('messages-read', {
          messageIds: data.messageIds,
          userId: socket.userId
        });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Join group
    socket.on('join-group', (groupId) => {
      socket.join(groupId);
    });

    // Leave group
    socket.on('leave-group', (groupId) => {
      socket.leave(groupId);
    });

    // Disconnect
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.username}`);
      await User.findByIdAndUpdate(socket.userId, {
        status: 'offline',
        lastSeen: new Date()
      });
      socket.broadcast.emit('user-status', { userId: socket.userId, status: 'offline' });
    });
  });
};
