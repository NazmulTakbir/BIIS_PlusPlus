const express = require("express");
const { check } = require("express-validator");

const InfoController = require("../controllers/Student/InfoController");
const CoursesController = require("../controllers/Student/CoursesController");
const ExamsController = require("../controllers/Student/ExamsController");
const ScholarshipController = require("../controllers/Student/ScholarshipController");

// const CheckAuth = require("../middleware/CheckAuth");

const StudentRoutes = express.Router();

// StudentRoutes.use(checkAuth);

StudentRoutes.get("/studentinfo/:sid/home", InfoController.getHomeInfo);
StudentRoutes.get("/studentinfo/:sid/classroutine", InfoController.getClassRoutine);
StudentRoutes.get("/studentinfo/:sid/advisor", InfoController.getAdvisorInfo);

StudentRoutes.get("/courses/:sid/registeredcourses", CoursesController.getRegisteredCourses);
StudentRoutes.get("/courses/:sid/coursestoadd", CoursesController.getCoursesToAdd);
StudentRoutes.get("/courses/:sid/coursestodrop ", CoursesController.getCoursesToDrop);
StudentRoutes.post("/courses/:sid/addRequest", CoursesController.postAddRequest);
StudentRoutes.post("/courses/:sid/dropRequest", CoursesController.postDropRequest);

StudentRoutes.get("/exam/:sid/grades/:level/:term", ExamsController.getGrades);
StudentRoutes.get("/exam/:sid/routine/:sessionID", ExamsController.getExamRoutine);
StudentRoutes.get("/exam/:sid/seatplan/:sessionID", ExamsController.getSeatPlan);
StudentRoutes.get("/exam/:sid/guidelines/:sessionID", ExamsController.getGuidelines);

StudentRoutes.get("/scholarship/:sid/getData", ScholarshipController.getData);
StudentRoutes.get("/scholarship/:sid/download/:scid", ScholarshipController.getForm);
StudentRoutes.post("/scholarship/:sid/apply/:scid", ScholarshipController.postApplication);

module.exports = StudentRoutes;
