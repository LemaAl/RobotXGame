const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(express.static('public'));

const dbURI = "mongodb+srv://LemaAl:LemaOmar12.@cluster0.tgmnb.mongodb.net/MyData?retryWrites=true&w=majority";
    const adminNames = ["NouraBader", "LemaOmar"];

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));


    const codes = [
        { number: 1, hints: ["gives us vision","everywhere ", "something we can see but can’t touch"], answer: "light" },
        { number: 2, hints: ["I am greater than all negative numbers", "I have no opposite", "I am the starting point of the axes"], answer: "Zero" },
        { number: 3, hints: ["a system that makes robots learn from data", "used in self-driving cars", "need a “training set” to work properly"], answer: "Machine Learning" },
        { number: 4, hints: ["An open source operating system", "It is widely used in servers", "Its name starts with -L-"], answer: "Linux" },
        { number: 5, hints: ["My form is: 192.168.0.1", "made up of four sets of numbers", "used to identify devices on a network"], answer: "IP" },
        { number: 6, hints: ["My name has the word Scope", "Galileo first used me", "a tool used to see distant objects"], answer: "Telescope" },
        { number: 7, hints: ["Starts with C and ends with S", "4-letter abbreviation", "Used to detect weaknesses"], answer: "CTFs" },
        { number: 8, hints: ["My name starts with B", "My method is based on continuous comparison", "Used to sort data"], answer: "Bubble sort" },
        { number: 9, hints: ["a system that makes robots learn from data", "used in self-driving cars", "need a “training set” to work properly"], answer: "RobotX" },
        { number: 10, hints: ["robot", "best people", "Club"], answer: "Machine Learning" },
    ];

    
    const playerSchema = new mongoose.Schema({
        name: { type: String, required: true },
        score: { type: Number, default: 0 } 
    });
    const Player = mongoose.model("Player", playerSchema);
    

app.post("/players", async (req, res) => {
    try {
        const playerName = req.body.name;

        if (adminNames.includes(playerName)) {
            return res.status(200).json({ isAdmin: true }); 
        }
        const newPlayer = new Player({ name: playerName });
        await newPlayer.save();
        res.status(201).json({ isAdmin: false, player: newPlayer });
    } catch (error) {
        res.status(500).json({ error: "Failed to add player" });
    }
});
    
    app.get("/players", async (req, res) => {
        try {
            const players = await Player.find();
            res.json(players);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch players" });
        }
    });

    app.post("/game/start", async (req, res) => {
        try {
            const gameState = new GameState({ started: true });
            await gameState.save();
            res.json({ message: "Game started" });
        } catch (error) {
            res.status(500).json({ error: "Failed to start game" });
        }
    });

    

    app.post("/game/start", async (req, res) => {
        try {
            let gameState = await GameState.findOne();
            if (!gameState) {
                // إذا لم تكن هناك حالة لعبة، أنشئ واحدة جديدة
                gameState = new GameState({ started: true });
            } else {
                // إذا كانت موجودة، قم بتحديثها
                gameState.started = true;
            }
    
            await gameState.save(); // حفظ التحديث
            res.json({ message: "تم بدء اللعبة بنجاح!" }); // إرسال رد للعميل
        } catch (error) {
            console.error("خطأ أثناء بدء اللعبة:", error);
            res.status(500).json({ error: "فشل في بدء اللعبة." });
        }
    });
    

app.get("/game/state", async (req, res) => {
    try {
        const gameState = await GameState.findOne();
        res.json(gameState || { started: false });
    } catch (error) {
        console.error("خطأ أثناء جلب حالة اللعبة:", error);
        res.status(500).json({ error: "فشل في جلب حالة اللعبة." });
    }
});

const gameStateSchema = new mongoose.Schema({
    started: { type: Boolean, default: false }, 
    createdAt: { type: Date, default: Date.now },
});

const GameState = mongoose.model("GameState", gameStateSchema);
    

// حالة اللعبة
let gameState = {
    currentCodeIndex: 0, // البداية من أول شفرة
    isGameStarted: false
};

// مسار لبدء اللعبة
app.post("/game/start", (req, res) => {
    if (!codes.length) {
        return res.status(400).json({ error: "لا توجد شفرات لبدء اللعبة." });
    }
    gameState.currentCodeIndex = 0;
    gameState.isGameStarted = true;
    res.json({ message: "تم بدء اللعبة!" });
});

app.get("/game/code", (req, res) => {
    if (!gameState.isGameStarted) {
        return res.status(400).json({ error: "اللعبة لم تبدأ بعد." });
    }

    const currentCode = codes[gameState.currentCodeIndex];
    if (!currentCode) {
        return res.status(404).json({ error: "لا توجد شفرة حالية." });
    }

    res.json({
        codeNumber: currentCode.number,
        hints: currentCode.hints
    });
});

app.post("/game/submit", (req, res) => {
    const { answer } = req.body;

    if (!answer) {
        return res.status(400).json({ error: "الإجابة مطلوبة." });
    }

    const currentCode = codes[gameState.currentCodeIndex];
    if (!currentCode) {
        return res.status(404).json({ error: "لا توجد شفرة حالية." });
    }

    const isCorrect = currentCode.answer.toLowerCase().trim() === answer.toLowerCase().trim();

    if (isCorrect) {
        if (gameState.currentCodeIndex === codes.length - 1) {
            gameState.isGameStarted = false; // إنهاء اللعبة
            return res.json({
                correct: true,
                message: "تهانينا! لقد أكملت جميع الشفرات! 🎉",
                isGameOver: true
            });
        } else {
            gameState.currentCodeIndex++; // الانتقال إلى المرحلة التالية
            return res.json({
                correct: true,
                message: "إجابة صحيحة! تم الانتقال إلى المرحلة التالية."
            });
        }
    } else {
        return res.json({ correct: false, message: "إجابة خاطئة. حاول مرة أخرى." });
    }
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
