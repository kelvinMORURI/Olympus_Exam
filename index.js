const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const secretKey = 'super_secret_key_abcd1234'; // Replace with a secure key


const { Sequelize, DataTypes } = require("sequelize");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

// Parse incoming requests data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Sequelize
const sequelize = new Sequelize("eAssessmentDB", "root", "kelvin", {
  host: "localhost",
  dialect: "mysql",
});

// Define models
const Course = sequelize.define(
  "Course",
  {
    CourseID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    CourseName: { type: DataTypes.STRING, allowNull: false },
    CourseDescription: { type: DataTypes.TEXT },
    StudyMode: { type: DataTypes.TEXT },
    Credits: { type: DataTypes.INTEGER },
  },
  {
    tableName: "CourseTable",
    timestamps: false,
  }
);

const Student = sequelize.define(
  "Student",
  {
    StudentID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    FirstName: { type: DataTypes.STRING, allowNull: false },
    LastName: { type: DataTypes.STRING, allowNull: false },
    Email: { type: DataTypes.STRING, allowNull: false, unique: true },
    PasswordHash: { type: DataTypes.STRING, allowNull: false },
    EnrollmentDate: { type: DataTypes.DATE },
  },
  {
    tableName: "StudentsTable",
    timestamps: false,
  }
);

const Unit = sequelize.define(
  "Unit",
  {
    UnitID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    CourseID: { type: DataTypes.INTEGER, allowNull: false }, // Example foreign key relationship
    UnitName: { type: DataTypes.STRING, allowNull: false },
    UnitDescription: { type: DataTypes.TEXT },
  },
  {
    tableName: "UnitTable", // Adjust table name as needed
    timestamps: false,
  }
);

// Define ResultsTable model
const ResultsTable = sequelize.define(
  "ResultsTable",
  {
    ResultID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    StudentID: { type: DataTypes.INTEGER, allowNull: false },
    ExamID: { type: DataTypes.INTEGER, allowNull: false },
    TotalMarksObtained: { type: DataTypes.INTEGER, allowNull: false },
    Grade: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: "ResultsTable",
    timestamps: false,
  }
);

const QuestionsTable = sequelize.define(
  "QuestionsTable",
  {
    QuestionID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ExamID: { type: DataTypes.INTEGER, allowNull: false },
    QuestionText: { type: DataTypes.TEXT, allowNull: false },
    Marks: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: "QuestionsTable",
    timestamps: false,
  }
);

// Define QuestionOptionsTable model
const QuestionOptionsTable = sequelize.define(
  "QuestionOptionsTable",
  {
    OptionID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    QuestionID: { type: DataTypes.INTEGER, allowNull: false },
    OptionText: { type: DataTypes.TEXT, allowNull: false },
    IsCorrect: { type: DataTypes.BOOLEAN, allowNull: false },
  },
  {
    tableName: "QuestionOptionsTable",
    timestamps: false,
  }
);

// Define InstructorsTable model
const InstructorsTable = sequelize.define(
  "InstructorsTable",
  {
    InstructorID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    FirstName: { type: DataTypes.STRING, allowNull: false },
    LastName: { type: DataTypes.STRING, allowNull: false },
    Email: { type: DataTypes.STRING, allowNull: false, unique: true },
    HireDate: { type: DataTypes.DATE, allowNull: false },
    PasswordHash: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: "InstructorsTable",
    timestamps: false,
  }
);

const FeedbackTable = sequelize.define(
  "FeedbackTable",
  {
    FeedbackID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    StudentID: { type: DataTypes.INTEGER, allowNull: false },
    ExamID: { type: DataTypes.INTEGER, allowNull: false },
    FeedbackText: { type: DataTypes.TEXT, allowNull: false },
    SubmissionDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "FeedbackTable",
    timestamps: false,
  }
);

