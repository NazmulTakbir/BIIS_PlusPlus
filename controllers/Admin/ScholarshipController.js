const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const mailController = require("../Shared/email");

const allAttributes = ["student_id", "session_id", "scholarship_type_id"];

const createScholarship = async (data) => {
  await pool.query(
    `INSERT INTO public.scholarship(student_id, session_id, scholarship_state, scholarship_type_id, payment_date) \
    VALUES ($1, $2,'awaiting_application', $3, NULL);`,
    data
  );

  const student_id = data[0];
  const scholarship_type = data[2];

  let queryRes = await pool.query(
    'select scholarship_name, amount from public."scholarship type" \
    where scholarship_type_id = $1',
    [scholarship_type]
  );
  let description =
    "Eligible for " +
    queryRes.rows[0].scholarship_name + " scholarship" +
    " of Session " +
    data[1] +
    ". Amount: " +
    queryRes.rows[0].amount +
    " Taka";

  await pool.query("call insert_notification($1, $2, $3, $4, $5)", [
    "student",
    student_id,
    "Scholarship Made Available",
    new Date(),
    description,
  ]);

  queryRes = await pool.query('select email from public.student where student_id = $1', [student_id]);
  const email = queryRes.rows[0].email;
  const subject = "BIISPLUSPLUS : Scholarship Made Available";
  description += + "\n\nThank you."
  + "\nDo not reply to this email. This email is sent from a system that cannot receive email messages." 
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

exports.postAddScholarship = postAddScholarship;
exports.getSampleFile = getSampleFile;
