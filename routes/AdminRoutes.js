const express = require("express");
// const { check } = require("express-validator");

const StudentController = require("../controllers/Admin/StudentController");
const TeacherController = require("../controllers/Admin/TeacherController");
const CourseController = require("../controllers/Admin/CourseController");
const CourseOfferingController = require("../controllers/Admin/CourseOfferingController");
const CourseTeacherController = require("../controllers/Admin/CourseTeacherController");
const NoticeController = require("../controllers/Admin/NoticeController");
const DuesController = require("../controllers/Admin/DuesController");
const AcademicCalenderController = require("../controllers/Admin/AcademicCalenderController");

// const CheckAuth = require("../middleware/CheckAuth");

const AdminRoutes = express.Router();

// AdminRoutes.use(checkAuth);

AdminRoutes.post("/student/add", StudentController.postAddStudent);
AdminRoutes.get("/student/samplefile", StudentController.getSampleFile);

AdminRoutes.post("/teacher/add", TeacherController.postAddTeacher);
AdminRoutes.get("/teacher/samplefile", TeacherController.getSampleFile);

AdminRoutes.post("/course/add", CourseController.postAddCourse);
AdminRoutes.get("/course/samplefile", CourseController.getSampleFile);

AdminRoutes.post("/offering/add", CourseOfferingController.postAddCourseOffering);
AdminRoutes.get("/offering/samplefile", CourseOfferingController.getSampleFile);
AdminRoutes.get("/offering/getunofferedcourses", CourseOfferingController.getunofferedcourses);
//AdminRoutes.get("/offering/getunofferedcourses/admin_dept_id", CourseOfferingController.getunofferedcourses);
AdminRoutes.get("/offering/getexamslots", CourseOfferingController.getexamslots);

AdminRoutes.post("/courseteacher/add", CourseTeacherController.postAddCourseTeacher);
AdminRoutes.get("/courseteacher/samplefile", CourseTeacherController.getSampleFile);

AdminRoutes.post("/notice/add", NoticeController.postAddNotice);
AdminRoutes.get("/notice/samplefile", NoticeController.getSampleFile);

AdminRoutes.post("/dues/add", DuesController.postAddDues);
AdminRoutes.get("/dues/samplefile", DuesController.getSampleFile);

AdminRoutes.post("/academiccalender/add", AcademicCalenderController.addCalender);
AdminRoutes.get("/academiccalender/samplefile", AcademicCalenderController.getSampleFile);

module.exports = AdminRoutes;
