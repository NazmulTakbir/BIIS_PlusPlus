import React, { useState, useCallback } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import StudentRoutes from "./student/routes/StudentRoutes";
// import TeacherRoutes from "./teacher/routes/TeacherRoutes";
import AdminRoutes from "./admin/routes/AdminRoutes";
import UnauthenticatedRoutes from "./shared/routes/UnauthenticatedRoutes";

import "./App.css";

// import Auth from "./user/pages/Auth";
import { AuthContext } from "./shared/context/AuthContext";

const App = () => {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(false);

  const login = useCallback((uid, token) => {
    setToken(token);
    setUserId(uid);
  }, []); // second argument empty implies function will be initiated only once

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
  }, []);

  let routes;
  let userType = "teacher";
  if (token || true) {
    if (userType === "student") routes = <StudentRoutes />;
    else if (userType === "admin") routes = <AdminRoutes />;
    else routes = <UnauthenticatedRoutes />;
  } else {
    routes = <UnauthenticatedRoutes />;
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
