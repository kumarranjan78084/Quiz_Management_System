const express = require("express");
const { queryDatabase } = require('../Database/testing'); 
const router = express.Router();

async function generateNewQuizId() {
    const result = await queryDatabase('SELECT MAX(QuizID) as maxId FROM Quiz');
    return (result[0].maxId || 0) + 1; 
}

async function generatePassword() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < 8; i++) {
        key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return key;
}

router.post('/', async (req, res) => {
    const { Title, Questions, Duration, FacultyID, Marks } = req.body;

    console.log("Received data:", req.body); 

    if (!Title || !Questions || !Duration || !FacultyID || !Marks) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const hours = Math.floor(Duration / 3600);
    const minutes = Math.floor((Duration % 3600) / 60);
    const seconds = Duration % 60;
    const totalDuration = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    console.log("Formatted Duration:", totalDuration);

    try {
        const newQuizId = await generateNewQuizId();
        const password = await generatePassword();

        const query = `INSERT INTO Quiz (QuizID, Title, CreatedDate, Duration, FacultyID, password, total_mark) VALUES (?, ?, CURRENT_TIMESTAMP, ?, ?, ?, ?)`;
        const params = [newQuizId, Title, totalDuration, FacultyID, password, Marks]; // Corrected param order

        await queryDatabase(query, params);

        res.status(200).json({
            success: true,
            message: 'Quiz created successfully',
            quizId: newQuizId,
            password: password
        });
    } catch (err) {
        console.error('Error saving quiz data to database:', err); 
        res.status(500).json({ success: false, message: 'Failed to save quiz data to database' });
    }
});

module.exports = router;
