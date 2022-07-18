const pool = require("../../db");

const get_dept_level_term = async (sid) => {
  let queryRes = await pool.query("SELECT dept_id, level, term from student where student_id = $1", [sid]);

  var returnedObject = {};
  returnedObject["dept_id"] = queryRes.rows[0]["dept_id"];
  returnedObject["level"] = queryRes.rows[0]["level"];
  returnedObject["term"] = queryRes.rows[0]["term"];

  return returnedObject;
};

const get_total_credit = async (sid, level, term, session_id) => {
  let total_credits = 0.0;
  console.log("hsdfhsd");
  let queryRes = await pool.query(
    'SELECT offering_id from "course registrations" where student_id = $1 and session_id = $2',
    [sid, session_id]
  );

  for (const element of queryRes.rows) {
    const offeringID = element["offering_id"];
    queryRes = await pool.query('SELECT course_id from "course offering" where offering_id = $1', [offeringID]);
    const courseID = queryRes.rows[0]["course_id"];

    queryRes = await pool.query("SELECT credits from course where course_id = $1 and level=$2 and term=$3", [
      courseID,
      level,
      term,
    ]);
    total_credits += queryRes.rows[0]["credits"];
  }

  var returnedObject = {};
  returnedObject["total_credit"] = total_credits;
  return returnedObject;
};

exports.get_dept_level_term = get_dept_level_term;
exports.get_total_credit = get_total_credit;
