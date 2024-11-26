import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, get, update } from "firebase/database";


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

// عرض قائمة اللاعبين
const displayPlayers = () => {
    const playersRef = ref(db, "players");
    onValue(playersRef, (snapshot) => {
        const players = snapshot.val();
        const playersList = document.getElementById("players-list");
        playersList.innerHTML = "";

        for (const playerId in players) {
            const playerItem = document.createElement("li");
            playerItem.textContent = players[playerId];
            playersList.appendChild(playerItem);
        }
    });
};
document.addEventListener("DOMContentLoaded", displayPlayers);


const createTeamsStructure = async () => {
    const playersRef = ref(db, "players");
    const snapshot = await get(playersRef);

    if (snapshot.exists()) {
        const players = Object.values(snapshot.val());
        const numberOfTeams = Math.ceil(players.length / 3);
        const teams = {};

        for (let i = 1; i <= numberOfTeams; i++) {
            teams[`team${i}`] = {
              players: [], 
              messages: {} 
            };
          }

        players.sort(() => Math.random() - 0.5);

        players.forEach((player, index) => {
            teams[`team${(index % numberOfTeams) + 1}`].push(player);
        });

        const teamsRef = ref(db, "teams");
        await update(teamsRef, teams);

        alert("تم إنشاء الفرق بنجاح!");
    } else {
        alert("لا يوجد لاعبين لتوزيعهم.");
    }
};

// بدء اللعبة
const startGame = () => {
    alert("اللعبة بدأت!");
    // هنا يمكن إضافة منطق البدء
};

