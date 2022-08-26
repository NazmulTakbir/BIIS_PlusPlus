const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const { getCurrentSession } = require("../../util/CurrentSession");
const { getStudentResults } = require("./utils");

const getFeedbacks = async (req, res, next) => {
  try {
    const tid = req.userData.id;
    let queryRes = await pool.query(
      "select f.feedback_id, s.student_id, s.name as student_name, f.subject, \
       f.submission_date, f.details from feedback as f natural join \
       student as s where teacher_id = $1;",
      [tid]
    );
    feedback_list = [];
    for (const element of queryRes.rows) {
      comp = {};
      comp["feedback_id"] = element["feedback_id"];
      comp["student_id"] = element["student_id"];
      comp["student_name"] = element["student_name"];
      comp["subject"] = element["subject"];
      comp["details"] = element["details"];

      let date_ = "";
      date_ = (date_ + element["submission_date"]).substring(4, 16);
      comp["submission_date"] = date_;

      feedback_list.push(comp);
    }

    res.status(201).json({ message: "getFeedbacks", data: feedback_list });
  } catch (err) {
    const error = new HttpError("Fetching Student Info Failed", 500);
    return next(error);
  }
};

const getDepartmentStudents = async (req, res, next) => {
  try {
    const tid = req.userData.id;
    let queryRes = await pool.query("SELECT dept_id FROM department WHERE dept_head = $1", [tid]);
    const dept_id = queryRes.rows[0]["dept_id"];

    queryRes = await pool.query(
      "select student_id, name, level, term from student where dept_id=$1 order by student_id;",
      [dept_id]
    );

    res.json({ message: "getDepartmentStudents", data: queryRes.rows });
  } catch (err) {
    const error = new HttpError("Fetching All Advisees Failed", 500);
    return next(error);
  }
};

const getRegistrationRequestSummary = async (req, res, next) => {
  try {
    const tid = req.userData.id;
    let queryRes = await pool.query("SELECT dept_id FROM department WHERE dept_head = $1", [tid]);
    const dept_id = queryRes.rows[0]["dept_id"];

    queryRes = await pool.query(
      'select request_type, student_id, request_date, COUNT(*) as req_count \
      from (select rr.request_type, rr.request_date, s.student_id \
      from "registration request" as rr, student as s\
       where rr.reg_status = $2 and s.dept_id = $1 and rr.student_id = s.student_id) \
      as t1 group by student_id, request_type, request_date order by request_date asc;',
      [dept_id, "awaiting_head"]
    );

    data = queryRes.rows;
    for (let i = 0; i < data.length; i++) {
      let date_ = "";
      date_ = (date_ + data[i]["request_date"]).substring(4, 16);
      data[i]["request_date"] = date_;
      data[i]["request_type"] = data[i]["request_type"].toUpperCase();
    }

    res.json({ message: "getRegistrationRequestSummary", data: data });
  } catch (err) {
    const error = new HttpError("Fetching Registration Summary Failed", 500);
    return next(error);
  }
};

//async function to get deptStudentInfo
const getDeptStudentInfo = async (req, res, next) => {
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
    const error = new HttpError("Fetching All Advisees Failed", 500);
    return next(error);
  }
};

