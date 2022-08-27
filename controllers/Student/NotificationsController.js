const pool = require("../../db");
const HttpError = require("../../models/HttpError");

const getNotifications = async (req, res, next) => {
  try {
    let queryRes = await pool.query(
      "select notification_type, notification_date as date, details, seen from student_notifications where student_id=$1 order by seen",
      [req.userData.id]
    );

    await pool.query("update student_notifications set seen=true where student_id=$1", [req.userData.id]);

    res.status(201).json({ message: "getNotifications successful", data: queryRes.rows });
  } catch (err) {
    const error = new HttpError("getNotifications failed", 500);
    return next(error);
  }
};

const getSubscriptions = async (req, res, next) => {
  try {
    let queryRes = await pool.query(
      "select notification_type from student_notification_registrations where student_id=$1",
      [req.userData.id]
    );

    res.status(201).json({ message: "getSubscriptions successful", data: queryRes.rows });
  } catch (err) {
    const error = new HttpError("getSubscriptions failed", 500);
    return next(error);
  }
};

exports.getNotifications = getNotifications;
exports.getSubscriptions = getSubscriptions;
