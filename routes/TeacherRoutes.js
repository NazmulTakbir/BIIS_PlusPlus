const express = require("express");

const InfoController = require("../controllers/Teacher/InfoController");
const GradingController = require("../controllers/Teacher/GradingController");
const ScrutinizeController = require("../controllers/Teacher/ScrutinizeController");
const AdviseeCourseRegistrationController = require("../controllers/Teacher/AdviseeCourseRegistrationController");
const FeedbackController = require("../controllers/Teacher/FeedbackController");
const HallProvostController = require("../controllers/Teacher/HallProvostController");
const DepartmentHeadController = require("../controllers/Teacher/DepartmentHeadController");
const AdviseeInfoController = require("../controllers/Teacher/AdviseeInfoController");
const CourseCoordinatorController = require("../controllers/Teacher/CourseCoordinatorController");
const ExamcontrollerController = require("../controllers/Teacher/ExamcontrollerController");
const NotificationsController = require("../controllers/Teacher/NotificationsController");

const verifyTeacher = require("../controllers/Authentication/VerifyTeacher");

const TeacherRoutes = express.Router();

TeacherRoutes.use(verifyTeacher);

TeacherRoutes.get("/teacherinfo", InfoController.getInfo);
TeacherRoutes.get("/adviseelist", InfoController.getAllAdvisee);
TeacherRoutes.get("/coursescoordinated", InfoController.getCoursesCoordinated);
TeacherRoutes.get("/coursestaught", InfoController.getCoursesTaught);
TeacherRoutes.get("/coursesscrutinized", InfoController.getCoursesScrutinized);
TeacherRoutes.get("/assignedteachers/:course_id", InfoController.getAssignedTeachers);
TeacherRoutes.get("/assignedscrutinizers/:course_id", InfoController.getAssignedScrutinizers);
TeacherRoutes.get("/coursecriteriabyteacher/:course_id", InfoController.getCourseCriteriaByTeacher);
TeacherRoutes.get("/coursecriteriabyscrutinizer/:course_id", InfoController.getCourseCriteriaByScrutinizer);

TeacherRoutes.post("/newmarkingcriteria", CourseCoordinatorController.postMarkingCriteria);
TeacherRoutes.get("/markingcriteria/:course_id", CourseCoordinatorController.getMarkingCriteria);
TeacherRoutes.post("/newgradingboundary", CourseCoordinatorController.postGradingBoundary);
TeacherRoutes.get("/gradingboundary/:course_id", CourseCoordinatorController.getGradingBoundary);

TeacherRoutes.get("/adviseeinfo/:sid", AdviseeInfoController.getAdviseeInfo);
TeacherRoutes.get("/advisee/:sid/getAvailableResults", AdviseeInfoController.getAvailableResults);
TeacherRoutes.get("/advisee/:sid/getGrades/:level/:term", AdviseeInfoController.getGrades);

TeacherRoutes.get("/studentmarks/:course_id/:criteria", GradingController.getStudentMarks);
TeacherRoutes.post("/studentmarks/:course_id/:criteria", GradingController.postStudentMarks);
TeacherRoutes.post("/sendForScrutiny/:course_id/:criteria", GradingController.sendForScrutiny);

TeacherRoutes.get("/scrutinize/getall/:course_id/:criteria", ScrutinizeController.getAll);
TeacherRoutes.post("/scrutinize/approve/:course_id/:criteria", ScrutinizeController.postApproval);
TeacherRoutes.post("/scrutinize/reject/:course_id/:criteria", ScrutinizeController.postRejection);

// TeacherRoutes.get("/exam/scrutinize/courses", ScrutinizeController.getCourses);

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

TeacherRoutes.get("/advisees/feedbacks", FeedbackController.getAdviseeFeedbacks);
TeacherRoutes.get("/courses/feedbacks", FeedbackController.getCourseFeedbacks);

TeacherRoutes.get("/hallprovost/allstudents", HallProvostController.getAllStudents);
//pending requests
TeacherRoutes.get("/hallprovost/scholarshiprequests", HallProvostController.getScholarshipRequests);

//all scholarships in stages
TeacherRoutes.get("/hallprovost/allrequests", HallProvostController.getAllScholarshipRequests);
TeacherRoutes.get("/hallprovost/pendingresults", HallProvostController.getPendingResults);
TeacherRoutes.post("/hallprovost/approveresults", HallProvostController.postApproveResults);
TeacherRoutes.post("/hallprovost/rejectresults", HallProvostController.postRejectResults);

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
TeacherRoutes.get("/departmenthead/offeredcourses", DepartmentHeadController.getOfferedCourses);
TeacherRoutes.get("/departmenthead/preparedresults/:course_id", DepartmentHeadController.getPreparedResults);
TeacherRoutes.get("/departmenthead/pendingresults/:course_id", DepartmentHeadController.getPendingResults);
TeacherRoutes.get("/departmenthead/resultdetails/:course_id/:student_id", DepartmentHeadController.getResultDetails);
TeacherRoutes.post("/departmenthead/approveresults/:course_id", DepartmentHeadController.postApproveResults);
TeacherRoutes.post("/departmenthead/rejectresults/:course_id", DepartmentHeadController.postRejectResults);

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
TeacherRoutes.get(
  "/departmenthead/student/scholarshiprequests/:sid",
  DepartmentHeadController.getStudentScholarshipRequests
);
TeacherRoutes.post("/departmenthead/approvescholarship/", DepartmentHeadController.allowDeptScholarshipRequests);
TeacherRoutes.post("/departmenthead/rejectscholarship/", DepartmentHeadController.rejectDeptScholarshipRequests);

TeacherRoutes.get("/examcontroller/pendingresults/", ExamcontrollerController.getPendingResults);
TeacherRoutes.post("/examcontroller/approveresults/", ExamcontrollerController.postApproveResults);
TeacherRoutes.post("/examcontroller/rejectresults/", ExamcontrollerController.postRejectResults);

TeacherRoutes.get("/notifications/getall/", NotificationsController.getNotifications);

module.exports = TeacherRoutes;
