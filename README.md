#  Student Management System

A full-stack, session-authenticated web application for managing student records. Built with a **Node.js/Express** backend, a **PostgreSQL** database, and a responsive **HTML/CSS/JavaScript** frontend.

---

## Features

- **User Authentication:** Secure registration and login using hashed passwords (`bcryptjs`).
- **Session Persistence:** Persistent login sessions stored in PostgreSQL using `express-session` and `connect-pg-simple`.
- **Student CRUD Operations:** 
  - View current list of students.
  - Add new students with auto-updating list views.
  - Delete student records with confirmation/error feedback.
- **Protected API Routes:** Authentication middleware (`requireLogin`) secures state-changing endpoints (adding/deleting students).
- **Responsive UI:** Clean, modern dashboard interface built with plain CSS and Flexbox/Grid layouts.

---

##  Tech Stack

### Backend
- **Node.js** & **Express.js**
- **PostgreSQL** (Database)
- **`pg`** (Node-Postgres client & connection pooling)
- **`bcryptjs`** (Password hashing)
- **`express-session`** & **`connect-pg-simple`** (Session store)
- **`dotenv`** & **`cors`**

### Frontend
- **HTML5**
- **Vanilla JavaScript (ES6+)** (`async/await`, Fetch API with `credentials: "include"`)
- **CSS3** (Flexbox, Grid, custom styling)

---

##  Database Setup

Before running the application, set up your PostgreSQL database (`student_database`) and execute the following SQL schema commands:

### 1. Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "user_sessions" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "user_sessions" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "user_sessions" ("expire");

GETTING STARTED
1. Clone the Repository

2. Backend Setup

Navigate into the backend directory and install the dependencies:
Bash

cd backend
npm install

Create a .env file in the backend/ folder and configure your database variables:
Code snippet

PORT=5000
DB_USER=ur db user
DB_HOST=localhost (or whatever it is)
DB_DATABASE=Your database
DB_PASSWORD=your_postgres_password
DB_PORT= your port
SESSION_SECRET=your_super_secret_session_key

Start the Node.js server:


node server.js

The server should output:
Plaintext

Database connected successfully!
Server running on port 5000

3. Frontend Setup

    Open index.html using Live Server (e.g., via VS Code Live Server extension at http://localhost:5500 or http://127.0.0.1:5500).

  NB:  Register a new user via curl or test logging in with an existing user.