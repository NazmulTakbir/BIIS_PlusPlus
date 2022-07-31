const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const session_id = require("../../placeHolder");

const essentialAttributes = [];

const allAttributes = ["course_id", "session_id", "exam_slot_id"];

const createCourseOffering = async (data) => {
  await pool.query(
    'INSERT INTO public."course offering"(offering_id, course_id, session_id, exam_slot_id) \
     VALUES ($1, $2, $3, $4)',
    data
  );
};

const postAddCourseOffering = async (req, res, next) => {
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
      await createCourseOffering(data);
    }

    res.status(201).json({ message: "postAddCourseOffering successful" });
  } catch (err) {
    const error = new HttpError("postAddCourseOffering failed", 500);
    return next(error);
  }
};

exports.postAddCourseOffering = postAddCourseOffering;
