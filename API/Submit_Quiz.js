const express = require("express");
const { queryDatabase } = require('../Database/testing');
const router = express.Router();

router.post('/', async (req, res) => {
    const { StudentID, QuizID, AttemptDate, totalScore } = req.body;

    try {
        console.log("Received quiz data for submission:", { StudentID, QuizID, AttemptDate, totalScore });
        
        const insertQuery = `INSERT INTO student_score (StudentID, QuizID, Score, AttemptDate) VALUES (?, ?, ?, ?)`;
        const result = await queryDatabase(insertQuery, [StudentID, QuizID, totalScore, AttemptDate]);

        console.log("Quiz result saved successfully");
        return res.status(200).json({ success: true, message: 'Quiz results saved successfully.' });
    } catch (error) {
        console.error("Error saving quiz result:", error);
        return res.status(500).json({ success: false, message: 'Server error. Failed to save quiz results.' });
    }
});

module.exports = router;
