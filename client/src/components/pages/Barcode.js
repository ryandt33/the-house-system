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

import React, { useContext, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Camera from "../scanner/Camera";
import AuthContext from "../../context/auth/authContext";
import PointContext from "../../context/point/pointContext";
import StudentContext from "../../context/student/studentContext";
import NavbarMenu from "../layout/NavbarMenu";

const StudentsList = (props) => {
  const authContext = useContext(AuthContext);
  const pointContext = useContext(PointContext);
  const studentContext = useContext(StudentContext);

  useEffect(() => {
    pointContext.clearState();
    studentContext.clearStudent();
    authContext.loadUser();
    // eslint-disable-next-line
  }, []);

  return (
    <Container fluid>
      {" "}
      <NavbarMenu className="navbar-full-width" props={props} />
      <Card>
        <Card.Body>
          <Card.Title>
            <h1>Scan a student barcode</h1>
          </Card.Title>
          <Camera />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StudentsList;
