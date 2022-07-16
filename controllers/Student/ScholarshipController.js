const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const session_id = require("../../placeHolder");

const getData = async (req, res, next) => {
  try {
    res.status(201).json({ message: "getData" });
  } catch (err) {
    const error = new HttpError("Fetching Courses to Add Failed", 500);
    return next(error);
  }
};

const getForm = async (req, res, next) => {
  try {
    res.status(201).json({ message: "getForm" });
  } catch (err) {
    const error = new HttpError("Fetching Courses to Drop Failed", 500);
    return next(error);
  }
};

const postApplication = async (req, res, next) => {
  try {
    res.status(201).json({ message: "postApplication" });
  } catch (err) {
    const error = new HttpError("Fetching Courses to Drop Failed", 500);
    return next(error);
  }
};

exports.getData = getData;
exports.getForm = getForm;
exports.postApplication = postApplication;
