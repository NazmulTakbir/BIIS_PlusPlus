const express = require("express");

const InfoController = require("../controllers/Teacher/InfoController");
const AddGradesController = require("../controllers/Teacher/AddGradesController");
const ViewGradesController = require("../controllers/Teacher/ViewGradesController");
const ScrutinizeController = require("../controllers/Teacher/ScrutinizeController");
const AdviseeCourseRegistrationController = require("../controllers/Teacher/AdviseeCourseRegistrationController");
const AdviseeFeedbackController = require("../controllers/Teacher/AdviseeFeedbackController");
const HallProvostController = require("../controllers/Teacher/HallProvostController");
const DepartmentHeadController = require("../controllers/Teacher/DepartmentHeadController");

const verifyTeacher = require("../controllers/Authentication/VerifyTeacher");

const TeacherRoutes = express.Router();

TeacherRoutes.use(verifyTeacher);

TeacherRoutes.get("/teacherinfo/:tid", InfoController.getInfo);
TeacherRoutes.get("/adviseelist/:tid", InfoController.getAllAdvisee);
TeacherRoutes.get("/adviseeinfo/:tid/:sid", InfoController.getAdviseeInfo);
TeacherRoutes.get("/advisee/:tid/:sid/getAvailableResults", InfoController.getAvailableResults);
TeacherRoutes.get("/advisee/:tid/:sid/getGrades/:level/:term", InfoController.getGrades);

TeacherRoutes.get("/exam/:tid/addgrades/courses", AddGradesController.getCourses);
TeacherRoutes.get("/exam/:tid/viewgrades/courses", ViewGradesController.getCourses);
TeacherRoutes.get("/exam/:tid/scrutinize/courses", ScrutinizeController.getCourses);

TeacherRoutes.get(
  "/advisees/:tid/registrationrequests/:sid",
  AdviseeCourseRegistrationController.getRegistrationRequests
);
TeacherRoutes.get(
  "/advisees/:tid/registrationsummary",
  AdviseeCourseRegistrationController.getRegistrationRequestSummary
);
TeacherRoutes.get("/advisees/:tid/feedbacks", AdviseeFeedbackController.getFeedbacks);

TeacherRoutes.get("/hallprovost/:tid/scholarshiprequests", HallProvostController.getScholarshipRequests);

TeacherRoutes.get("/departmenthead/:tid/feedbacks", DepartmentHeadController.getFeedbacks);

module.exports = TeacherRoutes;
