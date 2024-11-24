const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./firebaseConfig'); // إعداد Firebase

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public')); // مجلد الواجهة الأمامية

const players = {}; // قائمة اللاعبين المتصلين
const teams = {}; // قائمة الفرق
const teamStages = {}; // تقدم الفرق في المراحل
let hostId = null; // معرف الهوست

io.on('connection', (socket) => {
  console.log(`لاعب متصل: ${socket.id}`);

  // تسجيل اللاعب وانتقاله لشاشة الانتظار
  socket.on('registerPlayer', (playerName) => {
    if (!hostId) {
      hostId = socket.id; // أول لاعب يصبح هو الهوست
      io.to(socket.id).emit('hostAssigned', "You are the host. Waiting for players...");
    } else {
      players[socket.id] = { name: playerName, team: null }; // إضافة اللاعب كجزء من اللاعبين
      io.to(socket.id).emit('waitingRoom', "Waiting for the host to start the game...");
      updatePlayerCount(); // تحديث عدد اللاعبين للهوست
    }
  });

  // تحديث عدد اللاعبين المتصلين للهوست
  const updatePlayerCount = () => {
    const playerCount = Object.keys(players).length;
    if (hostId) {
      io.to(hostId).emit('playerCount', playerCount); // إرسال عدد اللاعبين المتصلين (بدون الهوست)
    }
  };

  // بدء اللعبة من قبل الهوست
  socket.on('startGame', () => {
    if (socket.id === hostId) {
      const playerIds = Object.keys(players);

      // توزيع اللاعبين عشوائيًا إلى الفرق
      const teamNames = ['team1', 'team2', 'team3'];
      for (let i = 0; i < playerIds.length; i++) {
        const team = teamNames[i % teamNames.length];
        if (!teams[team]) teams[team] = [];
        teams[team].push(playerIds[i]);
        players[playerIds[i]].team = team; // تعيين الفريق للاعب
      }

      // تعيين المرحلة الأولى لكل فريق
      for (let team of teamNames) {
        if (!teamStages[team]) teamStages[team] = 1;
      }

      // إرسال الفرق لكل لاعب
      for (let playerId of playerIds) {
        const team = players[playerId].team;
        io.to(playerId).emit('teamAssigned', team);
      }

      console.log("Game started and players distributed to teams:", teams);
    }
  });

  // بدء المرحلة للفريق
  socket.on('startTeamStage', async (team) => {
    try {
      const currentStage = teamStages[team];
      const docId = `code${currentStage}`;
      const doc = await db.collection('code').doc(docId).get();

      if (doc.exists) {
        const codeData = doc.data();
        io.to(team).emit('sendCode', {
          code: codeData.code,
          hints: codeData.hints
        });
      } else {
        io.to(team).emit('gameOver', "All stages completed!");
      }
    } catch (error) {
      console.error("Error fetching code:", error);
    }
  });

  // التحقق من الإجابة
  socket.on('submitAnswer', async ({ team, answer }) => {
    try {
      const currentStage = teamStages[team];
      const docId = `code${currentStage}`;
      const doc = await db.collection('code').doc(docId).get();

      if (doc.exists) {
        const solution = doc.data().solution;
        if (answer.trim().toLowerCase() === solution.trim().toLowerCase()) {
          io.to(team).emit('correctAnswer', "Correct! Moving to the next stage.");
          teamStages[team]++;

          const nextDocId = `code${teamStages[team]}`;
          const nextDoc = await db.collection('code').doc(nextDocId).get();

          if (nextDoc.exists) {
            const nextCodeData = nextDoc.data();
            io.to(team).emit('sendCode', {
              code: nextCodeData.code,
              hints: nextCodeData.hints
            });
          } else {
            io.to(team).emit('gameOver', "All stages completed!");
          }
        } else {
          io.to(team).emit('wrongAnswer', "Wrong answer, try again!");
        }
      }
    } catch (error) {
      console.error("Error verifying answer:", error);
    }
  });

  // عند مغادرة اللاعب
  socket.on('disconnect', () => {
    console.log(`لاعب فصل الاتصال: ${socket.id}`);
    if (socket.id === hostId) {
      console.log("Host has disconnected. Game stopped.");
      hostId = null; // إعادة تعيين الهوست
    } else {
      delete players[socket.id];
      updatePlayerCount();
    }
  });
});

server.listen(3000, () => {
  console.log('الخادم يعمل على http://localhost:3000');
});
