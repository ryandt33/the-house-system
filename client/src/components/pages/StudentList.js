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

import React, { useContext, useEffect, Fragment } from "react";
import { Container, Card } from "react-bootstrap";
import Students from "../studentList/Students";
import AuthContext from "../../context/auth/authContext";
import NavbarMenu from "../layout/NavbarMenu";
import RealmContext from "../../context/realm/realmContext";
import StudentContext from "../../context/student/studentContext";

const StudentsList = (props) => {
  const authContext = useContext(AuthContext);
  const realmContext = useContext(RealmContext);
  const studentContext = useContext(StudentContext);

  useEffect(() => {
    authContext.loadUser();
    studentContext.clearStudent();
    realmContext.getRealms();
    // eslint-disable-next-line
  }, []);

  return (
    <Fragment>
      <NavbarMenu className="navbar-full-width" props={props} />
      <Card style={{ padding: "20px", margin: "10px" }}>
        <Container fluid>
          <Card.Title>
            <h1 className="centered">Student List:</h1>
          </Card.Title>
          {realmContext.realms !== null && (
            <Students realms={realmContext.realms.houses} />
          )}
        </Container>
      </Card>
    </Fragment>
  );
};

export default StudentsList;
