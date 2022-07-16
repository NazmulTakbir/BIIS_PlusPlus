import { Route, Redirect, Switch } from "react-router-dom";

import StudentInfoHome from "../pages/StudentInfo/StudentInfoHome";
import StudentInfoClassRoutine from "../pages/StudentInfo/StudentInfoClassRoutine";
import StudentInfoAdvisor from "../pages/StudentInfo/StudentInfoAdvisor";

import CoursesRegister from "../pages/Courses/CoursesRegister";
import DuesPending from "../pages/Dues/DuesPending";
import ExamGrades from "../pages/Exam/ExamGrades";
import GeneralInfoAcademicCalender from "../pages/GeneralInfo/GeneralInfoAcademicCalender";
import ScholarshipAvailable from "../pages/Scholarship/ScholarshipAvailable";
import FeedbackComplaintNew from "../pages/FeedbackComplaint/FeedbackComplaintNew";

const StudentRoutes = () => {
  return (
    <Switch>
      <Route path="/" exact>
        <StudentInfoHome />
      </Route>

      <Route path="/studentinfo/home" exact>
        <StudentInfoHome />
      </Route>
      <Route path="/studentinfo/classroutine" exact>
        <StudentInfoClassRoutine />
      </Route>
      <Route path="/studentinfo/advisor" exact>
        <StudentInfoAdvisor />
      </Route>

      <Route path="/courses/register" exact>
        <CoursesRegister />
      </Route>
      <Route path="/courses/adddrop" exact>
        <CoursesRegister />
      </Route>

      <Route path="/exam/grades" exact>
        <ExamGrades />
      </Route>
      <Route path="/exam/routine" exact>
        <ExamGrades />
      </Route>
      <Route path="/exam/seatplan" exact>
        <ExamGrades />
      </Route>
      <Route path="/exam/guidelines" exact>
        <ExamGrades />
      </Route>

      <Route path="/dues/pending" exact>
        <DuesPending />
      </Route>
      <Route path="/dues/paid" exact>
        <DuesPending />
      </Route>

      <Route path="/generalinfo/academiccalender" exact>
        <GeneralInfoAcademicCalender />
      </Route>
      <Route path="/generalinfo/hallsupervisors" exact>
        <GeneralInfoAcademicCalender />
      </Route>
      <Route path="/generalinfo/notice" exact>
        <GeneralInfoAcademicCalender />
      </Route>

      <Route path="/scholarship/available" exact>
        <ScholarshipAvailable />
      </Route>
      <Route path="/scholarship/received" exact>
        <ScholarshipAvailable />
      </Route>
      <Route path="/scholarship/processing" exact>
        <ScholarshipAvailable />
      </Route>

      <Route path="/feedbackcomplaint/new" exact>
        <FeedbackComplaintNew />
      </Route>
      <Route path="/feedbackcomplaint/old" exact>
        <FeedbackComplaintNew />
      </Route>

      <Redirect to="/studentinfo/home" />
    </Switch>
  );
};

export default StudentRoutes;
