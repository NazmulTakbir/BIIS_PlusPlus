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
    //get pending dues from dues table
    let queryRes = await pool.query(
      `SELECT d.dues_id , d.student_id , s.name , dt.description , dt.amount , d.deadline FROM dues as d , public."dues type" as dt, student as s WHERE dues_status = 'Not Paid' \
      AND d.dues_type_id = dt.dues_type_id and d.student_id = s.student_id`
    );

    res.json({ message: "getPendingDues successful", data: queryRes.rows });
  } catch (err) {
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
    for(let i = 0; i < duesIDs.length; i++){
        queryRes = await pool.query(
          "UPDATE dues SET dues_status = 'Paid' WHERE dues_id = $1",[duesIDs[i]]
        );
    }
    console.log(duesIDs);
    
    res.json({ message: "postMarkDuesPaid successful" });
  } catch (err) {
    const error = new HttpError("postMarkDuesPaid failed", 500);
    return next(error);
  }
}

exports.postMarkDuesPaid = postMarkDuesPaid;
exports.getPendingScholarships = getPendingScholarships;
exports.getPendingDues = getPendingDues;
