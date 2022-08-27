const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const { getCurrentSession } = require("../../util/CurrentSession");

const essentialAttributes = [];

const allAttributes = ["course_id", "session_id", "exam_slot_id"];

const createCourseOffering = async (data) => {
  await pool.query(
    'INSERT INTO public."course offering"(course_id, session_id, exam_slot_id) \
     VALUES ($1, $2, $3)',
    data
  );
};

const postAddCourseOffering = async (req, res, next) => {
  try {
    let allData = req.body.data;
    for (let rowNo = 0; rowNo < allData.length; rowNo++) {
      let data = [];
      for (let columnNo = 0; columnNo < allAttributes.length; columnNo++) {
        if (allAttributes[columnNo] in allData[rowNo]) {
          if (allData[rowNo][allAttributes[columnNo]] === "") {
            data.push(null);
          } else {
            data.push(allData[rowNo][allAttributes[columnNo]]);
          }
        } else {
          data.push(null);
        }
      }
      await createCourseOffering(data);
    }

    res.status(201).json({ message: "postAddCourseOffering successful" });
  } catch (err) {
    console.log(err);
    const error = new HttpError("postAddCourseOffering failed", 500);
    return next(error);
  }
};

const getSampleFile = async (req, res, next) => {
  try {
    data = "";
    for (let i = 0; i < allAttributes.length; i++) {
      if (i === allAttributes.length - 1) {
        data += allAttributes[i];
      } else {
        data += allAttributes[i] + ",";
      }
    }

    res.json({ message: "getSampleFile successful", data: data });
  } catch (err) {
    console.log(err);
    const error = new HttpError("getSampleFile failed", 500);
    return next(error);
  }
};

const getunofferedcourses = async (req, res, next) => {
  try {
    data = [];
    let queryRes = await pool.query('select dept_id from "department admin" where dept_admin_id=$1', [req.userData.id]);
    const offered_by_dept_id = queryRes.rows[0].dept_id;

    queryRes = await pool.query(
      'select course_id from public."course" where \
      offered_by_dept_id = $1 and \
       course_id not in (select course_id from public."course offering")',
      [offered_by_dept_id]
    );

    for (let i = 0; i < queryRes.rows.length; i++) {
      data.push(queryRes.rows[i].course_id);
    }

    res.json({ message: "getunofferedcourses successful", data: data });
  } catch (err) {
    console.log(err);
    const error = new HttpError("getunofferedcourses failed", 500);
    return next(error);
  }
};

const getexamslots = async (req, res, next) => {
  try {
    const currentSession = await getCurrentSession();

    data = [];
    let queryRes = await pool.query(
      'select exam_slot_id from public."exam time" where \
       session_id = $1 \
       ',
      [currentSession]
    );

    for (let i = 0; i < queryRes.rows.length; i++) {
      data.push(queryRes.rows[i].exam_slot_id);
    }
    res.json({ message: "getunofferedcourses successful", data: data });
  } catch (err) {
    console.log(err);
    const error = new HttpError("getexamslots failed", 500);
    return next(error);
  }
};

const getOffering_admin_dept = async (req, res, next) => {
  try {
    let queryRes = await pool.query(
      `select dept_id, dept_name from "department admin" natural join department where dept_admin_id=$1`,
      [req.userData.id]
    );
    const offered_by_dept_id = queryRes.rows[0]["dept_id"];

    const currentSession = await getCurrentSession();

    data = [];
    queryRes = await pool.query(
      'select c.course_name , co.offering_id from public."course" as c , public."course offering" as co where \
       c.offered_by_dept_id = $1 and \
       c.course_id = co.course_id \
       and co.session_id = $2',
      [offered_by_dept_id, currentSession]
    );
    for (let i = 0; i < queryRes.rows.length; i++) {
      data.push(queryRes.rows[i]);
    }

    res.json({ message: "getOffering_admin_dept successful", data: data });
  } catch (err) {
    console.log(err);
    const error = new HttpError("getOffering_admin_dept failed", 500);
    return next(error);
  }
};

exports.getOffering_admin_dept = getOffering_admin_dept;
exports.getSampleFile = getSampleFile;
exports.getunofferedcourses = getunofferedcourses;
exports.postAddCourseOffering = postAddCourseOffering;
exports.getexamslots = getexamslots;
