
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const firebaseConfig = {
  apiKey: "AIzaSyC_uFM3_FuGFEtao_ixBwJLuHyQfvvB-ZA",
  authDomain: "robotxgame1.firebaseapp.com",
  databaseURL: "https://robotxgame1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "robotxgame1",
  storageBucket: "robotxgame1.firebasestorage.app",
  messagingSenderId: "603173136605",
  appId: "1:603173136605:web:648acb4cb161738f925334",
  measurementId: "G-4Q12NPKGZ3"
};

firebase.initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
  
const sendMessage = async (teamId, playerId, messageContent) => {
  const chatRef = ref(db, `teams/${teamId}/messages`);
  const newMessageRef = push(chatRef);

  const messageData = {
    sender: playerId,
    message: messageContent,
    timestamp: Date.now(),
  };

  await set(newMessageRef, messageData);

  console.log(`تم إرسال الرسالة إلى الفريق ${teamId}`);
  document.getElementById("chat-message").value = ""; // مسح حقل الإدخال
};

const initializeChatSession = async () => {
  try {
    // افتراض وجود playerId مخزن في الجلسة
    const playerId = localStorage.getItem("playerId") || getPlayerId();

    // تحديد الفريق بناءً على playerId
    const teamId = await getTeamIdForPlayer(playerId);

    // ربط زر الإرسال
    document.getElementById("send-button").addEventListener("click", () => {
      const messageContent = document.getElementById("chat-message").value.trim();
      if (messageContent) {
        sendMessage(teamId, playerId, messageContent);
      } else {
        alert("يرجى كتابة رسالة قبل الإرسال!");
      }
    });
  } catch (error) {
    console.error("خطأ أثناء تهيئة الجلسة:", error.message);
  }
};

initializeChatSession();


const displayMessages = () => {
  // استبدال "chat" بـ "messages"
  const messagesRef = ref(db, `teams/${teamId}/messages`);
  
  // الاستماع للتغيرات في المسار
  onValue(messagesRef, (snapshot) => {
    const chatContainer = document.getElementById("chat-container");
    chatContainer.innerHTML = ""; 

    const messages = snapshot.val();
    if (messages) {
      for (const messageId in messages) {
        const { sender, message, timestamp } = messages[messageId];

        const messageElement = document.createElement("p");
        const time = new Date(timestamp).toLocaleTimeString(); 
        messageElement.textContent = `[${time}] [${sender}]: ${message}`;
        chatContainer.appendChild(messageElement);
      }
      
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  });
};

displayMessages();

let currentCodeIndex = 1; // يبدأ من الشفرة الأولى
const totalCodes = 10; // إجمالي عدد الشفرات
let teamId = "";
let playerId = "";

import { ref, get } from "firebase/database";


const loadHintForPlayer = async () => {
  try {
    // جلب بيانات الفريق
    const teamRef = ref(db, `teams/${teamId}`);
    const teamSnapshot = await get(teamRef);

    if (teamSnapshot.exists()) {
      const teamMembers = teamSnapshot.val(); // قائمة اللاعبين
      const playerIndex = teamMembers.indexOf(playerId); // فهرس اللاعب

      if (playerIndex === -1) {
        throw new Error("اللاعب غير موجود في الفريق.");
      }

      // جلب بيانات الشفرة الحالية
      const codeId = `code${currentCodeIndex}`; // تحديد معرف الشفرة الحالية
      const codeRef = ref(db, `codes/${codeId}`);
      const codeSnapshot = await get(codeRef);

      if (codeSnapshot.exists()) {
        const { hints } = codeSnapshot.val();
        const playerHint = hints[playerIndex]; // التلميح الخاص باللاعب

        // تحديث واجهة المستخدم
        document.getElementById("hint-text").textContent = `تلميحك: ${playerHint}`;
        document.getElementById("code-question").textContent = `شفرة ${currentCodeIndex}`;
        document.getElementById("result-message").textContent = ""; // مسح رسالة النتيجة
        document.getElementById("code-answer").value = ""; // مسح حقل الإجابة
      } else {
        throw new Error("لم يتم العثور على الشفرة.");
      }
    } else {
      throw new Error("لم يتم العثور على الفريق.");
    }
  } catch (error) {
    console.error(error.message);
    document.getElementById("hint-text").textContent = error.message;
  }
};

            
const checkCodeAnswer = async () => {
  try {
    const codeId = `code${currentCodeIndex}`;
    const codeRef = ref(db, `codes/${codeId}`);
    const snapshot = await get(codeRef);

    if (snapshot.exists()) {
      const { answer } = snapshot.val();
      const userAnswer = document.getElementById("code-answer").value.trim();

      const resultMessage = document.getElementById("result-message");
      if (userAnswer.toLowerCase() === answer.toLowerCase()) {
        resultMessage.textContent = "إجابة صحيحة! 🎉";
        resultMessage.style.color = "green";

        // الانتقال إلى الشفرة التالية إذا لم نصل إلى الشفرة الأخيرة
        if (currentCodeIndex < totalCodes) {
          currentCodeIndex++;
          // تحميل التلميح للشفرة التالية بعد فترة قصيرة
          setTimeout(() => {
            loadHintForPlayer();
          }, 2000); // انتظار 2 ثانية قبل الانتقال
        } else {
          // إذا أكمل الفريق اللعبة
          const gameStateRef = ref(db, "gameState");
          await update(gameStateRef, {
            completed: true,
            winningTeam: teamId
          });

          // الانتقال إلى صفحة الفوز
          window.location.href = "win.html";
        }

      } else {
        resultMessage.textContent = "إجابة خاطئة. حاول مرة أخرى.";
        resultMessage.style.color = "red";
      }
    } else {
      throw new Error("لم يتم العثور على الشفرة.");
    }
  } catch (error) {
    console.error(error.message);
    alert(error.message);
  }
};

document.getElementById("submit-answer").addEventListener("click", () => {
  checkCodeAnswer();
});

import { ref, onValue } from "firebase/database";

const monitorGameState = () => {

// مرجع إلى حالة اللعبة
const gameStateRef = ref(db, "gameState");

// الاستماع للتغييرات في حالة اللعبة
onValue(gameStateRef, (snapshot) => {
  const gameState = snapshot.val();

  if (gameState && gameState.completed) {
    const winningTeamId = gameState.winningTeam;

    // مرجع إلى بيانات الفريق الفائز
    const teamRef = ref(db, `teams/${winningTeamId}`);

    // جلب أعضاء الفريق الفائز
    onValue(teamRef, (teamSnapshot) => {
      const teamData = teamSnapshot.val();

      if (teamData) {
        const teamMembers = teamData.members;
        const membersList = teamMembers.join(", "); // تحويل الأسماء إلى نص

        // تحديث واجهة المستخدم
        document.getElementById("winning-team").textContent = `الفريق الفائز: ${winningTeamId}`;
        document.getElementById("winning-members").textContent = `الأعضاء: ${membersList}`;
      }
    });
  } else {
    document.getElementById("winning-team").textContent = "لا يوجد فريق فائز بعد.";
    document.getElementById("winning-members").textContent = "";
  }
});

};

monitorGameState();



