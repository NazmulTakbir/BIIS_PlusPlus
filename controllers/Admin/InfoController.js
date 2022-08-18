const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const session_id = require("../../placeHolder");

//async function getAdminInfo
const getAdminInfo = async (req, res, next) => {

    console.log(req.userData);

    if(req.userData.userType === "comptroller admin"){
        try {
            let queryRes = await pool.query(
                `SELECT * FROM "comptroller admin" WHERE comptroller_admin_id = $1`, [req.userData.id]
            );
            console.log(queryRes.rows[0]);
            res.json({ message: "getAdminInfo successful", ProfileData: queryRes.rows[0] });
        } catch (err) {
            const error = new HttpError("getAdminInfo failed", 500);
            return next(error);
        }
    }
    else if (req.userData.userType === "office admin"){
        try {
            let queryRes = await pool.query(
                `SELECT * FROM "office admin" WHERE office_admin_id = $1`, [req.userData.id]
            );
            res.json({ message: "getAdminInfo successful", ProfileData: queryRes.rows[0] });
        } catch (err) {
            const error = new HttpError("getAdminInfo failed", 500);
            return next(error);
        }
    }
    else if (req.userData.userType === "department admin"){
        try {
            let queryRes = await pool.query(
                `SELECT d.dept_name,da.name FROM "department admin" as da, department as d WHERE da.dept_admin_id = $1\
                and d.dept_id = da.dept_id`, [req.userData.id]
            );
            res.json({ message: "getAdminInfo successful", ProfileData: queryRes.rows[0] });
        } catch (err) {
            const error = new HttpError("getAdminInfo failed", 500);
            return next(error);
        }
    }
    else if (req.userData.userType === "hall admin"){
        try {
            let queryRes = await pool.query(
                `SELECT ha.name , h.hall_name FROM "hall admin" as ha,hall as h WHERE hall_admin_id = $1\
                and h.hall_id = ha.hall_id`, [req.userData.id]
            );
            res.json({ message: "getAdminInfo successful", ProfileData: queryRes.rows[0] });
        } catch (err) {
            const error = new HttpError("getAdminInfo failed", 500);
            return next(error);
        }
    }

}

exports.getAdminInfo = getAdminInfo;