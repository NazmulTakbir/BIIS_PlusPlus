const express = require("express");
// const { check } = require("express-validator");

const LoginController = require("../controllers/Authentication/LoginController");

// const CheckAuth = require("../middleware/CheckAuth");

const UnauthenticatedRoutes = express.Router();

// UnauthenticatedRoutes.use(checkAuth);

UnauthenticatedRoutes.post("/login", LoginController.postLogin);

module.exports = UnauthenticatedRoutes;
