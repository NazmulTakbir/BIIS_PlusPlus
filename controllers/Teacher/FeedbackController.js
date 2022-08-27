const pool = require("../../db");
const HttpError = require("../../models/HttpError");

const getAdviseeFeedbacks = async (req, res, next) => {
  try {
    const tid = req.userData.id;
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

    res.status(201).json({ message: "getAdviseeFeedbacks", data: feedback_list });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Fetching getAdviseeFeedbacks Failed", 500);
    return next(error);
  }
};

const getCourseFeedbacks = async (req, res, next) => {
  try {
    const tid = req.userData.id;
    let queryRes = await pool.query(
      'select student_id, details, submission_date, subject, course_id, session_id \
      from (select distinct(course_feedback_id) from "course feedback" \
      natural join "course offering teacher" where teacher_id=$1) as t1 \
      natural join "course feedback" as t2 natural join "course offering" as t3;',
      [tid]
    );

    res.status(201).json({ message: "getCourseFeedbacks", data: queryRes.rows });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Fetching getCourseFeedbacks Failed", 500);
    return next(error);
  }
};

exports.getAdviseeFeedbacks = getAdviseeFeedbacks;
exports.getCourseFeedbacks = getCourseFeedbacks;
