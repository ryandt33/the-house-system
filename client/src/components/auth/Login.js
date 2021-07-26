// This file is part of the House System - https://houses.for.education/
//
// The House System is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The House System is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with The House System. If not, see <http://www.gnu.org/licenses/>.

import React, { useState, useContext, useEffect } from "react";
import { Container, Form, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import AuthContext from "../../context/auth/authContext";
import AlertContext from "../../context/alert/alertContext";
import NavbarMenu from "../layout/NavbarMenu";

const Login = (props) => {
  const alertContext = useContext(AlertContext);
  const authContext = useContext(AuthContext);

  const { setAlert } = alertContext;
  const { login, error, isAuthenticated } = authContext;

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      props.history.push("/");
    }

    console.log(authContext);
    if (error && error !== "Unauthorized Access - No token") {
      setAlert(error, "danger");
    }
    //eslint-disable-next-line
  }, [authContext, isAuthenticated, props.history]);

  const { email, password } = user;

  const onChange = (e) =>
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });

  const onSubmit = (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      setAlert("Please complete all the fields", "danger");
    } else {
      login({
        email,
        password,
      });
    }
  };

  return (
    <Container>
      {" "}
      <NavbarMenu className="navbar-full-width" props={props} />
      <Card className="login-card">
        <Card.Body>
          <Card.Title>
            Account <span className="text-primary">Login</span>:
          </Card.Title>
          <Form onSubmit={onSubmit}>
            <Form.Group>
              <Form.Label>E-Mail</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={email}
                onChange={onChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={password}
                onChange={onChange}
              />
            </Form.Group>
            <Link to="/resetPassword" className="password-reset-link">
              Forgot your password?
            </Link>
            <input
              type="submit"
              value="Login"
              className="btn btn-primary btn-block"
            />
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
