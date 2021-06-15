import React, { useContext, useEffect, Fragment } from "react";
import { Container, Card } from "react-bootstrap";
import Students from "../studentList/Students";
import AuthContext from "../../context/auth/authContext";
import NavbarMenu from "../layout/NavbarMenu";
import RealmContext from "../../context/realm/realmContext";
import StudentContext from "../../context/student/studentContext";

const StudentsList = props => {
  const authContext = useContext(AuthContext);
  const realmContext = useContext(RealmContext);
  const studentContext = useContext(StudentContext);

  useEffect(() => {
    authContext.loadUser();
    studentContext.clearStudent();
    realmContext.getRealms();
    // eslint-disable-next-line
  }, []);

  return (
    <Fragment>
      <NavbarMenu className='navbar-full-width' props={props} />
      <Card style={{ padding: "20px", margin: "10px" }}>
        <Container fluid>
          <Card.Title>
            <h1 className='centered'>Student List:</h1>
          </Card.Title>
          {realmContext.realms !== null && (
            <Students realms={realmContext.realms.houses} />
          )}
        </Container>
      </Card>
    </Fragment>
  );
};

export default StudentsList;
