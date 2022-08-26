const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const { getCurrentSession } = require("../../util/CurrentSession");
const { get_dept_level_term } = require("./Util");

const getRegistrationPhase = async () => {
  try {
    const session_id = await getCurrentSession();
    const queryRes = await pool.query('select registration_phase from "session" where session_id = $1', [session_id]);
    return queryRes.rows[0]["registration_phase"];
  } catch (err) {
    const error = new HttpError("Fetching Registration Phase Failed", 500);
    return next(error);
  }
};

const getRegisteredCourses = async (req, res, next) => {
  try {
    const session_id = await getCurrentSession();
    let queryRes = await pool.query('SELECT * FROM "course registrations" where student_id = $1 and session_id = $2', [
      req.userData.id,
      session_id,
    ]);

    const registeredCourses = [];
    course_ids = [];
    for (const element of queryRes.rows) {
      queryRes = await pool.query(
        `SELECT c.course_name, c.credits , co.offering_id from course as c ,\
        "course offering" as co where c.course_id = $1 \
        and c.course_id = co.course_id and co.session_id = $2`, 
        [element["course_id"], session_id]
      );
      
      registeredCourses.push({
        course_id: element["course_id"],
        offering_id: element["offering_id"],
        course_name: queryRes.rows[0]["course_name"],
        credits: queryRes.rows[0]["credits"],
        reg_status: element["reg_status"],
      });
      course_ids.push(element["course_id"]);
    }
    
    res.json({ message: "registeredCourses", data: registeredCourses ,course_ids : course_ids});
  } catch (err) {
    const error = new HttpError("Fetching Registered Courses Failed", 500);
    return next(error);
  }
};

const getPendingRequests = async (req, res, next) => {
  try {
    const session_id = await getCurrentSession();
    let queryRes = await pool.query(
      'select request_type, reg_status, request_date, course_id, course_name, credits from "registration request" as t1 \
      natural join "course offering" as t2 natural join course  where student_id=$1 and session_id=$2 \
      and reg_status<>\'approved\' order by reg_request_id',
      [req.userData.id, session_id]
    );

    data = queryRes.rows;
    for (let i = 0; i < data.length; i++) {
      let date_ = "";
      date_ = (date_ + data[i]["request_date"]).substring(4, 16);
      data[i]["request_date"] = date_;
    }

    res.json({ message: "getPendingRequests", data: data });
  } catch (err) {
    const error = new HttpError("Fetching Pending Registration Requests Failed", 500);
    return next(error);
  }
};

const getCoursesToAddUtil = async (sid) => {
  const session_id = await getCurrentSession();
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
        offering_id: coursesOffered[i]["offering_id"],
      });
    }
  }
  return coursesToAdd;
};

const getCoursesToAdd = async (req, res, next) => {
  try {
    const registrationPhase = await getRegistrationPhase();
    if (registrationPhase === "open") {
      const coursesToAdd = await getCoursesToAddUtil(req.userData.id);
      res.status(201).json({ message: "getCoursesToAdd", data: coursesToAdd });
    } else {
      res.status(201).json({ message: registrationPhase });
    }
  } catch (err) {
    const error = new HttpError("Fetching Courses to Add Failed", 500);
    return next(error);
  }
};

const getCoursesToDropUtil = async (sid) => {
  const session_id = await getCurrentSession();
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
        offering_id: coursesOffered[i]["offering_id"],
      });
    }
  }
  return coursesToDrop;
};

const getCoursesToDrop = async (req, res, next) => {
  try {
    const registrationPhase = await getRegistrationPhase();
    if (registrationPhase === "open") {
      const coursesToDrop = await getCoursesToDropUtil(req.userData.id);
      res.status(201).json({ message: "getCoursesToDrop", data: coursesToDrop });
    } else {
      res.status(201).json({ message: registrationPhase });
    }
  } catch (err) {
    const error = new HttpError("Fetching Courses to Drop Failed", 500);
    return next(error);
  }
};

const postAddRequest = async (req, res, next) => {
  try {
    const registrationPhase = await getRegistrationPhase();
    if (registrationPhase === "open") {
      const availableCourses = await getCoursesToAddUtil(req.userData.id);
      let availableOfferingIDs = [];
      for (let i = 0; i < availableCourses.length; i++) {
        availableOfferingIDs.push(availableCourses[i]["offering_id"]);
      }

      const { offeringIDs } = req.body;

      const response = [];
      for (let i = 0; i < offeringIDs.length; i++) {
        offeringID = offeringIDs[i];
        if (availableOfferingIDs.includes(offeringID)) {
          await pool.query(
            'INSERT INTO "registration request" (student_id, offering_id, request_type, reg_status, request_date) VALUES($1, $2, $3, $4, $5)',
            [req.userData.id, offeringID, "add", "awaiting_advisor", new Date()]
          );
          response.push({ message: "Placed Add Request", id: offeringID });
        } else {
          response.push({ message: "Could Not Place Add Request", id: offeringID });
        }
      }
      res.status(201).json({ result: response });
    } else {
      res.status(201).json({ message: registrationPhase });
    }
  } catch (err) {
    const error = new HttpError("Failed to Place Add Request", 500);
    return next(error);
  }
};

const postDropRequest = async (req, res, next) => {
  try {
    const registrationPhase = await getRegistrationPhase();
    if (registrationPhase === "open") {
      const dropableCourses = await getCoursesToDropUtil(req.userData.id);
      let dropableOfferingIDs = [];
      for (let i = 0; i < dropableCourses.length; i++) {
        dropableOfferingIDs.push(dropableCourses[i]["offering_id"]);
      }

      const { offeringIDs } = req.body;
      const response = [];
      for (let i = 0; i < offeringIDs.length; i++) {
        offeringID = offeringIDs[i];
        if (dropableOfferingIDs.includes(offeringID)) {
          await pool.query(
            'INSERT INTO "registration request" (student_id, offering_id, request_type, reg_status, request_date) VALUES($1, $2, $3, $4, $5)',
            [req.userData.id, offeringID, "drop", "awaiting_advisor", new Date()]
          );
          response.push({ message: "Placed Drop Request", id: offeringID });
        } else {
          response.push({ message: "Could Not Place Drop Request", id: offeringID });
        }
      }
      res.status(201).json({ result: response });
    } else {
      res.status(201).json({ message: registrationPhase });
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
exports.getPendingRequests = getPendingRequests;
