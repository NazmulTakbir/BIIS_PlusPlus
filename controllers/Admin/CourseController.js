const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const session_id = require("../../placeHolder");

const essentialAttributes = [];

const allAttributes = [
  "course_id",
  "course_name",
  "offered_by_dept_id",
  "offered_to_dept_id",
  "level",
  "term",
  "credits",
];

const createCourse = async (data) => {
  await pool.query(
    "INSERT INTO public.course(course_id, course_name, offered_by_dept_id, offered_to_dept_id, level, term, \
      credits) VALUES ($1, $2, $3, $4, $5, $6, $7);",
    data
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
    console.log(err);
    const error = new HttpError("getSampleFile failed", 500);
    return next(error);
  }
};

const postAddCourse = async (req, res, next) => {
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
      await createCourse(data);
    }

    res.status(201).json({ message: "postAddCourse successful" });
  } catch (err) {
    console.log(err);
    const error = new HttpError("postAddCourse failed", 500);
    return next(error);
  }
};

exports.postAddCourse = postAddCourse;
exports.getSampleFile = getSampleFile;
