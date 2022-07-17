const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const session_id = require("../../placeHolder");

const getScholarshipRequests = async (req, res, next) => {
  try {
    res.json({ message: "getScholarshipRequests" });
  } catch (err) {
    const error = new HttpError("Fetching Student Info Failed", 500);
    return next(error);
  }
};

exports.getScholarshipRequests = getScholarshipRequests;
