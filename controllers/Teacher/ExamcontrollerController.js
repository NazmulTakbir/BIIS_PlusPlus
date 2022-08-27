const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const { getCurrentSession } = require("../../util/CurrentSession");

const getPendingResults = async (req, res, next) => {
  try {
    const session_id = await getCurrentSession();

    let queryRes = await pool.query(
      "select t2.student_id, t2.student_name, t2.dept_name, t2.hall_name, t2.level, \
      t2.term, t3.offering_id, t4.course_name, get_grade_point(t2.student_id, \
      t3.offering_id) as grade_point, get_letter_grade(t2.student_id, t3.offering_id) \
      as letter_grade from (select ts.student_id, ts.name as student_name, dept_name, \
      hall_name, level, term, all_offering_result_complete_for_student(student_id, \
      $1, 'Awaiting Exam Controller Approval') as filter_result from student as ts \
      natural join department as td natural join hall as th) as t2 \
      join \"course registrations\" as t3 on t2.student_id=t3.student_id \
      natural join course as t4 where t2.filter_result=true and t3.session_id=$1;",
      [session_id]
    );

    let data = {};
    for (const element of queryRes.rows) {
      if (element["student_id"] in data) {
        data[element["student_id"]].push([
          element["offering_id"],
          element["course_name"],
          element["grade_point"],
          element["letter_grade"],
          element["student_name"],
          element["dept_name"],
          element["hall_name"],
          element["level"],
          element["term"],
        ]);
      } else {
        data[element["student_id"]] = [
          [
            element["offering_id"],
            element["course_name"],
            element["grade_point"],
            element["letter_grade"],
            element["student_name"],
            element["dept_name"],
            element["hall_name"],
            element["level"],
            element["term"],
          ],
        ];
      }
    }
    res.status(201).json({ message: "getPendingResults", data: data });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Fetching getPendingResults Failed", 500);
    return next(error);
  }
};

const postApproveResults = async (req, res, next) => {
  try {
    const session_id = await getCurrentSession();

    const student_ids = req.body;
    for (let i = 0; i < student_ids.length; i++) {
      await pool.query(
        'UPDATE public."result details" as t1 SET status=\'Published\' \
          from "course offering" as t2 WHERE t1.offering_id=t2.offering_id and \
          t1.student_id=$1 and t2.session_id=$2',
        [student_ids[i], session_id]
      );
    }

    res.json({ message: "postApproveResults" });
  } catch (err) {
    console.log(err);
    const error = new HttpError("postApproveResults Failed", 500);
    return next(error);
  }
};

const postRejectResults = async (req, res, next) => {
  try {
    const session_id = await getCurrentSession();

    const student_ids = req.body;
    for (let i = 0; i < student_ids.length; i++) {
      await pool.query(
        'UPDATE public."result details" as t1 SET status=\'Rejected by Exam Controller\' \
          from "course offering" as t2 WHERE t1.offering_id=t2.offering_id and \
          t1.student_id=$1 and t2.session_id=$2',
        [student_ids[i], session_id]
      );
    }

    res.json({ message: "postRejectResults" });
  } catch (err) {
    console.log(err);
    const error = new HttpError("postRejectResults Failed", 500);
    return next(error);
  }
};

exports.postApproveResults = postApproveResults;
exports.postRejectResults = postRejectResults;
exports.getPendingResults = getPendingResults;
