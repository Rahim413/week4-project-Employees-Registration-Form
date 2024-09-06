import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET all employees
app.get("/employees_info", async (req, res) => {
  const result = await db.query("SELECT * FROM employees_info");
  res.json(result.rows);
});

// POST new employee
app.post("/employees_info", async (req, res) => {
  const { name, job_title, salary } = req.body;
  const result = await db.query(
    "INSERT INTO employees_info (name, job_title, salary) VALUES ($1, $2, $3) RETURNING *",
    [name, job_title, salary]
  );
  res.json(result.rows[0]);
});

// GET employee by ID
app.get("/employees_info/:id", async (req, res) => {
  const employeeId = req.params.id;
  const result = await db.query("SELECT * FROM employees_info WHERE id = $1", [employeeId]);

  if (result.rows.length > 0) {
    res.json(result.rows[0]);
  } else {
    res.status(404).json({ message: "Employee not found" });
  }
});

// Start the server
app.listen(8080, function () {
  console.log("App is running on port 8080");
});
