import React, { useContext, useEffect } from "react";
import { Card, Container } from "react-bootstrap";
import NavbarMenu from "../layout/NavbarMenu";
import RealmContext from "../../context/realm/realmContext";
import StudentContext from "../../context/student/studentContext";

const Admin = (props) => {
  const realmContext = useContext(RealmContext);
  const studentContext = useContext(StudentContext);

  useEffect(() => {
    realmContext.getRealms();
    studentContext.clearStudent();
    studentContext.getTop();
  });

  return (
    <Container fluid>
      <NavbarMenu className='navbar-full-width' props={props} />
      <Card className='p-3'>
        <h1>Admin Menu</h1>
      </Card>
    </Container>
  );
};

export default Admin;