// Define exam model
const ExamsTable = sequelize.define(
  "ExamsTable",
  {
    ExamID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    CourseID: { type: DataTypes.INTEGER, allowNull: false },
    ExamName: { type: DataTypes.STRING, allowNull: false },
    ExamDate: { type: DataTypes.DATE, allowNull: false },
    Duration: { type: DataTypes.INTEGER, allowNull: false },
    TotalMarks: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: "ExamsTable",
    timestamps: false,
  }
);

const ExamSchedulesTable = sequelize.define(
  "ExamSchedulesTable",
  {
    ScheduleID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ExamID: { type: DataTypes.INTEGER, allowNull: false },
    ScheduledDate: { type: DataTypes.DATE, allowNull: false },
    Location: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: "ExamSchedulesTable",
    timestamps: false,
  }
);

const ExamResponseTable = sequelize.define(
  "ExamResponseTable",
  {
    ResponseID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ExamID: { type: DataTypes.INTEGER, allowNull: false },
    StudentID: { type: DataTypes.INTEGER, allowNull: false },
    QuestionID: { type: DataTypes.INTEGER, allowNull: false },
    AttemptId: {type: DataTypes.INTEGER, allowNull:false},
    OptionId: { type: DataTypes.INTEGER, allowNull: false },
    IsCorrect: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: "ExamResponseTable",
    timestamps: false,
  }
);

const ExamAttemptsTable = sequelize.define(
  "ExamAttemptsTable",
  {
    AttemptID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ExamID: { type: DataTypes.INTEGER, allowNull: false },
    StudentID: { type: DataTypes.INTEGER, allowNull: false },
    AttemptDate: { type: DataTypes.DATE, allowNull: false },
  },
  {
    tableName: "ExamAttemptsTable",
    timestamps: false,
  }
);

const Course_InstructorTable = sequelize.define(
  "Course_InstructorTable",
  {
    CourseID: { type: DataTypes.INTEGER, allowNull: false },
    InstructorID: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: "Course_InstructorTable",
    timestamps: false,
  }
);

// Define the relationship for exam & courses join querry
ExamsTable.belongsTo(Course, { foreignKey: "CourseID" });
Course.hasMany(ExamsTable, { foreignKey: "CourseID" });

// Define the relationship for unit & courses join Querry
// Define relationships
Unit.belongsTo(Course, { as: "Course", foreignKey: "CourseID" });
Course.hasMany(Unit, { foreignKey: "CourseID", as: "Units" });

// CRUD endpoints for ResultsTable

