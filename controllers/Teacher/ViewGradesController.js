const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const session_id = require("../../placeHolder");

const getCourses = async (req, res, next) => {
  try {
    res.json({ message: "getCourses" });
  } catch (err) {
    const error = new HttpError("Fetching Student Info Failed", 500);
    return next(error);
  }
};

exports.getCourses = getCourses;
