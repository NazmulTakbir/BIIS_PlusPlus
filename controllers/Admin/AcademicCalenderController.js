const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const session_id = require("../../placeHolder");

const essentialAttributes = [];

const allAttributes = ["phase_number", "session_id", "start_date", "end_date", "no_of_weeks", "description"];

const createSession = async (session_id, startDate, endDate) => {
  await pool.query("INSERT INTO public.session(session_id, start_date, end_date) VALUES ($1, $2, $3);", [
    session_id,
    startDate,
    endDate,
  ]);
};

const createPhase = async (data) => {
  await pool.query(
    "INSERT INTO public.session_phase(phase_number, session_id, start_date, end_date, no_of_weeks, description) \
      VALUES ($1, $2, $3, $4, $5, $6);",
    data
  );
};

const addCalender = async (req, res, next) => {
  try {
    const allData = req.body.data;
    const { session_id, startDate, endDate } = req.body;
    await createSession(session_id, startDate, endDate);

    for (let rowNo = 0; rowNo < allData.length; rowNo++) {
      let data = [];
      for (let columnNo = 0; columnNo < allAttributes.length; columnNo++) {
        if (allAttributes[columnNo] === "session_id") {
          data.push(session_id);
        } else if (allAttributes[columnNo] in allData[rowNo]) {
          if (allData[rowNo][allAttributes[columnNo]] === "") {
            data.push(null);
          } else {
            data.push(allData[rowNo][allAttributes[columnNo]]);
          }
        } else {
          data.push(null);
        }
      }
      await createPhase(data);
    }

    res.status(201).json({ message: "addCalender successful" });
  } catch (err) {
    const error = new HttpError("addCalender failed", 500);
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

exports.getSampleFile = getSampleFile;
exports.addCalender = addCalender;
