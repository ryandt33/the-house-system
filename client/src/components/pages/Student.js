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

import React, { useEffect, useContext, useState } from "react";
import { Container, Card, Row, Col, Badge } from "react-bootstrap";
import StudentContext from "../../context/student/studentContext";
import AuthContext from "../../context/auth/authContext";
import RealmContext from "../../context/realm/realmContext";
import PointContext from "../../context/point/pointContext";
import Point from "../points/Point";
import PointCounter from "../points/PointCounter";
import StudentPic from "../layout/StudentPic";
import PointForm from "../points/PointForm";
import NavbarMenu from "../layout/NavbarMenu";

const Student = (props) => {
  const studentContext = useContext(StudentContext);
  const realmContext = useContext(RealmContext);
  const pointContext = useContext(PointContext);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    pointContext.clearState();
    authContext.loadUser();
    studentContext.getStudentbyID(props.match.params.id);
    realmContext.getRealms();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (studentContext.student !== null) {
      updateStudent();
    }

    // eslint-disable-next-line
  }, [studentContext.student]);

  useEffect(() => {}, [studentContext]);

  const [display, setDisplay] = useState({
    page: 0,
    points: [],
    monthlyPoints: 0,
    img: "",
  });

  const [edit, setEdit] = useState(false);

  useEffect(() => {
    setDisplay({
      ...display,
      points: pointContext.points,
    });
    // eslint-disable-next-line
  }, [pointContext.points]);

  const { student } = studentContext;
  const { realms } = realmContext;

  // TO-DO ADD PAGINATION

  const canEdit = () => {
    setEdit(!edit);
  };

  const houseSelect = async (e) => {
    await studentContext.editHouse(
      student._id,
      realms.houses.find((realm) => realm.name === e.target.value)._id
    );
    setEdit(false);
  };

  const updateStudent = async () => {
    if (student.photoURL !== undefined) {
      await getPhoto();
    }
    await pointContext.getUserPoints(studentContext.student._id);
  };

  const getPhoto = async () => {
    const pic = await studentContext.getPhoto(student.studentID);
    setDisplay({ ...display, img: pic });
  };

  const goBack = () => {
    props.history.goBack();
  };

  console.log(student);

  return (
    <Container fluid id="top">
      <NavbarMenu className="navbar-full-width" props={props} />
      {pointContext.loading || student === null || realms === null ? (
        <Card>
          <h1 style={{ textAlign: "center" }}>Loading</h1>
        </Card>
      ) : (
        <div className="flexbox-responsive align-items-stretch">
          <Card className="col-lg-9 col-xs-12">
            {" "}
            <Card.Body>
              <div>
                <div
                  className="icon-holder float-left"
                  style={{
                    marginRight: "2em",
                    width: "2em",
                    height: "2em",
                    cursor: "pointer",
                    paddingTop: "0.15em",
                  }}
                  onClick={goBack}
                >
                  <i
                    className="far fa-hand-point-left"
                    style={{ color: "white" }}
                  ></i>{" "}
                </div>{" "}
                <p onClick={goBack} style={{ cursor: "pointer" }}>
                  Click here to go back.
                </p>
              </div>
              <br />
              <hr />
              <Card.Title>
                {" "}
                {authContext.user.role === "Admin" &&
                  (!edit ? (
                    <div className="float-right icon-holder" onClick={canEdit}>
                      <i className="fas fa-pencil-alt" color="white" />
                    </div>
                  ) : (
                    <div
                      className="float-right icon-holder"
                      onClick={canEdit}
                      style={{ backgroundColor: "red" }}
                    >
                      <i className="fas fa-pencil-alt" color="white" />
                    </div>
                  ))}
                <h3>
                  <div className="flex-name">
                    {student.photoURL && (
                      <div
                        style={{
                          position: "relative",
                          width: "3em",
                          height: "3",
                          display: "inline-block",
                        }}
                      >
                        {/* <img
                          src={`data:image/jpg;base64, ${display.img}`}
                          alt={`${student.firstName} ${student.lastName}`}
                        /> */}
                        <div className="stuPagePic">
                          <StudentPic props={{ student: student }} />
                        </div>
                      </div>
                    )}
                    <p style={{ display: "inline-block", paddingLeft: "1em" }}>
                      {student.lastName} {student.firstName} -{" "}
                      {student.studentID}{" "}
                      {student.otherName && " (" + student.otherName + ")"}
                      {student.nickname && ` | ${student.nickname}`}
                    </p>
                  </div>
                </h3>
              </Card.Title>
              <h4>
                <b>House: </b>
              </h4>
              {!edit ? (
                <Badge
                  style={{
                    background: realms.houses.find(
                      (realm) => realm._id === student.house
                    ).backgroundColor,
                    color: realms.houses.find(
                      (realm) => realm._id === student.house
                    ).color,
                  }}
                >
                  {
                    realms.houses.find((realm) => realm._id === student.house)
                      .name
                  }
                </Badge>
              ) : (
                <select
                  className="p-2"
                  value={
                    realms.houses.find((realm) => realm._id === student.house)
                      .name
                  }
                  onChange={houseSelect}
                >
                  {realms.houses.map((house) => (
                    <option key={house._id} onClick={houseSelect}>
                      {house.name}
                    </option>
                  ))}
                  {/* <Dropdown.Item href='#'>Action</Dropdown.Item>
                    <Dropdown.Item href='#'>Another action</Dropdown.Item>
                    <Dropdown.Item href='#'>Something else here</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item href='#'>Separated link</Dropdown.Item> */}
                </select>
              )}
              <hr />
              <Row>
                <Col xs={12} md={6}>
                  Email: <a href={`mailto:${student.email}`}>{student.email}</a>
                </Col>
                <Col xs={12} md={6}>
                  Grade: {student.classGrade}
                </Col>
              </Row>
              <Container className="points-display">
                <p>
                  <b>Monthly Points:</b> {student.monthlyPoints[0].points}
                </p>
                <p>
                  <b>Yearly Points:</b> {student.yearlyPoints[0].points}
                </p>
                <p>
                  <b>Total Points:</b>{" "}
                  {
                    student.totalPoints.find(
                      (points) => points.realm === student.house.toString()
                    ).points
                  }
                </p>
              </Container>
              {display.points !== [] && (
                <Container className="points-display">
                  <h4>Points Earned:</h4>
                  {display.points.map(
                    (point) =>
                      !point.archived && (
                        <Point
                          point={point.point}
                          key={point._id}
                          style={{ backgroundColor: "green" }}
                        />
                      )
                  )}
                </Container>
              )}
            </Card.Body>
          </Card>
          <Card
            className="col-lg-2 col-xs-12 point-form-student"
            style={{ marginBottom: "5em" }}
          >
            <Card.Body>
              <Card.Title>Add a Point</Card.Title>
            </Card.Body>
            <PointForm />{" "}
          </Card>
        </div>
      )}
    </Container>
  );
};

export default Student;
