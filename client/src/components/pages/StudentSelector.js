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

import React, { useContext, useEffect, useState } from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import NavbarMenu from "../layout/NavbarMenu";
import PointForm from "../points/PointForm";
import ClassContext from "../../context/class/classContext";
import RealmContext from "../../context/realm/realmContext";
import StudentContext from "../../context/student/studentContext";

const StudentSelector = (props) => {
  const classContext = useContext(ClassContext);
  const realmContext = useContext(RealmContext);
  const studentContext = useContext(StudentContext);
  const beeps = [];

  useEffect(() => {
    classContext.getSsClass(props.match.params.id);
    classContext.getClass(props.match.params.id);
    studentContext.clearState();
    if (realmContext.realms === null) {
      realmContext.getRealms();
    }
    // eslint-disable-next-line
  }, [props]);

  useEffect(() => {
    const loading = async () => {
      await loadStu();
    };
    if (classContext.students) {
      classContext.students.length > 0 && loading();
    }
    return () => {
      setStu({ ...stu, kill: true });
    };
    // eslint-disable-next-line
  }, [classContext]);

  for (let x = 0; x < 5; x++) {
    beeps.push(new Audio(`/sounds/beep-${x}.wav`));
  }

  beeps.push(new Audio("/sounds/tada.wav"));

  const [stu, setStu] = useState({
    stus: [],
    count: null,
    selector: [],
    spinning: false,
  });

  const loadStu = async () => {
    const stus = [];
    const students = classContext.students;
    for (let x = 0; x < students.length; x++) {
      stus.push({
        _id: students[x].student._id,
        studentID: students[x].student.studentID,
        firstName: students[x].student.firstName,
        lastName: students[x].student.lastName,
        otherName: students[x].student.otherName,
        nickname: students[x].student.nickname,
        email: students[x].student.email,
        classGrade: students[x].student.classGrade,
        house: students[x].student.house,
      });
      stus[x].photo = await studentContext.getPhoto(
        students[x].student.studentID
      );
    }

    setStu({ ...stu, stus: stus, selector: [...stus], kill: false });
  };

  const popStu = async (count, pop) => {
    setStu({
      ...stu,
      spinning: false,
      count: count,
      selector: pop,
      kill: false,
    });
    beeps[beeps.length - 1].play();
    console.log(realmContext.realms.houses);
    console.log();
  };

  const spin = async () => {
    let pop;
    if (stu.selector.length > 1) {
      pop = stu.selector;
      stu.count !== null && pop.splice(stu.count, 1);
    } else {
      pop = [...stu.stus];
    }
    setStu(
      { ...stu, selector: pop, spinning: true, count: 0 },
      randomStu(20, pop)
    );
  };

  const randomStu = async (time, pop) => {
    const count = Math.floor(Math.random() * pop.length);
    await studentContext.getStudent(pop[count]._id);
    setStu({ ...stu, count: count, selector: pop, spinning: true });
    beeps[Math.floor(Math.random() * (beeps.length - 1))].play();
    time < 500 && !stu.kill
      ? setTimeout(() => {
          randomStu(time * 1.2, pop);
        }, time)
      : popStu(count, pop);
  };

  return (
    <Container fluid>
      <NavbarMenu className="navbar-full-width" props={props} />
      <Card style={{ marginBottom: "100px" }} className="p-3">
        <Card.Title>
          {" "}
          <h2>{classContext.class && classContext.class.name}</h2>
        </Card.Title>
        <Card.Body className="student-selector">
          <h2 style={{ textAlign: "center", paddingBottom: "1em" }}>
            The Wheel of Destiny
          </h2>
          {stu.stus.length === 0 ? (
            <h1 style={{ textAlign: "center" }}>
              ... is loading. <br />
              <br />
              Please Standby.
            </h1>
          ) : (
            <Container>
              {stu.count !== null && (
                <Row>
                  <Col sm="12" md={{ span: 4, offset: 1 }}>
                    <div
                      className="selector-image-holder"
                      style={{
                        border: `5px solid ${
                          realmContext.realms &&
                          realmContext.realms.houses.find(
                            (realm) =>
                              realm._id === stu.selector[stu.count].house
                          ).backgroundColor
                        }`,
                      }}
                    >
                      <img
                        src={`data:image/jpg;base64, ${
                          stu.selector[stu.count].photo
                        }`}
                        alt={`${stu.selector[stu.count].firstName} ${
                          stu.selector[stu.count].lastName
                        }`}
                        className="selector-image"
                      />
                    </div>{" "}
                    <h3 className="selector-name">
                      {`${stu.selector[stu.count].lastName} ${
                        stu.selector[stu.count].firstName
                      }`}{" "}
                      {stu.selector[stu.count].otherName &&
                        `(${stu.selector[stu.count].otherName})`}
                      {stu.selector[stu.count].nickname &&
                        ` | ${stu.selector[stu.count].nickname}`}
                    </h3>{" "}
                    {!stu.spinning && (
                      <Container>
                        <Row>
                          <Col
                            sm={{ span: 8, offset: 4 }}
                            style={{ margin: "auto", textAlign: "center" }}
                          >
                            <Button
                              variant="warning"
                              onClick={spin}
                              className="selector-button"
                            >
                              Button of Fate
                            </Button>
                          </Col>
                        </Row>
                      </Container>
                    )}
                  </Col>
                  {!stu.spinning && (
                    <Col
                      sm={{ span: 5, offset: 1 }}
                      className="selector-points"
                    >
                      <PointForm />
                    </Col>
                  )}
                </Row>
              )}
              <br />{" "}
              {stu.count === null && (
                <Container>
                  <Row>
                    <Col
                      sm={{ span: 4, offset: 4 }}
                      style={{ margin: "auto", textAlign: "center" }}
                    >
                      <Button
                        variant="warning"
                        onClick={spin}
                        className="selector-button"
                      >
                        Button of Fate
                      </Button>
                    </Col>
                  </Row>
                </Container>
              )}
            </Container>
          )}
          {!stu.spinning && (
            <Link
              to={`/class/${props.match.params.id}`}
              className="selector-back"
            >
              <Button variant="primary" className="selector-button">
                Back to{" "}
                {classContext.class ? `${classContext.class.name}` : `Class`}
              </Button>
            </Link>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StudentSelector;
