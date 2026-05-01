const mysql = require('mysql2');

// Create the connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'task_manager',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Use promises
const db = pool.promise();

// Test the connection
db.getConnection()
    .then(connection => {
        console.log('Connected to the MySQL database.');
        connection.release();
    })
    .catch(err => {
        console.error('Database connection failed:', err.message);
    });

module.exports = db;
