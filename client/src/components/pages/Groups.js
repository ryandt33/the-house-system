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
import ClassContext from "../../context/class/classContext";
import StudentContext from "../../context/student/studentContext";

const Groups = (props) => {
  const classContext = useContext(ClassContext);
  const studentContext = useContext(StudentContext);
  const groupIndex = [];

  const [group, setGroup] = useState({
    groupIndex: [],
    groups: [],
  });

  const createGroups = (num) => {
    const groups = [];
    const groupEle = [];
    const stu = [...classContext.students];
    let count;

    for (let x = 0; x < num; x++) {
      //Create an empty 2nd dimension to populate with groups
      groups[x] = [];

      //Choose a random student from all students, assign it to the end of the 2nd dimension, splice the student from the main
      for (let y = 0; y < Math.floor(classContext.students.length / num); y++) {
        count = Math.floor(Math.random() * stu.length);
        groups[x][groups[x].length] = stu[count].student;
        stu.splice(count, 1);
      }
    }

    //Error handling
    if (stu.length >= groups.length) {
      console.log("Assignment error!");
    } else if (stu.length > 0) {
      for (let x = 0; stu.length > 0 && x < num; x++) {
        groups[x][groups[x].length] = stu.pop().student;
      }
    }

    console.log(groups.length);
    //Populate the group tables
    for (let x = 0; x < groups.length; x += 3) {
      x + 2 < groups.length
        ? groupEle.push(
            <Row key={`${x}-r`}>
              <Col sm={4}>
                <div className="group__container">
                  <h3>Group {x + 1}</h3>
                  <ul>
                    {groups[x].map((student) => (
                      <li key={student._id}>
                        {student.firstName} {student.lastName}
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
              <Col sm={4}>
                {" "}
                <div className="group__container">
                  <h3>Group {x + 2}</h3>
                  <ul>
                    {groups[x + 1].map((student) => (
                      <li key={student._id}>
                        {student.firstName} {student.lastName}
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
              <Col sm={4}>
                {" "}
                <div className="group__container">
                  <h3>Group {x + 3}</h3>
                  <ul>
                    {groups[x + 2].map((student) => (
                      <li key={student._id}>
                        {student.firstName} {student.lastName}
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
            </Row>
          )
        : x + 1 < groups.length
        ? groupEle.push(
            <Row key={`${x}-r`}>
              <Col sm={{ span: 4, offset: 2 }}>
                <div className="group__container">
                  <h3>Group {x + 1}</h3>
                  <ul>
                    {groups[x].map((student) => (
                      <li key={student._id}>
                        {student.firstName} {student.lastName}
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>{" "}
              <Col sm={4}>
                {" "}
                <div className="group__container">
                  <h3>Group {x + 2}</h3>
                  <ul>
                    {groups[x + 1].map((student) => (
                      <li key={student._id}>
                        {student.firstName} {student.lastName}
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
            </Row>
          )
        : groupEle.push(
            <Row key={`${x}-r`}>
              <Col sm={{ span: 4, offset: 4 }}>
                <div className="group__container">
                  <h3>Group {x + 1}</h3>
                  <ul>
                    {groups[x].map((student) => (
                      <li key={student._id}>
                        {student.firstName} {student.lastName}
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
            </Row>
          );
    }

    setGroup({ ...group, groupIndex: groupIndex, groups: groupEle });
  };

  const groupCount = () => {
    groupIndex.push(
      <Col
        sm={Math.ceil((12 - classContext.students.length / 2) / 2)}
        key="group-spacer"
      ></Col>
    );
    for (let x = 1; x < classContext.students.length / 2 && x < 12; x++) {
      groupIndex.push(
        <Col sm={1} key={x + 1}>
          <div className="group-index" onClick={() => createGroups(x + 1)}>
            {x + 1}
          </div>
        </Col>
      );
    }
    setGroup({ groupIndex: groupIndex });
  };

  useEffect(() => {
    classContext.getSsClass(props.match.params.id);
    classContext.getClass(props.match.params.id);
    studentContext.clearState();
    // eslint-disable-next-line
  }, [props]);

  useEffect(() => {
    classContext.students && groupCount();
    // eslint-disable-next-line
  }, [classContext.students]);

  return (
    <Container fluid>
      <NavbarMenu classname="navbar-full-width" props={props} />
      <Card style={{ marginBottom: "100px" }} className="p-3">
        <Card.Title>Group Maker!</Card.Title>
        <Card.Body>
          <p>How many groups would you like to create?</p>
          <Row>{group.groupIndex}</Row>
          {group.groups}
          <Link
            to={`/class/${props.match.params.id}`}
            className="selector-back"
          >
            <Button variant="primary" className="selector-button">
              Back to{" "}
              {classContext.class ? `${classContext.class.name}` : `Class`}
            </Button>
          </Link>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Groups;
