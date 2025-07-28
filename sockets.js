module.exports = function(io) {
  io.on('connection', (socket) => {
    console.log('🔌 New client connected:', socket.id);

    // Example: Broadcast a welcome message
    socket.emit('message', 'Welcome to Wildspire!');

    // Example: Listen for a custom event from client
    socket.on('chat message', (msg) => {
      // Broadcast the message to all connected clients
      io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Client disconnected:', socket.id);
    });
  });
};
