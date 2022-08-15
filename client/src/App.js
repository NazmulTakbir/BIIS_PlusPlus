import React, { useState, useCallback, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import jwt_decode from "jwt-decode";

import StudentRoutes from "./student/routes/StudentRoutes";
import TeacherRoutes from "./teacher/routes/TeacherRoutes";
import AdminRoutes from "./admin/routes/AdminRoutes";
import UnauthenticatedRoutes from "./shared/routes/UnauthenticatedRoutes";

import "./App.css";

import { AuthContext } from "./shared/context/AuthContext";

const App = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null);
  const [responsibilities, setResponsibilities] = useState(null);

  const login = useCallback((uid, uType, responsibilities, token) => {
    setToken(token);
    setUserId(uid);
    setUserType(uType);
    setResponsibilities(responsibilities);
    localStorage.setItem(
      "userData",
      JSON.stringify({ userID: uid, userType: uType, responsibilities: responsibilities, token: token })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(false);
    setUserId(false);
    setUserType(false);
    setResponsibilities(false);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.token) {
      let decodedToken = jwt_decode(storedData.token);
      let currentDate = new Date();

      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        logout();
      } else {
        login(storedData.userID, storedData.userType, storedData.responsibilities, storedData.token);
      }
    } else {
      logout();
    }
  }, [login, logout]);

  let routes;
  if (token !== null) {
    if (token) {
      if (userType === "student") {
        routes = <StudentRoutes />;
      } else if (userType === "teacher") {
        routes = <TeacherRoutes />;
      } else if (
        userType === "comptroller admin" ||
        userType === "office admin" ||
        userType === "hall admin" ||
        userType === "department admin"
      ) {
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
        userType: userType,
        responsibilities: responsibilities,
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
