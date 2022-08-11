import { Route, Redirect, Switch } from "react-router-dom";

import TeacherInfo from "../pages/Info/TeacherInfo";

import AllCourses from "../pages/Courses/AllCourses";
import AddGrades from "../pages/Courses/CourseDetail/AddGrades";
import ViewGrades from "../pages/Courses/CourseDetail/ViewGrades";
import Scrutinize from "../pages/Courses/CourseDetail/Scrutinize";

import CourseRegistration from "../pages/Advisees/CourseRegistration";
import Feedback from "../pages/Advisees/Feedback";
import AdviseeInfo from "../pages/Advisees/AdviseeProfile/Info";
import AdviseeAcademic from "../pages/Advisees/AdviseeProfile/Academic";
import AdviseeRegistration from "../pages/Advisees/AdviseeProfile/Registration";
import AdviseeList from "../pages/Advisees/AdviseeList";

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

      <Route path="/courses/all" exact>
        <AllCourses />
      </Route>
      <Route path="/courses/addgrades" exact>
        <AddGrades />
      </Route>
      <Route path="/courses/viewgrades" exact>
        <ViewGrades />
      </Route>
      <Route path="/courses/scrutinize" exact>
        <Scrutinize />
      </Route>

      <Route path="/advisees/courseregistration" exact>
        <CourseRegistration />
      </Route>
      <Route path="/advisees/all" exact>
        <AdviseeList />
      </Route>
      <Route path="/advisees/feedback" exact>
        <Feedback />
      </Route>
      <Route path="/advisees/profile/info/:studentID" exact>
        <AdviseeInfo />
      </Route>
      <Route path="/advisees/profile/academic/:studentID" exact>
        <AdviseeAcademic />
      </Route>
      <Route path="/advisees/profile/registration/:studentID" exact>
        <AdviseeRegistration />
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
