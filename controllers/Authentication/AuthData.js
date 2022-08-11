const pool = require("../../db");

const getAuthData = async (userid) => {
  let queryRes = await pool.query("select * from student where student_id=$1", [userid]);
  if (queryRes.rows.length > 0) {
    return { userType: "student", password: queryRes.rows[0]["password"] };
  }

  queryRes = await pool.query("select * from teacher where teacher_id=$1", [userid]);
  if (queryRes.rows.length > 0) {
    return { userType: "teacher", password: queryRes.rows[0]["password"] };
  }

  queryRes = await pool.query('select * from "hall admin" where hall_admin_id=$1', [userid]);
  if (queryRes.rows.length > 0) {
    return { userType: "hall admin", password: queryRes.rows[0]["password"] };
  }

  queryRes = await pool.query('select * from "office admin" where office_admin_id=$1', [userid]);
  if (queryRes.rows.length > 0) {
    return { userType: "office admin", password: queryRes.rows[0]["password"] };
  }

  queryRes = await pool.query('select * from "department admin" where dept_admin_id=$1', [userid]);
  if (queryRes.rows.length > 0) {
    return { userType: "department admin", password: queryRes.rows[0]["password"] };
  }

  return "invalid";
};

exports.getAuthData = getAuthData;
