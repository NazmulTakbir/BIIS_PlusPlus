const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const session_id = require("../../placeHolder");

const getData = async (req, res, next) => {
  try {
    let queryRes = await pool.query(
      'select s.scholarship_id , s.scholarship_state , s.session_id , s.payment_date , st.scholarship_name , st.amount \
      from scholarship as s , "scholarship type" as st \
      where s.scholarship_type_id = st.scholarship_type_id and s.student_id = $1',
      [req.params.sid]
    );

    scholarship_list = []
    for(const element of queryRes.rows){
      var sc_obj = {};
      sc_obj["scholarship_name"] = element["scholarship_name"];
      sc_obj["amount"] = element["amount"];
      sc_obj["scholarship_id"] = element["scholarship_id"];
      sc_obj["scholarship_state"] = element["scholarship_state"];
      sc_obj["session_id"] = element["session_id"];
      sc_obj["payment_date"] = element["payment_date"];

      scholarship_list.push(sc_obj);
    }

    res.status(201).json({ message: "getData" , scholarship_list:scholarship_list });

  } catch (err) {
    const error = new HttpError("Fetching scholarship data Failed", 500);
    return next(error);
  }
};

const getForm = async (req, res, next) => {
  try {
    //file stuff to be done later
    res.status(201).json({ message: "getForm" });
  } catch (err) {
    const error = new HttpError("Fetching Courses to Drop Failed", 500);
    return next(error);
  }
};

const postApplication = async (req, res, next) => {
  try {
    //retrieve student id and scholarship_type_id from URL
    const sid = req.params.sid;
    const sc_id = req.params.scid;
    //create a new scholarship obj
    let queryRes = await pool.query(
      'UPDATE scholarship SET scholarship_state = $1  \
       where scholarship_id = $2',
      ['awaiting_provost' , sc_id]
    );
    //console.log(queryRes);
    res.status(201).json({ message: "scholarship state updated to awaiting_provost" });
  } catch (err) {
    const error = new HttpError("scholarship state update Failed", 500);
    return next(error);
  }
};

exports.getData = getData;
exports.getForm = getForm;
exports.postApplication = postApplication;
