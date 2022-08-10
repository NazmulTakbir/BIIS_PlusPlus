const express = require("express");
// const { check } = require("express-validator");

const SessionController = require("../controllers/Shared/SessionController");

// const CheckAuth = require("../middleware/CheckAuth");

const SharedRoutes = express.Router();

// AdminRoutes.use(checkAuth);

SharedRoutes.get("/session/getCurrent", SessionController.getCurrentSession);

module.exports = SharedRoutes;
