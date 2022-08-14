import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import HomeIcon from "@mui/icons-material/Home";

export const SidebarData = [
  {
    title: "Teacher Info",
    icon: <PersonIcon />,
    link: "/teacherinfo",
  },
  {
    title: "Courses",
    icon: <LibraryBooksIcon />,
    link: "/courses/all",
  },
  {
    title: "Advisees",
    icon: <PeopleIcon />,
    link: "/advisees/all",
  },
  {
    title: "Hall Provost Issues",
    icon: <HomeIcon />,
    link: "/hallissues",
  },
  {
    title: "Dept Head Issues",
    icon: <BusinessIcon />,
    link: "/deptStudents/all",
  },
];
