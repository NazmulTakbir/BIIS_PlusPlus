import { Route, Redirect, Switch } from "react-router-dom";

import StudentInfoHome from "../pages/StudentInfo/StudentInfoHome";
import StudentInfoClassRoutine from "../pages/StudentInfo/StudentInfoClassRoutine";
import StudentInfoAdvisor from "../pages/StudentInfo/StudentInfoAdvisor";

import CoursesRegistered from "../pages/Courses/CoursesRegistered";
import CoursesAdd from "../pages/Courses/CoursesAdd";
import CoursesDrop from "../pages/Courses/CoursesDrop";
import CoursesPending from "../pages/Courses/CoursesPending";

import DuesPending from "../pages/Dues/DuesPending";
import DuesPaid from "../pages/Dues/DuesPaid";

import ExamGrades from "../pages/Exam/ExamGrades";
import ExamRoutine from "../pages/Exam/ExamRoutine";
import ExamSeatplan from "../pages/Exam/ExamSeatplan";
import ExamGuidelines from "../pages/Exam/ExamGuidelines";

import GeneralInfoAcademicCalender from "../pages/GeneralInfo/GeneralInfoAcademicCalender";
import GeneralInfoHallSupervisor from "../pages/GeneralInfo/GeneralInfoHallSupervisor";
import GeneralInfoNotice from "../pages/GeneralInfo/GeneralInfoNotice";

import ScholarshipAvailable from "../pages/Scholarship/ScholarshipAvailable";
import ScholarshipProcessing from "../pages/Scholarship/ScholarshipProcessing";
import ScholarshipReceived from "../pages/Scholarship/ScholarshipReceived";

import FeedbackNew from "../pages/Feedback/FeedbackNew";
import FeedbackOld from "../pages/Feedback/FeedbackOld";
import CourseFeedback from "../pages/Feedback/CourseFeedback";

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

      <Route path="/courses/registered" exact>
        <CoursesRegistered />
      </Route>
      <Route path="/courses/pending" exact>
        <CoursesPending />
      </Route>
      <Route path="/courses/add" exact>
        <CoursesAdd />
      </Route>
      <Route path="/courses/drop" exact>
        <CoursesDrop />
      </Route>

      <Route path="/exam/grades" exact>
        <ExamGrades />
      </Route>
      <Route path="/exam/routine" exact>
        <ExamRoutine />
      </Route>
      <Route path="/exam/seatplan" exact>
        <ExamSeatplan />
      </Route>
      <Route path="/exam/guidelines" exact>
        <ExamGuidelines />
      </Route>

      <Route path="/dues/pending" exact>
        <DuesPending />
      </Route>
      <Route path="/dues/paid" exact>
        <DuesPaid />
      </Route>

      <Route path="/generalinfo/academiccalender" exact>
        <GeneralInfoAcademicCalender />
      </Route>
      <Route path="/generalinfo/hallsupervisors" exact>
        <GeneralInfoHallSupervisor />
      </Route>
      <Route path="/generalinfo/notice" exact>
        <GeneralInfoNotice />
      </Route>

      <Route path="/scholarship/available" exact>
        <ScholarshipAvailable />
      </Route>
      <Route path="/scholarship/received" exact>
        <ScholarshipReceived />
      </Route>
      <Route path="/scholarship/processing" exact>
        <ScholarshipProcessing />
      </Route>

      <Route path="/feedback/new" exact>
        <FeedbackNew />
      </Route>
      <Route path="/feedback/old" exact>
        <FeedbackOld />
      </Route>
      <Route path="/feedback/course" exact>
        <CourseFeedback />
      </Route>

      <Redirect to="/studentinfo/home" />
    </Switch>
  );
};

export default StudentRoutes;
