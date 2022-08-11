const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const session_id = require("../../placeHolder");

const essentialAttributes = [
  "student_id",
  "name",
  "hall_id",
  "dept_id",
  "advisor_id",
  "date_of_birth",
  "level",
  "term",
];

const allAttributes = [
  "student_id",
  "name",
  "email",
  "hall_id",
  "dept_id",
  "advisor_id",
  "mobile_no",
  "bank_acc_no",
  "present_address",
  "contact_person_address",
  "date_of_birth",
  "nid_no",
  "level",
  "term",
];

const createStudent = async (data) => {
  await pool.query(
    "INSERT INTO public.student(student_id, name, email, hall_id, dept_id, advisor_id, \
                    mobile_no, bank_acc_no, present_address, contact_person_address, date_of_birth, \
                    nid_no, level, term) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)",
    data
  );
};

const postAddStudent = async (req, res, next) => {
  try {
    allData = req.body.data;
    for (let rowNo = 0; rowNo < allData.length; rowNo++) {
      let data = [];
      for (let columnNo = 0; columnNo < allAttributes.length; columnNo++) {
        if (allAttributes[columnNo] in allData[rowNo]) {
          if (allData[rowNo][allAttributes[columnNo]] === "") {
            data.push(null);
          } else {
            data.push(allData[rowNo][allAttributes[columnNo]]);
          }
        } else {
          data.push(null);
        }
      }
      await createStudent(data);
    }

    res.status(201).json({ message: "postAddStudent successful" });
  } catch (err) {
    const error = new HttpError("postAddStudent failed", 500);
    return next(error);
  }
};

const getSampleFile = async (req, res, next) => {
  try {
    data = "";
    for (let i = 0; i < allAttributes.length; i++) {
      if (i === allAttributes.length - 1) {
        data += allAttributes[i];
      } else {
        data += allAttributes[i] + ",";
      }
    }

    res.json({ message: "getSampleFile successful", data: data });
  } catch (err) {
    const error = new HttpError("getSampleFile failed", 500);
    return next(error);
  }
};

//create getStudentsOfDept async function
const getStudentsOfDept = async (req, res, next) => {
  try {
    const { dept_id } = req.params;
    const result = await pool.query(
      "SELECT student_id, name FROM public.student WHERE dept_id = $1",
      [dept_id]
    );
    res.json({ message: "getStudentsOfDept successful", data: result.rows });
  } catch (err) {
    const error = new HttpError("getStudentsOfDept failed", 500);
    return next(error);
  }
}

exports.getStudentsOfDept = getStudentsOfDept;
exports.getSampleFile = getSampleFile;
exports.postAddStudent = postAddStudent;
