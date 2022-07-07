const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const PORT = process.env.PORT || 5000;
const path = require("path");

//middleware
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use("/", express.static(path.join(__dirname, "client/build")));
}

app.get("/depts", async (req, res) => {
  try {
    const allDepts = await pool.query("SELECT * from public.Department");
    res.json(allDepts.rows);
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(PORT, () => {
  console.log(`server has started on port ${PORT}`);
});
