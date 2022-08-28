const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const mailController = require("../Shared/email");
const { v4: uuidv4 } = require("uuid");
const { generateScholarshipPDF } = require("../../util/GeneratePdf");

const allAttributes = ["student_id", "session_id", "scholarship_type_id"];

const createScholarship = async (data) => {
  const fileName = uuidv4() + ".pdf";
  const student_id = data[0];
  const session_id = data[1];
  const scholarship_type_id = data[2];

  let qeuryRes = await pool.query(
    'select t1.name, t2.scholarship_name, t2.amount \
     from student as t1, "scholarship type" as t2 where student_id=$1 \
     and scholarship_type_id=$2',
    [student_id, scholarship_type_id]
  );
  const fileData = qeuryRes.rows[0];
  generateScholarshipPDF(
    fileName,
    fileData["name"],
    student_id,
    fileData["scholarship_name"],
    fileData["amount"],
    session_id
  );

  await pool.query(
    `INSERT INTO public.scholarship(student_id, session_id, scholarship_state, scholarship_type_id, payment_date, application_file) \
    VALUES ($1, $2,'awaiting_application', $3, NULL, $4);`,
    [data[0], data[1], data[2], fileName]
  );

  let scholarship_info = await pool.query(
    'select scholarship_name, amount from public."scholarship type" \
    where scholarship_type_id = $1',
    [scholarship_type_id]
  );
  let description =
    "Eligible for " +
    scholarship_info.rows[0].scholarship_name +
    " scholarship" +
    " of Session " +
    data[1] +
    ". Amount: " +
    scholarship_info.rows[0].amount +
    " Taka";

  await pool.query("call insert_notification($1, $2, $3, $4, $5)", [
    "student",
    student_id,
    "Scholarship Made Available",
    new Date(),
    description,
  ]);

  let queryRes = await pool.query("select email from public.student where student_id = $1", [student_id]);
  const email = queryRes.rows[0].email;
  const subject = "BIISPLUSPLUS : Scholarship Made Available";
  description =
    "You are eligible for " +
    scholarship_info.rows[0].scholarship_name +
    " scholarship" +
    " of Session " +
    data[1] +
    ".\nAmount: " +
    scholarship_info.rows[0].amount +
    " BDT";
  description = "Dear Student,\n\n" + description + "\n\nRegards,\nBIISPLUSPLUS";
  description += "\n\nDo not reply to this email. This email is sent from a system that cannot receive email messages.";
  const text = description;
  mailController.sendMail(email, subject, text);
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

const postAddScholarship = async (req, res, next) => {
  try {
    const allData = req.body.data;
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
      await createScholarship(data);
    }

    res.status(201).json({ message: "postAddScholarship successful" });
  } catch (err) {
    console.log(err);
    const error = new HttpError("postAddScholarship failed", 500);
    return next(error);
  }
};

const postAddScholarshipSingle = async (req, res, next) => {
  try {
    const student_id = req.body.student_id;
    const session_id = req.body.session_id;
    const scholarship_type_id = req.body.scholarship_type_id;
    await createScholarship([student_id, session_id, scholarship_type_id]);
    res.status(201).json({ message: "postAddScholarshipSingle successful" });
  } catch (err) {
    console.log(err);
    const error = new HttpError("postAddScholarshipSingle failed", 500);
    return next(error);
  }
};

exports.postAddScholarship = postAddScholarship;
exports.getSampleFile = getSampleFile;
exports.postAddScholarshipSingle = postAddScholarshipSingle;
