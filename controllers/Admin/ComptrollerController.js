const pool = require("../../db");
const HttpError = require("../../models/HttpError");

const getPendingScholarships = async (req, res, next) => {
  try {
    let queryRes = await pool.query(
      `SELECT scholarship.scholarship_id, scholarship.student_id, student.name, scholarship.session_id,\
      (SELECT scholarship_name from "scholarship type" where scholarship_type_id=scholarship.scholarship_type_id)\
      FROM scholarship\
      INNER JOIN student ON scholarship.student_id=student.student_id\
      where scholarship_state='awaiting_comptroller';`
    );
    res.json({ message: "getPendingScholarships successful", data: queryRes.rows });
  } catch (err) {
    console.log(err);
    const error = new HttpError("getPendingScholarships failed", 500);
    return next(error);
  }
};

const getPendingDues = async (req, res, next) => {
  try {
    //get pending dues from dues table
    let queryRes = await pool.query(
      `SELECT d.dues_id , d.student_id , s.name , dt.description , dt.amount , d.deadline FROM dues as d , public."dues type" as dt, student as s WHERE dues_status = 'Not Paid' \
      AND d.dues_type_id = dt.dues_type_id and d.student_id = s.student_id`
    );

    res.json({ message: "getPendingDues successful", data: queryRes.rows });
  } catch (err) {
    console.log(err);
    const error = new HttpError("getPendingDues failed", 500);
    return next(error);
  }
};

//async method to mark dues as paid
const postMarkDuesPaid = async (req, res, next) => {
  try {
    const { duesIDs } = req.body;
    let queryRes;
    console.log(duesIDs);
    for (let i = 0; i < duesIDs.length; i++) {
      queryRes = await pool.query("UPDATE dues SET dues_status = 'Paid' WHERE dues_id = $1", [duesIDs[i]]);
    }
    console.log(duesIDs);

    res.json({ message: "postMarkDuesPaid successful" });
  } catch (err) {
    console.log(err);
    const error = new HttpError("postMarkDuesPaid failed", 500);
    return next(error);
  }
};

const postMarkScholarshipPaid = async (req, res, next) => {
  try {
    const { schIDs } = req.body;
    console.log(schIDs);
    let queryRes;
    for (let i = 0; i < schIDs.length; i++) {
      queryRes = await pool.query(
        "UPDATE scholarship SET scholarship_state = 'paid', payment_date=NOW() WHERE scholarship_id = $1",
        [schIDs[i]]
      );
    }
    console.log(schIDs);

    res.json({ message: "postMarkScholarshipPaid successful" });
  } catch (err) {
    console.log(err);
    const error = new HttpError("postMarkScholarshipPaid failed", 500);
    return next(error);
  }
};

exports.postMarkScholarshipPaid = postMarkScholarshipPaid;
exports.postMarkDuesPaid = postMarkDuesPaid;
exports.getPendingScholarships = getPendingScholarships;
exports.getPendingDues = getPendingDues;
