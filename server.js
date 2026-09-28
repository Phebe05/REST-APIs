require("dotenv").config(); // Reads variables from .env file

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

// Using environment variables for pool configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Verify PostgreSQL connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("Database Connection Error:", err.message);
  } else {
    console.log("Database connected successfully!");
    release();
  }
});

app.get("/", (req, res) => {
  res.send("Student API is running!!!");
});

app.get("/students", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM students");
    res.json(result.rows);
  } catch (error) {
    console.error("Query Error:", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
});

app.post("/students", async (req, res) => {
  try {
    const { name, age } = req.body;

    const result = await pool.query(
      "INSERT INTO students (name, age) VALUES ($1, $2) RETURNING *",
      [name, age],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Sth went wrong",
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
