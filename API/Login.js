const express = require("express");
const { queryDatabase } = require('../Database/testing'); 
const router = express.Router();

// Login route
router.post('/', async (req, res) => {
    const { userId, password, userType } = req.body;

    let tableName = '';
    let idColumn = '';

    if (userType === 'student') {
        tableName = 'students';
        idColumn = 'student_id';
    } else if (userType === 'faculty') {
        tableName = 'faculty';
        idColumn = 'faculty_id';
    } else {
        return res.status(400).json({ success: false, message: 'Invalid user type' });
    }
    if (userType === 'student' && !userId.startsWith('10SI')) {
        return res.status(400).json({ success: false, message: 'Invalid student ID format' });
    }
    if (userType === 'faculty' && !userId.startsWith('10FI')) {
        return res.status(400).json({ success: false, message: 'Invalid faculty ID format' });
    }
    const query = `SELECT * FROM ${tableName} WHERE ${idColumn} = ? AND password = ?`;
    const params = [userId, password];

    try {
        const results = await queryDatabase(query, params);
        if (results.length > 0) {
            const user = results[0];
            return res.status(200).json({
                success: true,
                message: 'Login successful',
                name: user.name 
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Invalid user ID or password'
            });
        }
    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});


module.exports = router;
