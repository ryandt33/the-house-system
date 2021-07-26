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

import { Container, Form, Card } from "react-bootstrap";
import React, { useContext, useEffect, useState } from "react";
import NavbarMenu from "../layout/NavbarMenu";
import AuthContext from "../../context/auth/authContext";
import AlertContext from "../../context/alert/alertContext";

const ResetPassword = (props) => {
  const token = props.match.params.token;
  const alertContext = useContext(AlertContext);
  const authContext = useContext(AuthContext);

  const { setAlert } = alertContext;
  const { getReset, resetPassword, error, isAuthenticated } = authContext;

  const [user, setUser] = useState({
    email: "",
    pass1: "",
    pass2: "",
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

  const { email } = user;

  const onChange = (e) =>
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (email === "") {
      setAlert("Please complete all the fields", "danger");
    } else {
      const success = await getReset({
        email,
      });
      success && setAlert("E-mail sent, please check your e-mail", "success");
    }
  };

  const onSubmitPassword = async (e) => {
    e.preventDefault();
    if (user.pass1 !== user.pass2) {
      alertContext.setAlert("Passwords do not match", "danger");
    } else if (user.pass1.length < 8) {
      alertContext.setAlert(
        "Passwords must be at least 8 characters!",
        "danger"
      );
    } else {
      const success = await resetPassword(user.pass1, token);
      if (success) {
        alertContext.setAlert("Password Changed Successfully", "success");
        props.history.push("/login");
      } else {
        alertContext.setAlert("Error changing password", "danger");
      }
    }
  };

  return (
    <Container>
      <NavbarMenu className="navbar-full-width" props={props} />
      {!token ? (
        <Card className="login-card">
          <Card.Body>
            <Card.Title>Reset your password</Card.Title>
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
              <input
                type="submit"
                value="Send E-Mail to Reset Password"
                className="btn btn-primary btn-block"
              />
            </Form>
          </Card.Body>
        </Card>
      ) : (
        <Card className="login-card">
          <Card.Body>
            <Card.Title>Reset your password</Card.Title>
            <Form onSubmit={onSubmitPassword}>
              <Form.Group>
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  name="pass1"
                  value={user.pass1}
                  onChange={onChange}
                  required
                />
                <Form.Label>New Password Again</Form.Label>
                <Form.Control
                  type="password"
                  name="pass2"
                  value={user.pass2}
                  onChange={onChange}
                  required
                />
              </Form.Group>
              <input
                type="submit"
                value="Change Password"
                className="btn btn-primary btn-block"
              />
            </Form>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default ResetPassword;
