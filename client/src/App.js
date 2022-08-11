import React, { useState, useCallback, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import StudentRoutes from "./student/routes/StudentRoutes";
import TeacherRoutes from "./teacher/routes/TeacherRoutes";
import AdminRoutes from "./admin/routes/AdminRoutes";
import UnauthenticatedRoutes from "./shared/routes/UnauthenticatedRoutes";

import "./App.css";

import { AuthContext } from "./shared/context/AuthContext";

const App = () => {
  const [token, setToken] = useState("a");
  const [userId, setUserId] = useState("1705103");
  const [userType, setUserType] = useState("student");

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.token) {
      login(storedData.userID, storedData.userType, storedData.token);
    }
  }, []);

  const login = useCallback((uid, uType, token) => {
    setToken(token);
    setUserId(uid);
    setUserType(uType);
    localStorage.setItem("userData", JSON.stringify({ userID: uid, userType: uType, token: token }));
  }, []);

  const logout = useCallback(() => {
    setToken("a");
    setUserId(null);
  }, []);

  let routes;
  if (token !== null) {
    if (token) {
      if (userType === "student") {
        routes = <UnauthenticatedRoutes />;
      } else if (userType === "teacher") {
        routes = <TeacherRoutes />;
      } else if (userType === "office admin" || userType === "hall admin" || userType === "department admin") {
        routes = <AdminRoutes />;
      }
    } else {
      routes = <UnauthenticatedRoutes />;
    }
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
