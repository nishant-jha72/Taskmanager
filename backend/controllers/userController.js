const db = require('../db');

exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, name, email, role, status FROM users');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
