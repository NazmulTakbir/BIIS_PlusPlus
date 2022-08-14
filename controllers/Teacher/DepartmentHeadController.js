const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const session_id = require("../../placeHolder");

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

//async function to get department students
const getDepartmentStudents = async (req, res, next) => {
  try {
    //write query to get dept_id from teacher_id
    let queryRes = await pool.query(
      "SELECT dept_id FROM teacher WHERE teacher_id = $1",[req.userData.id]
    )
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
}

const getRegistrationRequestSummary = async (req, res, next) => {
  try {
     //write query to get dept_id from teacher_id
     const tid = req.userData.id;
     let queryRes = await pool.query(
      "SELECT dept_id FROM teacher WHERE teacher_id = $1",[tid]
    )
    const dept_id = queryRes.rows[0]["dept_id"];
    
    queryRes = await pool.query(
      'select request_type, student_id, request_date, COUNT(*) as req_count \
      from (select rr.request_type, rr.request_date, s.student_id \
      from "registration request" as rr, student as s\
       where rr.reg_status = $2 and s.dept_id = $1 and rr.student_id = s.student_id) \
      as t1 group by student_id, request_type, request_date order by request_date asc;',
      [dept_id , 'awaiting_head']
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
}

const getRegistrationRequests = async (req, res, next) => {
  try {
    const tid = req.userData.id;
    const sid = req.params.sid;
    let queryRes = await pool.query(
      'select rr.request_type, s.student_id, co.course_id, rr.request_date , rr.reg_request_id  from \
      "registration request" as rr , student as s , "course offering" as co\
      where reg_status=$2 and s.student_id=$1 and rr.student_id = s.student_id and rr.offering_id = co.offering_id order by reg_request_id;',
      [sid , 'awaiting_head']
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

const postApproveRegistrationRequests = async (req, res, next) => {
  try {
    const { requestIDs } = req.body;
    console.log("here"+requestIDs);
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
      await pool.query("update \"registration request\" set reg_status='rejected_departmenthead' where reg_request_id=$1;", [
        requestIDs[i],
      ]);
    }
    res.json({ message: "postRejectRegistrationRequests" });
  } catch (err) {
    const error = new HttpError("postRejectRegistrationRequests Failed", 500);
    return next(error);
  }
};

exports.postApproveRegistrationRequests = postApproveRegistrationRequests;
exports.postRejectRegistrationRequests = postRejectRegistrationRequests;
exports.getAvailableResults = getAvailableResults;
exports.getGrades = getGrades;
exports.getRegistrationRequests = getRegistrationRequests;
exports.getDeptStudentInfo = getDeptStudentInfo;
exports.getRegistrationRequestSummary = getRegistrationRequestSummary;
exports.getFeedbacks = getFeedbacks;
exports.getDepartmentStudents = getDepartmentStudents;
