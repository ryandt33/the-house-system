import React, { useContext, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Camera from "../scanner/Camera";
import AuthContext from "../../context/auth/authContext";
import PointContext from "../../context/point/pointContext";
import StudentContext from "../../context/student/studentContext";
import NavbarMenu from "../layout/NavbarMenu";

const StudentsList = (props) => {
  const authContext = useContext(AuthContext);
  const pointContext = useContext(PointContext);
  const studentContext = useContext(StudentContext);

  useEffect(() => {
    pointContext.clearState();
    studentContext.clearStudent();
    authContext.loadUser();
    // eslint-disable-next-line
  }, []);

  return (
    <Container fluid>
      {" "}
      <NavbarMenu className='navbar-full-width' props={props} />
      <Card>
        <Card.Body>
          <Card.Title>
            <h1>Scan a student barcode</h1>
          </Card.Title>
          <Camera />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StudentsList;