// Create a new result
app.post("/results", async (req, res) => {
  try {
    const result = await ResultsTable.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Retrieve all results
app.get("/results", async (req, res) => {
  try {
    const results = await ResultsTable.findAll();
    res.status(200).json(results);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Retrieve a specific result by ResultID
app.get("/results/:id", async (req, res) => {
  try {
    const result = await ResultsTable.findByPk(req.params.id);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: "Result not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a result by ResultID
app.put("/results/:id", async (req, res) => {
  try {
    const [updated] = await ResultsTable.update(req.body, {
      where: { ResultID: req.params.id },
    });
    if (updated) {
      const updatedResult = await ResultsTable.findByPk(req.params.id);
      res.status(200).json(updatedResult);
    } else {
      res.status(404).json({ error: "Result not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a result by ResultID
app.delete("/results/:id", async (req, res) => {
  try {
    const deleted = await ResultsTable.destroy({
      where: { ResultID: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Result not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Synchronize models with the database
sequelize
  .sync()
  .then(() => console.log("Database synchronized"))
  .catch((err) => {
    console.error("Failed to synchronize database:", err);
    process.exit(1);
  });

// CRUD endpoints for courses
app.post("/courses", async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/courses", async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.status(200).json(courses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/courses/:id", async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (course) {
      res.status(200).json(course);
    } else {
      res.status(404).json({ error: "Course not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/courses/:id", async (req, res) => {
  try {
    const [updated] = await Course.update(req.body, {
      where: { CourseID: req.params.id },
    });
    if (updated) {
      const updatedCourse = await Course.findByPk(req.params.id);
      res.status(200).json(updatedCourse);
    } else {
      res.status(404).json({ error: "Course not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/courses/:id", async (req, res) => {
  try {
    const deleted = await Course.destroy({
      where: { CourseID: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Course not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// CRUD endpoints for students

// Create a new student
app.post("/students", async (req, res) => {
  const saltRounds = 10;
  try {
    // Check if the password is provided in the request body
    const plainPassword = req.body.Password;
    if (!plainPassword) {
      return res.status(400).json({ error: "Password is required" });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    // Replace the plain password with the hashed password
    const studentData = {
      ...req.body,
      PasswordHash: hashedPassword,
    };

    // Create the student in the database
    const student = await Student.create(studentData);
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Retrieve all students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.findAll();
    res.status(200).json(students);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Retrieve a specific student by ID
app.get("/students/:id", async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (student) {
      res.status(200).json(student);
    } else {
      res.status(404).json({ error: "Student not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a student by ID
app.put("/students/:id", async (req, res) => {
  try {
    const [updated] = await Student.update(req.body, {
      where: { StudentID: req.params.id },
    });
    if (updated) {
      const updatedStudent = await Student.findByPk(req.params.id);
      res.status(200).json(updatedStudent);
    } else {
      res.status(404).json({ error: "Student not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a student by ID
app.delete("/students/:id", async (req, res) => {
  try {
    const deleted = await Student.destroy({
      where: { StudentID: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Student not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/students/login", async (req, res) => {
  try {
    const { Email, Password } = req.body;

    // Check if email and password are provided
    if (!Email || !Password) {
      return res.status(400).json({ error: "Email and Password are required" });
    }

    // Find the student by email
    const student = await Student.findOne({ where: { Email } });

    // If the student doesn't exist
    if (!student) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(Password, student.PasswordHash);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Create a JWT token excluding the PasswordHash
    const token = jwt.sign(
      {
        StudentID: student.StudentID,
        FirstName: student.FirstName,
        LastName: student.LastName,
        Email: student.Email,
        EnrollmentDate: student.EnrollmentDate,
      },
      secretKey,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Respond with the JWT token and user details (excluding PasswordHash)
    res.status(200).json({
      message: "Login successful",
      token: token,
      student: {
        StudentID: student.StudentID,
        FirstName: student.FirstName,
        LastName: student.LastName,
        Email: student.Email,
        EnrollmentDate: student.EnrollmentDate,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CRUD ENDPOINTS FOR Units

app.post("/units", async (req, res) => {
  try {
    const unit = await Unit.create(req.body);
    res.status(201).json(unit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// app.get('/units', async (req, res) => {
//     try {
//         const units = await Unit.findAll();
//         res.status(200).json(units);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });
app.get("/units", async (req, res) => {
  try {
    const units = await Unit.findAll({
      include: [
        {
          model: Course,
          as: "Course", // Use the alias defined in belongsTo
          attributes: ["CourseName"], // Specify which fields to include from the Course model
        },
      ],
    });
    res.status(200).json(units);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/units/:id", async (req, res) => {
  try {
    const unit = await Unit.findByPk(req.params.id);
    if (unit) {
      res.status(200).json(unit);
    } else {
      res.status(404).json({ error: "Unit not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/units/:id", async (req, res) => {
  try {
    const [updated] = await Unit.update(req.body, {
      where: { UnitID: req.params.id },
    });
    if (updated) {
      const updatedUnit = await Unit.findByPk(req.params.id);
      res.status(200).json(updatedUnit);
    } else {
      res.status(404).json({ error: "Unit not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/units/:id", async (req, res) => {
  try {
    const deleted = await Unit.destroy({ where: { UnitID: req.params.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Unit not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// CRUD endpoints for QuestionsTable

// Create a new question
app.post("/questions", async (req, res) => {
  try {
    const question = await QuestionsTable.create(req.body);
    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Retrieve all questions
app.get("/questions", async (req, res) => {
  try {
    const questions = await QuestionsTable.findAll();
    res.status(200).json(questions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/questions/exam/:examID", async (req, res) => {
  try {
    const questions = await QuestionsTable.findAll({
      where: { ExamID: req.params.examID },
    });
    res.status(200).json(questions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Retrieve a specific question by QuestionID
app.get("/questions/:id", async (req, res) => {
  try {
    const question = await QuestionsTable.findByPk(req.params.id);
    if (question) {
      res.status(200).json(question);
    } else {
      res.status(404).json({ error: "Question not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a question by QuestionID
app.put("/questions/:id", async (req, res) => {
  try {
    const [updated] = await QuestionsTable.update(req.body, {
      where: { QuestionID: req.params.id },
    });
    if (updated) {
      const updatedQuestion = await QuestionsTable.findByPk(req.params.id);
      res.status(200).json(updatedQuestion);
    } else {
      res.status(404).json({ error: "Question not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a question by QuestionID
app.delete("/questions/:id", async (req, res) => {
  try {
    const deleted = await QuestionsTable.destroy({
      where: { QuestionID: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Question not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// CRUD endpoints for QuestionOptionsTable

// Create a new option
app.post("/question-options", async (req, res) => {
  try {
    const option = await QuestionOptionsTable.create(req.body);
    res.status(201).json(option);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Retrieve all options
app.get("/question-options", async (req, res) => {
  try {
    const options = await QuestionOptionsTable.findAll();
    res.status(200).json(options);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/options/question/:questionId", async (req, res) => {
  try {
    const { questionId } = req.params;
    const options = await QuestionOptionsTable.findAll({
      where: { QuestionID: questionId },
    });
    res.json(options);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Retrieve a specific option by OptionID
app.get("/question-options/:id", async (req, res) => {
  try {
    const option = await QuestionOptionsTable.findByPk(req.params.id);
    if (option) {
      res.status(200).json(option);
    } else {
      res.status(404).json({ error: "Option not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update an option by OptionID
app.put("/question-options/:id", async (req, res) => {
  try {
    const [updated] = await QuestionOptionsTable.update(req.body, {
      where: { OptionID: req.params.id },
    });
    if (updated) {
      const updatedOption = await QuestionOptionsTable.findByPk(req.params.id);
      res.status(200).json(updatedOption);
    } else {
      res.status(404).json({ error: "Option not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete an option by OptionID
app.delete("/question-options/:id", async (req, res) => {
  try {
    const deleted = await QuestionOptionsTable.destroy({
      where: { OptionID: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Option not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// CRUD endpoints for FeedbackTable

// Create a new feedback
app.post("/feedbacks", async (req, res) => {
  try {
    const feedback = await FeedbackTable.create(req.body);
    res.status(201).json(feedback);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Retrieve all feedbacks
app.get("/feedbacks", async (req, res) => {
  try {
    const feedbacks = await FeedbackTable.findAll();
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Retrieve a specific feedback by ID
app.get("/feedbacks/:id", async (req, res) => {
  try {
    const feedback = await FeedbackTable.findByPk(req.params.id);
    if (feedback) {
      res.status(200).json(feedback);
    } else {
      res.status(404).json({ error: "Feedback not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a feedback by ID
app.put("/feedbacks/:id", async (req, res) => {
  try {
    const [updated] = await FeedbackTable.update(req.body, {
      where: { FeedbackID: req.params.id },
    });
    if (updated) {
      const updatedFeedback = await FeedbackTable.findByPk(req.params.id);
      res.status(200).json(updatedFeedback);
    } else {
      res.status(404).json({ error: "Feedback not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a feedback by ID
app.delete("/feedbacks/:id", async (req, res) => {
  try {
    const deleted = await FeedbackTable.destroy({
      where: { FeedbackID: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Feedback not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// CRUD endpoints for InstructorsTable

// // Create a new instructor
// app.post("/instructors", async (req, res) => {
//   try {
//     const instructor = await InstructorsTable.create(req.body);
//     res.status(201).json(instructor);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

app.post("/instructors", async (req, res) => {
  const saltRounds = 10;
  try {
    const plainPassword = req.body.Password;
    if (!plainPassword) {
      return res.status(400).json({ error: "Password is required" });
    }
    const hashedPassword = await bcrypt.hash(req.body.Password, saltRounds);
    const instructorData = {
      ...req.body,
      PasswordHash: hashedPassword,
    };
    const instructor = await InstructorsTable.create(instructorData);
    res.status(201).json(instructor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Retrieve all instructors
app.get("/instructors", async (req, res) => {
  try {
    const instructors = await InstructorsTable.findAll();
    res.status(200).json(instructors);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Retrieve a specific instructor by InstructorID
app.get("/instructors/:id", async (req, res) => {
  try {
    const instructor = await InstructorsTable.findByPk(req.params.id);
    if (instructor) {
      res.status(200).json(instructor);
    } else {
      res.status(404).json({ error: "Instructor not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/instructors/login", async (req, res) => {
  try {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
      return res.status(400).json({ error: "Email and Password are required" });
    }

    const instructor = await InstructorsTable.findOne({ where: { Email } });

    if (!instructor) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(Password, instructor.PasswordHash);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Create a JWT token excluding the PasswordHash
    const token = jwt.sign(
      {
        InstructorID: instructor.InstructorID,
        FirstName: instructor.FirstName,
        LastName: instructor.LastName,
        Email: instructor.Email,
        HireDate: instructor.HireDate,
      },
      secretKey,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Respond with the JWT token and user details (excluding PasswordHash)
    res.status(200).json({
      message: "Login successful",
      token: token,
      admin: {
        InstructorID: instructor.InstructorID,
        FirstName: instructor.FirstName,
        LastName: instructor.LastName,
        Email: instructor.Email,
        HireDate: instructor.HireDate,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CRUD endpoints for ExamsTable
app.post("/exams", async (req, res) => {
  try {
    const exam = await ExamsTable.create(req.body);
    res.status(201).json(exam);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// app.get('/exams', async (req, res) => {
//     try {
//         const exams = await ExamsTable.findAll();
//         res.status(200).json(exams);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

app.get("/exams", async (req, res) => {
  try {
    const exams = await ExamsTable.findAll({
      include: [
        {
          model: Course,
          attributes: ["CourseName"], // Only fetch CourseName
        },
      ],
    });
    res.status(200).json(exams);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/exams/:id", async (req, res) => {
  try {
    const exam = await ExamsTable.findByPk(req.params.id, {
      include: {
        model: Course,
        attributes: ["CourseName"],
      },
    });
    if (exam) {
      res.status(200).json(exam);
    } else {
      res.status(404).json({ error: "Exam not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/exams/:id", async (req, res) => {
  try {
    const [updated] = await ExamsTable.update(req.body, {
      where: { ExamID: req.params.id },
    });
    if (updated) {
      const updatedExam = await ExamsTable.findByPk(req.params.id);
      res.status(200).json(updatedExam);
    } else {
      res.status(404).json({ error: "Exam not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/exams/:id", async (req, res) => {
  try {
    const deleted = await ExamsTable.destroy({
      where: { ExamID: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Exam not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// CRUD endpoints for ExamSchedulesTable
app.post("/exam-schedules", async (req, res) => {
  try {
    const schedule = await ExamSchedulesTable.create(req.body);
    res.status(201).json(schedule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/exam-schedules", async (req, res) => {
  try {
    const schedules = await ExamSchedulesTable.findAll();
    res.status(200).json(schedules);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/exam-schedules/:id", async (req, res) => {
  try {
    const schedule = await ExamSchedulesTable.findByPk(req.params.id);
    if (schedule) {
      res.status(200).json(schedule);
    } else {
      res.status(404).json({ error: "Schedule not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/exam-schedules/:id", async (req, res) => {
  try {
    const [updated] = await ExamSchedulesTable.update(req.body, {
      where: { ScheduleID: req.params.id },
    });
    if (updated) {
      const updatedSchedule = await ExamSchedulesTable.findByPk(req.params.id);
      res.status(200).json(updatedSchedule);
    } else {
      res.status(404).json({ error: "Schedule not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/exam-schedules/:id", async (req, res) => {
  try {
    const deleted = await ExamSchedulesTable.destroy({
      where: { ScheduleID: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Schedule not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// CRUD endpoints for ExamResponseTable
app.post("/exam-responses", async (req, res) => {
  try {
    const response = await ExamResponseTable.create(req.body);
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/exam-responses", async (req, res) => {
  try {
    const responses = await ExamResponseTable.findAll();
    res.status(200).json(responses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/exam-responses/:id", async (req, res) => {
  try {
    const response = await ExamResponseTable.findByPk(req.params.id);
    if (response) {
      res.status(200).json(response);
    } else {
      res.status(404).json({ error: "Response not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/exam-responses/:id", async (req, res) => {
  try {
    const [updated] = await ExamResponseTable.update(req.body, {
      where: { ResponseID: req.params.id },
    });
    if (updated) {
      const updatedResponse = await ExamResponseTable.findByPk(req.params.id);
      res.status(200).json(updatedResponse);
    } else {
      res.status(404).json({ error: "Response not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/exam-responses/:id", async (req, res) => {
  try {
    const deleted = await ExamResponseTable.destroy({
      where: { ResponseID: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Response not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// CRUD endpoints for ExamAttemptsTable
app.post("/exam-attempts", async (req, res) => {
  try {
    const attempt = await ExamAttemptsTable.create(req.body);
    res.status(201).json(attempt);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/exam-attempts", async (req, res) => {
  try {
    const attempts = await ExamAttemptsTable.findAll();
    res.status(200).json(attempts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/exam-attempts/:id", async (req, res) => {
  try {
    const attempt = await ExamAttemptsTable.findByPk(req.params.id);
    if (attempt) {
      res.status(200).json(attempt);
    } else {
      res.status(404).json({ error: "Attempt not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/exam-attempts/:id", async (req, res) => {
  try {
    const [updated] = await ExamAttemptsTable.update(req.body, {
      where: { AttemptID: req.params.id },
    });
    if (updated) {
      const updatedAttempt = await ExamAttemptsTable.findByPk(req.params.id);
      res.status(200).json(updatedAttempt);
    } else {
      res.status(404).json({ error: "Attempt not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/exam-attempts/:id", async (req, res) => {
  try {
    const deleted = await ExamAttemptsTable.destroy({
      where: { AttemptID: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Attempt not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// CRUD endpoints for Course_InstructorTable
app.post("/course-instructors", async (req, res) => {
  try {
    const courseInstructor = await Course_InstructorTable.create(req.body);
    res.status(201).json(courseInstructor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/course-instructors", async (req, res) => {
  try {
    const courseInstructors = await Course_InstructorTable.findAll();
    res.status(200).json(courseInstructors);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/course-instructors/:courseId/:instructorId", async (req, res) => {
  try {
    const courseInstructor = await Course_InstructorTable.findOne({
      where: {
        CourseID: req.params.courseId,
        InstructorID: req.params.instructorId,
      },
    });
    if (courseInstructor) {
      res.status(200).json(courseInstructor);
    } else {
      res.status(404).json({ error: "Course-Instructor not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/course-instructors/:courseId/:instructorId", async (req, res) => {
  try {
    const [updated] = await Course_InstructorTable.update(req.body, {
      where: {
        CourseID: req.params.courseId,
        InstructorID: req.params.instructorId,
      },
    });
    if (updated) {
      const updatedCourseInstructor = await Course_InstructorTable.findOne({
        where: {
          CourseID: req.params.courseId,
          InstructorID: req.params.instructorId,
        },
      });
      res.status(200).json(updatedCourseInstructor);
    } else {
      res.status(404).json({ error: "Course-Instructor not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/course-instructors/:courseId/:instructorId", async (req, res) => {
  try {
    const deleted = await Course_InstructorTable.destroy({
      where: {
        CourseID: req.params.courseId,
        InstructorID: req.params.instructorId,
      },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Course-Instructor not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
