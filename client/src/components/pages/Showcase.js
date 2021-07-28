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
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import RealmContext from "../../context/realm/realmContext";
import StudentPic from "../layout/StudentPic";
import NavbarMenu from "../layout/NavbarMenu";
import socketIOClient from "socket.io-client";

const Showcase = (props) => {
  const realmContext = useContext(RealmContext);

  const [display, setDisplay] = useState([]);
  const socket = socketIOClient("https://houseapi.ocasuzhou.net");

  useEffect(() => {
    realmContext.getRealms();
    console.log(display);
    socket.on("new point", (data) => {
      setDisplay((oldData) => [...oldData, data]);
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    console.log(display);
    realmContext.getRealms();
    // eslint-disable-next-line
  }, [display]);

  const { realms } = realmContext;

  return (
    <Container fluid>
      {" "}
      <NavbarMenu className="navbar-full-width" props={props} />
      <Card>
        <Card.Body>
          <Card.Title>
            <h1>Points Showcase</h1>
          </Card.Title>
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
                      <p style={{ fontSize: "1em" }}>
                        <b>Monthly Points:</b> {house.monthlyPoints}
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
          {display.length > 0 && display.length < 6
            ? display
                .slice(0)
                .reverse()
                .map((award) => (
                  <div
                    className="showcaseStuCard"
                    style={{
                      backgroundColor: award.category.backgroundColor,
                      color: award.category.color,
                    }}
                    key={award.point._id}
                  >
                    <div className="stuPagePic">
                      <StudentPic
                        props={{
                          student: award.student,
                          width: "10em",
                          height: "10em",
                        }}
                      />{" "}
                    </div>
                    <div className="showcaseText">
                      <p>
                        <b>
                          {award.student.lastName} {award.student.firstName}
                        </b>{" "}
                        was awarded <b>{award.point.category}</b> by{" "}
                        <b>
                          {award.teacher.lastName} {award.teacher.firstName}
                        </b>
                      </p>
                      {award.point.message !== "" && (
                        <p className="showcaseMessage">{award.point.message}</p>
                      )}
                    </div>
                  </div>
                ))
            : display
                .slice(display.length - 5, display.length - 0)
                .reverse()
                .map((award) => (
                  <div
                    className="showcaseStuCard"
                    style={{
                      backgroundColor: award.category.backgroundColor,
                      color: award.category.color,
                    }}
                    key={award.point._id}
                  >
                    <div className="stuPagePic">
                      <StudentPic
                        props={{
                          student: award.student,
                          width: "10em",
                          height: "10em",
                        }}
                      />{" "}
                    </div>
                    <div className="showcaseText">
                      <p>
                        <b>
                          {award.student.lastName} {award.student.firstName}
                        </b>{" "}
                        was awarded <b>{award.point.category}</b> by{" "}
                        <b>
                          {award.teacher.lastName} {award.teacher.firstName}
                        </b>
                      </p>
                      {award.point.message !== "" && (
                        <p className="showcaseMessage">{award.point.message}</p>
                      )}
                    </div>
                  </div>
                ))}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Showcase;
