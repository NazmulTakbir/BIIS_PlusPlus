import { Route, Redirect, Switch } from "react-router-dom";

import TeacherInfo from "../pages/Info/TeacherInfo";

import AddGrades from "../pages/Exam/AddGrades";
import ViewGrades from "../pages/Exam/ViewGrades";
import Scrutinize from "../pages/Exam/Scrutinize";

import CourseRegistration from "../pages/Advisees/CourseRegistration";
import FeedbackComplaint from "../pages/Advisees/FeedbackComplaint";

import DepartmentalIssues from "../pages/Department Office/DepartmentIssues";
import HallIssues from "../pages/Hall Office/HallIssues";

const TeacherRoutes = () => {
  return (
    <Switch>
      <Route path="/" exact>
        <TeacherInfo />
      </Route>
      <Route path="/teacherinfo" exact>
        <TeacherInfo />
      </Route>

      <Route path="/exam/addgrades" exact>
        <AddGrades />
      </Route>
      <Route path="/exam/viewgrades" exact>
        <ViewGrades />
      </Route>
      <Route path="/exam/scrutinize" exact>
        <Scrutinize />
      </Route>

      <Route path="/advisees/courseregistration" exact>
        <CourseRegistration />
      </Route>
      <Route path="/advisees/feedback" exact>
        <FeedbackComplaint />
      </Route>

      <Route path="/deptissues" exact>
        <DepartmentalIssues />
      </Route>

      <Route path="/hallissues" exact>
        <HallIssues />
      </Route>

      <Redirect to="/teacherinfo" />
    </Switch>
  );
};

export default TeacherRoutes;
