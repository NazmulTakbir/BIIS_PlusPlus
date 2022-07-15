const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const session_id = require("../../placeHolder");

const getRegisteredCourses = async (req, res, next) => {
  try {
    let queryRes = await pool.query(
      'SELECT offering_id from "course registration" where student_id = $1 and session_id = $2',
      [req.params.sid, session_id]
    );

    const registeredCourses = {};
    for (const element of queryRes.rows) {
      const offeringID = element["offering_id"];
      queryRes = await pool.query('SELECT course_id from "course offering" where offering_id = $1', [offeringID]);
      const courseID = queryRes.rows[0]["course_id"];

      queryRes = await pool.query("SELECT course_name, credits from course where course_id = $1", [courseID]);
      registeredCourses[courseID] = {
        course_name: queryRes.rows[0]["course_name"],
        credits: queryRes.rows[0]["credits"],
      };
    }

    res.json(registeredCourses);
  } catch (err) {
    const error = new HttpError("Fetching Registered Courses Failed", 500);
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
