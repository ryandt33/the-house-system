import React, { useContext, useEffect, useState } from "react";
import { Card, Container, Row, Col, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import NavbarMenu from "../layout/NavbarMenu";
import StudentPic from "../layout/StudentPic";
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
      groups[x] = [];
      for (let y = 0; y < Math.floor(classContext.students.length / num); y++) {
        count = Math.floor(Math.random() * stu.length);
        groups[x][groups[x].length] = stu[count].student;
        stu.splice(count, 1);
      }
    }
    if (stu.length >= groups.length) {
      console.log("Assignment error!");
    } else if (stu.length > 0) {
      for (let x = 0; stu.length > 0 && x < num; x++) {
        groups[x][groups[x].length] = stu.pop().student;
      }
    }

    for (let x = 0; x < groups.length; x += 2) {
      x + 1 !== groups.length
        ? groupEle.push(
            <Row key={`${x}-r`}>
              <Col sm={6}>
                <Table striped bordered hover className='group-table'>
                  <thead style={{ backgroundColor: "white" }}>
                    <tr>
                      <th></th>
                      <th>Name:</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groups[x].map((student) => (
                      <tr key={student._id}>
                        <td style={{ position: "relative" }}>
                          <StudentPic
                            props={{ student: student }}
                            className='stuPic'
                          />
                        </td>
                        <td>
                          {student.lastName} {student.firstName}
                          {student.otherName && " (" + student.otherName + ")"}
                          {student.nickname && ` | ${student.nickname}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
              <Col sm={6}>
                <Table striped bordered hover className='group-table'>
                  <thead>
                    <tr>
                      <th></th>
                      <th>Name:</th>
                    </tr>
                  </thead>
                  <tbody>
                    {x + 1 < groups.length &&
                      groups[x + 1].map((student) => (
                        <tr key={student._id}>
                          <td style={{ position: "relative" }}>
                            <StudentPic
                              props={{ student: student }}
                              className='stuPic'
                            />
                          </td>
                          <td>
                            {student.lastName} {student.firstName}
                            {student.otherName &&
                              " (" + student.otherName + ")"}
                            {student.nickname && ` | ${student.nickname}`}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          )
        : groupEle.push(
            <Row key={`${x}-r`}>
              <Col sm={{ span: 6, offset: 3 }}>
                <Table striped bordered hover className='group-table'>
                  <thead style={{ backgroundColor: "white" }}>
                    <tr>
                      <th></th>
                      <th>Name:</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groups[x].map((student) => (
                      <tr key={student._id}>
                        <td style={{ position: "relative" }}>
                          <StudentPic
                            props={{ student: student }}
                            className='stuPic'
                          />
                        </td>
                        <td>
                          {student.lastName} {student.firstName}
                          {student.otherName && " (" + student.otherName + ")"}
                          {student.nickname && ` | ${student.nickname}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
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
        key='group-spacer'
      ></Col>
    );
    for (let x = 1; x < classContext.students.length / 2 && x < 12; x++) {
      groupIndex.push(
        <Col sm={1} key={x + 1}>
          <div className='group-index' onClick={() => createGroups(x + 1)}>
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
      <NavbarMenu classname='navbar-full-width' props={props} />
      <Card style={{ marginBottom: "100px" }} className='p-3'>
        <Card.Title>Group Maker!</Card.Title>
        <Card.Body>
          <p>How many groups would you like to create?</p>
          <Row>{group.groupIndex}</Row>
          {group.groups}
          <Link
            to={`/class/${props.match.params.id}`}
            className='selector-back'
          >
            <Button variant='primary' className='selector-button'>
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
