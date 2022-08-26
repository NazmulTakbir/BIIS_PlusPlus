const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const session_id = require("../../placeHolder");
const { getCurrentSession } = require("../../util/CurrentSession");

const getScholarshipRequests = async (req, res, next) => {
  try {
    let queryRes = await pool.query(`Select hall_id from public.hall where hall_provost_id=$1;`, [req.userData.id]);
    const hall_id = queryRes.rows[0]["hall_id"];

    queryRes = await pool.query(
      `SELECT scholarship.scholarship_id, scholarship.student_id, student.name, scholarship.session_id, \
      (SELECT scholarship_name from "scholarship type" where scholarship_type_id=scholarship.scholarship_type_id) \
      FROM scholarship \
      INNER JOIN student ON scholarship.student_id=student.student_id \
      where student.hall_id = $1 and scholarship.scholarship_state='awaiting_provost';`,
      [hall_id]
    );

    res.json({ message: "getScholarshipRequests", data: queryRes.rows });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Fetching Student Info Failed", 500);
    return next(error);
  }
};

const getAllScholarshipRequests = async (req, res, next) => {
  try {
    let queryRes = await pool.query(`Select hall_id from public.hall where hall_provost_id=$1;`, [req.userData.id]);
    const hall_id = queryRes.rows[0]["hall_id"];

    queryRes = await pool.query(
      `SELECT scholarship.scholarship_id, scholarship.scholarship_state ,scholarship.student_id, student.name, scholarship.session_id, \
      (SELECT scholarship_name from "scholarship type" where scholarship_type_id=scholarship.scholarship_type_id) \
      FROM scholarship \
      INNER JOIN student ON scholarship.student_id=student.student_id \
      where student.hall_id = $1;`,
      [hall_id]
    );

    res.json({ message: "getScholarshipRequests", data: queryRes.rows });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Fetching Student Info Failed", 500);
    return next(error);
  }
};

const getHallMemberInfo = async (req, res, next) => {
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
    console.log(err);
    const error = new HttpError("Fetching Student Info Failed", 500);
    return next(error);
  }
};

const getAvailableResults = async (req, res, next) => {
  try {
    const sid = req.params.sid;

    let query = await pool.query(
      'select distinct(level, term) from "result summary" as r natural join "course offering" as co natural join \
        course as c where student_id=$1',
      [sid]
    );
    data = [];
    for (const element of query.rows) {
      data.push(element["row"][1] + "," + element["row"][3]);
    }

    res.status(201).json({ message: "getGrades", data: data });
  } catch (err) {
    console.log(err);
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
    console.log(err);
    const error = new HttpError("Fetching Grades Failed", 500);
    return next(error);
  }
};

const getHallMemberScholarshipRequests = async (req, res, next) => {
  try {
    const sid = req.params.sid;

    queryRes = await pool.query(
      `select scholarship_id, student_id, session_id, \
        (select name from student where student_id=scholarship.student_id) as name, \
          (
            select scholarship_name from "scholarship type" \
            where scholarship_type_id=scholarship.scholarship_type_id \
          ) \
          from scholarship where student_id=$1 and scholarship_state='awaiting_provost'`,
      [sid]
    );

    res.json({ message: "getScholarshipRequests", data: queryRes.rows });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Fetching Grades Failed", 500);
    return next(error);
  }
};

const allowHallMemberScholarshipRequests = async (req, res, next) => {
  try {
    //retrieve scholarship_type_id from URL
    const sc_id = req.params.scid;

    //create a new scholarship obj
    let queryRes = await pool.query(
      "UPDATE scholarship SET scholarship_state = $1  \
       where scholarship_id = $2",
      ["awaiting_head", sc_id]
    );
    res.status(201).json({ message: "scholarship state updated to awaiting_head" });
  } catch (err) {
    console.log(err);
    const error = new HttpError("scholarship state update Failed", 500);
    return next(error);
  }
};

const rejectHallMemberScholarshipRequests = async (req, res, next) => {
  try {
    //retrieve scholarship_type_id from URL
    const sc_id = req.params.scid;

    //create a new scholarship obj
    let queryRes = await pool.query(
      "UPDATE scholarship SET scholarship_state = $1  \
       where scholarship_id = $2",
      ["rejected_provost", sc_id]
    );
    res.status(201).json({ message: "scholarship state updated to rejected" });
  } catch (err) {
    console.log(err);
    const error = new HttpError("scholarship state update Failed", 500);
    return next(error);
  }
};

