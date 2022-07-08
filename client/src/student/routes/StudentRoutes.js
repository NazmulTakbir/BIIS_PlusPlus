import { Route, Redirect, Switch } from "react-router-dom";

import StudentInfo from "../pages/StudentInfo";
import Courses from "../pages/Courses";
import Dues from "../pages/Dues";
import Exam from "../pages/Exam";
import GeneralInfo from "../pages/GeneralInfo";
import Scholarship from "../pages/Scholarship";
import FeedbackComplaint from "../pages/FeedbackComplaint";

const StudentRoutes = () => {
  return (
    <Switch>
      <Route path="/" exact>
        <StudentInfo />
      </Route>
      <Route path="/studentinfo" exact>
        <StudentInfo />
      </Route>
      <Route path="/courses" exact>
        <Courses />
      </Route>
      <Route path="/exam" exact>
        <Exam />
      </Route>
      <Route path="/dues" exact>
        <Dues />
      </Route>
      <Route path="/generalinfo" exact>
        <GeneralInfo />
      </Route>
      <Route path="/scholarship" exact>
        <Scholarship />
      </Route>
      <Route path="/feedbackcomplaint" exact>
        <FeedbackComplaint />
      </Route>
      <Redirect to="/studentinfo" />
    </Switch>
  );
};

export default StudentRoutes;
