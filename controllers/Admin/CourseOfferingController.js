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
    allData = req.body.data;
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
      console.log("adding " + data);
    }

    res.status(201).json({ message: "postAddCourseOffering successful" });
  } catch (err) {
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
    const error = new HttpError("getSampleFile failed", 500);
    return next(error);
  }
};

const getunofferedcourses = async (req, res, next) => {
  try {
    data = [];
    const offered_to_dept_id = 5;//extract it from req.body later
    let queryRes = await pool.query(
      'select course_id from public."course" where \
       offered_to_dept_id = $1 and \
       course_id not in (select course_id from public."course offering")',[offered_to_dept_id]
    );

    for (let i = 0; i < queryRes.rows.length; i++) {
      data.push(queryRes.rows[i].course_id);
    }
    
    res.json({ message: "getunofferedcourses successful", data: data });

  } catch (err) {
    const error = new HttpError("getunofferedcourses failed", 500);
    return next(error);
  }
};

const getexamslots = async (req, res, next) => {
  try {
    //finding current session
    const currentSession = await getCurrentSession();
    //console.log(currentSession_);

    data = [];
    let queryRes = await pool.query(
      'select exam_slot_id from public."exam time" where \
       session_id = $1 \
       ',[currentSession]
    );
 
    for (let i = 0; i < queryRes.rows.length; i++) {
      data.push(queryRes.rows[i].exam_slot_id);
    }
    res.json({ message: "getunofferedcourses successful", data: data });

  } catch (err) {
    const error = new HttpError("getexamslots failed", 500);
    return next(error);
  }
};

exports.getSampleFile = getSampleFile;
exports.getunofferedcourses = getunofferedcourses;
exports.postAddCourseOffering = postAddCourseOffering;
exports.getexamslots = getexamslots;
