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
    title: "Exam",
    icon: <LibraryBooksIcon />,
    link: "/exam/addgrades",
  },
  {
    title: "Advisees",
    icon: <PeopleIcon />,
    link: "/advisees/courseregistration",
  },
  {
    title: "Hall Issues",
    icon: <HomeIcon />,
    link: "/hallissues",
  },
  {
    title: "Department Issues",
    icon: <BusinessIcon />,
    link: "/deptissues",
  },
];
