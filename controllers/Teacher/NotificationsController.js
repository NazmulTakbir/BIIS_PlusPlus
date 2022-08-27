const pool = require("../../db");
const HttpError = require("../../models/HttpError");

const getNotifications = async (req, res, next) => {
  try {
    res.status(201).json({ message: "getNotifications successful" });
  } catch (err) {
    const error = new HttpError("getNotifications failed", 500);
    return next(error);
  }
};

exports.getNotifications = getNotifications;
