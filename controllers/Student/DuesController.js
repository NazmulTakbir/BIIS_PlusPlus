const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const session_id = require("../../placeHolder");

const getPendingDues = async (req, res, next) => {
  try {
    res.status(201).json({ message: "getPendingDues" });
  } catch (err) {
    const error = new HttpError("Fetching Courses to Add Failed", 500);
    return next(error);
  }
};

const getPaidDues = async (req, res, next) => {
  try {
    res.status(201).json({ message: "getPaidDues" });
  } catch (err) {
    const error = new HttpError("Fetching Courses to Drop Failed", 500);
    return next(error);
  }
};

exports.getPendingDues = getPendingDues;
exports.getPaidDues = getPaidDues;
