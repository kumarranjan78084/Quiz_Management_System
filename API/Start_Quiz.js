const express = require("express");
const { queryDatabase } = require('../Database/testing'); 
const router = express.Router();

router.post('/', async (req, res) => {
    const { quizID, password } = req.body;

    if (!quizID || !password) {
        return res.status(400).json({ success: false, message: 'Quiz ID and password are required' });
    }

    try {
        console.log("Received request for quizID:", quizID);
        const quizQuery = `SELECT * FROM quiz WHERE quizID = ? AND password = ?`;
        const quizResult = await queryDatabase(quizQuery, [quizID, password]);
        if (quizResult.length === 0) {
            console.log("No quiz found for the provided quizID and password.");
            return res.status(401).json({ success: false, message: 'Invalid Quiz ID or Password' });
        }
        const fetchQuestionsQuery = `SELECT * FROM questions WHERE quizID = ?`;
        const questionsResult = await queryDatabase(fetchQuestionsQuery, [quizID]);

        const questions = questionsResult.map((question, index) => ({
            id:  index+1,
            Question_text: question.question,       
            Question_ans: question.correct_answer, 
            Question_options: question.options     
        }));

        const quizData = {
            Title: quizResult[0].Title,  
            total_mark: quizResult[0].total_mark,  
            Duration: quizResult[0].Duration,  
            Questions: questions  
        };

        console.log("Quiz data retrieved successfully:", quizData);
        res.status(200).json({ success: true, quizData });

    } catch (error) {
        console.error("Error querying the database:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
