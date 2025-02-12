import { Server } from 'socket.io';

let io;
const onlineUsers = new Map(); // ✅ Store { email -> socket.id }

export function initializeSocket(httpServer) {
  if (!io) {
    console.log('🔄 Starting WebSocket Server...');
    io = new Server(httpServer, {
      cors: {
        origin: 'http://localhost:3000', // ✅ Allow frontend connection
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log(`✅ New connection: ${socket.id}`);

      // ✅ Handle user joining
      socket.on('join', ({ userEmail }) => {
        if (!userEmail) return;
        onlineUsers.set(userEmail, socket.id);
        console.log(`🟢 ${userEmail} is online.`);
        io.emit('updateUsers', Array.from(onlineUsers.keys())); // ✅ Send online users list
      });

      // ✅ Handle user logging out
      socket.on('logout', ({ userEmail }) => {
        if (!userEmail) return;
        onlineUsers.delete(userEmail);
        console.log(`🚪 ${userEmail} logged out.`);
        io.emit('updateUsers', Array.from(onlineUsers.keys())); // ✅ Update users
      });

      // ✅ Handle disconnection
      socket.on('disconnect', () => {
        let disconnectedUser = null;
        for (const [userEmail, id] of onlineUsers.entries()) {
          if (id === socket.id) {
            disconnectedUser = userEmail;
            onlineUsers.delete(userEmail);
            break;
          }
        }
        console.log(`❌ ${disconnectedUser} went offline.`);
        io.emit('updateUsers', Array.from(onlineUsers.keys())); // ✅ Update users
      });
    });

    console.log('🚀 WebSocket Server is Ready.');
  }
  return io;
}
