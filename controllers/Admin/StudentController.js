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
          data.push(allData[rowNo][allAttributes[columnNo]]);
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

exports.postAddStudent = postAddStudent;
