const pool = require("../../db");
const HttpError = require("../../models/HttpError");

const getPendingScholarships = async (req, res, next) => {
  try {
    let queryRes = await pool.query(
      `SELECT scholarship.scholarship_id, scholarship.student_id, student.name, scholarship.session_id,\
      (SELECT scholarship_name from "scholarship type" where scholarship_type_id=scholarship.scholarship_type_id)\
      FROM scholarship\
      INNER JOIN student ON scholarship.student_id=student.student_id\
      where scholarship_state='awaiting_comptroller';`
    );
    res.json({ message: "getPendingScholarships successful", data: queryRes.rows });
  } catch (err) {
    console.log(err);
    const error = new HttpError("getPendingScholarships failed", 500);
    return next(error);
  }
};

const getPendingDues = async (req, res, next) => {
  try {
    //get pending dues from dues table
    let queryRes = await pool.query(
      `SELECT d.dues_id , d.student_id , s.name , dt.description , dt.amount , d.deadline FROM dues as d , public."dues type" as dt, student as s WHERE dues_status = 'Not Paid' \
      AND d.dues_type_id = dt.dues_type_id and d.student_id = s.student_id`
    );

    res.json({ message: "getPendingDues successful", data: queryRes.rows });
  } catch (err) {
    console.log(err);
    const error = new HttpError("getPendingDues failed", 500);
    return next(error);
  }
};

//async method to mark dues as paid
const postMarkDuesPaid = async (req, res, next) => {
  try {
    const { duesIDs } = req.body;
    let queryRes;
    for (let i = 0; i < duesIDs.length; i++) {
      queryRes = await pool.query("UPDATE dues SET dues_status = 'Paid' WHERE dues_id = $1", [duesIDs[i]]);

      queryRes = await pool.query(
        'select description, amount, student_id from dues natural join "dues type" where dues_id=$1',
        [duesIDs[i]]
      );

      const student_id = queryRes.rows[0].student_id;

      let description =
        "Payment for the following due has been received: " +
        queryRes.rows[0].description +
        ". Amount: " +
        queryRes.rows[0].amount +
        " BDT";

      await pool.query("call insert_notification($1, $2, $3, $4, $5)", [
        "student",
         student_id,
        "Dues Payment Confirmed",
        new Date(),
        description,
      ]);

      

      let mailInfo = await pool.query('select email from public.student where student_id = $1', [student_id]);
      const email = mailInfo.rows[0].email;
      
      const subject = "BIISPLUSPLUS : Dues Payment Confirmed";
      description = "Dear Student,\n" + description + "\n\nRegards,\nBIISPLUSPLUS";
      description += "\nDo not reply to this email. This email is sent from a system that cannot receive email messages." 
      
      const text = description;

      mailController.sendMail(email, subject, text);
    }

    res.json({ message: "postMarkDuesPaid successful" });
  } catch (err) {
    console.log(err);
    const error = new HttpError("postMarkDuesPaid failed", 500);
    return next(error);
  }
};

const postMarkScholarshipPaid = async (req, res, next) => {
  try {
    const { schIDs } = req.body;
    let queryRes;
    for (let i = 0; i < schIDs.length; i++) {
      queryRes = await pool.query(
        "UPDATE scholarship SET scholarship_state = 'paid', payment_date=NOW() WHERE scholarship_id = $1",
        [schIDs[i]]
      );

      queryRes = await pool.query(
        'select scholarship_name, amount, session_id, student_id from scholarship natural join "scholarship type" where scholarship_id=$1',
        [schIDs[i]]
      );

      const student_id = queryRes.rows[0].student_id;

      let description =
        "The following Scholarship has been Paid: " +
        queryRes.rows[0].scholarship_name +
        " of Session " +
        queryRes.rows[0].session_id +
        ". Amount: " +
        queryRes.rows[0].amount +
        " Taka";

      await pool.query("call insert_notification($1, $2, $3, $4, $5)", [
        "student",
        student_id,
        "Scholarship Paid",
        new Date(),
        description,
      ]);

      let mailInfo = await pool.query('select email from public.student where student_id = $1', [student_id]);
      const email = mailInfo.rows[0].email;
      
      description = "Dear Student,\n" + description + "\n\nRegards,\nBIISPLUSPLUS";
      description += "\nDo not reply to this email. This email is sent from a system that cannot receive email messages." 

      const subject = "BIISPLUSPLUS : Scholarship Paid";

      const text = description;

      mailController.sendMail(email, subject, text);
    }

    res.json({ message: "postMarkScholarshipPaid successful" });
  } catch (err) {
    console.log(err);
    const error = new HttpError("postMarkScholarshipPaid failed", 500);
    return next(error);
  }
};

exports.postMarkScholarshipPaid = postMarkScholarshipPaid;
exports.postMarkDuesPaid = postMarkDuesPaid;
exports.getPendingScholarships = getPendingScholarships;
exports.getPendingDues = getPendingDues;
