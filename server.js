const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const formidable = require("express-formidable");
// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();
const app = express();

// Route files

app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: true }));
const auth = require("./routes/auth");
const admin = require("./routes/admin");
const student = require("./routes/student");

const commonRoute = require("./routes/common");

app.get("/", (req, res) => {
  return res.status(202).json({
    message: "Url not exists",
  });
});

app.use("/auth", auth);
app.use("/admin", admin);
app.use("/student", student);
app.use(formidable());
app.use("/", commonRoute);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
// process.on('unhandledRejection', (err, promise) => {
// console.log(`Error: ${err.message}`.red);
//   Close server & exit process
// server.close(() => process.exit(1));
// });
