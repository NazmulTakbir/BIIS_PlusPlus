const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const session_id = require("../../placeHolder");

const getHomeInfo = async (req, res, next) => {
  try {
    let queryRes = await pool.query("SELECT * from student where student_id = $1", [req.params.sid]);
    const studentInfo = queryRes.rows[0];
    res.json(studentInfo);
  } catch (err) {
    const error = new HttpError("Fetching Student Info Failed", 500);
    return next(error);
  }
};

const getClassRoutine = async (req, res, next) => {
  try {
    let queryRes = await pool.query(
      'SELECT offering_id from "course registration" where student_id = $1 and session_id = $2',
      [req.params.sid, session_id]
    );

    let courseTimings = {};
    for (const element of queryRes.rows) {
      const offeringID = element["offering_id"];
      queryRes = await pool.query('select course_id from "course offering" where offering_id = $1', [offeringID]);
      const courseID = queryRes.rows[0]["course_id"];

      queryRes = await pool.query(
        'select day, start_time, end_time from "offering time location" where offering_id = $1',
        [offeringID]
      );
      courseTimings[courseID] = queryRes.rows;
    }
    res.json(courseTimings);
  } catch (err) {
    const error = new HttpError("Fetching Student Routine Info Failed", 500);
    return next(error);
  }
};

const getAdvisorInfo = async (req, res, next) => {
  try {
    let queryRes = await pool.query("SELECT advisor_id from student where student_id = $1", [req.params.sid]);
    const advisorID = queryRes.rows[0]["advisor_id"];

    queryRes = await pool.query("SELECT * from teacher where teacher_id = $1", [advisorID]);
    const teacherInfo = queryRes.rows[0];
    res.json(teacherInfo);
  } catch (err) {
    const error = new HttpError("Fetching Student Info Failed", 500);
    return next(error);
  }
};

exports.getHomeInfo = getHomeInfo;
exports.getClassRoutine = getClassRoutine;
exports.getAdvisorInfo = getAdvisorInfo;