const getRegistrationRequests = async (req, res, next) => {
  try {
    const tid = req.userData.id;
    let queryRes = await pool.query("SELECT dept_id FROM department WHERE dept_head = $1", [tid]);
    const dept_id = queryRes.rows[0]["dept_id"];
    const sid = req.params.sid;

    queryRes = await pool.query(
      'select rr.request_type, s.student_id, co.course_id, rr.request_date , rr.reg_request_id  from \
      "registration request" as rr , student as s , "course offering" as co\
      where reg_status=$2 and s.student_id=$1 and s.dept_id = $3 and rr.student_id = s.student_id and rr.offering_id = co.offering_id order by reg_request_id;',
      [sid, "awaiting_head", dept_id]
    );
    data = queryRes.rows;
    for (let i = 0; i < data.length; i++) {
      let date_ = "";
      date_ = (date_ + data[i]["request_date"]).substring(4, 16);
      data[i]["request_date"] = date_;
      data[i]["request_type"] = data[i]["request_type"].toUpperCase();
    }

    res.json({ message: "getRegistrationRequests", data: data });
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
        course as c where student_id=$1',
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

const postApproveRegistrationRequests = async (req, res, next) => {
  try {
    const { requestIDs } = req.body;
    for (let i = 0; i < requestIDs.length; i++) {
      await pool.query("update \"registration request\" set reg_status='approved' where reg_request_id=$1;", [
        requestIDs[i],
      ]);
    }
    res.json({ message: "postApproveRegistrationRequests" });
  } catch (err) {
    const error = new HttpError("postApproveRegistrationRequests Failed", 500);
    return next(error);
  }
};

const postRejectRegistrationRequests = async (req, res, next) => {
  try {
    const { requestIDs } = req.body;
    for (let i = 0; i < requestIDs.length; i++) {
      await pool.query("update \"registration request\" set reg_status='rejected_head' where reg_request_id=$1;", [
        requestIDs[i],
      ]);
    }
    res.json({ message: "postRejectRegistrationRequests" });
  } catch (err) {
    const error = new HttpError("postRejectRegistrationRequests Failed", 500);
    return next(error);
  }
};

// for scholarships =============================================================
const getScholarshipRequests = async (req, res, next) => {
  try {
    let queryRes = await pool.query(`Select dept_id from public.department where dept_head=$1;`, [req.userData.id]);
    const dept_id = queryRes.rows[0]["dept_id"];

    queryRes = await pool.query(
      `SELECT scholarship.scholarship_id, scholarship.student_id, student.name, scholarship.session_id, \
      (SELECT scholarship_name from "scholarship type" where scholarship_type_id=scholarship.scholarship_type_id) \
      FROM scholarship \
      INNER JOIN student ON scholarship.student_id=student.student_id \
      where student.dept_id = $1 and scholarship.scholarship_state='awaiting_head';`,
      [dept_id]
    );

    res.json({ message: "getScholarshipRequests", data: queryRes.rows });
  } catch (err) {
    const error = new HttpError("Fetching Student Info Failed", 500);
    return next(error);
  }
};

const getStudentScholarshipRequests = async (req, res, next) => {
  try {
    const sid = req.params.sid;
    queryRes = await pool.query(
      `select scholarship_id, student_id, session_id, \
        (select name from student where student_id=scholarship.student_id) as name, \
          (
            select scholarship_name from "scholarship type" \
            where scholarship_type_id=scholarship.scholarship_type_id \
          ) \
          from scholarship where student_id=$1 and scholarship_state='awaiting_head'`,
      [sid]
    );
    res.json({ message: "getScholarshipRequests", data: queryRes.rows });
  } catch (err) {
    const error = new HttpError("Fetching Grades Failed", 500);
    return next(error);
  }
};

const allowDeptScholarshipRequests = async (req, res, next) => {
  try {
    const { requestIDs } = req.body;
    for (let i = 0; i < requestIDs.length; i++) {
      await pool.query("update \"scholarship\" set scholarship_state='awaiting_comptroller' where scholarship_id=$1;", [
        requestIDs[i],
      ]);
    }
    res.json({ message: "postAllowDeptScholarshipRequests" });
  } catch (err) {
    const error = new HttpError("postAllowDeptScholarshipRequests Failed", 500);
    return next(error);
  }
};

const rejectDeptScholarshipRequests = async (req, res, next) => {
  try {
    const { requestIDs } = req.body;
    for (let i = 0; i < requestIDs.length; i++) {
      await pool.query("update \"scholarship\" set scholarship_state='rejected_head' where scholarship_id=$1;", [
        requestIDs[i],
      ]);
    }
    res.json({ message: "postRejectDeptScholarshipRequests" });
  } catch (err) {
    const error = new HttpError("postRejectDeptScholarshipRequests Failed", 500);
    return next(error);
  }
};

const getOfferedCourses = async (req, res, next) => {
  try {
    const tid = req.userData.id;
    let queryRes = await pool.query("SELECT dept_id FROM department WHERE dept_head = $1", [tid]);
    const dept_id = queryRes.rows[0]["dept_id"];

    const session_id = await getCurrentSession();

    queryRes = await pool.query(
      'SELECT course_id FROM "course offering" natural \
      join "course" WHERE offered_by_dept_id = $1 and \
      session_id=$2',
      [dept_id, session_id]
    );

    data = [];
    for (let i = 0; i < queryRes.rows.length; i++) {
      data.push(queryRes.rows[i]["course_id"]);
    }

    res.json({ message: "getOfferedCourses", data: data });
  } catch (err) {
    console.log(err);
    const error = new HttpError("getOfferedCourses Failed", 500);
    return next(error);
  }
};

const getPreparedResults = async (req, res, next) => {
  try {
    const session_id = await getCurrentSession();
    const course_id = req.params.course_id;

    let queryRes = await pool.query(
      'select offering_id from "course offering" where course_id=$1 and \
      session_id=$2',
      [course_id, session_id]
    );

    const offering_id = queryRes.rows[0]["offering_id"];

    // get students whose results are prepared
    queryRes = await pool.query(
      "select student_id, filter_value1, filter_value2 from (select student_id, \
       offering_result_complete_for_student($1, student_id, 'Awaiting Department Head Approval') as filter_value1, \
       offering_result_complete_for_student($1, student_id, 'Rejected by Hall Provost') as filter_value2 \
       from \"course registrations\" where offering_id=$1) as t1\
       where filter_value1=true or filter_value2=true",
      [offering_id]
    );

    for (let i = 0; i < queryRes.rows.length; i++) {
      if (queryRes.rows[i]["filter_value1"]) {
        queryRes.rows[i]["status"] = "Awaiting Department Head Approval";
      }
      if (queryRes.rows[i]["filter_value2"]) {
        queryRes.rows[i]["status"] = "Rejected by Hall Provost";
      }
    }

    const data = await getStudentResults(queryRes.rows, offering_id);

    console.log(data);

    res.json({ message: "getPreparedResults", data: data });
  } catch (err) {
    console.log(err);
    const error = new HttpError("getPreparedResults Failed", 500);
    return next(error);
  }
};

const getResultDetails = async (req, res, next) => {
  try {
    const session_id = await getCurrentSession();
    const course_id = req.params.course_id;
    const student_id = req.params.student_id;

    let queryRes = await pool.query(
      'select offering_id from "course offering" where course_id=$1 and \
      session_id=$2',
      [course_id, session_id]
    );

    const offering_id = queryRes.rows[0]["offering_id"];

    queryRes = await pool.query(
      'select criteria_name, marks from "result details" where student_id=$1 and offering_id=$2',
      [student_id, offering_id]
    );

    res.json({ message: "getResultDetails", data: queryRes.rows });
  } catch (err) {
    const error = new HttpError("getResultDetails Failed", 500);
    return next(error);
  }
};

const postApproveResults = async (req, res, next) => {
  try {
    const session_id = await getCurrentSession();
    const course_id = req.params.course_id;

    let queryRes = await pool.query(
      'select offering_id from "course offering" where course_id=$1 and \
      session_id=$2',
      [course_id, session_id]
    );

    const offering_id = queryRes.rows[0]["offering_id"];

    const student_ids = req.body;
    for (let i = 0; i < student_ids.length; i++) {
      await pool.query(
        "UPDATE public.\"result details\" SET status='Awaiting Hall Provost Approval' WHERE student_id=$1 and offering_id=$2",
        [student_ids[i], offering_id]
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
    const course_id = req.params.course_id;

    let queryRes = await pool.query(
      'select offering_id from "course offering" where course_id=$1 and \
      session_id=$2',
      [course_id, session_id]
    );

    const offering_id = queryRes.rows[0]["offering_id"];

    const student_ids = req.body;
    for (let i = 0; i < student_ids.length; i++) {
      await pool.query(
        "UPDATE public.\"result details\" SET status='Rejected by Dept Head' WHERE student_id=$1 and offering_id=$2",
        [student_ids[i], offering_id]
      );
    }

    res.json({ message: "postRejectResults" });
  } catch (err) {
    const error = new HttpError("postRejectResults Failed", 500);
    return next(error);
  }
};

const getPendingResults = async (req, res, next) => {
  try {
    const session_id = await getCurrentSession();
    const course_id = req.params.course_id;

    let queryRes = await pool.query(
      'select offering_id from "course offering" where course_id=$1 and \
      session_id=$2',
      [course_id, session_id]
    );

    const offering_id = queryRes.rows[0]["offering_id"];

    // find out all the marking criteria for the course offering
    queryRes = await pool.query(
      'select criteria_name, name from "mark distribution policy" natural join teacher where offering_id=$1',
      [offering_id]
    );
    let criteria_list = [];
    for (let i = 0; i < queryRes.rows.length; i++) {
      criteria_list.push(queryRes.rows[i]["criteria_name"]);
    }

    // find out all the students who have registered for the course offering
    queryRes = await pool.query('select student_id from "course registrations" where offering_id=$1', [offering_id]);
    let student_list = [];
    for (let i = 0; i < queryRes.rows.length; i++) {
      student_list.push(queryRes.rows[i]["student_id"]);
    }

    let data = [];

    // find out all the students whose results are not completely prepared for the course offering
    for (let i = 0; i < student_list.length; i++) {
      let student_id = student_list[i];
      let temp = { student_id: student_id, details: [] };

      // find out the criteria list whose results are not completely prepared for the student
      queryRes = await pool.query(
        "select criteria_name, status from \"result details\" \
         where student_id=$1 and (status='Added by Course Teacher' \
         or status='Awaiting Scrutiny' or status='Rejected by Dept Head')",
        [student_id]
      );

      for (let j = 0; j < queryRes.rows.length; j++) {
        temp["details"].push({
          criteria: queryRes.rows[j]["criteria_name"],
          status: queryRes.rows[j]["status"],
        });
      }

      // criteria that have not been added by the course teacher
      queryRes = await pool.query(
        'select t1.criteria_name from  (select criteria_name from \
        "mark distribution policy" where offering_id=$1) as t1 where not exists \
        (select t2.criteria_name from "result details" as t2 where \
        t1.criteria_name=t2.criteria_name and t2.student_id=$2 and t2.offering_id=$1)',
        [offering_id, student_id]
      );

      for (let j = 0; j < queryRes.rows.length; j++) {
        temp["details"].push({
          criteria: queryRes.rows[j]["criteria_name"],
          status: "Not Added",
        });
      }

      if (temp["details"].length > 0) {
        data.push(temp);
      }
    }

    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i]["details"].length; j++) {
        const criteria_name = data[i]["details"][j].criteria;
        queryRes = await pool.query(
          "select course_teacher_name, scrutinizer_name from offering_teachers \
          where offering_id=$1 and criteria_name=$2",
          [offering_id, criteria_name]
        );
        data[i]["details"][j].course_teacher_name = queryRes.rows[0]["course_teacher_name"];
        data[i]["details"][j].scrutinizer_name = queryRes.rows[0]["scrutinizer_name"];
      }
    }

    console.log(data);

    res.json({ message: "getPendingResults", data: data });
  } catch (err) {
    console.log(err);
    const error = new HttpError("getPendingResults Failed", 500);
    return next(error);
  }
};

exports.postApproveResults = postApproveResults;
exports.postRejectResults = postRejectResults;
exports.getOfferedCourses = getOfferedCourses;
exports.getResultDetails = getResultDetails;
exports.postApproveRegistrationRequests = postApproveRegistrationRequests;
exports.postRejectRegistrationRequests = postRejectRegistrationRequests;
exports.getAvailableResults = getAvailableResults;
exports.getGrades = getGrades;
exports.getRegistrationRequests = getRegistrationRequests;
exports.getDeptStudentInfo = getDeptStudentInfo;
exports.getRegistrationRequestSummary = getRegistrationRequestSummary;
exports.getFeedbacks = getFeedbacks;
exports.getDepartmentStudents = getDepartmentStudents;
exports.getScholarshipRequests = getScholarshipRequests;
exports.getStudentScholarshipRequests = getStudentScholarshipRequests;
exports.allowDeptScholarshipRequests = allowDeptScholarshipRequests;
exports.rejectDeptScholarshipRequests = rejectDeptScholarshipRequests;
exports.getPreparedResults = getPreparedResults;
exports.getPendingResults = getPendingResults;
