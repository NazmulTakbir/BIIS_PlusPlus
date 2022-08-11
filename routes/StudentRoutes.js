const express = require("express");

const InfoController = require("../controllers/Student/InfoController");
const CoursesController = require("../controllers/Student/CoursesController");
const ExamsController = require("../controllers/Student/ExamsController");
const ScholarshipController = require("../controllers/Student/ScholarshipController");
const GeneralInfoController = require("../controllers/Student/GeneralInfoController");
const DuesController = require("../controllers/Student/DuesController");
const FeedbackController = require("../controllers/Student/FeedbackController");

const verifyStudent = require("../controllers/Authentication/VerifyStudent");

const StudentRoutes = express.Router();

StudentRoutes.use(verifyStudent);

StudentRoutes.get("/studentinfo/home", InfoController.getHomeInfo);
StudentRoutes.get("/studentinfo/classroutine", InfoController.getClassRoutine);
StudentRoutes.get("/studentinfo/advisor", InfoController.getAdvisorInfo);

StudentRoutes.get("/courses/registeredcourses", CoursesController.getRegisteredCourses);
StudentRoutes.get("/courses/pending", CoursesController.getPendingRequests);
StudentRoutes.get("/courses/coursestoadd", CoursesController.getCoursesToAdd);
StudentRoutes.get("/courses/coursestodrop", CoursesController.getCoursesToDrop);
StudentRoutes.post("/courses/addRequest", CoursesController.postAddRequest);
StudentRoutes.post("/courses/dropRequest", CoursesController.postDropRequest);

StudentRoutes.get("/exam/grades/:level/:term", ExamsController.getGrades);
StudentRoutes.get("/exam/routine", ExamsController.getExamRoutine);
StudentRoutes.get("/exam/seatplan", ExamsController.getSeatPlan);
StudentRoutes.get("/exam/guidelines", ExamsController.getGuidelines);
StudentRoutes.get("/exam/getAvailableResults", ExamsController.getAvailableResults);

StudentRoutes.get("/scholarship/received", ScholarshipController.getReceived);
StudentRoutes.get("/scholarship/processing", ScholarshipController.getProcessing);
StudentRoutes.get("/scholarship/available", ScholarshipController.getAvailable);
StudentRoutes.get("/scholarship/download/:scid", ScholarshipController.getForm);
StudentRoutes.post("/scholarship/apply/:scid", ScholarshipController.postApplication);

StudentRoutes.get("/generalinfo/academiccalender", GeneralInfoController.getAcademicCalender);
StudentRoutes.get("/generalinfo/hallinfo", GeneralInfoController.getHallInfo);
StudentRoutes.get("/generalinfo/notices", GeneralInfoController.getNotices);

StudentRoutes.get("/dues/pendingdues", DuesController.getPendingDues);
StudentRoutes.get("/dues/paiddues", DuesController.getPaidDues);

StudentRoutes.get("/feedback/pastsubmissions", FeedbackController.getPastSubmissions);
StudentRoutes.post("/feedback/newsubmission", FeedbackController.postNewSubmission);

module.exports = StudentRoutes;
