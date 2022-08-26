const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const session_id = require("../../placeHolder");

const getPastSubmissions = async (req, res, next) => {
  try {
    const sid = req.userData.id;
    let queryRes = await pool.query("select * from feedback where student_id = $1 ", [sid]);
    feedback_list = [];
    for (const element of queryRes.rows) {
      comp = {};
      comp["feedback_id"] = element["feedback_id"];
      comp["teacher_id"] = element["teacher_id"];
      comp["subject"] = element["subject"];
      comp["details"] = element["details"];
      comp["receiver_type"] = element["receiver_type"];

      let date_ = "";
      date_ = (date_ + element["submission_date"]).substring(4, 16);
      comp["submission_date"] = date_;

      feedback_list.push(comp);
    }

    res.status(201).json({ message: "getPastSubmissions", data: feedback_list });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Fetching Courses to Add Failed", 500);
    return next(error);
  }
};

const postNewSubmission = async (req, res, next) => {
  try {
    const sid = req.userData.id;

    const { subject, details, submission_date, receiver } = req.body;

    if (receiver !== "Department Head" && receiver !== "Advisor") {
      res.status(201).json({ message: "Unknown Receiver Type" });
    } else {
      let teacher_id;
      if (receiver === "Advisor") {
        let queryRes = await pool.query("select advisor_id from student where student_id=$1", [sid]);
        teacher_id = queryRes.rows[0]["advisor_id"];
      } else if (receiver === "Department Head") {
        let queryRes = await pool.query(
          "select dept_head from student natural join department where \
                                        student_id=$1;",
          [sid]
        );
        teacher_id = queryRes.rows[0]["dept_head"];
      }

      queryRes = await pool.query(
        "INSERT INTO public.feedback(student_id, teacher_id, subject, details, submission_date, \
            receiver_type) VALUES ($1, $2, $3, $4, $5, $6)",
        [sid, teacher_id, subject, details, submission_date, receiver]
      );
      res.status(201).json({ message: "postNewSubmission" });
    }
  } catch (err) {
    console.log(err);
    const error = new HttpError("Submitting Feedback Failed", 500);
    return next(error);
  }
};

exports.getPastSubmissions = getPastSubmissions;
exports.postNewSubmission = postNewSubmission;
