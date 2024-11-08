const express = require("express");
const { queryDatabase } = require('../Database/testing'); 
const router = express.Router();

router.post('/', async (req, res) => {
    const { quizID, studentID, feedback_rating, feedback_text } = req.body;

    try {
        
        const insertQuery = `
            INSERT INTO student_feedback (QuizID, student_id, feedback_rating, feedback_text)
            VALUES (?, ?, ?, ?)
        `;
        const result = await queryDatabase(insertQuery, [quizID, studentID, feedback_rating, feedback_text]);

        return res.status(200).json({ success: true, message: 'Feedback submitted successfully.' });
    } catch (error) {
        console.error("Error submitting feedback:", error);
        return res.status(500).json({ success: false, message: 'Server error. Failed to submit feedback.' });
    }
});

module.exports = router;
