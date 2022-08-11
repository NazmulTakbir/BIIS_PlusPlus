const pool = require("../db");

const getCurrentSession = async () => {
  const today = new Date();
  const queryRes = await pool.query(
    "select session_id from session where start_date<=$1::date and \
                    end_date>=$1::date",
    [today]
  );
  return queryRes.rows[0]["session_id"];
};

exports.getCurrentSession = getCurrentSession;
