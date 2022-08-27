const SearchMenuData = [
  // Advisees
  {
    name: "My Advisees",
    value: "/advisees/all",
    roles: ["advisor"],
  },
  {
    name: "Advisee Course Registration Requests",
    value: "/advisees/courseregistration",
    roles: ["advisor"],
  },
  {
    name: "Advisee Feedbacks",
    value: "/advisees/feedback",
    roles: ["advisor"],
  },

  // Courses
  {
    name: "My Courses",
    value: "/courses/all",
    roles: [],
  },
  {
    name: "Courses Coordinated",
    value: "/courses/coordinated",
    roles: [],
  },
  {
    name: "Courses Taught",
    value: "/courses/taught",
    roles: [],
  },
  {
    name: "Courses Scrutinized",
    value: "/courses/scrutinized",
    roles: [],
  },
  {
    name: "Course Feedbacks",
    value: "/courses/feedbacks",
    roles: [],
  },

  // Department Office
  {
    name: "Department: All Students",
    value: "/deptStudents/all",
    roles: ["depthead"],
  },
  {
    name: "Departmental Course Registration Requests",
    value: "/deptStudents/courseregistration",
    roles: ["depthead"],
  },
  {
    name: "Departmental Feedbacks",
    value: "/deptStudents/feedback",
    roles: ["depthead"],
  },
  {
    name: "Departmental Scholarship",
    value: "/deptStudents/scholarship",
    roles: ["depthead"],
  },

  // Hall Office
  {
    name: "Hall: All Students",
    value: "/hallissues/allstudents",
    roles: ["hallprovost"],
  },
  {
    name: "Hall: Pending Scholarships",
    value: "/hallissues/scholarships/pending",
    roles: ["hallprovost"],
  },
  {
    name: "Hall: All Scholarships",
    value: "/hallissues/scholarships/processing",
    roles: ["hallprovost"],
  },
  {
    name: "Hall: Pending Exam Results",
    value: "/hallissues/results/pending",
    roles: ["hallprovost"],
  },

  // Teacher Info
  {
    name: "My Profile/Info",
    value: "/teacherinfo",
    roles: [],
  },

  // Exam Controller
  {
    name: "Exam Controller Issues",
    value: "/examcontroller/pendingresults",
    roles: ["examcontroller"],
  },
];

const getSearchBarData = (roles) => {
  let data = [];
  for (let i = 0; i < SearchMenuData.length; i++) {
    let authorized = true;
    for (let j = 0; j < SearchMenuData[i].roles.length; j++) {
      if (!roles.includes(SearchMenuData[i].roles[j])) {
        authorized = false;
        break;
      }
    }
    if (authorized) {
      data.push(SearchMenuData[i]);
    }
  }
  return data;
};

exports.getSearchBarData = getSearchBarData;
