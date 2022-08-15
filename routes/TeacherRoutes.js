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
TeacherRoutes.post(
  "/advisees/approveregistrationrequests",
  AdviseeCourseRegistrationController.postApproveRegistrationRequests
);
TeacherRoutes.post(
  "/advisees/rejectregistrationrequests",
  AdviseeCourseRegistrationController.postRejectRegistrationRequests
);

TeacherRoutes.get("/advisees/feedbacks", AdviseeFeedbackController.getFeedbacks);

TeacherRoutes.get("/hallprovost/allstudents", HallProvostController.getAllStudents);
//pending requests
TeacherRoutes.get("/hallprovost/scholarshiprequests", HallProvostController.getScholarshipRequests);

//all scholarships in stages
TeacherRoutes.get("/hallprovost/allrequests", HallProvostController.getAllScholarshipRequests);

//new window for approving requests
TeacherRoutes.get("/hallmemberinfo/:sid", HallProvostController.getHallMemberInfo);
TeacherRoutes.get("/hallmemberinfo/:sid/getAvailableResults", HallProvostController.getAvailableResults);
TeacherRoutes.get("/hallmemberinfo/:sid/getpendingdues", HallProvostController.getPendingDues);
TeacherRoutes.get("/hallmemberinfo/:sid/getGrades/:level/:term", HallProvostController.getGrades);
TeacherRoutes.get("/hallmemberinfo/scholarshiprequests/:sid", HallProvostController.getHallMemberScholarshipRequests);
TeacherRoutes.post(
  "/hallmemberinfo/approvescholarship/:scid",
  HallProvostController.allowHallMemberScholarshipRequests
);
TeacherRoutes.post(
  "/hallmemberinfo/rejectscholarship/:scid",
  HallProvostController.rejectHallMemberScholarshipRequests
);

//dept head routes
TeacherRoutes.get("/departmenthead/feedbacks", DepartmentHeadController.getFeedbacks);
TeacherRoutes.get("/departmenthead/deptStudents", DepartmentHeadController.getDepartmentStudents);
TeacherRoutes.get("/departmenthead/registrationsummary", DepartmentHeadController.getRegistrationRequestSummary);
//route for deptStudent
TeacherRoutes.get("/departmenthead/registrationrequests/:sid", DepartmentHeadController.getRegistrationRequests);
TeacherRoutes.get("/departmenthead/deptStudentInfo/:sid", DepartmentHeadController.getDeptStudentInfo);
TeacherRoutes.get("/departmenthead/getAvailableResults/:sid", DepartmentHeadController.getAvailableResults);
TeacherRoutes.get("/departmenthead/getGrades/:sid/:level/:term", DepartmentHeadController.getGrades);
TeacherRoutes.post(
  "/departmenthead/approveregistrationrequests",
  DepartmentHeadController.postApproveRegistrationRequests
);
TeacherRoutes.post(
  "/departmenthead/rejectregistrationrequests",
  DepartmentHeadController.postRejectRegistrationRequests
);

TeacherRoutes.get("/departmenthead/scholarshiprequests", DepartmentHeadController.getScholarshipRequests);

module.exports = TeacherRoutes;
