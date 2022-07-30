const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const session_id = require("../../placeHolder");

const essentialAttributes = [];

const allAttributes = ["offering_id", "teacher_id", "role"];

const createCourseTeacher = async (data) => {
  await pool.query(
    'INSERT INTO public."course offering teacher"(offering_id, teacher_id, role) VALUES ($1, $2, $3);',
    data
  );
};

const postAddCourseTeacher = async (req, res, next) => {
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
      await createCourseTeacher(data);
    }

    res.status(201).json({ message: "postAddCourseTeacher successful" });
  } catch (err) {
    const error = new HttpError("postAddCourseTeacher failed", 500);
    return next(error);
  }
};

exports.postAddCourseTeacher = postAddCourseTeacher;
