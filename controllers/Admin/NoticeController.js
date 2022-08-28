const { v4: uuidv4 } = require("uuid");
const pool = require("../../db");
const HttpError = require("../../models/HttpError");

const postAddNotice = async (req, res, next) => {
  try {
    if (req.files === null) {
      return res.status(400).json({ msg: "No file uploaded" });
    }
    const file = req.files.file;

    const fileName = uuidv4() + ".pdf";
    const subject = req.body.subject;

    file.mv(`${__dirname}/../../uploads/notices/${fileName}`, (err) => {
      if (err) {
        console.error(err);
      }
    });

    await pool.query("INSERT INTO public.notice(description, file_path, upload_date) VALUES ($1, $2, $3)", [
      subject,
      fileName,
      new Date(),
    ]);

    res.json({ "message: ": "Notice uploaded successfully" });
  } catch (err) {
    console.log(err);
    const error = new HttpError("postAddNotice failed", 500);
    return next(error);
  }
};

exports.postAddNotice = postAddNotice;
