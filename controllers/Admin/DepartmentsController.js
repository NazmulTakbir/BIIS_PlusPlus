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

exports.getDepartmentsList = getDepartmentsList;