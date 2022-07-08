import { Route, Redirect, Switch } from "react-router-dom";

import Login from "../pages/Login";

const UnauthenticatedRoutes = () => {
  return (
    <Switch>
      <Route path="/login" exact>
        <Login />
      </Route>
      <Redirect to="/login" />
    </Switch>
  );
};

export default UnauthenticatedRoutes;
