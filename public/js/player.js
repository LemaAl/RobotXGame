import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const checkIfPlayerExists = async (playerName) => {
    const playersRef = ref(db, "players");
    const snapshot = await get(playersRef);
  
    if (snapshot.exists()) {
      const players = Object.values(snapshot.val());
      return players.includes(playerName);
    }
  
    return false;
  };
  
  const registerPlayer = async () => {
    const playerName = document.getElementById("playerName").value.trim();
  
    if (playerName) {
      const exists = await checkIfPlayerExists(playerName);
      if (exists) {
        alert("الاسم موجود بالفعل. الرجاء اختيار اسم آخر.");
        return;
      }
       // التحقق إذا كان الاسم هو "LemaOmar"
        if (playerName === "LemaOmar") {
            // توجيه إلى صفحة الهوست
            window.location.href = "/host.html";
            return; // لا يتم تسجيله في قاعدة البيانات
    }
  
      push(ref(db, "players"), playerName)
        .then(() => {
          alert("تم تسجيلك بنجاح!");
          showWaitingScreen();
        })
        .catch((error) => console.error("حدث خطأ أثناء التسجيل:", error));
    } else {
      alert("يرجى إدخال اسم اللاعب!");
    }
  };
  
