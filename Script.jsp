const hints = [
  {
    level: 1,
    hints: ["أستجيب للأوامر الصوتية وأُعتبر مساعدًا منزليًا.", "أُشغل الموسيقى وأتحكم في الأجهزة الذكية.", "اسمي يبدأ بـ “A”."],
    answer: "أليكسا"
  },
  {
    level: 2,
    hints: ["أكون أكبر من جميع الأعداد السالبة.", "ليس لدي عكس.", "أُعتبر نقطة البداية في المحاور."],
    answer: "الصفر"
  },
  {
    level: 3,
    hints: ["هو الشيء الذي نراه ولكن لا نستطيع لمسه.", "موجود في كل مكان من حولنا.", "يمنحنا الرؤية"],
    answer: "الضوء"
  }
];

let currentLevel = 0;

function startGame() {
  if (currentLevel < hints.length) {
    const currentHints = hints[currentLevel].hints;
    document.getElementById('hint1').textContent = `تلميح 1: ${currentHints[0]}`;
    document.getElementById('hint2').textContent = `تلميح 2: ${currentHints[1]}`;
    document.getElementById('hint3').textContent = `تلميح 3: ${currentHints[2]}`;
  } else {
    endGame();
  }
}

function submitAnswer() {
  const userAnswer = document.getElementById('answer-input').value.trim();
  if (userAnswer === hints[currentLevel].answer) {
    document.getElementById('winner-message').textContent = "الإجابة صحيحة! فريقك فاز!";
    document.getElementById('winner-section').style.display = "block";
  } else {
    alert("إجابة خاطئة! حاول مرة أخرى.");
  }
}

function endGame() {
  document.getElementById('winner-message').textContent = "اللعبة انتهت! شكراً للمشاركة.";
  document.getElementById('winner-section').style.display = "block";
  document.getElementById('team-hints').style.display = "none";
  document.getElementById('answer-section').style.display = "none";
}

startGame();
// script.js
<!-- The core Firebase JS SDK is always required and must be listed first -->
<script src="https://www.gstatic.com/firebasejs/6.6.1/firebase-app.js"></script>
 <script src="https://www.gstatic.com/firebasejs/6.6.1/firebase-databace.js"></script>
<!-- include firebase database -->
<script src="https://www.gstatic.com/firebasejs/6.6.1/firebase-database.js"></script>
 
<script>
    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "",
        authDomain: "",
        databaseURL: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: ""
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
	
const socket = io();
let currentTeam = '';

// تسجيل اللاعب والانضمام إلى الفريق
function registerPlayer() {
  const playerName = document.getElementById('playerName').value.trim();
  const team = document.getElementById('teamSelect').value;

  if (!playerName) {
    alert("يرجى إدخال اسم اللاعب!");
    return;
  }

  currentTeam = team;
  socket.emit('joinTeam', { playerName, team });

  document.getElementById('register').style.display = 'none';
  document.getElementById('chatRoom').style.display = 'block';
}

// إرسال رسالة في الشات
function sendMessage() {
  const message = document.getElementById('messageInput').value.trim();
  if (message) {
    socket.emit('chatMessage', { team: currentTeam, message });
    document.getElementById('messageInput').value = '';
  }
}

// استقبال الرسائل وعرضها في واجهة الشات

});
var myName = prompt("Enter your name");
function sendMessage() {
    // get message
    var message = document.getElementById("messaage").value;

    // save in database
    firebase.database().ref("messages").push().set({
        "sender": myName,
        "message": message
    });

    // prevent form from submitting
    return false;
}
const hints = [

  {
    level: 1,
    hints: ["أستجيب للأوامر الصوتية وأُعتبر مساعدًا منزليًا.", "أُشغل الموسيقى وأتحكم في الأجهزة الذكية.", "اسمي يبدأ بـ “A”."],
    answer: "أليكسا"
  },
  {
    level: 2,
    hints: ["أكون أكبر من جميع الأعداد السالبة.", "ليس لدي عكس.", "أُعتبر نقطة البداية في المحاور."],
    answer: "الصفر"
  },
  {
    level: 3,
    hints: ["هو الشيء الذي نراه ولكن لا نستطيع لمسه.", "موجود في كل مكان من حولنا.", "يمنحنا الرؤية"],
    answer: "الضوء"
  }
];

let currentLevel = 0;

function startGame() {
  if (currentLevel < hints.length) {
    const currentHints = hints[currentLevel].hints;
    document.getElementById('hint1').textContent = `تلميح 1: ${currentHints[0]}`;
    document.getElementById('hint2').textContent = `تلميح 2: ${currentHints[1]}`;
    document.getElementById('hint3').textContent = `تلميح 3: ${currentHints[2]}`;
  } else {
    endGame();
  }
}

function submitAnswer() {
  const userAnswer = document.getElementById('answer-input').value.trim();
  if (userAnswer === hints[currentLevel].answer) {
    document.getElementById('winner-message').textContent = "الإجابة صحيحة! فريقك فاز!";
    document.getElementById('winner-section').style.display = "block";
  } else {
    alert("إجابة خاطئة! حاول مرة أخرى.");
  }
}

function endGame() {
  document.getElementById('winner-message').textContent = "اللعبة انتهت! شكراً للمشاركة.";
  document.getElementById('winner-section').style.display = "block";
  document.getElementById('team-hints').style.display = "none";
  document.getElementById('answer-section').style.display = "none";
}

	
</script>
