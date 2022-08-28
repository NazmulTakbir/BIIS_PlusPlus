import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import BookIcon from "@mui/icons-material/Book";

export const SidebarData = [
  {
    title: "Admin Info",
    icon: <PersonIcon />,
    link: "/admininfo",
  },
  {
    title: "Add Courses",
    icon: <CastForEducationIcon />,
    link: "/addcourses",
  },
  {
    title: "Add Course Offerings",
    icon: <LibraryBooksIcon />,
    link: "/addcourseofferings",
  },
  {
    title: "Add Students",
    icon: <PeopleIcon />,
    link: "/addstudents",
  },
  {
    title: "Add Teachers",
    icon: <WorkOutlineIcon />,
    link: "/addteachers",
  },
  {
    title: "Assign Course Teachers",
    icon: <AssignmentIndIcon />,
    link: "/assigncourseteachers",
  },
  {
    title: "Add Dues",
    icon: <AttachMoneyIcon />,
    link: "/adddues",
  },
  {
    title: "Add Scholarship",
    icon: <BookIcon />,
    link: "/addscholarship",
  },
  {
    title: "Upload Academic Calender",
    icon: <CalendarMonthIcon />,
    link: "/uploadacademiccalender",
  },
  {
    title: "Payment of Dues",
    icon: <AttachMoneyIcon />,
    link: "/paymentdues",
  },
  {
    title: "Payment of Scholarships",
    icon: <BookIcon />,
    link: "/paymentscholarships",
  },
  {
    title: "Upload Notice",
    icon: <BookIcon />,
    link: "/uploadnotice",
  },
];
