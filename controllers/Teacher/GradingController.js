const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const { getCurrentSession } = require("../../util/CurrentSession");

const getStudentMarks = async (req, res, next) => {
  try {
    const session_id = await getCurrentSession();
    const course_id = req.params.course_id;
    const criteria = req.params.criteria;

    let queryRes = await pool.query(
      'select offering_id from "course offering" where course_id=$1 and \
    session_id=$2',
      [course_id, session_id]
    );

    const offering_id = queryRes.rows[0]["offering_id"];

    queryRes = await pool.query('select student_id from "course registrations" where offering_id=$1;', [offering_id]);

    data = [];
    for (let i = 0; i < queryRes.rows.length; i++) {
      const student_id = queryRes.rows[i]["student_id"];

      queryRes = await pool.query(
        'select marks, status from "result details" where student_id=$1 and offering_id=$2 and criteria_name=$3;',
        [student_id, offering_id, criteria]
      );

      if (queryRes.rows.length > 0) {
        data.push({ studentID: student_id, marks: queryRes.rows[0]["marks"], status: queryRes.rows[0]["status"] });
      } else {
        data.push({ studentID: student_id, marks: "", status: "No Score Added" });
      }
    }

    queryRes = await pool.query(
      'select total_marks, criteria_weight from "mark distribution policy" where offering_id=$1 and criteria_name=$2;',
      [offering_id, criteria]
    );
    total_marks = queryRes.rows[0]["total_marks"];
    criteria_weight = queryRes.rows[0]["criteria_weight"];

    res.json({ message: "getStudentMarks", data: data, total_marks: total_marks, criteria_weight: criteria_weight });
  } catch (err) {
    const error = new HttpError("getStudentMarks Failed", 500);
    return next(error);
  }
};

const postStudentMarks = async (req, res, next) => {
  try {
    const session_id = await getCurrentSession();
    const course_id = req.params.course_id;
    const criteria = req.params.criteria;
    const studentMarks = req.body;

    let queryRes = await pool.query(
      'select offering_id from "course offering" where course_id=$1 and \
    session_id=$2',
      [course_id, session_id]
    );

    const offering_id = queryRes.rows[0]["offering_id"];

    for (const [studentID, marks] of Object.entries(studentMarks)) {
      queryRes = await pool.query(
        'select status from "result details" where student_id=$1 and offering_id=$2 and criteria_name=$3;',
        [studentID, offering_id, criteria]
      );

      if (queryRes.rows.length > 0) {
        if (
          queryRes.rows[0]["status"] == "Added by Course Teacher" ||
          queryRes.rows[0]["status"] == "Rejected by Scrutinizer"
        ) {
          await pool.query(
            "UPDATE public.\"result details\" SET marks=$1, status='Added by Course Teacher' WHERE student_id=$2 and offering_id=$3 and criteria_name=$4;",
            [marks, studentID, offering_id, criteria]
          );
        }
      } else {
        await pool.query(
          "INSERT INTO public.\"result details\" (student_id, offering_id, criteria_name, marks, status) VALUES ($1, $2, $3, $4, 'Added by Course Teacher');",
          [studentID, offering_id, criteria, marks]
        );
      }
    }

    res.json({ message: "postStudentMarks" });
  } catch (err) {
    const error = new HttpError("postStudentMarks Failed", 500);
    return next(error);
  }
};

const sendForScrutiny = async (req, res, next) => {
  try {
    const session_id = await getCurrentSession();
    const course_id = req.params.course_id;
    const criteria = req.params.criteria;
    const studentIDs = req.body;

    let queryRes = await pool.query(
      'select offering_id from "course offering" where course_id=$1 and \
    session_id=$2',
      [course_id, session_id]
    );

    const offering_id = queryRes.rows[0]["offering_id"];

    for (let i = 0; i < studentIDs.length; i++) {
      queryRes = await pool.query(
        'select scrutinizer_id from "mark distribution policy" where offering_id=$1 and criteria_name=$2;',
        [offering_id, criteria]
      );
      if (queryRes.rows[0]["scrutinizer_id"] === null) {
        await pool.query(
          "UPDATE public.\"result details\" SET status='Awaiting Department Head Approval' WHERE student_id=$1 and offering_id=$2 and criteria_name=$3;",
          [studentIDs[i], offering_id, criteria]
        );
      } else {
        await pool.query(
          "UPDATE public.\"result details\" SET status='Awaiting Scrutiny' WHERE student_id=$1 and offering_id=$2 and criteria_name=$3;",
          [studentIDs[i], offering_id, criteria]
        );
      }
    }

    res.json({ message: "sendForScrutiny" });
  } catch (err) {
    const error = new HttpError("sendForScrutiny Failed", 500);
    return next(error);
  }
};

exports.getStudentMarks = getStudentMarks;
exports.postStudentMarks = postStudentMarks;
exports.sendForScrutiny = sendForScrutiny;
