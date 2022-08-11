const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const session_id = require("../../placeHolder");

const getFeedbacks = async (req, res, next) => {
  try {
    const tid = req.params.tid;
    let queryRes = await pool.query(
      "select f.feedback_id, s.student_id, s.name as student_name, f.subject, \
       f.submission_date, f.details from feedback as f natural join \
       student as s where teacher_id = $1;",
      [tid]
    );
    feedback_list = [];
    for (const element of queryRes.rows) {
      comp = {};
      comp["feedback_id"] = element["feedback_id"];
      comp["student_id"] = element["student_id"];
      comp["student_name"] = element["student_name"];
      comp["subject"] = element["subject"];
      comp["details"] = element["details"];

      let date_ = "";
      date_ = (date_ + element["submission_date"]).substring(4, 16);
      comp["submission_date"] = date_;

      feedback_list.push(comp);
    }

    res.status(201).json({ message: "getFeedbacks", data: feedback_list });
  } catch (err) {
    const error = new HttpError("Fetching Student Info Failed", 500);
    return next(error);
  }
};

exports.getFeedbacks = getFeedbacks;
