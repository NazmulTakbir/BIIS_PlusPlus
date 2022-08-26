const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const session_id = require("../../placeHolder");

const essentialAttributes = [];

const allAttributes = ["student_id", "dues_type_id", "deadline", "dues_status", "payment_date", "specification"];

const createDue = async (data) => {
  await pool.query(
    "INSERT INTO public.dues(student_id, dues_type_id, deadline, dues_status, payment_date, specification) \
    VALUES ($1, $2, $3, $4, $5, $6);",
    data
  );
};

const postAddDues = async (req, res, next) => {
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
      await createDue(data);
    }

    res.status(201).json({ message: "postAddDues successful" });
  } catch (err) {
    console.log(err);
    const error = new HttpError("postAddDues failed", 500);
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
    console.log(err);
    const error = new HttpError("getSampleFile failed", 500);
    return next(error);
  }
};

//create getDuesTypes async function
const getDuesTypes = async (req, res, next) => {
  try {
    const result = await pool.query(`SELECT dues_type_id , description FROM public."dues type" `);
    res.json({ message: "getDuesTypes successful", data: result.rows });
  } catch (err) {
    console.log(err);
    const error = new HttpError("getDuesTypes failed", 500);
    return next(error);
  }
};

exports.getDuesTypes = getDuesTypes;
exports.getSampleFile = getSampleFile;
exports.postAddDues = postAddDues;
