import React from 'react'
import PersonIcon from '@mui/icons-material/Person';
import InfoIcon from '@mui/icons-material/Info';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PaidIcon from '@mui/icons-material/Paid';
import FeedbackIcon from '@mui/icons-material/Feedback';


export const SidebarData = [
    {
        title: "Student Info",
        icon: <PersonIcon />,
        link: "/studentInfo"
    },
    {
        title: "Courses",
        icon: <LibraryBooksIcon />,
        link: "/courses"
    },
    {
        title: "Exam",
        icon: <BorderColorIcon />,
        link: "/Exam"
    },
    {
        title: "Scholarship",
        icon: <PaidIcon />,
        link: "/scholarship"
    },
    {
        title: "General Info",
        icon: <InfoIcon />,
        link: "/generalInfo"
    },
    {
        title: "Dues and Loans",
        icon: <AttachMoneyIcon />,
        link: "/duesAndLoans"
    },
    {
        title: "Award of Degree",
        icon: <EmojiEventsIcon />,
        link: "/awardOfDegree"
    },
    {
        title: "Feedback/Complain",
        icon: <FeedbackIcon />,
        link: "/feedback"
    },                
]