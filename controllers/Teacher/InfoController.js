const pool = require("../../db");
const HttpError = require("../../models/HttpError");

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
