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
import { Link } from "react-router-dom";
import { Card, Container, Table, Badge } from "react-bootstrap";
import NavbarMenu from "../layout/NavbarMenu";
import StudentPic from "../layout/StudentPic";
import RealmContext from "../../context/realm/realmContext";
import StudentContext from "../../context/student/studentContext";
import PointCounter from "../points/PointCounter";

const StudentsList = (props) => {
  const realmContext = useContext(RealmContext);
  const studentContext = useContext(StudentContext);

  useEffect(() => {
    realmContext.getRealms();
    studentContext.clearStudent();
    studentContext.getTop();

    // eslint-disable-next-line
  }, []);

  const { realms } = realmContext;
  return (
    <Container fluid>
      <NavbarMenu className="navbar-full-width" props={props} />
      <Card className="p-3" style={{ marginBottom: "100px" }}>
        <h1>Welcome to Houses</h1>
        {realms !== null && (
          <Container
            fluid
            style={{
              width: "100%",
              textAlign: "center",
              textShadow: " 1px 1px 3px black",
            }}
          >
            {realms.houses.map((house) =>
              house.backgroundColor && house.color ? (
                <Card
                  style={{
                    marginRight: "20px",
                    backgroundColor: house.backgroundColor,
                    color: house.color,
                  }}
                  key={house._id}
                  className="col-xl-2 col-lg-5 col-sm-12 studentCards"
                >
                  <Card.Body>
                    <Card.Title>{house.name}</Card.Title>
                    <p style={{ fontSize: "0.75em" }}>
                      <b>Monthly Points:</b> {house.monthlyPoints}
                      <br />
                      <b>Yearly Points:</b> {house.yearlyPoints}
                    </p>
                  </Card.Body>
                </Card>
              ) : (
                <Card
                  style={{ marginRight: "20px" }}
                  key={house._id}
                  className="col-xl-2 col-lg-5 col-sm-12 studentCards"
                >
                  <Card.Body>
                    <Card.Title>{house.name}</Card.Title>
                    <p>
                      <b>Points:</b> {house.monthlyPoints}
                      <b>Total House Points:</b> {house.totalPoints}
                    </p>
                  </Card.Body>
                </Card>
              )
            )}
            {/* This is code that will be antiquated upon updating all houses and
            making background/color mandatory */}
          </Container>
        )}
        {studentContext.top !== null && (
          <div>
            <br />
            <h2>Top Students:</h2>
            <Table
              striped
              bordered
              hover
              style={{ backgroundColor: "white", marginTop: "20px" }}
            >
              <thead>
                <tr>
                  <th className="d-none d-sm-table-cell"></th>
                  <th>Name</th>
                  <th className="d-none d-sm-table-cell">House</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {studentContext.top.map((student) => (
                  <tr key={student._id}>
                    <td
                      style={{ position: "relative" }}
                      className="d-none d-sm-table-cell"
                    >
                      <StudentPic
                        props={{
                          student: student,
                          width: "6em",
                          height: "6em",
                        }}
                        className="stuPic"
                      />
                    </td>
                    <td>
                      <Link
                        to={`/student/${student.studentID}`}
                        student={student}
                        className="homeName"
                      >
                        {`${student.lastName} ${student.firstName}`}{" "}
                        {student.otherName && ` (${student.otherName})`}
                        {student.nickname && ` | ${student.nickname}`}
                      </Link>
                    </td>
                    <td className="d-none d-sm-table-cell">
                      {realms && (
                        <Badge
                          className="homeName"
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
                            realms.houses.find(
                              (realm) => realm._id === student.house
                            ).name
                          }
                        </Badge>
                      )}
                    </td>
                    <td>
                      <PointCounter
                        className="homeName"
                        points={student.points}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card>
    </Container>
  );
};

export default StudentsList;
