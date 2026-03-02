require("dotenv").config();
const fs = require("fs");
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,        
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  ssl: {
    ca: fs.readFileSync('./ca.pem'),
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
