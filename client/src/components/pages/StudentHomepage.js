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
    pointContext.getMyPoints();
    console.log(authContext.user);
    authContext.loadUser();
    studentContext.getMe();
    realmContext.getRealms();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    console.log(authContext.user);
  }, [authContext.user]);

  //   useEffect(() => {
  //     if (studentContext.student !== null) {
  //       updateStudent();
  //     }

  //     // eslint-disable-next-line
  //   }, [studentContext.student]);

  //   useEffect(() => {}, [studentContext]);

  const [display, setDisplay] = useState({
    page: 0,
    points: [],
    monthlyPoints: 0,
    img: "",
  });

  //   const [edit, setEdit] = useState(false);

  useEffect(() => {
    setDisplay({
      ...display,
      points: pointContext.points,
    });
    // eslint-disable-next-line
  }, [pointContext.points]);

  const { student } = studentContext;
  const { realms } = realmContext;
  const { points } = pointContext;

  console.log(points);

  //   // TO-DO ADD PAGINATION

  //   const canEdit = () => {
  //     setEdit(!edit);
  //   };

  //   const houseSelect = async (e) => {
  //     await studentContext.editHouse(
  //       student._id,
  //       realms.houses.find((realm) => realm.name === e.target.value)._id
  //     );
  //     setEdit(false);
  //   };

  //   const updateStudent = async () => {
  //     if (student.photoURL !== undefined) {
  //       await getPhoto();
  //     }
  //     await pointContext.getUserPoints(studentContext.student._id);
  //   };

  //   const getPhoto = async () => {
  //     const pic = await studentContext.getPhoto(student.studentID);
  //     setDisplay({ ...display, img: pic });
  //   };

  const goBack = () => {
    props.history.goBack();
  };

  return (
    <Container fluid>
      <NavbarMenu className="navbar-full-width" props={props} />
      {pointContext.loading || student === null || realms === null ? (
        <Card>
          <h1 style={{ textAlign: "center" }}>Loading</h1>
        </Card>
      ) : (
        <div className="flexbox-responsive align-items-stretch">
          <Card className="col-lg-12 col-xs-12">
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
              <Badge
                style={{
                  backgroundColor: realms.houses.find(
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

              <hr />
              <Row>
                <Col xs={12} md={6}>
                  Grade: {student.classGrade}
                </Col>
              </Row>
              <Container className="points-display">
                <p>
                  <b>Monthly Points:</b>{" "}
                  <PointCounter points={points} total={false} />
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
        </div>
      )}
    </Container>
  );
};

export default Student;
