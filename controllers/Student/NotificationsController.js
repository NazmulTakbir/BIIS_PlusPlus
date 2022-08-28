const pool = require("../../db");
const HttpError = require("../../models/HttpError");

const getNotifications = async (req, res, next) => {
  try {
    let queryRes ;
    queryRes = await pool.query(
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
    const allPossibleSubscriptions = [
      "Course Registration Approval/Rejection",
      "Dues Payment Confirmed",
      "New Dues to be Paid",
      "Notice Added",
      "Results Published",
      "Scholarship Made Available",
      "Scholarship Paid",
    ];

    let queryRes = await pool.query(
      "select notification_type from student_notification_registrations where student_id=$1",
      [req.userData.id]
    );

    const subscribedNotifications = queryRes.rows.map((row) => row.notification_type);

    data = [];
    for (let i = 0; i < allPossibleSubscriptions.length; i++) {
      if (subscribedNotifications.includes(allPossibleSubscriptions[i])) {
        data.push({ notification_type: allPossibleSubscriptions[i], subscribed: true });
      } else {
        data.push({ notification_type: allPossibleSubscriptions[i], subscribed: false });
      }
    }

    res.status(201).json({ message: "getSubscriptions successful", data: data });
  } catch (err) {
    const error = new HttpError("getSubscriptions failed", 500);
    return next(error);
  }
};

const postSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = req.body.subscriptions;

    await pool.query("delete from student_notification_registrations where student_id=$1", [req.userData.id]);

    for (let i = 0; i < subscriptions.length; i++) {
      const queryRes = await pool.query(
        "insert into student_notification_registrations (student_id, notification_type) values ($1, $2)",
        [req.userData.id, subscriptions[i]]
      );
    }

    res.status(201).json({ message: "postSubscriptions successful" });
  } catch (err) {
    const error = new HttpError("postSubscriptions failed", 500);
    return next(error);
  }
};

exports.getNotifications = getNotifications;
exports.getSubscriptions = getSubscriptions;
exports.postSubscriptions = postSubscriptions;
