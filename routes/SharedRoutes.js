const express = require("express");

const SessionController = require("../controllers/Shared/SessionController");

const SharedRoutes = express.Router();

SharedRoutes.get("/session/getCurrent", SessionController.getCurrentSession);

module.exports = SharedRoutes;
