const express = require("express");
const fs = require("fs");
const { queryDatabase } = require('../Database/testing');
const router = express.Router();

function generateNewId(lastId) {
    if (!lastId) {
        return "10SI101";
    }

    const numericPart = parseInt(lastId.slice(4));
    const newNumericPart = numericPart + 1;
    return `10SI${newNumericPart}`;
}

router.post('/', async (req, res) => {
    const { Name, email, phone, college, department, password } = req.body;

    const tableName = 'students';
    const idColumn = 'student_id';

    fs.readFile('./modules/data.txt', 'utf8', (err, data) => {
        let users = [];
        let newId;

        if (!err && data) {
            try {
                users = JSON.parse(data);
            } catch (parseError) {
                console.error('Error parsing existing data:', parseError);
            }
        }

        const lastUser = users.length ? users[users.length - 1] : null;
        const lastId = lastUser ? lastUser.id : null;
        newId = generateNewId(lastId);

        const query = `INSERT INTO ${tableName} (${idColumn}, name, email, phone_no, college, branch, password) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const params = [newId, Name, email, phone, college, department, password];

        queryDatabase(query, params)
            .then((result) => {
                const newUser = {
                    id: newId,
                    Name,
                    email,
                    phone,
                    college,
                    department,
                    password
                };
                users.push(newUser);
                fs.writeFile('./modules/data.txt', JSON.stringify(users, null, 2), (err) => {
                    if (err) {
                        console.error('Error writing to file:', err);
                        return res.status(500).json({ success: false, message: 'Failed to save data to file' });
                    }
                    res.status(200).json({
                        success: true,
                        message: 'Signup data saved successfully in database and file',
                        id: newId
                    });
                });
            })
            .catch((err) => {
                console.error('Error saving signup data to database:', err);
                res.status(500).json({ success: false, message: 'Failed to save data to database' });
            });
    });
});

module.exports = router;
