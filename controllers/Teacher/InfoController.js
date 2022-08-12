const pool = require("../../db");
const HttpError = require("../../models/HttpError");

const getInfo = async (req, res, next) => {
  try {
    let queryRes = await pool.query("SELECT * from teacher where teacher_id = $1", [req.userData.id]);
    var teacherInfo = queryRes.rows[0];

    queryRes = await pool.query("SELECT * from department where dept_id = $1", [teacherInfo["dept_id"]]);
    teacherInfo["dept_name"] = queryRes.rows[0]["dept_name"];

    res.json(teacherInfo);
    console.log(teacherInfo);
  } catch (err) {
    const error = new HttpError("Fetching Student Info Failed", 500);
    return next(error);
  }
};

const getAllAdvisee = async (req, res, next) => {
  try {
    const queryRes = await pool.query(
      "select student_id, s.name, level, term from teacher as t, student as s where teacher_id=$1 \
                      and advisor_id=teacher_id order by student_id;",
      [req.userData.id]
    );

    res.json({ message: "getInfo", data: queryRes.rows });
  } catch (err) {
    const error = new HttpError("Fetching All Advisees Failed", 500);
    return next(error);
  }
};

exports.getInfo = getInfo;
exports.getAllAdvisee = getAllAdvisee;
