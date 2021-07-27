import React, { useContext, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import AuthContext from "../../context/auth/authContext";

const AdminRoute = ({ component: Component, ...rest }) => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, loading, user } = authContext;

  useEffect(() => {
    authContext.loadUser();
  }, []);

  return (
    <Route
      {...rest}
      render={(props) =>
        user &&
        (!loading && isAuthenticated && user.role !== "Admin" ? (
          <Redirect to="/" />
        ) : (
          <Component {...props} />
        ))
      }
    />
  );
};

export default AdminRoute;
