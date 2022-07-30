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
          data.push(allData[rowNo][allAttributes[columnNo]]);
        } else {
          data.push(null);
        }
      }
      await createTeacher(data);
    }

    res.status(201).json({ message: "postAddTeacher successful" });
  } catch (err) {
    const error = new HttpError("postAddTeacher failed", 500);
    return next(error);
  }
};

exports.postAddTeacher = postAddTeacher;
