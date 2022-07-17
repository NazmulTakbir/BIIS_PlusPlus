const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const session_id = require("../../placeHolder");

const getPastSubmissions = async (req, res, next) => {
  try {
    const sid = req.params.sid;
    let queryRes = await pool.query("select * from complaint where student_id = $1 ", [sid]);
    complaint_list = [];
    for (const element of queryRes.rows) {
      comp = {};
      comp["complain_id"] = element["complain_id"];
      comp["teacher_id"] = element["teacher_id"];
      comp["subject"] = element["subject"];
      comp["details"] = element["details"];
      comp["receiver_type"] = element["receiver_type"];

      let date_ = "";
      date_ = (date_ + element["submission_date"]).substring(4, 16);
      comp["submmission_date"] = date_;

      complaint_list.push(comp);
    }

    res.status(201).json({ message: "getPastSubmissions", data: complaint_list });
  } catch (err) {
    const error = new HttpError("Fetching Courses to Add Failed", 500);
    return next(error);
  }
};

const postNewSubmission = async (req, res, next) => {
  try {
    sid = req.params.sid;
    console.log(req.body);
    const { complaint_id, student_id, teacher_id, subject, details, submission_date } = req.body;
    queryRes = await pool.query(
      "INSERT INTO public.complaint (complaint_id, student_id, teacher_id, subject, details, submission_date) \
      VALUES($1 , $2 , $3 , $4 , $5 , $6)",
      [complaint_id, student_id, teacher_id, subject, details, submission_date]
    );

    res.status(201).json({ message: "postNewSubmission" });
  } catch (err) {
    const error = new HttpError("Fetching Courses to Drop Failed", 500);
    return next(error);
  }
};

exports.getPastSubmissions = getPastSubmissions;
exports.postNewSubmission = postNewSubmission;
