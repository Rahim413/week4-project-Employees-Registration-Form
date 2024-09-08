import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
// Connect to DataBase
const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET all employees
app.get('/employees_registration', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM employees_registration');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Error fetching employees', error: error.message });
  }
});

// POST new employee
app.post('/employees_registration', async (req, res) => {
  const { FirstName, LastName, Email, PhoneNumber, JobTitle, Salary, DateOfBirth, StartDate, Gender } = req.body;

  try {
    // Check if email already exists
    const emailCheck = await db.query('SELECT * FROM employees_registration WHERE email = $1', [Email]);

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const result = await db.query(
      `INSERT INTO employees_registration 
      (firstname, lastname, email, phonenumber, jobtitle, salary, dateofbirth, startdate, gender) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [FirstName, LastName, Email, PhoneNumber, JobTitle, Salary, DateOfBirth, StartDate, Gender]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error registering employee:', error);
    res.status(500).json({ message: 'Error registering employee', error: error.message });
  }
});

// Search employee by last name
app.get('/employees_registration/search', async (req, res) => {
  const { lastname } = req.query;

  try {
    const result = await db.query(
      'SELECT * FROM employees_registration WHERE lastname = $1',
      [lastname]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    console.error('Error searching employee:', error);
    res.status(500).json({ message: 'Error searching employee', error: error.message });
  }
});

// Start the server
app.listen(8080, () => {
  console.log('Server running on port 8080');
});
