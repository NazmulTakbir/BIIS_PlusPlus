const express = require("express");
// const { check } = require("express-validator");

const StudentController = require("../controllers/Admin/StudentController");
const DepartmentsController = require("../controllers/Admin/DepartmentsController");
const TeacherController = require("../controllers/Admin/TeacherController");
const CourseController = require("../controllers/Admin/CourseController");
const CourseOfferingController = require("../controllers/Admin/CourseOfferingController");
const CourseTeacherController = require("../controllers/Admin/CourseTeacherController");
const NoticeController = require("../controllers/Admin/NoticeController");
const DuesController = require("../controllers/Admin/DuesController");
const AcademicCalenderController = require("../controllers/Admin/AcademicCalenderController");

const verifyAdmin = require("../controllers/Authentication/VerifyAdmin");

const AdminRoutes = express.Router();

AdminRoutes.use(verifyAdmin);

AdminRoutes.get("/departments/get", DepartmentsController.getDepartmentsList);
AdminRoutes.get("/departments/getTeacher/:admin_dept_id", DepartmentsController.getTeachersList);

//AdminRoutes.get("/departments/getdeptid/:dept_name", DepartmentsController.get_dept_id);


AdminRoutes.post("/student/add", StudentController.postAddStudent);
AdminRoutes.get("/student/samplefile", StudentController.getSampleFile);
AdminRoutes.get("/student/getStudentsOfDept/:dept_id", StudentController.getStudentsOfDept);

AdminRoutes.post("/teacher/add", TeacherController.postAddTeacher);
AdminRoutes.get("/teacher/samplefile", TeacherController.getSampleFile);
AdminRoutes.get("/teacher/getnextid", TeacherController.getnextid);

AdminRoutes.post("/course/add", CourseController.postAddCourse);
AdminRoutes.get("/course/samplefile", CourseController.getSampleFile);

AdminRoutes.post("/offering/add", CourseOfferingController.postAddCourseOffering);
AdminRoutes.get("/offering/samplefile", CourseOfferingController.getSampleFile);
AdminRoutes.get("/offering/getunofferedcourses", CourseOfferingController.getunofferedcourses);
//AdminRoutes.get("/offering/getunofferedcourses/admin_dept_id", CourseOfferingController.getunofferedcourses);
AdminRoutes.get("/offering/getexamslots", CourseOfferingController.getexamslots);
AdminRoutes.get("/offering/getOffering_admin_dept/:admin_dept_id", CourseOfferingController.getOffering_admin_dept);

AdminRoutes.post("/courseteacher/add", CourseTeacherController.postAddCourseTeacher);
AdminRoutes.get("/courseteacher/samplefile", CourseTeacherController.getSampleFile);

AdminRoutes.post("/notice/add", NoticeController.postAddNotice);
AdminRoutes.get("/notice/samplefile", NoticeController.getSampleFile);

AdminRoutes.post("/dues/add", DuesController.postAddDues);
AdminRoutes.get("/dues/samplefile", DuesController.getSampleFile);
AdminRoutes.get("/dues/getDuesTypes", DuesController.getDuesTypes);

AdminRoutes.post("/academiccalender/add", AcademicCalenderController.addCalender);
AdminRoutes.get("/academiccalender/samplefile", AcademicCalenderController.getSampleFile);

module.exports = AdminRoutes;
