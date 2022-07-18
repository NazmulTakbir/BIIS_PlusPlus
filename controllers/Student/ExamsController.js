const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const session_id = require("../../placeHolder");
const { get_dept_level_term, get_total_credit } = require("./Util");

const getGrades = async (req, res, next) => {
  try {
    let total_grade_point = 0.0;
    const sid = req.params.sid;
    const level = req.params.level;
    const term = req.params.term;
    // write query to get grades of student based on sid,level,term
    let queryRes = await pool.query(
      'select offering_id, grade_point, letter_grade from "result summary" where student_id=$1',
      [sid]
    );

    course_wise_grade = [];
    for (const element of queryRes.rows) {
      const offering_id = element["offering_id"];
      const achieved_grade_point = element["grade_point"];
      const achieved_letter_grade = element["letter_grade"];

      let queryRes_ = await pool.query(
        'select c.credits , c.course_id , c.course_name from course as c , "course offering" as co where co.offering_id=$1 and co.course_id = c.course_id and c.level=$2 and c.term=$3',
        [offering_id, level, term]
      );

      //to store specific coure's grade
      course_grade = {};
      course_grade["course_id"] = queryRes_.rows[0]["course_id"];
      course_grade["course_name"] = queryRes_.rows[0]["course_name"];
      course_grade["credits"] = queryRes_.rows[0]["credits"];
      course_grade["grade_point"] = achieved_grade_point;
      course_grade["letter_grade"] = achieved_letter_grade;
      course_wise_grade.push(course_grade);

      //finding total grade point in this term
      total_grade_point += queryRes_.rows[0]["credits"] * parseFloat(achieved_grade_point);
    }

    //now divide by the total credit he has registered for
    const total_credits = (await get_total_credit(sid, level, term, session_id)).total_credit;
    const gpa = total_grade_point / total_credits;

    // console.log("total grade point for student_id " + sid + ":: " + total_grade_point);
    // console.log("total credits in level " + level + " term " + term + ":: " + total_credits);

    res.status(201).json({ message: "getGrades", gpa: gpa, data: course_wise_grade });
  } catch (err) {
    const error = new HttpError("Fetching Grades Failed", 500);
    return next(error);
  }
};

const getExamRoutine = async (req, res, next) => {
  try {
    const sid = req.params.sid;

    let queryRes = await pool.query(
      'SELECT co.course_id , et.exam_date, et.start_time, et.end_time , c.course_name\
        from "course offering" as co , "course registrations" as cr, "exam time" as et ,course as c \
         where cr.student_id = $1 and cr.session_id = $2 and co.course_id = c.course_id\
         and cr.offering_id = co.offering_id and co.exam_slot_id = et.exam_slot_id',
      [sid, session_id]
    );
    //console.log(queryRes);
    exam_routine_list = [];
    for (const element of queryRes.rows) {
      var routine_obj = {};
      routine_obj["course_id"] = element["course_id"];

      let date_ = "";
      date_ = (date_ + element["exam_date"]).substring(4, 16);
      routine_obj["exam_date"] = date_;

      routine_obj["course_name"] = element["course_name"];
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
    const { level, term } = await get_dept_level_term(sid);

    let queryRes = await pool.query(
      "select row_no, col_no, t2.student_id from student_seat_plan as t1, student as t2 where \
      t1.student_id = t2.student_id and t2.level=$1 and t2.term=$2 and session_id=$4 \
      and location_id=(select location_id from student_seat_plan where student_id=$3 \
      and session_id=$4)",
      [level, term, sid, session_id]
    );
    const seatingGrid = queryRes.rows;

    queryRes = await pool.query(
      "select building, room_no from location where location_id=(select location_id from \
        student_seat_plan where student_id=$1 and session_id=$2)",
      [sid, session_id]
    );
    const building = queryRes.rows[0]["building"];
    const room_no = queryRes.rows[0]["room_no"];

    res.status(201).json({ message: "getSeatPlan", data: seatingGrid, building: building, room_no: room_no });
  } catch (err) {
    const error = new HttpError("Fetching seat plan Failed", 500);
    return next(error);
  }
};

const getGuidelines = async (req, res, next) => {
  try {
    let queryRes = await pool.query("SELECT * from exam_guidelines where session_id=$1", [session_id]);

    exam_guidelines_list = [];
    for (const element of queryRes.rows) {
      var guideline_obj = {};
      guideline_obj["guideline_id"] = element["guideline_id"];
      guideline_obj["description"] = element["description"];
      guideline_obj["file_path"] = element["file_path"];

      let date_ = "";
      date_ = (date_ + element["upload_date"]).substring(4, 16);
      guideline_obj["upload_date"] = date_;

      exam_guidelines_list.push(guideline_obj);
    }

    res.status(201).json({ message: "getGuidelines", data: exam_guidelines_list });
  } catch (err) {
    const error = new HttpError("Fetching exam guidelines Failed", 500);
    return next(error);
  }
};

exports.getGrades = getGrades;
exports.getExamRoutine = getExamRoutine;
exports.getSeatPlan = getSeatPlan;
exports.getGuidelines = getGuidelines;
