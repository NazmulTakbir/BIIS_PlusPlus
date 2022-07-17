const { query } = require("express");
const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const session_id = require("../../placeHolder");

//utils methos
const get_dept_level_term = async (sid) => {
  let queryRes = await pool.query("SELECT dept_id, level, term from student where student_id = $1", [sid]);

  var returnedObject = {};
  returnedObject["dept_id"] = queryRes.rows[0]["dept_id"];
  returnedObject["level"] = queryRes.rows[0]["level"];
  returnedObject["term"] = queryRes.rows[0]["term"];

  return returnedObject;
};

const getRegisteredCourses = async (req, res, next) => {
  try {
    let queryRes = await pool.query('SELECT * FROM "course registrations" where student_id = $1 and session_id = $2', [
      req.params.sid,
      session_id,
    ]);

    const registeredCourses = [];
    for (const element of queryRes.rows) {
      queryRes = await pool.query("SELECT course_name, credits from course where course_id = $1", [
        element["course_id"],
      ]);
      registeredCourses.push({
        course_id: element["course_id"],
        course_name: queryRes.rows[0]["course_name"],
        credits: queryRes.rows[0]["credits"],
        reg_status: element["reg_status"],
      });
    }

    res.json({ message: "registeredCourses", data: registeredCourses });
  } catch (err) {
    const error = new HttpError("Fetching Registered Courses Failed", 500);
    return next(error);
  }
};

const getCoursesToAdd = async (req, res, next) => {
  try {
    const sid = req.params.sid;
    const { dept_id, level, term } = await get_dept_level_term(sid);

    let queryRes = await pool.query(
      'select t1.course_id, t1.course_name, t1.credits, t2.offering_id from (select course_id, \
        course_name, credits from course where offered_to_dept_id=$1 and level=$2 and term=$3) as t1, \
      (select offering_id, course_id, session_id from "course offering") as t2 where \
      t1.course_id = t2.course_id and session_id=$4',
      [dept_id, level, term, session_id]
    );
    const coursesOffered = queryRes.rows;

    coursesToAdd = [];
    for (let i = 0; i < coursesOffered.length; i++) {
      queryRes = await pool.query(
        'select offering_id from "registration request" where student_id = $1 and offering_id=$2',
        [sid, coursesOffered[i]["offering_id"]]
      );
      if (queryRes.rowCount == 0) {
        coursesToAdd.push({
          course_id: coursesOffered[i]["course_id"],
          course_name: coursesOffered[i]["course_name"],
          credits: coursesOffered[i]["credits"],
        });
      }
    }

    res.status(201).json({ message: "getCoursesToAdd", data: coursesToAdd });
  } catch (err) {
    const error = new HttpError("Fetching Courses to Add Failed", 500);
    return next(error);
  }
};

const getCoursesToDrop = async (req, res, next) => {
  try {
    const sid = req.params.sid;
    const { dept_id, level, term } = await get_dept_level_term(sid);

    let queryRes = await pool.query(
      'select t1.course_id, t1.course_name, t1.credits, t2.offering_id from (select course_id, \
        course_name, credits from course where offered_to_dept_id=$1 and level=$2 and term=$3) as t1, \
      (select offering_id, course_id, session_id from "course offering") as t2 where \
      t1.course_id = t2.course_id and session_id=$4',
      [dept_id, level, term, session_id]
    );
    const coursesOffered = queryRes.rows;

    coursesToDrop = [];
    for (let i = 0; i < coursesOffered.length; i++) {
      queryRes = await pool.query(
        'select offering_id from "registration request" where student_id = $1 and offering_id=$2',
        [sid, coursesOffered[i]["offering_id"]]
      );
      if (queryRes.rowCount == 1) {
        coursesToDrop.push({
          course_id: coursesOffered[i]["course_id"],
          course_name: coursesOffered[i]["course_name"],
          credits: coursesOffered[i]["credits"],
        });
      }
    }

    res.status(201).json({ message: "getCoursesToDrop", data: coursesToDrop });
  } catch (err) {
    const error = new HttpError("Fetching Courses to Drop Failed", 500);
    return next(error);
  }
};

const postAddRequest = async (req, res, next) => {
  try {
    placeHolder = {
      addID: 1,
    };

    // const { addID } = req.body;
    const { addID } = placeHolder;

    let queryRes = await pool.query('select * from "registration request" where offering_id = $1 and student_id = $2', [
      addID,
      req.params.sid,
    ]);

    if (queryRes.rowCount > 0) {
      res.status(201).json({ message: "Cannot Add. Course Previously Requested", id: addID });
    } else {
      await pool.query(
        'INSERT INTO "registration request" (student_id, offering_id, request_type, reg_status) VALUES($1, $2, $3, $4)',
        [req.params.sid, addID, "add", "awaiting_advisor"]
      );
      res.status(201).json({ message: "Placed Add Request", id: addID });
    }
  } catch (err) {
    const error = new HttpError("Failed to Place Add Request", 500);
    return next(error);
  }
};

const postDropRequest = async (req, res, next) => {
  try {
    placeHolder = {
      dropID: 1,
    };

    // const { dropID } = req.body;
    const { dropID } = placeHolder;

    let queryRes = await pool.query('select * from "registration request" where offering_id = $1 and student_id = $2', [
      dropID,
      req.params.sid,
    ]);

    if (queryRes.rowCount == 0) {
      res.status(201).json({ message: "Cannot Drop. Course Offering Not Requested Previously", id: dropID });
    } else if (queryRes.rowCount == 1) {
      await pool.query(
        'INSERT INTO "registration request" (student_id, offering_id, request_type, reg_status) VALUES($1, $2, $3, $4)',
        [req.params.sid, dropID, "drop", "awaiting_advisor"]
      );
      res.status(201).json({ message: "Placed Drop Request", id: dropID });
    } else if (queryRes.rowCount == 2) {
      res.status(201).json({ message: "Cannot Drop. Course Offering Already Dropped", id: dropID });
    }
  } catch (err) {
    const error = new HttpError("Failed to Place Drop Request", 500);
    return next(error);
  }
};

exports.getRegisteredCourses = getRegisteredCourses;
exports.postAddRequest = postAddRequest;
exports.postDropRequest = postDropRequest;
exports.getCoursesToAdd = getCoursesToAdd;
exports.getCoursesToDrop = getCoursesToDrop;
