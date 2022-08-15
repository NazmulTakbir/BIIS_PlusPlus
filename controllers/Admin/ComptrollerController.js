const pool = require("../../db");
const HttpError = require("../../models/HttpError");

const getPendingScholarships = async (req, res, next) => {
  try {
    res.json({ message: "getPendingScholarships successful" });
  } catch (err) {
    const error = new HttpError("getPendingScholarships failed", 500);
    return next(error);
  }
};

const getPendingDues = async (req, res, next) => {
  try {
    res.json({ message: "getPendingDues successful" });
  } catch (err) {
    const error = new HttpError("getPendingDues failed", 500);
    return next(error);
  }
};

exports.getPendingScholarships = getPendingScholarships;
exports.getPendingDues = getPendingDues;
