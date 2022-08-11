const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const session_id = require("../../placeHolder");

const getPendingDues = async (req, res, next) => {
  try {
    const sid = req.userData.id;
    const stat = "Not Paid";
    let queryRes = await pool.query(
      'select dt.description , dt.amount , d.deadline , d.payment_date , d.dues_status, d.specification \
      from dues as d , "dues type" as dt \
      where d.dues_type_id = dt."dues type id" and d.dues_status = $2 and d.student_id = $1  ',
      [sid, stat]
    );

    pending_dues_list = [];

    for (const element of queryRes.rows) {
      due_obj = {};
      due_obj["description"] = element["description"];
      due_obj["amount"] = element["amount"];

      let date_ = "";
      date_ = (date_ + element["deadline"]).substring(4, 16);
      due_obj["deadline"] = date_;

      date_ = "";
      date_ = (date_ + element["payment_date"]).substring(4, 16);
      due_obj["payment_date"] = date_;

      due_obj["dues_status"] = element["dues_status"];
      due_obj["specification"] = element["specification"];

      pending_dues_list.push(due_obj);
    }

    res.status(201).json({ message: "getPendingDues", data: pending_dues_list });
  } catch (err) {
    const error = new HttpError("Fetching pending dues Failed", 500);
    return next(error);
  }
};

const getPaidDues = async (req, res, next) => {
  try {
    const sid = req.userData.id;
    const stat = "Paid";
    let queryRes = await pool.query(
      'select dt.description , dt.amount , d.deadline , d.payment_date , d.dues_status, d.specification \
      from dues as d , "dues type" as dt \
      where d.dues_type_id = dt."dues type id" and d.dues_status = $2 and d.student_id = $1  ',
      [sid, stat]
    );

    dues_list = [];

    for (const element of queryRes.rows) {
      due_obj = {};
      due_obj["description"] = element["description"];
      due_obj["amount"] = element["amount"];

      let date_ = "";
      date_ = (date_ + element["deadline"]).substring(4, 16);
      due_obj["deadline"] = date_;

      date_ = "";
      date_ = (date_ + element["payment_date"]).substring(4, 16);
      due_obj["payment_date"] = date_;

      due_obj["dues_status"] = element["dues_status"];
      due_obj["specification"] = element["specification"];

      dues_list.push(due_obj);
    }
    res.status(201).json({ message: "getPaidDues", data: dues_list });
  } catch (err) {
    const error = new HttpError("Fetching Courses to Drop Failed", 500);
    return next(error);
  }
};

exports.getPendingDues = getPendingDues;
exports.getPaidDues = getPaidDues;
