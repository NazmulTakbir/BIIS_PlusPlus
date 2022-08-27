const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const session_id = require("../../placeHolder");
const mailController = require("../Shared/email");

const essentialAttributes = [];

const allAttributes = ["student_id", "dues_type_id", "deadline", "dues_status", "payment_date", "specification"];

const createDue = async (data) => {
  await pool.query(
    "INSERT INTO public.dues(student_id, dues_type_id, deadline, dues_status, payment_date, specification) \
    VALUES ($1, $2, $3, $4, $5, $6);",
    data
  );
  const student_id = data[0];
  const dues_type = data[1];

  let queryRes = await pool.query('select description, amount from \
    public."dues type" where dues_type_id = $1', [
    dues_type,
  ]);
  const amount = queryRes.rows[0].amount;
  let description = "Your " + queryRes.rows[0].description + " is due to be paid.\nAmount: " 
   + amount + " BDT.\nPayment Deadline: "
   + data[2];
  await pool.query("call insert_notification($1, $2, $3, $4, $5)", [
    "student",
    student_id,
    "New Dues to be Paid",
    new Date(),
    description,
  ]);

  //send email
  queryRes = await pool.query('select email from public.student where student_id = $1', [student_id]);
  const email = queryRes.rows[0].email;
  const subject = "BIISPLUSPLUS : New Dues to be Paid";
  description += + "\n\nThank you."
  + "\nDo not reply to this email. This email is sent from a system that cannot receive email messages." 
  const text = description;
  mailController.sendMail(email, subject, text);
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
