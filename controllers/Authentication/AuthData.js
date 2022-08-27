const pool = require("../../db");

const getAuthData = async (userid) => {
  let queryRes = await pool.query("select * from student where student_id=$1", [userid]);
  if (queryRes.rows.length > 0) {
    return { userType: "student", password: queryRes.rows[0]["password"], responsibilities: [] };
  }

  queryRes = await pool.query("select * from teacher where teacher_id=$1", [userid]);
  if (queryRes.rows.length > 0) {
    let responsibilities = [];

    let hasRole = await pool.query("select * from student where advisor_id=$1", [queryRes.rows[0]["teacher_id"]]);
    if (hasRole.rows.length > 0) {
      responsibilities.push("advisor");
    }
    hasRole = await pool.query("select * from hall where hall_provost_id=$1", [queryRes.rows[0]["teacher_id"]]);
    if (hasRole.rows.length > 0) {
      responsibilities.push("hallprovost");
    }
    hasRole = await pool.query("select * from department where dept_head=$1", [queryRes.rows[0]["teacher_id"]]);
    if (hasRole.rows.length > 0) {
      responsibilities.push("depthead");
    }
    hasRole = await pool.query("select * from session where exam_controller_id=$1", [queryRes.rows[0]["teacher_id"]]);
    if (hasRole.rows.length > 0) {
      responsibilities.push("examcontroller");
    }

    return { userType: "teacher", password: queryRes.rows[0]["password"], responsibilities: responsibilities };
  }

  queryRes = await pool.query('select * from "hall admin" where hall_admin_id=$1', [userid]);
  if (queryRes.rows.length > 0) {
    return { userType: "hall admin", password: queryRes.rows[0]["password"], responsibilities: [] };
  }

  queryRes = await pool.query('select * from "office admin" where office_admin_id=$1', [userid]);
  if (queryRes.rows.length > 0) {
    return { userType: "office admin", password: queryRes.rows[0]["password"], responsibilities: [] };
  }

  queryRes = await pool.query('select * from "department admin" where dept_admin_id=$1', [userid]);
  if (queryRes.rows.length > 0) {
    return { userType: "department admin", password: queryRes.rows[0]["password"], responsibilities: [] };
  }

  queryRes = await pool.query('select * from "comptroller admin" where comptroller_admin_id=$1', [userid]);
  if (queryRes.rows.length > 0) {
    return { userType: "comptroller admin", password: queryRes.rows[0]["password"], responsibilities: [] };
  }

  return "invalid";
};

exports.getAuthData = getAuthData;