const getAllStudents = async (req, res, next) => {
  try {
    let queryRes = await pool.query(`Select hall_id from public.hall where hall_provost_id=$1;`, [req.userData.id]);
    const hall_id = queryRes.rows[0]["hall_id"];

    queryRes = await pool.query(
      `select student.student_id, student.name, level, term from student natural join hall where hall_id=$1;`,
      [hall_id]
    );

    res.json({ message: "getScholarshipRequests", data: queryRes.rows });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Fetching Student Info Failed", 500);
    return next(error);
  }
};

const getPendingDues = async (req, res, next) => {
  try {
    const sid = req.params.sid;
    const stat = "Not Paid";
    let queryRes = await pool.query(
      'select dt.description , dt.amount , d.deadline , d.payment_date , d.dues_status, d.specification \
        from dues as d , "dues type" as dt \
        where d.dues_type_id = dt."dues_type_id" and d.dues_status = $2 and d.student_id = $1  ',
      [sid, stat]
    );

    pending_dues_list = [];

    for (const element of queryRes.rows) {
      due_obj = {};
      due_obj["description"] = element["description"];
      due_obj["amount"] = element["amount"];

      let date_ = "";
      date_ = (date_ + element["deadline"]).substring(4, 16);
      due_obj["deadline"] = date_;

      due_obj["dues_status"] = element["dues_status"];
      due_obj["specification"] = element["specification"];

      pending_dues_list.push(due_obj);
    }

    res.status(201).json({ message: "getPendingDues", data: pending_dues_list });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Fetching Student Info Failed", 500);
    return next(error);
  }
};

const getPendingResults = async (req, res, next) => {
  try {
    const session_id = await getCurrentSession();

    let queryRes = await pool.query(
      "select t2.student_id, t3.offering_id, t4.course_name, get_grade_point(t2.student_id, t3.offering_id) as grade_point, \
      get_letter_grade(t2.student_id, t3.offering_id) as letter_grade from \
      (select student_id, all_offering_result_complete_for_student(student_id, $1, 'Awaiting Hall Provost Approval') as filter_result \
      from (select student_id from hall natural join student where hall_provost_id=$2) as t1) as t2 \
      join \"course registrations\" as t3 on t2.student_id=t3.student_id natural join course as t4 \
      where t2.filter_result=true and t3.session_id=$1;",
      [session_id, req.userData.id]
    );

    let data = {};
    for (const element of queryRes.rows) {
      if (element["student_id"] in data) {
        data[element["student_id"]].push([
          element["offering_id"],
          element["course_name"],
          element["grade_point"],
          element["letter_grade"],
        ]);
      } else {
        data[element["student_id"]] = [
          [element["offering_id"], element["course_name"], element["grade_point"], element["letter_grade"]],
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
    console.log(student_ids);
    for (let i = 0; i < student_ids.length; i++) {
      await pool.query(
        'UPDATE public."result details" as t1 SET status=\'Awaiting Exam Controller Approval\' \
        from "course offering" as t2 WHERE t1.offering_id=t2.offering_id and \
        t1.student_id=$1 and t2.session_id=$2',
        [student_ids[i], session_id]
      );
    }

    res.json({ message: "postApproveResults" });
  } catch (err) {
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
        'UPDATE public."result details" as t1 SET status=\'Rejected by Hall Provost\' \
        from "course offering" as t2 WHERE t1.offering_id=t2.offering_id and \
        t1.student_id=$1 and t2.session_id=$2',
        [student_ids[i], session_id]
      );
    }

    res.json({ message: "postRejectResults" });
  } catch (err) {
    const error = new HttpError("postRejectResults Failed", 500);
    return next(error);
  }
};

exports.postApproveResults = postApproveResults;
exports.postRejectResults = postRejectResults;
exports.getAllStudents = getAllStudents;
exports.getPendingResults = getPendingResults;
exports.getGrades = getGrades;
exports.getHallMemberInfo = getHallMemberInfo;
exports.getAvailableResults = getAvailableResults;
exports.getScholarshipRequests = getScholarshipRequests;
exports.getAllScholarshipRequests = getAllScholarshipRequests;
exports.getHallMemberScholarshipRequests = getHallMemberScholarshipRequests;
exports.allowHallMemberScholarshipRequests = allowHallMemberScholarshipRequests;
exports.rejectHallMemberScholarshipRequests = rejectHallMemberScholarshipRequests;
exports.getPendingDues = getPendingDues;
