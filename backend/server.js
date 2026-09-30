require("dotenv").config(); // Reads variables from .env file

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");  //helps express connect to db
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const bcrypt = require("bcryptjs");


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

app.use(
  session({
    store: new pgSession({
      pool: pool,
      tableName: "user_sessions",
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 1000 * 60 * 60
    }
  })
);

app.get("/", (req, res) => {
  res.send("Student API is running!!!");
});

//get all students
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

//add a student(post)
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


// get a specific student
app.get("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM students WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0){
      return res.status(404).json({
           error: "Student not found"
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    
    res.status(500).json({
       error: "Something went wrong"
    })
  }
});

//updating a student
app.put("/students/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, age } = req.body;

        const result = await pool.query(
            "UPDATE students SET name = $1, age = $2 WHERE id = $3 RETURNING *",
            [name, age, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Student not found"
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Something went wrong"
        });
    }
});

//deleting a student
app.delete("/students/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM students WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Student not found"
            });
        }

        res.json({
            message: "Student deleted",
            student: result.rows[0]
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Something went wrong"
        });
    }
});

app.post("/register", async (req, res ) => {

  try {
    const { username, password } = req.body;

    if(!username || !password){
      res.status(400).json({
        error: "Username and Password are required fr"
      });
    }

    //hashing the password
    const passwordHash = await bcrypt.hash( password, 12 );

    //save the registered user

    const result = await pool.query(
      `INSERT INTO users (username, password_hash)
       VALUES ($1, $2)
       RETURNING id, username, created_at`,
      [username, passwordHash]
    );

    res.status(201).json({
      message: "User created successfully",
      user: result.rows[0]
    });
     

  } catch (error) {
      // PostgreSQL own unique constraint
    if (error.code === "23505") {
      return res.status(409).json({
        error: "Username already exists"
      });
    }

    console.error(error);

    res.status(500).json({
      error: "Something went wrong"
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Username and password are required"
      });
    }

    // Find the user
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: "Invalid username or password"
      });
    }

    const user = result.rows[0];

    // Compare the supplied password with the stored hash
    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid username or password"
      });
    }

    // User is authenticated
    req.session.userId = user.id;

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Something went wrong"
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
