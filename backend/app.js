const express = require('express')
const cors = require('cors')
const pool = require('./db')
const identityRoutes = require('./Routes/identityRoutes')

const app = express()
app.use(cors({
    origin:['http://localhost:5173',
            'http://identity-reconciliation-in1q2akkd-sahils-projects-056d726d.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))
app.use(express.json());

app.use('/', identityRoutes);

const PORT = process.env.PORT || 3000;

const startServer = async() => {
    try {
        await pool.query("SELECT 1");
        console.log("Database connected successfully")

        // connection.release();

        app.listen(PORT, ()=>{
            console.log(`Server is running on PORT :- ${PORT}`)
        })
    } catch (error) {
        console.error("Database connection failed. The server will not start.");
        console.error("Error details:", error.message);
    }
}

startServer()