const HttpError = require("../../models/HttpError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getAuthData } = require("./AuthData");

const postLogin = async (req, res, next) => {
  try {
    const { id, password } = req.body;
    const authData = await getAuthData(id);

    if (authData !== "invalid") {
      let isValidPassword = false;
      try {
        isValidPassword = await bcrypt.compare(password, authData["password"]);
      } catch (err) {
        res.json({ message: "wrong password" });
      }

      if (!isValidPassword) {
        res.json({ message: "wrong password" });
      } else {
        const token = jwt.sign({ id: id, userType: authData["userType"] }, "supersecret_dont_share", {
          expiresIn: "1h",
        });
        res.json({
          message: "logged in",
          id: id,
          userType: authData["userType"],
          token: token,
        });
      }
    } else {
      res.json({ message: "invalid user id" });
    }
  } catch (err) {
    const error = new HttpError("login failed", 500);
    return next(error);
  }
};

exports.postLogin = postLogin;
