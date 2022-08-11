import { Route, Redirect, Switch } from "react-router-dom";

import Login0 from "../pages/Login0";
import Login from "../pages/Login";

const UnauthenticatedRoutes = () => {
  return (
    <Switch>
      <Route path="/login" exact>
        <Login0 />
        {/* <Login /> */}
      </Route>
      <Redirect to="/login" />
    </Switch>
  );
};

export default UnauthenticatedRoutes;
