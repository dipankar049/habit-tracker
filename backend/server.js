const express = require('express');
const app = express();
require('dotenv').config();
const dbConnection = require("./db/dbConnection");
const cors = require('cors');

dbConnection();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use('/api/auth', require("./routes/authRoutes"));
app.use('/api/routine', require("./routes/routineRoutes"));
app.use('/api/logTask', require("./routes/logRoutes"));

app.get('/', (req, res) => res.send("welcome to habit-tracker"));

app.listen(process.env.PORT, () => console.log("Server running on port 8000"));