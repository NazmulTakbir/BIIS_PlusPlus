const path = require("path");
const pool = require("./db");
const fileUpload = require("express-fileupload");
const PORT = process.env.PORT || 5000;

const express = require("express");
const bodyParser = require("body-parser");

const StudentRoutes = require("./routes/StudentRoutes");
const TeacherRoutes = require("./routes/TeacherRoutes");
const AdminRoutes = require("./routes/AdminRoutes");
// const UnauthorizedRoutes = require("./routes/UnauthorizedRoutes");
const HttpError = require("./models/HttpError");

const app = express();

app.use(bodyParser.json());
app.use(fileUpload());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/student", StudentRoutes);
app.use("/api/teacher", TeacherRoutes);
app.use("/api/admin", AdminRoutes);
// app.use("/api/auth", UnauthorizedRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

app.listen(PORT, () => {
  console.log(`server has started on port ${PORT}`);
});
