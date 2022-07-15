const express = require("express");
const { check } = require("express-validator");

const InfoController = require("../controllers/Student/InfoController");
const CoursesController = require("../controllers/Student/CoursesController");
// const CheckAuth = require("../middleware/CheckAuth");

const StudentRoutes = express.Router();

// StudentRoutes.use(checkAuth);

StudentRoutes.get("/studentinfo/:sid/home", InfoController.getHomeInfo);
StudentRoutes.get("/studentinfo/:sid/classroutine", InfoController.getClassRoutine);
StudentRoutes.get("/studentinfo/:sid/advisor", InfoController.getAdvisorInfo);

StudentRoutes.get("/courses/:sid/registeredcourses", CoursesController.getRegisteredCourses);
StudentRoutes.post("/courses/:sid/addRequest", CoursesController.postAddRequest);
StudentRoutes.post("/courses/:sid/dropRequest", CoursesController.postDropRequest);

// StudentRoutes.get("/exam/:sid", placesControllers.getPlaceById);
// StudentRoutes.get("/scholarship/:sid", placesControllers.getPlaceById);
// StudentRoutes.get("/dues/:sid", placesControllers.getPlaceById);
// StudentRoutes.get("/feedbackcomplaint/:sid", placesControllers.getPlaceById);

// StudentRoutes.get("/user/:uid", placesControllers.getPlacesByUserId);

module.exports = StudentRoutes;
