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

	
</script>

