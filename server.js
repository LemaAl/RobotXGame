const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./firebaseConfig');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let hostId = null;
io.on('connection', (socket) => {
  console.log(`Player Join: ${socket.id}`);
  socket.on('register', async (playerName) => {
    if (!hostId) {
      hostId = socket.id;
      socket.emit('setHost');
    }
  });

  socket.on('startGame', () => {
    if (socket.id === hostId) {
      io.emit('gameStarted');
    }
  });

  socket.on('disconnect', () => {
    if (socket.id === hostId) {
      hostId = null;
    }
  });
});

server.listen(3000, () => {
  console.log('server Work on : http://localhost:3000');
});
