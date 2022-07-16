const { deepOrange } = require("@mui/material/colors");
const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const session_id = require("../../placeHolder");

const getAcademicCalender = async (req, res, next) => {
  try {
    let queryRes = await pool.query(
      'select * from session_phase where session_id=$1' , [session_id]
    );
    
    phase_list = [];

    for(const element of queryRes.rows){
      var phase_obj = {};
      phase_obj["phase_number"] = element["phase_number"];
      phase_obj["description"] = element["description"];
      phase_obj["start_date"] = element["start_date"];
      phase_obj["end_date"] = element["end_date"];
      phase_obj["no_of_weeks"] = element["no_of_weeks"];
      
      phase_list.push(phase_obj);
    }

    res.status(201).json({ message: "getAcademicCalender"  ,  phase_list : phase_list});

  } catch (err) {
    const error = new HttpError("Fetching Courses to Add Failed", 500);
    return next(error);
  }
};

const getHallInfo = async (req, res, next) => {
  try {
    const sid = req.params.sid;
    let queryRes = await pool.query(
      'select h.hall_id , h.hall_name , h.supervisor_name , h.supervisor_phone , h.supervisor_email \
      from hall as h , student as s \
      where s.hall_id = h.hall_id and s.student_id = $1' , [sid]
    );
    var _row_ = queryRes.rows[0];
    var hall_obj = {
      hall_id : _row_["hall_id"],
      hall_name : _row_["hall_name"],
      supervisor_name : _row_["supervisor_name"],
      supervisor_phone : _row_["supervisor_phone"],
      supervisor_email : _row_["supervisor_email"]
    }

    res.status(201).json({ message: "getHallInfo" , hall_obj : hall_obj});
  } catch (err) {
    const error = new HttpError("Fetching Courses to Drop Failed", 500);
    return next(error);
  }
};

const getNotices = async (req, res, next) => {
  try {
    let queryRes = await pool.query(
      'select * from notice'
    );
    
    notice_list = []

    for(const element of queryRes.rows){
      notice_obj = {};
      notice_obj["notice_id"] = element["notice_id"];
      notice_obj["description"] = element["description"];
      notice_obj["file_path"] = element["file_path"];
      notice_obj["upload_date"] = element["upload_date"];

      notice_list.push(notice_obj);
    }

    res.status(201).json({ message: "getNotices" ,  notice_list:notice_list});
  } catch (err) {
    const error = new HttpError("Fetching Courses to Drop Failed", 500);
    return next(error);
  }
};

exports.getAcademicCalender = getAcademicCalender;
exports.getHallInfo = getHallInfo;
exports.getNotices = getNotices;