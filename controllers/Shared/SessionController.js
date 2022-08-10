const pool = require("../../db");
const HttpError = require("../../models/HttpError");

const getCurrentSession = async (req, res, next) => {
  try {
    const today = new Date();
    const queryRes = await pool.query(
      "select * from session where start_date<=$1::date and \
                      end_date>=$1::date",
      [today]
    );
    let session_data = queryRes.rows[0];

    let date_ = "";
    date_ = (date_ + session_data["start_date"]).substring(4, 16);
    session_data["start_date"] = date_;

    date_ = "";
    date_ = (date_ + session_data["end_date"]).substring(4, 16);
    session_data["end_date"] = date_;

    res.status(201).json({ message: "getCurrentSession successful", data: session_data });
  } catch (err) {
    const error = new HttpError("getCurrentSession failed", 500);
    return next(error);
  }
};

exports.getCurrentSession = getCurrentSession;
