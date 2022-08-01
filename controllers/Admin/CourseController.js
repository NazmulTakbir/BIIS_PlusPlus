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

const postAddCourse = async (req, res, next) => {
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
      await createCourse(data);
    }

    res.status(201).json({ message: "postAddCourse successful" });
  } catch (err) {
    const error = new HttpError("postAddCourse failed", 500);
    return next(error);
  }
};

exports.postAddCourse = postAddCourse;
