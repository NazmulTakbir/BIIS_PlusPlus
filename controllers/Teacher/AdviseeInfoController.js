const pool = require("../../db");
const HttpError = require("../../models/HttpError");

const getAdviseeInfo = async (req, res, next) => {
  try {
    const sid = req.params.sid;
    let queryRes = await pool.query(
      "select hall_name, dept_name from student natural join department natural join hall where student_id=$1",
      [sid]
    );
    const dept_name = queryRes.rows[0]["dept_name"];
    const hall_name = queryRes.rows[0]["hall_name"];

    queryRes = await pool.query("SELECT * from student where student_id = $1", [req.params.sid]);
    var studentInfo = queryRes.rows[0];

    let date_of_birth = "";
    date_of_birth = (date_of_birth + queryRes.rows[0]["date_of_birth"]).substring(4, 16);

    studentInfo["date_of_birth"] = date_of_birth;
    studentInfo["hall_name"] = hall_name;
    studentInfo["dept_name"] = dept_name;

    res.json(studentInfo);
  } catch (err) {
    const error = new HttpError("Fetching Student Info Failed", 500);
    return next(error);
  }
};

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

exports.getAdviseeInfo = getAdviseeInfo;
exports.getAvailableResults = getAvailableResults;
exports.getGrades = getGrades;
