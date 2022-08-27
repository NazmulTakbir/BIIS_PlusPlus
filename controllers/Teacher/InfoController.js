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
    console.log(err);
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
    console.log(err);
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
    console.log(err);
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
    console.log(err);
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
    console.log(err);
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
    console.log(err);
    const error = new HttpError("getAssignedTeachers Failed", 500);
    return next(error);
  }
};

const getAssignedScrutinizers = async (req, res, next) => {
  try {
    const session_id = await getCurrentSession();
    const course_id = req.params.course_id;

    let queryRes = await pool.query(
      'select DISTINCT teacher_id, name from teacher natural join "course offering teacher" natural join \
      "course offering" where session_id=$1 and course_id=$2 and role=\'Scrutinizer\';',
      [session_id, course_id]
    );

    res.json({ message: "getAssignedScrutinizers", data: queryRes.rows });
  } catch (err) {
    console.log(err);
    const error = new HttpError("getAssignedScrutinizers Failed", 500);
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
    console.log(err);
    const error = new HttpError("getCourseCriteriaByTeacher Failed", 500);
    return next(error);
  }
};

const getCourseCriteriaByScrutinizer = async (req, res, next) => {
  try {
    const session_id = await getCurrentSession();
    const course_id = req.params.course_id;

    let queryRes = await pool.query(
      'select criteria_name from "mark distribution policy" natural join "course offering" where \
      course_id=$1 and scrutinizer_id=$2 and session_id=$3;',
      [course_id, req.userData.id, session_id]
    );

    data = [];
    for (let i = 0; i < queryRes.rows.length; i++) {
      data.push(queryRes.rows[i]["criteria_name"]);
    }

    res.json({ message: "getCourseCriteriaByScrutinizer", data: data });
  } catch (err) {
    console.log(err);
    const error = new HttpError("getCourseCriteriaByScrutinizer Failed", 500);
    return next(error);
  }
};

exports.getInfo = getInfo;
exports.getAllAdvisee = getAllAdvisee;
exports.getCoursesScrutinized = getCoursesScrutinized;
exports.getCoursesTaught = getCoursesTaught;
exports.getCoursesCoordinated = getCoursesCoordinated;
exports.getAssignedTeachers = getAssignedTeachers;
exports.getCourseCriteriaByTeacher = getCourseCriteriaByTeacher;
exports.getCourseCriteriaByScrutinizer = getCourseCriteriaByScrutinizer;
exports.getAssignedScrutinizers = getAssignedScrutinizers;
