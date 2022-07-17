const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const session_id = require("../../placeHolder");

const getFeedbacks = async (req, res, next) => {
  try {
    res.json({ message: "getFeedbacks" });
  } catch (err) {
    const error = new HttpError("Fetching Student Info Failed", 500);
    return next(error);
  }
};

exports.getFeedbacks = getFeedbacks;
