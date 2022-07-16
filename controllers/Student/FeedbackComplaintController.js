const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const session_id = require("../../placeHolder");

const getPastSubmissions = async (req, res, next) => {
  try {
    res.status(201).json({ message: "getPastSubmissions" });
  } catch (err) {
    const error = new HttpError("Fetching Courses to Add Failed", 500);
    return next(error);
  }
};

const postNewSubmission = async (req, res, next) => {
  try {
    res.status(201).json({ message: "postNewSubmission" });
  } catch (err) {
    const error = new HttpError("Fetching Courses to Drop Failed", 500);
    return next(error);
  }
};

exports.getPastSubmissions = getPastSubmissions;
exports.postNewSubmission = postNewSubmission;
