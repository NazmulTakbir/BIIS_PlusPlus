const express = require("express");
// const { check } = require("express-validator");

const StudentController = require("../controllers/Admin/StudentController");
const TeacherController = require("../controllers/Admin/TeacherController");
const CourseController = require("../controllers/Admin/CourseController");
const CourseOfferingController = require("../controllers/Admin/CourseOfferingController");
const CourseTeacherController = require("../controllers/Admin/CourseTeacherController");
const NoticeController = require("../controllers/Admin/NoticeController");

// const CheckAuth = require("../middleware/CheckAuth");

const AdminRoutes = express.Router();

// AdminRoutes.use(checkAuth);

AdminRoutes.post("/student/add", StudentController.postAddStudent);

AdminRoutes.post("/teacher/add", TeacherController.postAddTeacher);

AdminRoutes.post("/course/add", CourseController.postAddCourse);

AdminRoutes.post("/offering/add", CourseOfferingController.postAddCourseOffering);

AdminRoutes.post("/courseteacher/add", CourseTeacherController.postAddCourseTeacher);

AdminRoutes.post("/notice/add", NoticeController.postAddNotice);

module.exports = AdminRoutes;
