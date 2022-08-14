const pool = require("../../db");
const HttpError = require("../../models/HttpError");

//util
const getDepartmentsList = async (req, res, next) => {
  try {
    let queryRes = await pool.query("select dept_id, dept_name from department");
    const deptData = queryRes.rows;

    res.json({ message: "getInfo", data: deptData });
  } catch (err) {
    const error = new HttpError("Fetching Dept Data Failed", 500);
    return next(error);
  }
};
/*
  const get_dept_id = async (req, res, next) => {
    try {
      const dept_name = req.body.dept_name;
      let queryRes = await pool.query("select dept_id from department where dept_name=$1",[dept_name]);
      const dept_id = queryRes.rows[0].dept_id;
  
      res.json({ message: "getInfo", dept_id: dept_id });
    } catch (err) {
      const error = new HttpError("Fetching Dept Data Failed", 500);
      return next(error);
    }
  };

exports.get_dept_id = get_dept_id;
*/
const getTeachersList = async (req, res, next) => {
  let queryRes = await pool.query(
    `select dept_id, dept_name from "department admin" natural join department where dept_admin_id=$1`,
    [req.userData.id]
  );
  const admin_dept_id = queryRes.rows[0]["dept_id"];

  try {
    let queryRes = await pool.query("select teacher_id, name from teacher where dept_id=$1", [admin_dept_id]);
    const teacherData = queryRes.rows;

    res.json({ message: "getInfo", data: teacherData });
  } catch (err) {
    const error = new HttpError("Fetching Teacher Data Failed", 500);
    return next(error);
  }
};

const getSessionList = async (req, res, next) => {
  try {
    let queryRes = await pool.query("select session_id from session");
    const sessionList = queryRes.rows;

    res.json({ message: "getInfo", data: sessionList });
  } catch (err) {
    const error = new HttpError("Fetching Session Data Failed", 500);
    return next(error);
  }
};

const getScholarshipTypeList = async (req, res, next) => {
  try {
    let queryRes = await pool.query(`select * from "scholarship type"`);
    const scholarship_type_list = queryRes.rows;

    res.json({ message: "getInfo", data: scholarship_type_list });
  } catch (err) {
    const error = new HttpError("Fetching Session Data Failed", 500);
    return next(error);
  }
};

const getSelfDepartment = async (req, res, next) => {
  try {
    let queryRes = await pool.query(
      `select dept_id, dept_name from "department admin" natural join department where dept_admin_id=$1`,
      [req.userData.id]
    );

    res.json({ message: "getInfo", data: queryRes.rows[0] });
  } catch (err) {
    const error = new HttpError("Fetching Session Data Failed", 500);
    return next(error);
  }
};

exports.getSessionList = getSessionList;
exports.getTeachersList = getTeachersList;
exports.getScholarshipTypeList = getScholarshipTypeList;
exports.getDepartmentsList = getDepartmentsList;
exports.getSelfDepartment = getSelfDepartment;
