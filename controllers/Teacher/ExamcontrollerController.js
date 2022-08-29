const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const { getCurrentSession } = require("../../util/CurrentSession");
const mailController = require("../Shared/email");

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
      let queryRes = await pool.query(
        'select distinct(offering_id) from "result details" natural join "course offering" where student_id=$1 and session_id=$2 and status=\'Awaiting Exam Controller Approval\'',
        [student_ids[i], session_id]
      );
      let offering_ids = queryRes.rows;

      for (let j = 0; j < offering_ids.length; j++) {
        queryRes = await pool.query(
          'INSERT INTO public."result summary"(offering_id, student_id, grade_point, letter_grade) \
           VALUES ($2, $1, CAST (get_grade_point($1, $2) AS DOUBLE PRECISION), get_letter_grade($1, $2));',
          [student_ids[i], offering_ids[j].offering_id]
        );
      }
      await pool.query(
        'UPDATE public."result details" as t1 SET status=\'Published\' \
          from "course offering" as t2 WHERE t1.offering_id=t2.offering_id and \
          t1.student_id=$1 and t2.session_id=$2',
        [student_ids[i], session_id]
      );

      queryRes = await pool.query(
        'select sum(grade_point*credits)/sum(credits) as gpa  \
      from "course offering" natural join "result summary" natural join course \
      where session_id=$1 and student_id=$2',
        [session_id, student_ids[i]]
      );
      let gpa = queryRes.rows[0].gpa;

      let description =
        "Result has been published for Session: " + session_id + " Obtained GPA: " + Math.round(gpa * 100) / 100;
      await pool.query("call insert_notification($1, $2, $3, $4, $5)", [
        "student",
        student_ids[i],
        "Results Published",
        new Date(),
        description,
      ]);

      const student_id = student_ids[i];

      let mailInfo = await pool.query("select email from public.student where student_id = $1", [student_id]);
      const email = mailInfo.rows[0].email;

      const subject = "BIISPLUSPLUS : Results Published";

      description =
        "Results for Session " + session_id + " has been published. Obtained GPA: " + Math.round(gpa * 100) / 100;
      description = "Dear Student,\n" + description + "\n\nRegards,\nBIISPLUSPLUS";
      description +=
        "\nDo not reply to this email. This email is sent from a system that cannot receive email messages.";
      const text = description;

      mailController.sendMail(email, subject, text);
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
