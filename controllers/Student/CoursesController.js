const pool = require("../../db");
const HttpError = require("../../models/HttpError");
const session_id = require("../../placeHolder");


//utils methos
const get_dept_level_term = async (sid) => {
  let queryRes = await pool.query(
    'SELECT dept_id  , level , term from student where student_id = $1',
    [sid]
  );

  var returnedObject = {};
  returnedObject["dept_id"] = queryRes.rows[0]["dept_id"];
  returnedObject["level"] = queryRes.rows[0]["level"];
  returnedObject["term"] = queryRes.rows[0]["term"];
  //console.log(returnedObject);
  return returnedObject;
}


const getRegisteredCourses = async (req, res, next) => {
  try {
    let queryRes = await pool.query(
      'SELECT offering_id from "course registration" where student_id = $1 and session_id = $2',
      [req.params.sid, session_id]
    );

    const registeredCourses = {};
    for (const element of queryRes.rows) {
      const offeringID = element["offering_id"];
      queryRes = await pool.query('SELECT course_id from "course offering" where offering_id = $1', [offeringID]);
      const courseID = queryRes.rows[0]["course_id"];

      queryRes = await pool.query("SELECT course_name, credits from course where course_id = $1", [courseID]);
      registeredCourses[courseID] = {
        course_name: queryRes.rows[0]["course_name"],
        credits: queryRes.rows[0]["credits"],
      };
    }

    res.json(registeredCourses);
  } catch (err) {
    const error = new HttpError("Fetching Registered Courses Failed", 500);
    return next(error);
  }
};

const getCoursesToAdd = async (req, res, next) => {
  try {
    // TODO: get courses in this session for which no previous request has been placed
    // filter by dept, term, level

    // response should specify if it is first add request of the term. then it is basically normal
    // course registration
    const sid = req.params.sid;
    const dept_id  = (await get_dept_level_term(sid)).dept_id;
    const level = (await get_dept_level_term(sid)).level;
    const term = (await get_dept_level_term(sid)).term;

    //console.log(dept_id , level , term , sid);
    let queryRes = await pool.query(
      ' \
      select t1.course_id , t1.course_name , t1.credits from \
      (select distinct c.course_id , c.course_name , c.credits \
      from course as c , "course offering" as co \
      where c.course_id = co.course_id and c.offered_to_dept_id = $1 \
      and c.level = $2 and c.term = $3 and co.session_id = $4 \
      ) as t1 ,\
      (select distinct c.course_id , c.course_name , c.credits \
        from course as c , "course offering" as co ,"registration request" as rr\
        where c.course_id = co.course_id and c.offered_to_dept_id = $1 \
        and c.level = $2 and c.term = $3 and co.session_id = $4 \
        and rr.student_id = $5 and rr.offering_id = co.offering_id) as t2 \
        where t1.course_id <> t2.course_id',
        [dept_id , level , term , session_id , sid]
    );
    //console.log(queryRes);
    course_list = []
    for(const element of queryRes.rows){
      course_obj = {};
      course_obj["course_id"] = element["course_id"];
      course_obj["course_name"] = element["course_name"];
      course_obj["credits"] = element["credits"];
      course_list.push(course_obj);
    }
    
    res.status(201).json({ message: "getCoursesToAdd" , course_list:course_list});
  } catch (err) {
    const error = new HttpError("Fetching Courses to Add Failed", 500);
    return next(error);
  }
};

const getCoursesToDrop = async (req, res, next) => {
  try {
    // TODO: get courses added in this session
    const sid = req.params.sid;
    const dept_id  = (await get_dept_level_term(sid)).dept_id;
    const level = (await get_dept_level_term(sid)).level;
    const term = (await get_dept_level_term(sid)).term;
    const type = "add";

    let queryRes = await pool.query(
      'select c.course_id , c.course_name , c.credits \
      from \
      (select count(offering_id) , offering_id from "registration request" \
            where student_id = $1 \
          group by offering_id) as tmp , "course offering" as co , course as c \
          where tmp.count = 1 and tmp.offering_id = co.offering_id and co.course_id = c.course_id \
          and c.level = $2 and c.term = $3 and c.offered_to_dept_id = $4 ',
      [sid , level , term  , dept_id]
    )
    //console.log(queryRes.rows);
    course_list = []
    for(const element of queryRes.rows){
      course_obj = {};
      course_obj["course_id"] = element["course_id"];
      course_obj["course_name"] = element["course_name"];
      course_obj["credits"] = element["credits"];
      course_list.push(course_obj);
    }
    res.status(201).json({ message: "getCoursesToDrop" , course_list:course_list});
  } catch (err) {
    const error = new HttpError("Fetching Courses to Drop Failed", 500);
    return next(error);
  }
};

const postAddRequest = async (req, res, next) => {
  try {
    placeHolder = {
      addID: 1,
    };

    // const { addID } = req.body;
    const { addID } = placeHolder;

    let queryRes = await pool.query('select * from "registration request" where offering_id = $1 and student_id = $2', [
      addID,
      req.params.sid,
    ]);

    if (queryRes.rowCount > 0) {
      res.status(201).json({ message: "Cannot Add. Course Previously Requested", id: addID });
    } else {
      await pool.query(
        'INSERT INTO "registration request" (student_id, offering_id, request_type, reg_status) VALUES($1, $2, $3, $4)',
        [req.params.sid, addID, "add", "awaiting_advisor"]
      );
      res.status(201).json({ message: "Placed Add Request", id: addID });
    }
  } catch (err) {
    const error = new HttpError("Failed to Place Add Request", 500);
    return next(error);
  }
};

const postDropRequest = async (req, res, next) => {
  try {
    placeHolder = {
      dropID: 1,
    };

    // const { dropID } = req.body;
    const { dropID } = placeHolder;

    let queryRes = await pool.query('select * from "registration request" where offering_id = $1 and student_id = $2', [
      dropID,
      req.params.sid,
    ]);

    if (queryRes.rowCount == 0) {
      res.status(201).json({ message: "Cannot Drop. Course Offering Not Requested Previously", id: dropID });
    } else if (queryRes.rowCount == 1) {
      await pool.query(
        'INSERT INTO "registration request" (student_id, offering_id, request_type, reg_status) VALUES($1, $2, $3, $4)',
        [req.params.sid, dropID, "drop", "awaiting_advisor"]
      );
      res.status(201).json({ message: "Placed Drop Request", id: dropID });
    } else if (queryRes.rowCount == 2) {
      res.status(201).json({ message: "Cannot Drop. Course Offering Already Dropped", id: dropID });
    }
  } catch (err) {
    const error = new HttpError("Failed to Place Drop Request", 500);
    return next(error);
  }
};

exports.getRegisteredCourses = getRegisteredCourses;
exports.postAddRequest = postAddRequest;
exports.postDropRequest = postDropRequest;
exports.getCoursesToAdd = getCoursesToAdd;
exports.getCoursesToDrop = getCoursesToDrop;
