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
    const admin_dept_id = req.params.admin_dept_id;
    try {
      let queryRes = await pool.query("select teacher_id, name from teacher where dept_id=$1",[admin_dept_id]);
      const teacherData = queryRes.rows;
  
      res.json({ message: "getInfo", data: teacherData });
    } catch (err) {
      const error = new HttpError("Fetching Teacher Data Failed", 500);
      return next(error);
    }
}

exports.getTeachersList = getTeachersList;
exports.getDepartmentsList = getDepartmentsList;