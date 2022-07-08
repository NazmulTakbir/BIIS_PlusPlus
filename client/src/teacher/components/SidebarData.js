import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import HomeIcon from "@mui/icons-material/Home";
import FeedbackIcon from "@mui/icons-material/Feedback";

export const SidebarData = [
  {
    title: "Teacher Info",
    icon: <PersonIcon />,
    link: "/teacherinfo",
  },
  {
    title: "Courses",
    icon: <LibraryBooksIcon />,
    link: "/courses",
  },
  {
    title: "Advisees",
    icon: <PeopleIcon />,
    link: "/advisees",
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
  {
    title: "Feedback/Complain",
    icon: <FeedbackIcon />,
    link: "/feedbackcomplaint",
  },
];
