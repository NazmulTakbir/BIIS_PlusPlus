import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import PeopleIcon from "@mui/icons-material/People";

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
];
