const jwt = require("jsonwebtoken");

const HttpError = require("../../models/HttpError");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    if (req.userData.userType === "teacher") {
      next();
    } else {
      throw new Error("API Accessible to Teachers Only");
    }
  } catch (err) {
    const error = new HttpError("API Accessible to Teachers Only", 401);
    return next(error);
  }
};
