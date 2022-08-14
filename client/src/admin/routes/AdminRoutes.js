import { Route, Redirect, Switch } from "react-router-dom";

import AdminInfo from "../pages/AdminInfo";
import AddCourses from "../pages/AddCourses";
import AddOffering from "../pages/AddOffering";
import AddStudents from "../pages/AddStudents";
import AssignCourseTeacher from "../pages/AssignCourseTeacher";
import AddTeachers from "./../pages/AddTeachers";
import AddDues from "./../pages/AddDues";
import AddScholarship from "./../pages/AddScholarship";
import UploadAcademicCalender from "./../pages/UploadAcademicCalender";

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
      <Route path="/addcourseofferings" exact>
        <AddOffering />
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
      <Route path="/adddues" exact>
        <AddDues />
      </Route>
      <Route path="/addscholarship" exact>
        <AddScholarship />
      </Route>      
      <Route path="/uploadacademiccalender" exact>
        <UploadAcademicCalender />
      </Route>
      <Redirect to="/admininfo" />
    </Switch>
  );
};

export default StudentRoutes;
