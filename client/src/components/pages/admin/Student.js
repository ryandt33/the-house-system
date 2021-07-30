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
import { Card } from "react-bootstrap";
import StudentContext from "../../../context/student/studentContext";
import TableView from "../../layout/TableView";
import EditModal from "./EditModal";
import PasswordResetInput from "./PasswordResetInput";
import ArchiveToggle from "./ArchiveToggle";

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
          {
            attribute: "firstName",
            name: "First Name",
            visible: true,
            editable: true,
          },
          {
            attribute: "lastName",
            name: "Last Name",
            visible: true,
            editable: true,
          },
          {
            attribute: "otherName",
            name: "Other Name",
            visible: false,
            editable: true,
          },
          {
            attribute: "nickname",
            name: "Nickname",
            visible: false,
            editable: true,
          },
          {
            attribute: "email",
            name: "E-Mail",
            visible: true,
            editable: false,
          },
          {
            attribute: "mbID",
            name: "ManageBac ID",
            visible: false,
            editable: false,
          },
          {
            attribute: "classGrade",
            name: "Grade",
            visible: true,
            editable: true,
          },
          { attribute: "house", name: "House", visible: true, editable: true },
          {
            attribute: "studentID",
            name: "Student ID",
            visible: false,
            editable: false,
          },
        ]}
        search={["firstName", "lastName"]}
        editFunction={studentContext.updateStudent}
        additionalFunctions={[
          {
            function: studentContext.updateStudentPassword,
            display: PasswordResetInput,
          },
          {
            function: studentContext.archiveStudent,
            display: ArchiveToggle,
          },
        ]}
        tabs={[
          {
            title: "Create a new Student",
            view: EditModal,
            editFunction: studentContext.createStudent,
          },
        ]}
      />
    </Card>
  );
};

export default Student;
