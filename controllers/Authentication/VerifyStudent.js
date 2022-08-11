const jwt = require("jsonwebtoken");

const HttpError = require("../../models/HttpError");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    if (req.userData.userType === "student") {
      next();
    } else {
      throw new Error("API Accessible to Students Only");
    }
  } catch (err) {
    const error = new HttpError("API Accessible to Students Only", 401);
    return next(error);
  }
};
