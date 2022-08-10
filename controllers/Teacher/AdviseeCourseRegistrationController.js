const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const session_id = require("../../placeHolder");

const getRegistrationRequests = async (req, res, next) => {
  try {
    const tid = req.params.tid;
    let queryRes = await pool.query(
      'select reg_request_id, request_type, student_id, course_id, request_date  from \
      "registration request" natural join student natural join "course offering" \
      where reg_status=\'awaiting_advisor\' and advisor_id = $1;',
      [tid]
    );
    reg_requests = [];
    for (const element of queryRes.rows) {
      comp = {};
      comp["reg_request_id"] = element["reg_request_id"];
      comp["request_type"] = element["request_type"];
      comp["student_id"] = element["student_id"];
      comp["course_id"] = element["course_id"];

      let date_ = "";
      date_ = (date_ + element["request_date"]).substring(4, 16);
      comp["request_date"] = date_;

      reg_requests.push(comp);
    }

    res.json({ message: "getRegistrationRequests", data: reg_requests });
  } catch (err) {
    const error = new HttpError("Fetching Student Info Failed", 500);
    return next(error);
  }
};

exports.getRegistrationRequests = getRegistrationRequests;
