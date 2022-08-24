const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const { getCurrentSession } = require("../../util/CurrentSession");

const postMarkingCriteria = async (req, res, next) => {
  try {
    const session_id = await getCurrentSession();
    const { criteria_name, criteria_weight, total_marks, teacher_id, course_id, scrutinizer_id } = req.body;

    let queryRes = await pool.query(
      'select offering_id from "course offering" where course_id=$1 and \
      session_id=$2',
      [course_id, session_id]
    );

    const offering_id = queryRes.rows[0]["offering_id"];

    await pool.query(
      'INSERT INTO public."mark distribution policy"(criteria_name, criteria_weight, total_marks, teacher_id, \
          offering_id, scrutinizer_id) VALUES ($1, $2, $3, $4, $5, $6);',
      [criteria_name, criteria_weight, total_marks, teacher_id, offering_id, scrutinizer_id]
    );

    res.json({ message: "postMarkingCriteria successful" });
  } catch (err) {
    const error = new HttpError("postMarkingCriteria Failed", 500);
    return next(error);
  }
};

const getMarkingCriteria = async (req, res, next) => {
  try {
    const session_id = await getCurrentSession();
    const course_id = req.params.course_id;

    let queryRes = await pool.query(
      'select criteria_name, criteria_weight, total_marks, teacher_name, scrutinizer_id, t2.name as scrutinizer_name\
      from (select criteria_name, criteria_weight, total_marks, t.name as teacher_name, scrutinizer_id from \
        "mark distribution policy" natural join "course offering" natural join teacher as t where \
        course_id=$1 and session_id=$2) as t1 LEFT JOIN teacher as t2 ON t1.scrutinizer_id=t2.teacher_id;',
      [course_id, session_id]
    );

    res.json({ message: "getAssignedTeachers", data: queryRes.rows });
  } catch (err) {
    const error = new HttpError("getAssignedTeachers Failed", 500);
    return next(error);
  }
};

const postGradingBoundary = async (req, res, next) => {
  try {
    const session_id = await getCurrentSession();
    const { letter_grade, lower_bound, upper_bound, grade_point, course_id } = req.body;

    let queryRes = await pool.query(
      'select offering_id from "course offering" where course_id=$1 and \
      session_id=$2',
      [course_id, session_id]
    );

    const offering_id = queryRes.rows[0]["offering_id"];

    queryRes = await pool.query(
      'INSERT INTO public."grade distribution policy"(offering_id, upper_bound, lower_bound, letter_grade, \
          grade_point) VALUES ($1, $2, $3, $4, $5);',
      [offering_id, upper_bound, lower_bound, letter_grade, grade_point]
    );

    res.json({ message: "postGradingBoundary", data: queryRes.rows });
  } catch (err) {
    const error = new HttpError("postGradingBoundary Failed", 500);
    return next(error);
  }
};

const getGradingBoundary = async (req, res, next) => {
  try {
    const session_id = await getCurrentSession();
    const course_id = req.params.course_id;

    let queryRes = await pool.query(
      'SELECT offering_id, upper_bound, lower_bound, letter_grade, grade_point FROM \
        public."grade distribution policy" natural join "course offering" where course_id=$1 \
        and session_id=$2;',
      [course_id, session_id]
    );

    res.json({ message: "getGradingBoundary", data: queryRes.rows });
  } catch (err) {
    const error = new HttpError("getGradingBoundary Failed", 500);
    return next(error);
  }
};

exports.postMarkingCriteria = postMarkingCriteria;
exports.getMarkingCriteria = getMarkingCriteria;
exports.postGradingBoundary = postGradingBoundary;
exports.getGradingBoundary = getGradingBoundary;
