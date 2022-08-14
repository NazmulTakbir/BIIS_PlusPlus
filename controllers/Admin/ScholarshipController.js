const pool = require("../../db");
const HttpError = require("../../models/HttpError");

const allAttributes = [
  "student_id",
  "session_id",
  "scholarship_type_id",
];

const createScholarship = async (data) => {
  await pool.query(
    `INSERT INTO public.scholarship(student_id, session_id, scholarship_state, scholarship_type_id, payment_date) \
    VALUES ($1, $2,'awaiting_application', $3, NULL);`
    , data
  );
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

const postAddScholarship = async (req, res, next) => {
  try {
    const allData = req.body.data;
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
      await createScholarship(data);
    }

    res.status(201).json({ message: "postAddScholarship successful" });
  } catch (err) {
    const error = new HttpError("postAddScholarship failed", 500);
    return next(error);
  }
};

exports.postAddScholarship = postAddScholarship;
exports.getSampleFile = getSampleFile;
