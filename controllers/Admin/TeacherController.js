const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const session_id = require("../../placeHolder");

const essentialAttributes = [];

const allAttributes = ["teacher_id", "dept_id", "name", "room_no", "office_phone", "cell_phone", "email", "link"];

const createTeacher = async (data) => {
  await pool.query(
    "INSERT INTO public.teacher(teacher_id, dept_id, name, room_no, office_phone, cell_phone, email, link) \
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
    data
  );
};

const postAddTeacher = async (req, res, next) => {
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
      await createTeacher(data);
    }

    res.status(201).json({ message: "postAddTeacher successful" });
  } catch (err) {
    console.log(err);
    const error = new HttpError("postAddTeacher failed", 500);
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

const getnextid = async (req, res, next) => {
  try {
    let queryRes = await pool.query(" select MAX(teacher_id) from public.teacher");
    let nextid = queryRes.rows[0].max + 1;

    res.json({ message: "getnextid successful", nextid: nextid });
  } catch (err) {
    console.log(err);
    const error = new HttpError("getnextid failed", 500);
    return next(error);
  }
};

exports.getSampleFile = getSampleFile;
exports.getnextid = getnextid;
exports.postAddTeacher = postAddTeacher;
