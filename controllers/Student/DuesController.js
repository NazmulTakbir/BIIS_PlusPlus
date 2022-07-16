const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const session_id = require("../../placeHolder");

const getPendingDues = async (req, res, next) => {
  try {
    const sid = req.params.sid;
    const stat = 'Not Paid';
    let queryRes = await pool.query(
      'select dt.description , dt.amount , d.deadline , d.payment_date , d.dues_status \
      from dues as d , "dues type" as dt \
      where d.dues_type_id = dt."dues type id" and d.dues_status = $2 and d.student_id = $1  ' , [sid , stat]
    );

    pending_dues_list = []
    
    for(const element of queryRes.rows){
      due_obj = {};
      due_obj["description"] = element["description"];
      due_obj["amount"]  = element["amount"];
      due_obj["deadline"] = element["deadline"];
      due_obj["payment_date"] = element["payment_date"]
      due_obj["dues_status"] = element["dues_status"];

      pending_dues_list.push(due_obj);
    }

    res.status(201).json({ message: "getPendingDues"  , pending_dues_list:pending_dues_list});

  } catch (err) {
    const error = new HttpError("Fetching pending dues Failed", 500);
    return next(error);
  }
};

const getPaidDues = async (req, res, next) => {
  try {
    const sid = req.params.sid;
    const stat = 'Paid';
    let queryRes = await pool.query(
      'select dt.description , dt.amount , d.deadline , d.payment_date , d.dues_status \
      from dues as d , "dues type" as dt \
      where d.dues_type_id = dt."dues type id" and d.dues_status = $2 and d.student_id = $1  ' , [sid , stat]
    );

    dues_list = []
    
    for(const element of queryRes.rows){
      due_obj = {};
      due_obj["description"] = element["description"];
      due_obj["amount"]  = element["amount"];
      due_obj["deadline"] = element["deadline"];
      due_obj["payment_date"] = element["payment_date"];
      due_obj["dues_status"] = element["dues_status"];

      dues_list.push(due_obj);
    }
    res.status(201).json({ message: "getPaidDues" , dues_list:dues_list});
  } catch (err) {
    const error = new HttpError("Fetching Courses to Drop Failed", 500);
    return next(error);
  }
};

exports.getPendingDues = getPendingDues;
exports.getPaidDues = getPaidDues;
