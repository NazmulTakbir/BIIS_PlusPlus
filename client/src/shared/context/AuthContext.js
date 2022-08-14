import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  userType: null,
  token: null,
  responsibilities: null,
  login: () => {},
  logout: () => {},
});
