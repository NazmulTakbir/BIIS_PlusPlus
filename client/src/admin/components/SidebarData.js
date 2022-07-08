import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import FeedbackIcon from "@mui/icons-material/Feedback";

export const SidebarData = [
  {
    title: "Admin Info",
    icon: <PersonIcon />,
    link: "/admininfo",
  },
  {
    title: "Add Courses",
    icon: <LibraryBooksIcon />,
    link: "/addcourses",
  },
  {
    title: "Add Students",
    icon: <PeopleIcon />,
    link: "/addstudents",
  },
  {
    title: "Add Teachers",
    icon: <PeopleIcon />,
    link: "/addteachers",
  },
  {
    title: "Assign Course Teachers",
    icon: <AssignmentIndIcon />,
    link: "/assigncourseteachers",
  },
];
