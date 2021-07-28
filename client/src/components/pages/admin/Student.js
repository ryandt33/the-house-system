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
import { Card, Container } from "react-bootstrap";
import StudentContext from "../../../context/student/studentContext";
import TableView from "../../layout/TableView";

const Student = (props) => {
  const studentContext = useContext(StudentContext);

  const { students } = studentContext;

  useEffect(() => {
    studentContext.clearState();
    studentContext.getStudents();

    // return () => {
    //   studentContext.clearState();
    // };
  }, []);

  return (
    <Card className="p-3">
      <h1>Students</h1>
      <hr />
      <TableView
        users={students}
        fields={[
          { attribute: "firstName", name: "First Name" },
          { attribute: "lastName", name: "Last Name" },
          { attribute: "email", name: "E-Mail" },
          { attribute: "classGrade", name: "Grade" },
          { attribute: "house", name: "House" },
        ]}
        search={["firstName", "lastName"]}
        editFunction={studentContext.updateStudent}
      />
    </Card>
  );
};

export default Student;
