const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const { getCurrentSession } = require("../../util/CurrentSession");

const getAll = async (req, res, next) => {
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

      let queryRes2 = await pool.query(
        'select marks, status from "result details" where student_id=$1 and offering_id=$2 and criteria_name=$3;',
        [student_id, offering_id, criteria]
      );

      if (queryRes2.rows.length > 0) {
        data.push({ studentID: student_id, marks: queryRes2.rows[0]["marks"], status: queryRes2.rows[0]["status"] });
      } else {
        data.push({ studentID: student_id, marks: "", status: "No Score Added" });
      }
    }

    let queryRes3 = await pool.query(
      'select total_marks, criteria_weight from "mark distribution policy" where offering_id=$1 and criteria_name=$2;',
      [offering_id, criteria]
    );
    total_marks = queryRes3.rows[0]["total_marks"];
    criteria_weight = queryRes3.rows[0]["criteria_weight"];

    res.json({ message: "getAll", data: data, total_marks: total_marks, criteria_weight: criteria_weight });
  } catch (err) {
    console.log(err);
    const error = new HttpError("getAll Failed", 500);
    return next(error);
  }
};

const postApproval = async (req, res, next) => {
  try {
    const session_id = await getCurrentSession();
    const course_id = req.params.course_id;
    const criteria = req.params.criteria;
    const approvedIDs = req.body;

    let queryRes = await pool.query(
      'select offering_id from "course offering" where course_id=$1 and \
      session_id=$2',
      [course_id, session_id]
    );

    const offering_id = queryRes.rows[0]["offering_id"];

    for (let i = 0; i < approvedIDs.length; i++) {
      queryRes = await pool.query(
        'select status from "result details" where student_id=$1 and offering_id=$2 and criteria_name=$3;',
        [approvedIDs[i], offering_id, criteria]
      );

      if (queryRes.rows.length > 0) {
        if (
          queryRes.rows[0]["status"] == "Awaiting Scrutiny" ||
          queryRes.rows[0]["status"] == "Rejected by Dept Head"
        ) {
          await pool.query(
            "update \"result details\" set status='Awaiting Department Head Approval' where student_id=$1 and offering_id=$2 and criteria_name=$3;",
            [approvedIDs[i], offering_id, criteria]
          );
        }
      }
    }

    res.json({ message: "postApproval" });
  } catch (err) {
    console.log(err);
    const error = new HttpError("postApproval Failed", 500);
    return next(error);
  }
};

const postRejection = async (req, res, next) => {
  try {
    const session_id = await getCurrentSession();
    const course_id = req.params.course_id;
    const criteria = req.params.criteria;
    const rejectedIDs = req.body;

    let queryRes = await pool.query(
      'select offering_id from "course offering" where course_id=$1 and \
      session_id=$2',
      [course_id, session_id]
    );

    const offering_id = queryRes.rows[0]["offering_id"];

    for (let i = 0; i < rejectedIDs.length; i++) {
      queryRes = await pool.query(
        'select status from "result details" where student_id=$1 and offering_id=$2 and criteria_name=$3;',
        [rejectedIDs[i], offering_id, criteria]
      );

      if (queryRes.rows.length > 0) {
        if (
          queryRes.rows[0]["status"] == "Awaiting Scrutiny" ||
          queryRes.rows[0]["status"] == "Rejected by Dept Head"
        ) {
          await pool.query(
            "update \"result details\" set status='Rejected by Scrutinizer' where student_id=$1 and offering_id=$2 and criteria_name=$3;",
            [rejectedIDs[i], offering_id, criteria]
          );
        }
      }
    }

    res.json({ message: "postRejection" });
  } catch (err) {
    console.log(err);
    const error = new HttpError("postRejection Failed", 500);
    return next(error);
  }
};

exports.getAll = getAll;
exports.postApproval = postApproval;
exports.postRejection = postRejection;
