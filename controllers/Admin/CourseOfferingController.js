const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const session_id = require("../../placeHolder");

const essentialAttributes = [];

const allAttributes = [];

const createCourseOffering = async (data) => {};

const postAddCourseOffering = async (req, res, next) => {
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
      await createCourseOffering(data);
    }

    res.status(201).json({ message: "postAddCourseOffering successful" });
  } catch (err) {
    const error = new HttpError("postAddCourseOffering failed", 500);
    return next(error);
  }
};

exports.postAddCourseOffering = postAddCourseOffering;
