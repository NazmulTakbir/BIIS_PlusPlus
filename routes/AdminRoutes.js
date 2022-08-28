const express = require("express");

const StudentController = require("../controllers/Admin/StudentController");
const DepartmentsController = require("../controllers/Admin/DepartmentsController");
const TeacherController = require("../controllers/Admin/TeacherController");
const CourseController = require("../controllers/Admin/CourseController");
const CourseOfferingController = require("../controllers/Admin/CourseOfferingController");
const CourseTeacherController = require("../controllers/Admin/CourseTeacherController");
const DuesController = require("../controllers/Admin/DuesController");
const AcademicCalenderController = require("../controllers/Admin/AcademicCalenderController");
const ScholarshipController = require("../controllers/Admin/ScholarshipController");
const ComptrollerController = require("../controllers/Admin/ComptrollerController");
const InfoController = require("../controllers/Admin/InfoController");
const NoticeController = require("../controllers/Admin/NoticeController");

const verifyAdmin = require("../controllers/Authentication/VerifyAdmin");

const AdminRoutes = express.Router();

AdminRoutes.use(verifyAdmin);

AdminRoutes.get("/departments/get", DepartmentsController.getDepartmentsList);
AdminRoutes.get("/departments/self", DepartmentsController.getSelfDepartment);
AdminRoutes.get("/departments/getTeacher", DepartmentsController.getTeachersList);

AdminRoutes.get("/sessionlist/get", DepartmentsController.getSessionList);
AdminRoutes.get("/scholarshiptypelist/get", DepartmentsController.getScholarshipTypeList);

AdminRoutes.post("/scholarship/add", ScholarshipController.postAddScholarship);
AdminRoutes.get("/scholarship/samplefile", ScholarshipController.getSampleFile);

AdminRoutes.post("/student/add", StudentController.postAddStudent);
AdminRoutes.get("/student/samplefile", StudentController.getSampleFile);
AdminRoutes.get("/student/getStudentsOfDept/:dept_id", StudentController.getStudentsOfDept);
AdminRoutes.get("/student/getStudentsOfHall/:hall_id", StudentController.getStudentsOfHall);

AdminRoutes.post("/teacher/add", TeacherController.postAddTeacher);
AdminRoutes.get("/teacher/samplefile", TeacherController.getSampleFile);
AdminRoutes.get("/teacher/getnextid", TeacherController.getnextid);

AdminRoutes.post("/course/add", CourseController.postAddCourse);
AdminRoutes.get("/course/samplefile", CourseController.getSampleFile);

AdminRoutes.post("/offering/add", CourseOfferingController.postAddCourseOffering);
AdminRoutes.get("/offering/samplefile", CourseOfferingController.getSampleFile);
AdminRoutes.get("/offering/getunofferedcourses", CourseOfferingController.getunofferedcourses);
AdminRoutes.get("/offering/getexamslots", CourseOfferingController.getexamslots);
AdminRoutes.get("/offering/getOffering_admin_dept", CourseOfferingController.getOffering_admin_dept);

AdminRoutes.post("/courseteacher/add", CourseTeacherController.postAddCourseTeacher);
AdminRoutes.get("/courseteacher/samplefile", CourseTeacherController.getSampleFile);

AdminRoutes.post("/dues/add", DuesController.postAddDues);
AdminRoutes.get("/dues/samplefile", DuesController.getSampleFile);
AdminRoutes.get("/dues/getDuesTypes", DuesController.getDuesTypes);

AdminRoutes.post("/academiccalender/add", AcademicCalenderController.addCalender);
AdminRoutes.get("/academiccalender/samplefile", AcademicCalenderController.getSampleFile);

AdminRoutes.get("/comptroller/pendingscholarships", ComptrollerController.getPendingScholarships);
AdminRoutes.get("/comptroller/pendingdues", ComptrollerController.getPendingDues);
AdminRoutes.post("/comptroller/markduesaspaid", ComptrollerController.postMarkDuesPaid);
AdminRoutes.post("/comptroller/markscholarshipaspaid", ComptrollerController.postMarkScholarshipPaid);

AdminRoutes.get("/admininfo", InfoController.getAdminInfo);
AdminRoutes.get("/hall/getHallId/:hall_admin_id", InfoController.getHallId);

AdminRoutes.get("/", InfoController.getAdminInfo);

AdminRoutes.get("/", InfoController.getAdminInfo);

AdminRoutes.post("/notice/upload", NoticeController.postAddNotice);

module.exports = AdminRoutes;
