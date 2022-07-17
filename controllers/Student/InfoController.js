const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const session_id = require("../../placeHolder");

//util
const get_dept_hall = async (sid) => {
  let queryRes = await pool.query(
    'SELECT d.dept_name , h.hall_name from student as s,department as d,hall as h \
     where s.student_id = $1 and d.dept_id = s.dept_id and h.hall_id = s.hall_id \
     ',
    [sid]
  );

  var returnedObject = {};
  returnedObject["dept_name"] = queryRes.rows[0]["dept_name"];
  returnedObject["hall_name"] = queryRes.rows[0]["hall_name"];
  //console.log(returnedObject);
  return returnedObject;
}

const getHomeInfo = async (req, res, next) => {
  try {
    const sid = req.params.sid;
    const dept_name  = (await get_dept_level_term(sid)).dept_name;
    const hall_name = (await get_dept_level_term(sid)).hall_name;

    console.log(hall_name);
    
    let queryRes = await pool.query("SELECT * from student where student_id = $1", [req.params.sid]);
    const studentInfo = queryRes.rows[0];
    const dob = queryRes.rows[0]["date_of_birth"].substring(0,10);

    res.json(studentInfo , {hall_name:hall_name} , {dept_name:dept_name} , {date_of_birth:dob});
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
