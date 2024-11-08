const express = require("express");
const { queryDatabase } = require('../Database/testing'); 
const router = express.Router();




router.post('/', (req, res) => {
    const { quiz_id, password } = req.body;

    const queryQuiz = 'SELECT * FROM quizzes WHERE QuizID = ? AND password = ?';
    db.query(queryQuiz, [quiz_id, password], (err, quizResult) => {
        if (err) throw err;

        if (quizResult.length > 0) {
            // Fetch questions for the quiz
            const queryQuestions = 'SELECT question_id, question, answer FROM questions WHERE quiz_id = ?';
            db.query(queryQuestions, [quiz_id], (err, questionResult) => {
                if (err) throw err;

                // If questions found, fetch the options for each question
                if (questionResult.length > 0) {
                    const questionIds = questionResult.map(q => q.question_id);

                    const queryOptions = 'SELECT question_id, option_text FROM options WHERE question_id IN (?)';
                    db.query(queryOptions, [questionIds], (err, optionsResult) => {
                        if (err) throw err;

                        // Group options by question_id
                        const questionsWithOptions = questionResult.map(question => {
                            return {
                                question_id: question.question_id,
                                question: question.question,
                                answer: question.answer,
                                options: optionsResult
                                    .filter(option => option.question_id === question.question_id)
                                    .map(opt => opt.option_text)
                            };
                        });

                        res.json({
                            success: true,
                            questions: questionsWithOptions
                        });
                    });
                } else {
                    res.json({
                        success: true,
                        questions: [] // No questions found
                    });
                }
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid Quiz ID or Password'
            });
        }
    });
});

module.exports = router;