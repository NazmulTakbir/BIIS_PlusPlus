const express = require("express");

const InfoController = require("../controllers/Teacher/InfoController");
const AddGradesController = require("../controllers/Teacher/AddGradesController");
const ViewGradesController = require("../controllers/Teacher/ViewGradesController");
const ScrutinizeController = require("../controllers/Teacher/ScrutinizeController");
const AdviseeCourseRegistrationController = require("../controllers/Teacher/AdviseeCourseRegistrationController");
const AdviseeFeedbackController = require("../controllers/Teacher/AdviseeFeedbackController");
const HallProvostController = require("../controllers/Teacher/HallProvostController");
const DepartmentHeadController = require("../controllers/Teacher/DepartmentHeadController");
const AdviseeInfoController = require("../controllers/Teacher/AdviseeInfoController");

const verifyTeacher = require("../controllers/Authentication/VerifyTeacher");

const TeacherRoutes = express.Router();

TeacherRoutes.use(verifyTeacher);

TeacherRoutes.get("/teacherinfo", InfoController.getInfo);
TeacherRoutes.get("/adviseelist", InfoController.getAllAdvisee);
TeacherRoutes.get("/adviseeinfo/:sid", AdviseeInfoController.getAdviseeInfo);
TeacherRoutes.get("/advisee/:sid/getAvailableResults", AdviseeInfoController.getAvailableResults);
TeacherRoutes.get("/advisee/:sid/getGrades/:level/:term", AdviseeInfoController.getGrades);

TeacherRoutes.get("/exam/addgrades/courses", AddGradesController.getCourses);
TeacherRoutes.get("/exam/viewgrades/courses", ViewGradesController.getCourses);
TeacherRoutes.get("/exam/scrutinize/courses", ScrutinizeController.getCourses);

TeacherRoutes.get("/advisees/registrationrequests/:sid", AdviseeCourseRegistrationController.getRegistrationRequests);
TeacherRoutes.get("/advisees/registrationsummary", AdviseeCourseRegistrationController.getRegistrationRequestSummary);
TeacherRoutes.get("/advisees/feedbacks", AdviseeFeedbackController.getFeedbacks);

TeacherRoutes.get("/hallprovost/scholarshiprequests", HallProvostController.getScholarshipRequests);

//dept head routes
TeacherRoutes.get("/departmenthead/feedbacks", DepartmentHeadController.getFeedbacks);
TeacherRoutes.get("/departmenthead/deptStudents", DepartmentHeadController.getDepartmentStudents);
TeacherRoutes.get("/departmenthead/registrationsummary", DepartmentHeadController.getRegistrationRequestSummary);
//route for deptStudent
TeacherRoutes.get("/departmenthead/registrationrequests/:sid", DepartmentHeadController.getRegistrationRequests);
TeacherRoutes.get("/departmenthead/deptStudentInfo/:sid", DepartmentHeadController.getDeptStudentInfo);
TeacherRoutes.get("/departmenthead/getAvailableResults/:sid", DepartmentHeadController.getAvailableResults);
TeacherRoutes.get("/departmenthead/getGrades/:sid/:level/:term", DepartmentHeadController.getGrades);

module.exports = TeacherRoutes;
