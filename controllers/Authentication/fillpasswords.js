const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../../db");

const main = async () => {
  let queryRes = await pool.query("select student_id from student");
  for (let i = 0; i < queryRes.rows.length; i++) {
    hashedPassword = await bcrypt.hash("1234", 10);
    await pool.query("update student set password=$1 where student_id=$2", [
      hashedPassword,
      queryRes.rows[i]["student_id"],
    ]);
  }
  console.log("done 1");

  queryRes = await pool.query("select teacher_id from teacher");
  for (let i = 0; i < queryRes.rows.length; i++) {
    hashedPassword = await bcrypt.hash("1234", 10);
    await pool.query("update teacher set password=$1 where teacher_id=$2", [
      hashedPassword,
      queryRes.rows[i]["teacher_id"],
    ]);
  }
  console.log("done 2");

  queryRes = await pool.query('select dept_admin_id from "department admin"');
  for (let i = 0; i < queryRes.rows.length; i++) {
    hashedPassword = await bcrypt.hash("1234", 10);
    await pool.query('update "department admin" set password=$1 where dept_admin_id=$2', [
      hashedPassword,
      queryRes.rows[i]["dept_admin_id"],
    ]);
  }
  console.log("done 3");

  queryRes = await pool.query('select hall_admin_id from "hall admin"');
  for (let i = 0; i < queryRes.rows.length; i++) {
    hashedPassword = await bcrypt.hash("1234", 10);
    await pool.query('update "hall admin" set password=$1 where hall_admin_id=$2', [
      hashedPassword,
      queryRes.rows[i]["hall_admin_id"],
    ]);
  }
  console.log("done 4");

  queryRes = await pool.query('select office_admin_id from "office admin"');
  for (let i = 0; i < queryRes.rows.length; i++) {
    hashedPassword = await bcrypt.hash("1234", 10);
    await pool.query('update "office admin" set password=$1 where office_admin_id=$2', [
      hashedPassword,
      queryRes.rows[i]["office_admin_id"],
    ]);
  }
  console.log("done 5");
};

main();
