const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const { getCurrentSession } = require("../../util/CurrentSession");

const getInfo = async (req, res, next) => {
  try {
    let queryRes = await pool.query("SELECT * from teacher where teacher_id = $1", [req.userData.id]);
    var teacherInfo = queryRes.rows[0];

    queryRes = await pool.query("SELECT * from department where dept_id = $1", [teacherInfo["dept_id"]]);
    teacherInfo["dept_name"] = queryRes.rows[0]["dept_name"];

    res.json(teacherInfo);
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

const getCoursesCoordinated = async (req, res, next) => {
  try {
    const session_id = await getCurrentSession();
    let queryRes = await pool.query(
      'select course_id from "course offering teacher" natural join "course offering" where session_id=$1 and \
      teacher_id=$2 and role=\'Coordinator\';',
      [session_id, req.userData.id]
    );
    data = [];
    for (let i = 0; i < queryRes.rows.length; i++) {
      data.push(queryRes.rows[i]["course_id"]);
    }
    res.json({ message: "getCoursesCoordinated", data: data });
  } catch (err) {
    const error = new HttpError("getCoursesCoordinated Failed", 500);
    return next(error);
  }
};

const getCoursesTaught = async (req, res, next) => {
  try {
    const session_id = await getCurrentSession();
    let queryRes = await pool.query(
      'select course_id from "course offering teacher" natural join "course offering" where session_id=$1 and \
      teacher_id=$2 and role=\'Course Teacher\';',
      [session_id, req.userData.id]
    );
    data = [];
    for (let i = 0; i < queryRes.rows.length; i++) {
      data.push(queryRes.rows[i]["course_id"]);
    }
    res.json({ message: "getCoursesTaught", data: data });
  } catch (err) {
    const error = new HttpError("getCoursesTaught Failed", 500);
    return next(error);
  }
};

const getCoursesScrutinized = async (req, res, next) => {
  try {
    const session_id = await getCurrentSession();
    let queryRes = await pool.query(
      'select course_id from "course offering teacher" natural join "course offering" where session_id=$1 and \
      teacher_id=$2 and role=\'Scrutinizer\';',
      [session_id, req.userData.id]
    );
    data = [];
    for (let i = 0; i < queryRes.rows.length; i++) {
      data.push(queryRes.rows[i]["course_id"]);
    }
    res.json({ message: "getCoursesScrutinized", data: data });
  } catch (err) {
    const error = new HttpError("getCoursesScrutinized Failed", 500);
    return next(error);
  }
};

const getAssignedTeachers = async (req, res, next) => {
  try {
    const session_id = await getCurrentSession();
    const course_id = req.params.course_id;

    let queryRes = await pool.query(
      'select DISTINCT teacher_id, name from teacher natural join "course offering teacher" natural join \
      "course offering" where session_id=$1 and course_id=$2 and role=\'Course Teacher\';',
      [session_id, course_id]
    );

    res.json({ message: "getAssignedTeachers", data: queryRes.rows });
  } catch (err) {
    const error = new HttpError("getAssignedTeachers Failed", 500);
    return next(error);
  }
};

const postMarkingCriteria = async (req, res, next) => {
  try {
    const session_id = await getCurrentSession();
    const { criteria_name, criteria_weight, total_marks, teacher_id, course_id } = req.body;

    let queryRes = await pool.query(
      'select offering_id from "course offering" where course_id=$1 and \
    session_id=$2',
      [course_id, session_id]
    );

    const offering_id = queryRes.rows[0]["offering_id"];

    await pool.query(
      'INSERT INTO public."mark distribution policy"(criteria_name, criteria_weight, total_marks, teacher_id, \
        offering_id) VALUES ($1, $2, $3, $4, $5);',
      [criteria_name, criteria_weight, total_marks, teacher_id, offering_id]
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
      'select criteria_name, criteria_weight, total_marks, t.name as teacher_name from \
      "mark distribution policy" natural join "course offering" natural join teacher as t where \
      course_id=$1 and session_id=$2',
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

const getCourseCriteriaByTeacher = async (req, res, next) => {
  try {
    const session_id = await getCurrentSession();
    const course_id = req.params.course_id;

    let queryRes = await pool.query(
      'select criteria_name from "mark distribution policy" natural join "course offering" where \
      course_id=$1 and teacher_id=$2 and session_id=$3;',
      [course_id, req.userData.id, session_id]
    );

    data = [];
    for (let i = 0; i < queryRes.rows.length; i++) {
      data.push(queryRes.rows[i]["criteria_name"]);
    }

    res.json({ message: "getCourseCriteriaByTeacher", data: data });
  } catch (err) {
    const error = new HttpError("getCourseCriteriaByTeacher Failed", 500);
    return next(error);
  }
};

const getStudentMarks = async (req, res, next) => {
  try {
    const session_id = await getCurrentSession();
    const course_id = req.params.course_id;
    const criteria = req.params.criteria;

    let queryRes = await pool.query(
      'select offering_id from "course offering" where course_id=$1 and \
    session_id=$2',
      [course_id, session_id]
    );

    const offering_id = queryRes.rows[0]["offering_id"];

    queryRes = await pool.query('select student_id from "course registrations" where offering_id=$1;', [offering_id]);

    data = [];
    for (let i = 0; i < queryRes.rows.length; i++) {
      const sutdent_id = queryRes.rows[i]["student_id"];

      queryRes = await pool.query(
        'select marks from "result details" where student_id=$1 and offering_id=$2 and criteria_name=$3;',
        [sutdent_id, offering_id, criteria]
      );

      if (queryRes.rows.length > 0) {
        data.push({ studentID: sutdent_id, marks: queryRes.rows[0]["marks"] });
      } else {
        data.push({ studentID: sutdent_id, marks: "Not Added" });
      }
    }

    res.json({ message: "getStudentMarks", data: data });
  } catch (err) {
    const error = new HttpError("getStudentMarks Failed", 500);
    return next(error);
  }
};

exports.getInfo = getInfo;
exports.getAllAdvisee = getAllAdvisee;
exports.getCoursesScrutinized = getCoursesScrutinized;
exports.getCoursesTaught = getCoursesTaught;
exports.getCoursesCoordinated = getCoursesCoordinated;
exports.getAssignedTeachers = getAssignedTeachers;
exports.postMarkingCriteria = postMarkingCriteria;
exports.getMarkingCriteria = getMarkingCriteria;
exports.postGradingBoundary = postGradingBoundary;
exports.getGradingBoundary = getGradingBoundary;
exports.getCourseCriteriaByTeacher = getCourseCriteriaByTeacher;
exports.getStudentMarks = getStudentMarks;
