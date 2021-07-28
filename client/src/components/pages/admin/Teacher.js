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
import TeacherContext from "../../../context/teacher/teacherContext";
import TableView from "../../layout/TableView";

const Teacher = (props) => {
  const teacherContext = useContext(TeacherContext);

  const { teachers } = teacherContext;

  useEffect(() => {
    teacherContext.clearState();
    teacherContext.getTeachers();
  }, []);

  return (
    <Card className="p-3">
      <h1>Teachers</h1>
      <hr />
      <TableView
        users={teachers}
        fields={[
          { attribute: "firstName", name: "First Name" },
          { attribute: "lastName", name: "Last Name" },
          { attribute: "email", name: "E-Mail" },
          { attribute: "role", name: "Role" },
        ]}
        search={["firstName", "lastName"]}
        editFunction={teacherContext.updateTeacher}
      />
    </Card>
  );
};

export default Teacher;
