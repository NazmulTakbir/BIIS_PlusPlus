const express = require("express");
const { check } = require("express-validator");

const InfoController = require("../controllers/Student/InfoController");
const CoursesController = require("../controllers/Student/CoursesController");
const ExamsController = require("../controllers/Student/ExamsController");
const ScholarshipController = require("../controllers/Student/ScholarshipController");
const GeneralInfoController = require("../controllers/Student/GeneralInfoController");
const DuesController = require("../controllers/Student/DuesController");
const FeedbackComplaintController = require("../controllers/Student/FeedbackComplaintController");

// const CheckAuth = require("../middleware/CheckAuth");

const StudentRoutes = express.Router();

// StudentRoutes.use(checkAuth);

StudentRoutes.get("/studentinfo/:sid/home", InfoController.getHomeInfo);
StudentRoutes.get("/studentinfo/:sid/classroutine", InfoController.getClassRoutine);
StudentRoutes.get("/studentinfo/:sid/advisor", InfoController.getAdvisorInfo);

StudentRoutes.get("/courses/:sid/registeredcourses", CoursesController.getRegisteredCourses);
StudentRoutes.get("/courses/:sid/coursestoadd", CoursesController.getCoursesToAdd);
StudentRoutes.get("/courses/:sid/coursestodrop", CoursesController.getCoursesToDrop);
StudentRoutes.post("/courses/:sid/addRequest", CoursesController.postAddRequest);
StudentRoutes.post("/courses/:sid/dropRequest", CoursesController.postDropRequest);

StudentRoutes.get("/exam/:sid/grades/:level/:term", ExamsController.getGrades);
StudentRoutes.get("/exam/:sid/routine/:sessionID", ExamsController.getExamRoutine);
StudentRoutes.get("/exam/:sid/seatplan/:sessionID", ExamsController.getSeatPlan);
StudentRoutes.get("/exam/:sid/guidelines/:sessionID", ExamsController.getGuidelines);

StudentRoutes.get("/scholarship/:sid/getData", ScholarshipController.getData);
StudentRoutes.get("/scholarship/:sid/download/:scid", ScholarshipController.getForm);
StudentRoutes.post("/scholarship/:sid/apply/:scid", ScholarshipController.postApplication);

StudentRoutes.get("/generalinfo/:sid/academiccalender", GeneralInfoController.getAcademicCalender);
StudentRoutes.get("/generalinfo/:sid/hallinfo", GeneralInfoController.getHallInfo);
StudentRoutes.get("/generalinfo/:sid/notices", GeneralInfoController.getNotices);

StudentRoutes.get("/dues/:sid/pendingdues", DuesController.getPendingDues);
StudentRoutes.get("/dues/:sid/paiddues", DuesController.getPaidDues);

StudentRoutes.get("/feedbackcomplaint/:sid/pastsubmissions", FeedbackComplaintController.getPastSubmissions);
StudentRoutes.post("/feedbackcomplaint/:sid/newsubmission", FeedbackComplaintController.postNewSubmission);

module.exports = StudentRoutes;
