const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const session_id = require("../../placeHolder");

const getGrades = async (req, res, next) => {
  try {
    res.status(201).json({ message: "getGrades" });
  } catch (err) {
    const error = new HttpError("Fetching Courses to Add Failed", 500);
    return next(error);
  }
};

const getExamRoutine = async (req, res, next) => {
  try {
    res.status(201).json({ message: "getExamRoutine" });
  } catch (err) {
    const error = new HttpError("Fetching Courses to Drop Failed", 500);
    return next(error);
  }
};

const getSeatPlan = async (req, res, next) => {
  try {
    res.status(201).json({ message: "getSeatPlan" });
  } catch (err) {
    const error = new HttpError("Fetching Courses to Drop Failed", 500);
    return next(error);
  }
};

const getGuidelines = async (req, res, next) => {
  try {
    res.status(201).json({ message: "getGuidelines" });
  } catch (err) {
    const error = new HttpError("Fetching Courses to Drop Failed", 500);
    return next(error);
  }
};

exports.getGrades = getGrades;
exports.getExamRoutine = getExamRoutine;
exports.getSeatPlan = getSeatPlan;
exports.getGuidelines = getGuidelines;
