const pool = require("../../db");

const getStudentResults = async (studentList, offeringID) => {
  // get total marks obtained by student in course offering
  let data = [];
  for (let i = 0; i < studentList.length; i++) {
    let student_id = studentList[i]["student_id"];
    let queryRes = await pool.query("select * from students_total_marks where student_id=$1 and offering_id=$2", [
      student_id,
      offeringID,
    ]);
    data.push(queryRes.rows[0]);
  }

  // get grade distribution policy of course offering
  let queryRes = await pool.query('select * from "grade distribution policy" where offering_id=$1', [offeringID]);
  const gradingPolicy = queryRes.rows;

  // get letter grade and grade point of students
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < gradingPolicy.length; j++) {
      const obtained_marks = data[i]["obtained_marks"];
      const upper_bound = gradingPolicy[j]["upper_bound"];
      const lower_bound = gradingPolicy[j]["lower_bound"];

      if (obtained_marks > lower_bound && obtained_marks <= upper_bound) {
        data[i]["letter_grade"] = gradingPolicy[j]["letter_grade"];
        data[i]["grade_point"] = gradingPolicy[j]["grade_point"];
      }
    }
  }

  return data;
};

exports.getStudentResults = getStudentResults;
