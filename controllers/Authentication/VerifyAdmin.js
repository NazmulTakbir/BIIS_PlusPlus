const jwt = require("jsonwebtoken");

const HttpError = require("../../models/HttpError");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    if (
      req.userData.userType === "office admin" ||
      req.userData.userType === "hall admin" ||
      req.userData.userType === "department admin"
    ) {
      next();
    } else {
      throw new Error("API Accessible to Admin Only");
    }
  } catch (err) {
    const error = new HttpError("API Accessible to Admin Only", 401);
    return next(error);
  }
};
