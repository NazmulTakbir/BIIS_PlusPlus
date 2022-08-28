const SearchMenuData = [
  {
    name: "My Information (Home)",
    value: "/admininfo",
    userType: ["hall admin", "department admin", "office admin", "comptroller admin"],
  },
  {
    name: "Add Courses",
    value: "/addcourses",
    userType: ["department admin"],
  },
  {
    name: "Add Course Offerings",
    value: "/addcourseofferings",
    userType: ["department admin"],
  },
  {
    name: "Add Students",
    value: "/addstudents",
    userType: ["hall admin"],
  },
  {
    name: "Add Teachers",
    value: "/addteachers",
    userType: ["department admin"],
  },
  {
    name: "Assign Course Teachers",
    value: "/assigncourseteachers",
    userType: ["department admin"],
  },
  {
    name: "Add Dues",
    value: "/adddues",
    userType: ["hall admin"],
  },
  {
    name: "Add Scholarship",
    value: "/addscholarship",
    userType: ["hall admin"],
  },
  {
    name: "Upload Academic Calender",
    value: "/uploadacademiccalender",
    userType: ["office admin"],
  },
  {
    name: "Payment of Dues",
    value: "/paymentdues",
    userType: ["comptroller admin"],
  },
  {
    name: "Payment of Scholarships",
    value: "/paymentscholarships",
    userType: ["comptroller admin"],
  },
  {
    name: "Upload Notice",
    value: "/uploadnotice",
    userType: ["office admin"],
  },
];

const getSearchBarData = (userType) => {
  let data = [];
  for (let i = 0; i < SearchMenuData.length; i++) {
    if (SearchMenuData[i].userType.includes(userType)) {
      data.push(SearchMenuData[i]);
    }
  }
  return data;
};

exports.getSearchBarData = getSearchBarData;
