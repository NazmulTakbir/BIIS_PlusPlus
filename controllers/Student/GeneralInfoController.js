const { deepOrange } = require("@mui/material/colors");
const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const { getCurrentSession } = require("../../util/CurrentSession");

const getAcademicCalender = async (req, res, next) => {
  try {
    const session_id = await getCurrentSession();
    let queryRes = await pool.query("select * from session_phase where session_id=$1 ORDER BY phase_number", [
      session_id,
    ]);

    phase_list = [];

    for (const element of queryRes.rows) {
      var phase_obj = {};
      phase_obj["phase_number"] = element["phase_number"];
      phase_obj["description"] = element["description"];

      let date_ = "";
      date_ = (date_ + element["start_date"]).substring(4, 16);
      phase_obj["start_date"] = date_;

      date_ = "";
      date_ = (date_ + element["end_date"]).substring(4, 16);
      phase_obj["end_date"] = date_;

      phase_obj["no_of_weeks"] = element["no_of_weeks"];

      phase_list.push(phase_obj);
    }

    res.status(201).json({ message: "getAcademicCalender", data: phase_list });
  } catch (err) {
    const error = new HttpError("Fetching Courses to Add Failed", 500);
    return next(error);
  }
};

const getHallInfo = async (req, res, next) => {
  try {
    const sid = req.params.sid;
    let queryRes = await pool.query(
      "select hall_name , supervisor_name , supervisor_phone , supervisor_email \
      from hall"
    );

    let hallData = [];
    for (let rowNo = 0; rowNo < queryRes.rowCount; rowNo++) {
      var _row_ = queryRes.rows[rowNo];
      var hall_obj = {
        hall_id: _row_["hall_id"],
        hall_name: _row_["hall_name"],
        supervisor_name: _row_["supervisor_name"],
        supervisor_phone: _row_["supervisor_phone"],
        supervisor_email: _row_["supervisor_email"],
      };
      hallData.push(hall_obj);
    }

    res.status(201).json({ message: "getHallInfo", data: hallData });
  } catch (err) {
    const error = new HttpError("Fetching Courses to Drop Failed", 500);
    return next(error);
  }
};

const getNotices = async (req, res, next) => {
  try {
    let queryRes = await pool.query("select * from notice");

    notice_list = [];

    for (const element of queryRes.rows) {
      notice_obj = {};
      notice_obj["notice_id"] = element["notice_id"];
      notice_obj["description"] = element["description"];
      notice_obj["file_path"] = element["file_path"];

      let date_ = "";
      date_ = (date_ + element["upload_date"]).substring(4, 16);
      notice_obj["upload_date"] = date_;

      notice_list.push(notice_obj);
    }

    res.status(201).json({ message: "getNotices", data: notice_list });
  } catch (err) {
    const error = new HttpError("Fetching Courses to Drop Failed", 500);
    return next(error);
  }
};

exports.getAcademicCalender = getAcademicCalender;
exports.getHallInfo = getHallInfo;
exports.getNotices = getNotices;
