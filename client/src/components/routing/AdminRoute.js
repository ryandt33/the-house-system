import React, { useContext, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import AuthContext from "../../context/auth/authContext";

const AdminRoute = ({ component: Component, ...rest }) => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, loading, user } = authContext;

  useEffect(() => {
    authContext.loadUser();
  }, []);

  return user ? (
    <Route
      {...rest}
      render={(props) =>
        !loading && isAuthenticated && user.role !== "Admin" ? (
          <Redirect to="/" />
        ) : (
          <Component {...props} />
        )
      }
    />
  ) : loading ? (
    <div></div>
  ) : (
    <Route {...rest} render={(props) => <Redirect to="/" />} />
  );
};

export default AdminRoute;
