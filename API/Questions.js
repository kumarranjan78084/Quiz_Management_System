const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const getQuestionsFromFile = (topic) => {
    const filePath = path.join(__dirname, '../Questions', `${topic}.json`);

    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                console.error(`Error reading file at ${filePath}:`, err.message);
                reject(new Error(`Could not read questions for topic: ${topic}`));
            } else {
                try {
                    const questions = JSON.parse(data);
                    resolve(questions);
                } catch (parseError) {
                    console.error('Error parsing JSON:', parseError.message);
                    reject(new Error('Error parsing questions data'));
                }
            }
        });
    });
};

router.get('/', async (req, res) => {
    const { topic } = req.query;

    try {
        const questions = await getQuestionsFromFile(topic);
        res.json({ questions });
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ message: 'Error fetching questions' });
    }
});

module.exports = router;
