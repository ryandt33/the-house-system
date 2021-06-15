import React, { useContext, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import { Card, Container, Col } from "react-bootstrap";
import NavbarMenu from "../layout/NavbarMenu";
import RealmContext from "../../context/realm/realmContext";
import StudentContext from "../../context/student/studentContext";
import AuthContext from "../../context/auth/authContext";
import PointCounter from "../points/PointCounter";

const Homeroom = (props) => {
  const realmContext = useContext(RealmContext);
  const studentContext = useContext(StudentContext);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    studentContext.clearState();
    if (realmContext.realms === null) {
      realmContext.getRealms();
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (authContext.user) studentContext.getHomeroom(authContext.user.mbID);
    // eslint-disable-next-line
  }, [authContext]);

  return (
    <Fragment>
      <NavbarMenu className='navbar-full-width' props={props} />
      <Card style={{ margin: "20px", padding: "20px" }}>
        <Container fluid>
          <Card.Title>
            <h2>
              {authContext.user !== null &&
                `${authContext.user.firstName}
          ${authContext.user.lastName}'s Class:`}
            </h2>
          </Card.Title>
          <Card.Body>
            {studentContext.students &&
              studentContext.students.map(
                (student) =>
                  !student.archived && (
                    <Col xs={6} className='studentCards' key={student._id}>
                      <Card
                        style={{
                          width: "95%",
                          margin: "auto",
                          boxShadow: `3px 3px 3px ${
                            realmContext.realms.houses.find(
                              (house) => house._id === student.house
                            ).backgroundColor
                          }`,
                          marginBottom: "0.5em",
                        }}
                      >
                        <Card.Body>
                          <Link
                            className='student-link'
                            to={`/student/${student.studentID}`}
                            student={student}
                          >
                            {student.lastName} {student.firstName}{" "}
                            {student.otherName && ` (${student.otherName})`}
                          </Link>
                          <span style={{ marginLeft: "20px" }}>
                            {
                              realmContext.realms.houses.find(
                                (house) => house._id === student.house
                              ).name
                            }{" "}
                          </span>
                          <span style={{ float: "right" }}>
                            <b>Points this month:</b>{" "}
                            <PointCounter points={student.points} />
                          </span>
                        </Card.Body>
                      </Card>
                    </Col>
                  )
              )}
          </Card.Body>
        </Container>
      </Card>
    </Fragment>
  );
};

export default Homeroom;
