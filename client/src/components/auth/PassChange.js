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

import React, { useContext, useState, useEffect } from "react";
import { Card, Form, Container } from "react-bootstrap";
import AuthContext from "../../context/auth/authContext";
import AlertContext from "../../context/alert/alertContext";
import NavbarMenu from "../layout/NavbarMenu";

const PassChange = props => {
  const alertContext = useContext(AlertContext);
  const authContext = useContext(AuthContext);

  const [pass, setPass] = useState({
    oldPass: "",
    pass1: "",
    pass2: ""
  });

  useEffect(() => {
    if (authContext.error !== null) {
      alertContext.setAlert(authContext.error, "danger");
    } //eslint-disable-next-line
  }, [authContext.error]);

  const onChange = e =>
    setPass({
      ...pass,
      [e.target.name]: e.target.value
    });

  const onSubmit = async e => {
    e.preventDefault();
    if (pass.pass1 !== pass.pass2) {
      alertContext.setAlert("Passwords do not match", "danger");
    } else if (pass.pass1.length < 8) {
      alertContext.setAlert(
        "Passwords must be at least 8 characters!",
        "danger"
      );
    } else {
      const success = await authContext.changePass(pass);
      if (success) {
        alertContext.setAlert("Password Changed Successfully", "success");
        props.history.push("/");
      } else {
        alertContext.setAlert("Error changing password", "danger");
      }
    }
  };

  return (
    <Container>
      {" "}
      <NavbarMenu className='navbar-full-width' props={props} />
      <Card style={{ padding: "10px" }}>
        <Card.Title>
          <h2>
            Change your <span className='text-danger'>password:</span>
          </h2>
        </Card.Title>
        <Form onSubmit={onSubmit}>
          <Form.Group>
            <Form.Label>Old Password</Form.Label>
            <Form.Control
              type='password'
              name='oldPass'
              value={pass.oldPass}
              onChange={onChange}
              required
            />
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type='password'
              name='pass1'
              value={pass.pass1}
              onChange={onChange}
              required
            />
            <Form.Label>New Password Again</Form.Label>
            <Form.Control
              type='password'
              name='pass2'
              value={pass.pass2}
              onChange={onChange}
              required
            />
          </Form.Group>
          <input
            type='submit'
            value='Change Password'
            className='btn btn-primary btn-block'
          />
        </Form>
      </Card>
    </Container>
  );
};

export default PassChange;
