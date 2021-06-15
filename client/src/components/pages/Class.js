import React, { useContext, useEffect } from "react";
import { Card, Container, Button, Table, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

import NavbarMenu from "../layout/NavbarMenu";
import StudentPic from "../layout/StudentPic";
import ClassContext from "../../context/class/classContext";
import RealmContext from "../../context/realm/realmContext";
import StudentContext from "../../context/student/studentContext";

const Class = (props) => {
  const classContext = useContext(ClassContext);
  const realmContext = useContext(RealmContext);
  const studentContext = useContext(StudentContext);

  const { realms } = realmContext;

  useEffect(() => {
    classContext.getSsClass(props.match.params.id);
    classContext.getClass(props.match.params.id);
    studentContext.clearState();
    if (realmContext.realms === null) {
      realmContext.getRealms();
    }

    return () => {
      classContext.clearStudents();
      studentContext.clearState();
    };
    // eslint-disable-next-line
  }, [props]);

  return (
    <Container fluid>
      <NavbarMenu className='navbar-full-width' props={props} />
      <Card
        style={{
          marginBottom: "100px",
        }}
        className='p-3'
      >
        <Card.Title>
          <h2>{classContext.class && classContext.class.name}</h2>
        </Card.Title>
        <Card.Body>
          <div className='buttonHolder'>
            <Link to={`/class/selector/${props.match.params.id}`}>
              <Button variant='primary'>Wheel of Destiny</Button>
            </Link>
            <Link to={`/class/groups/${props.match.params.id}`}>
              <Button variant='success'>Group Maker</Button>
            </Link>
          </div>
          <div>
            <br />
            <h2>Top Students for the Month:</h2>
            <Table
              striped
              bordered
              hover
              style={{ backgroundColor: "white", marginTop: "20px" }}
            >
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>House</th>
                </tr>
              </thead>
              <tbody>
                {classContext.students ? (
                  classContext.students.map((student) => (
                    <tr key={student.student._id}>
                      <td style={{ position: "relative" }}>
                        <StudentPic
                          props={{ student: student.student }}
                          className='stuPic'
                        />
                      </td>
                      <td>
                        <Link
                          to={`/student/${student.student.studentID}`}
                          student={student}
                        >
                          {`${student.student.lastName} ${student.student.firstName}`}{" "}
                          {student.student.otherName &&
                            ` (${student.student.otherName})`}
                          {student.student.nickname &&
                            ` | ${student.student.nickname}`}
                        </Link>
                      </td>
                      <td>
                        {realms && (
                          <Badge
                            style={{
                              backgroundColor: realms.houses.find(
                                (realm) => realm._id === student.student.house
                              ).backgroundColor,
                              color: realms.houses.find(
                                (realm) => realm._id === student.student.house
                              ).color,
                            }}
                          >
                            {
                              realms.houses.find(
                                (realm) => realm._id === student.student.house
                              ).name
                            }
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3}>
                      <h1 style={{ textAlign: "center" }}>Loading Class</h1>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Class;
