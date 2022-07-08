import { Route, Redirect, Switch } from "react-router-dom";

import TeacherInfo from "../pages/TeacherInfo";
import Courses from "../pages/Courses";
import Advisees from "../pages/Advisees";
import DepartmentalIssues from "../pages/DepartmentIssues";
import HallIssues from "../pages/HallIssues";
import FeedbackComplaint from "../pages/FeedbackComplaint";

const TeacherRoutes = () => {
  return (
    <Switch>
      <Route path="/" exact>
        <TeacherInfo />
      </Route>
      <Route path="/teacherinfo" exact>
        <TeacherInfo />
      </Route>
      <Route path="/courses" exact>
        <Courses />
      </Route>
      <Route path="/advisees" exact>
        <Advisees />
      </Route>
      <Route path="/deptissues" exact>
        <DepartmentalIssues />
      </Route>
      <Route path="/hallissues" exact>
        <HallIssues />
      </Route>
      <Route path="/feedbackcomplaint" exact>
        <FeedbackComplaint />
      </Route>
      <Redirect to="/teacherinfo" />
    </Switch>
  );
};

export default TeacherRoutes;
