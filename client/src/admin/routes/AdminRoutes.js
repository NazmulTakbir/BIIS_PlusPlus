import { Route, Redirect, Switch } from "react-router-dom";

import AdminInfo from "../pages/AdminInfo";
import AddCourses from "../pages/AddCourses";
import AddStudents from "../pages/AddStudents";
import AssignCourseTeacher from "../pages/AssignCourseTeacher";
import AddTeachers from "./../pages/AddTeachers";

const StudentRoutes = () => {
  return (
    <Switch>
      <Route path="/" exact>
        <AdminInfo />
      </Route>
      <Route path="/admininfo" exact>
        <AdminInfo />
      </Route>
      <Route path="/addcourses" exact>
        <AddCourses />
      </Route>
      <Route path="/addstudents" exact>
        <AddStudents />
      </Route>
      <Route path="/addteachers" exact>
        <AddTeachers />
      </Route>
      <Route path="/assigncourseteachers" exact>
        <AssignCourseTeacher />
      </Route>
      <Redirect to="/admininfo" />
    </Switch>
  );
};

export default StudentRoutes;
