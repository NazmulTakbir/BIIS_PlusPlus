const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const session_id = require("../../placeHolder");

const getInfo = async (req, res, next) => {
  try {
    res.json({ message: "getInfo" });
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
      [req.params.tid]
    );

    res.json({ message: "getInfo", data: queryRes.rows });
  } catch (err) {
    const error = new HttpError("Fetching All Advisees Failed", 500);
    return next(error);
  }
};

const getAdviseeInfo = async (req, res, next) => {
  try {
    const sid = req.params.sid;
    let queryRes = await pool.query(
      "select hall_name, dept_name from student natural join department natural join hall where student_id=$1",
      [sid]
    );
    const dept_name = queryRes.rows[0]["dept_name"];
    const hall_name = queryRes.rows[0]["hall_name"];

    queryRes = await pool.query("SELECT * from student where student_id = $1", [req.params.sid]);
    var studentInfo = queryRes.rows[0];

    let date_of_birth = "";
    date_of_birth = (date_of_birth + queryRes.rows[0]["date_of_birth"]).substring(4, 16);

    studentInfo["date_of_birth"] = date_of_birth;
    studentInfo["hall_name"] = hall_name;
    studentInfo["dept_name"] = dept_name;

    res.json(studentInfo);
  } catch (err) {
    const error = new HttpError("Fetching Student Info Failed", 500);
    return next(error);
  }
};

exports.getInfo = getInfo;
exports.getAllAdvisee = getAllAdvisee;
exports.getAdviseeInfo = getAdviseeInfo;
