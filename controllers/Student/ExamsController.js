const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const session_id = require("../../placeHolder");
const { get_dept_level_term } = require("./Util");

const getAvailableResults = async (req, res, next) => {
  try {
    const sid = req.params.sid;

    let query = await pool.query(
      'select distinct(level, term) from "result summary" as r natural join "course offering" as co natural join \
      course as c where student_id=$1 and result_status=\'published\';',
      [sid]
    );
    data = [];
    for (const element of query.rows) {
      data.push(element["row"][1] + "," + element["row"][3]);
    }

    res.status(201).json({ message: "getGrades", data: data });
  } catch (err) {
    const error = new HttpError("Fetching Grades Failed", 500);
    return next(error);
  }
};

const getGrades = async (req, res, next) => {
  try {
    let total_grade_point = 0.0;
    const sid = req.params.sid;
    const level = req.params.level;
    const term = req.params.term;

    let queryRes = await pool.query(
      'select course_id, course_name, credits, grade_point, letter_grade from "academic profile" \
      where student_id=$1 and level=$2 and term=$3;',
      [sid, level, term]
    );
    const data = queryRes.rows;

    let gpa = 0.0;
    let registered_credit = 0.0;
    let earned_credit = 0.0;
    let graded_credit = 0.0;

    for (const element of data) {
      if (element["letter_grade"] !== "F") {
        if (element["letter_grade"] !== "S") {
          gpa += element.grade_point * element.credits;
          graded_credit += element.credits;
        }
        earned_credit += element.credits;
      }
      registered_credit += element.credits;
    }
    gpa = gpa / graded_credit;

    queryRes = await pool.query(
      "select sum(credits*grade_point)/sum(credits) as cgpa from \"academic profile\" where letter_grade<>'F' \
      and letter_grade<>'S' and student_id=$1 and (level<$2 or (level=$2 and term<=$3))",
      [sid, level, term]
    );
    const cgpa = queryRes.rows[0]["cgpa"];

    queryRes = await pool.query(
      "select sum(credits) as total_credits from \"academic profile\" \
      where letter_grade<>'F' and student_id=$1 and (level<$2 or (level=$2 and term<=$3))",
      [sid, level, term]
    );
    const total_credits = queryRes.rows[0]["total_credits"];

    res.status(201).json({
      message: "getGrades",
      data: data,
      gpa: gpa,
      registeredCredits: registered_credit,
      earnedCredits: earned_credit,
      totalCreditsEarned: total_credits,
      cgpa: cgpa,
    });
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
exports.getAvailableResults = getAvailableResults;
