import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import InfoIcon from "@mui/icons-material/Info";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PaidIcon from "@mui/icons-material/Paid";
import FeedbackIcon from "@mui/icons-material/Feedback";

export const SidebarData = [
  {
    title: "Student Info",
    icon: <PersonIcon />,
    link: "/studentinfo/home",
  },
  {
    title: "Courses",
    icon: <LibraryBooksIcon />,
    link: "/courses/register",
  },
  {
    title: "Exam",
    icon: <BorderColorIcon />,
    link: "/exam/grades",
  },
  {
    title: "Scholarship",
    icon: <PaidIcon />,
    link: "/scholarship/available",
  },
  {
    title: "General Info",
    icon: <InfoIcon />,
    link: "/generalinfo/academiccalender",
  },
  {
    title: "Dues",
    icon: <AttachMoneyIcon />,
    link: "/dues/pending",
  },
  {
    title: "Feedback/Complain",
    icon: <FeedbackIcon />,
    link: "/feedbackcomplaint/new",
  },
];
