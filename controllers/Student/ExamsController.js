const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const session_id = require("../../placeHolder");

//utils methos
const get_total_credit = async (sid, level, term) => {
  let total_credits = 0.0;
  let queryRes = await pool.query(
    'SELECT offering_id from "course registration" where student_id = $1 and session_id = $2',
    [sid, session_id]
  );

  for (const element of queryRes.rows) {
    const offeringID = element["offering_id"];
    queryRes = await pool.query('SELECT course_id from "course offering" where offering_id = $1', [offeringID]);
    const courseID = queryRes.rows[0]["course_id"];

    queryRes = await pool.query("SELECT credits from course where course_id = $1 and level=$2 and term=$3", [
      courseID,
      level,
      term,
    ]);
    total_credits += queryRes.rows[0]["credits"];
  }

  var returnedObject = {};
  returnedObject["total_credit"] = total_credits;
  return returnedObject;
};

const getGrades = async (req, res, next) => {
  try {
    let total_grade_point = 0.0;
    const sid = req.params.sid;
    const level = req.params.level;
    const term = req.params.term;
    // write query to get grades of student based on sid,level,term
    let queryRes = await pool.query('select offering_id , grade_point from "result summary" where student_id=$1', [
      sid,
    ]);

    course_wise_grade = [];
    for (const element of queryRes.rows) {
      const offering_id = element["offering_id"];
      const achieved_grade_point = element["grade_point"];

      let queryRes_ = await pool.query(
        'select c.credits , c.course_id , c.course_name from course as c , "course offering" as co where co.offering_id=$1 and co.course_id = c.course_id and c.level=$2 and c.term=$3',
        [offering_id, level, term]
      );

      //to store specific coure's grade
      course_grade = {};
      course_grade["course_id"] = queryRes_.rows[0]["course_id"];
      course_grade["course_name"] = queryRes_.rows[0]["course_name"];
      course_grade["grade_point"] = achieved_grade_point;
      course_wise_grade.push(course_grade);

      //finding total grade point in this term
      total_grade_point += queryRes_.rows[0]["credits"] * parseFloat(achieved_grade_point);
    }

    //now divide by the total credit he has registered for
    const total_credits = (await get_total_credit(sid, level, term)).total_credit;
    const gpa = total_grade_point / total_credits;

    console.log("total grade point for student_id " + sid + ":: " + total_grade_point);
    console.log("total credits in level " + level + " term " + term + ":: " + total_credits);

    res.status(201).json({ message: "getGrades", gpa: gpa, course_wise_grade: course_wise_grade });
  } catch (err) {
    const error = new HttpError("Fetching Courses to Add Failed", 500);
    return next(error);
  }
};

const getExamRoutine = async (req, res, next) => {
  try {
    const sid = req.params.sid;

    let queryRes = await pool.query(
      'SELECT co.course_id , et.exam_date, et.start_time, et.end_time \
      from "course offering" as co , "course registration" as cr, "exam time" as et \
       where cr.student_id = $1 and cr.session_id = $2 \
       and cr.offering_id = co.offering_id and co.exam_slot_id = et.exam_slot_id',
      [sid, session_id]
    );

    exam_routine_list = [];
    for (const element of queryRes.rows) {
      var routine_obj = {};
      routine_obj["course_id"] = element["course_id"];
      routine_obj["exam_date"] = element["exam_date"];
      routine_obj["start_time"] = element["start_time"];
      routine_obj["end_time"] = element["end_time"];
      exam_routine_list.push(routine_obj);
    }

    res.status(201).json({ message: "getExamRoutine", data: exam_routine_list });
  } catch (err) {
    const error = new HttpError("Fetching exam routine Failed", 500);
    return next(error);
  }
};

const getSeatPlan = async (req, res, next) => {
  try {
    const sid = req.params.sid;
    console.log(sid);
    let queryRes = await pool.query(
      "SELECT ssp.row_no , ssp.col_no , l.building , l.room_no \
      from student_seat_plan as ssp , location as l \
      where ssp.location_id = l.location_id and ssp.student_id = $1 and ssp.session_id = $2",
      [sid, session_id]
    );
    //console.log(queryRes);

    res.status(201).json({
      message: "getSeatPlan",
      row_no: queryRes.rows[0]["row_no"],
      col_no: queryRes.rows[0]["col_no"],
      building: queryRes.rows[0]["building"],
      room_no: queryRes.rows[0]["room_no"],
    });
  } catch (err) {
    const error = new HttpError("Fetching seat plan Failed", 500);
    return next(error);
  }
};

const getGuidelines = async (req, res, next) => {
  try {
    let queryRes = await pool.query("SELECT * from exam_guidelines where session_id=$1", [session_id]);
    //console.log(queryRes);
    exam_guidelines_list = [];
    for (const element of queryRes.rows) {
      var guideline_obj = {};
      guideline_obj["guideline_id"] = element["guideline_id"];
      guideline_obj["description"] = element["description"];
      guideline_obj["file_path"] = element["file_path"];
      exam_guidelines_list.push(guideline_obj);
    }

    res.status(201).json({ message: "getGuidelines", exam_guidelines_list: exam_guidelines_list });
  } catch (err) {
    const error = new HttpError("Fetching exam guidelines Failed", 500);
    return next(error);
  }
};

exports.getGrades = getGrades;
exports.getExamRoutine = getExamRoutine;
exports.getSeatPlan = getSeatPlan;
exports.getGuidelines = getGuidelines;
