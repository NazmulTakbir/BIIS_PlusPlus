const pool = require("../../db");

const get_dept_level_term = async (sid) => {
  let queryRes = await pool.query("SELECT dept_id, level, term from student where student_id = $1", [sid]);

  var returnedObject = {};
  returnedObject["dept_id"] = queryRes.rows[0]["dept_id"];
  returnedObject["level"] = queryRes.rows[0]["level"];
  returnedObject["term"] = queryRes.rows[0]["term"];

  return returnedObject;
};

exports.get_dept_level_term = get_dept_level_term;
