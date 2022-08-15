const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const session_id = require("../../placeHolder");

const getScholarshipRequests = async (req, res, next) => {
  try {
    let queryRes = await pool.query(`Select hall_id from public.hall where hall_provost_id=$1;`, [req.userData.id]);
    const hall_id = queryRes.rows[0]["hall_id"];
    console.log("hall id is:" + hall_id);

    queryRes = await pool.query(
      `SELECT scholarship.scholarship_id, scholarship.student_id, student.name, scholarship.session_id, \
      (SELECT scholarship_name from "scholarship type" where scholarship_type_id=scholarship.scholarship_type_id) \
      FROM scholarship \
      INNER JOIN student ON scholarship.student_id=student.student_id \
      where student.hall_id = $1 and scholarship.scholarship_state='awaiting_provost';` , [hall_id]
    );
    console.log(queryRes.rows);

    res.json({ message: "getScholarshipRequests", data: queryRes.rows });
  } catch (err) {
    const error = new HttpError("Fetching Student Info Failed", 500);
    return next(error);
  }
};

exports.getScholarshipRequests = getScholarshipRequests;
