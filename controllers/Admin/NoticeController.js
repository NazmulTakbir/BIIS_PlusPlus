const { query } = require("express");
const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const session_id = require("../../placeHolder");

const essentialAttributes = [];

const allAttributes = ["description", "file_path", "upload_date"];

const createNotice = async (data) => {
  await pool.query("INSERT INTO public.notice(description, file_path, upload_date) VALUES ($1, $2, $3)", data);
};

const postAddNotice = async (req, res, next) => {
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
      await createNotice(data);
    }

    res.status(201).json({ message: "postAddNotice successful" });
  } catch (err) {
    const error = new HttpError("postAddNotice failed", 500);
    return next(error);
  }
};

exports.postAddNotice = postAddNotice;
