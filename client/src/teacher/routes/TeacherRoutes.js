import { Route, Redirect, Switch } from "react-router-dom";

import TeacherInfo from "../pages/Info/TeacherInfo";

import AllCourses from "../pages/Courses/AllCourses";
import AddGrades from "../pages/Courses/CourseDetail/AddGrades";
import ViewGrades from "../pages/Courses/CourseDetail/ViewGrades";
import Scrutinize from "../pages/Courses/CourseDetail/Scrutinize";

import AdviseeCourseRegistration from "../pages/Advisees/CourseRegistration";
import AdviseeFeedback from "../pages/Advisees/Feedback";
import AdviseeList from "../pages/Advisees/AdviseeList";
import AdviseeInfo from "../pages/Advisees/AdviseeProfile/Info";
import AdviseeAcademic from "../pages/Advisees/AdviseeProfile/Academic";
import AdviseeRegistration from "../pages/Advisees/AdviseeProfile/Registration";

import DeptStudentList from "../pages/Department_Office/StudentList";
import DeptCourseRegistration from "../pages/Department_Office/CourseRegistration";
import DeptFeedback from "../pages/Department_Office/Feedback";

import DeptStudentInfo from "../pages/Department_Office/StudentProfile/Info";
import DeptStudentAcademic from "../pages/Department_Office/StudentProfile/Academic";
import DeptStudentRegistration from "../pages/Department_Office/StudentProfile/Registration";
import DeptStudentScholarships from "../pages/Department_Office/StudentProfile/Scholarships";


import HallPendingScholarships from "../pages/Hall Office/PendingScholarships";
import HallPendingResults from "../pages/Hall Office/PendingResults";
import HallAllScholarships from "../pages/Hall Office/AllScholarships";
import MemberInfo from "../pages/Hall Office/HallMembers/MemberInfo";
import MemberAcademics from "../pages/Hall Office/HallMembers/MemberAcademics";
import ScholarshipAction from "../pages/Hall Office/HallMembers/ScholarshipAction";
import HallStudentDues from "../pages/Hall Office/HallMembers/Dues";
import HallStudentResults from "../pages/Hall Office/HallMembers/Results";
import ScholarshipsHead from "../pages/Department_Office/ScholarshipsHead";

import HallStudentList from "../pages/Hall Office/StudentList";


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
        <AdviseeCourseRegistration />
      </Route>
      <Route path="/advisees/all" exact>
        <AdviseeList />
      </Route>
      <Route path="/advisees/feedback" exact>
        <AdviseeFeedback />
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

      <Route path="/deptStudents/courseregistration" exact>
        <DeptCourseRegistration />
      </Route>
      <Route path="/deptStudents/all" exact>
        <DeptStudentList />
      </Route>
      <Route path="/deptStudents/feedback" exact>
        <DeptFeedback />
      </Route>
      <Route path="/deptStudents/scholarship" exact>
        <ScholarshipsHead />
      </Route>      
      <Route path="/deptStudents/profile/info/:studentID" exact>
        <DeptStudentInfo />
      </Route>
      <Route path="/deptStudents/profile/academic/:studentID" exact>
        <DeptStudentAcademic />
      </Route>
      <Route path="/deptStudents/profile/registration/:studentID" exact>
        <DeptStudentRegistration />
      </Route>
      <Route path="/deptStudents/profile/scholarships/:studentID" exact>
        <DeptStudentScholarships />
      </Route>      

      <Route path="/hallissues/scholarships/pending" exact>
        <HallPendingScholarships />
      </Route>
      <Route path="/hallissues/results/pending" exact>
        <HallPendingResults />
      </Route>

      <Route path="/hallissues/profile/info/:studentID" exact>
        <MemberInfo />
      </Route>
      <Route path="/hallissues/profile/academic/:studentID" exact>
        <MemberAcademics />
      </Route>
      <Route path="/hallissues/profile/scholarship/:studentID" exact>
        <ScholarshipAction />
      </Route>
      <Route path="/hallissues/profile/dues/:studentID" exact>
        <HallStudentDues />
      </Route>
      <Route path="/hallissues/profile/results/:studentID" exact>
        <HallStudentResults />
      </Route>

      <Route path="/hallissues/scholarships/processing" exact>
        <HallAllScholarships />
      </Route>

      <Route path="/hallissues/allstudents" exact>
        <HallStudentList />
      </Route>

      <Redirect to="/teacherinfo" />
    </Switch>
  );
};

export default TeacherRoutes;
