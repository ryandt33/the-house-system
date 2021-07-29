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
import ClassContext from "../../../context/class/classContext";
import TableView from "../../layout/TableView";

const Class = (props) => {
  const classContext = useContext(ClassContext);

  const { classes } = classContext;

  useEffect(() => {
    classContext.clearState();
    classContext.getClasses();
  }, []);

  return (
    <Card className="p-3">
      <h1>Classes</h1>
      <hr />
      <TableView
        users={classes}
        fields={[
          {
            attribute: "name",
            name: "Class Name",
            visible: true,
            editable: true,
          },
          {
            attribute: "program",
            name: "Program",
            visible: true,
            editable: true,
          },
          {
            attribute: "teachers",
            name: "Teachers",
            visible: true,
            editable: false,
          },
        ]}
        search={["name"]}
        editFunction={classContext.updateClass}
      />
    </Card>
  );
};

export default Class;
