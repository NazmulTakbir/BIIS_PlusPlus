const pool = require("../../db");
const HttpError = require("../../models/HttpError");

const getRegistrationRequests = async (req, res, next) => {
  try {
    const tid = req.userData.id;
    const sid = req.params.sid;
    let queryRes = await pool.query(
      'select reg_request_id, request_type, student_id, course_id, request_date  from \
      "registration request" natural join student natural join "course offering" \
      where reg_status=\'awaiting_advisor\' and advisor_id = $1 and student_id=$2 order by reg_request_id;',
      [tid, sid]
    );
    data = queryRes.rows;
    for (let i = 0; i < data.length; i++) {
      let date_ = "";
      date_ = (date_ + data[i]["request_date"]).substring(4, 16);
      data[i]["request_date"] = date_;
      data[i]["request_type"] = data[i]["request_type"].toUpperCase();
    }

    res.json({ message: "getRegistrationRequests", data: data });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Fetching Student Info Failed", 500);
    return next(error);
  }
};

const getRegistrationRequestSummary = async (req, res, next) => {
  try {
    const tid = req.userData.id;
    let queryRes = await pool.query(
      'select request_type, student_id, request_date, COUNT(*) as req_count \
      from (select * from "registration request" natural join student natural join \
      "course offering" where reg_status=\'awaiting_advisor\' and advisor_id = $1 ) \
      as t1 group by student_id, request_type, request_date order by request_date asc;',
      [tid]
    );

    data = queryRes.rows;
    for (let i = 0; i < data.length; i++) {
      let date_ = "";
      date_ = (date_ + data[i]["request_date"]).substring(4, 16);
      data[i]["request_date"] = date_;
      data[i]["request_type"] = data[i]["request_type"].toUpperCase();
    }

    res.json({ message: "getRegistrationRequestSummary", data: data });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Fetching Registration Summary Failed", 500);
    return next(error);
  }
};

const postApproveRegistrationRequests = async (req, res, next) => {
  try {
    const { requestIDs } = req.body;
    //console.log("here" + requestIDs);
    for (let i = 0; i < requestIDs.length; i++) {
      await pool.query("update \"registration request\" set reg_status='awaiting_head' where reg_request_id=$1;", [
        requestIDs[i],
      ]);
    }
    res.json({ message: "postApproveRegistrationRequests" });
  } catch (err) {
    console.log(err);
    const error = new HttpError("postApproveRegistrationRequests Failed", 500);
    return next(error);
  }
};

const postRejectRegistrationRequests = async (req, res, next) => {
  try {
    const { requestIDs } = req.body;
    for (let i = 0; i < requestIDs.length; i++) {
      await pool.query("update \"registration request\" set reg_status='rejected_advisor' where reg_request_id=$1;", [
        requestIDs[i],
      ]);
    }
    res.json({ message: "postRejectRegistrationRequests" });
  } catch (err) {
    console.log(err);
    const error = new HttpError("postRejectRegistrationRequests Failed", 500);
    return next(error);
  }
};

exports.getRegistrationRequests = getRegistrationRequests;
exports.getRegistrationRequestSummary = getRegistrationRequestSummary;
exports.postApproveRegistrationRequests = postApproveRegistrationRequests;
exports.postRejectRegistrationRequests = postRejectRegistrationRequests;
