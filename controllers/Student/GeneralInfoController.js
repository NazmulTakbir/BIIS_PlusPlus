const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const session_id = require("../../placeHolder");

const getAcademicCalender = async (req, res, next) => {
  try {
    res.status(201).json({ message: "getAcademicCalender" });
  } catch (err) {
    const error = new HttpError("Fetching Courses to Add Failed", 500);
    return next(error);
  }
};

const getHallInfo = async (req, res, next) => {
  try {
    res.status(201).json({ message: "getHallInfo" });
  } catch (err) {
    const error = new HttpError("Fetching Courses to Drop Failed", 500);
    return next(error);
  }
};

const getNotices = async (req, res, next) => {
  try {
    res.status(201).json({ message: "getNotices" });
  } catch (err) {
    const error = new HttpError("Fetching Courses to Drop Failed", 500);
    return next(error);
  }
};

exports.getAcademicCalender = getAcademicCalender;
exports.getHallInfo = getHallInfo;
exports.getNotices = getNotices;
