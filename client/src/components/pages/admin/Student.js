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
import RealmContext from "../../../context/realm/realmContext";

const Admin = (props) => {
  const studentContext = useContext(StudentContext);
  const realmContext = useContext(RealmContext);

  const { students } = studentContext;
  const { realms } = realmContext;

  const [stuList, setStuList] = useState({
    students: [],
    page: 0,
    pagification: [],
  });

  console.log(realmContext);

  useEffect(() => {
    studentContext.getStudents();
    realmContext.getRealms();
  }, []);

  useEffect(() => {
    students &&
      stuList.students.length === 0 &&
      setStuList({
        students: students.slice(0, 20),
        page: 1,
        pagification: [],
      });
  }, [students]);

  useEffect(() => {
    console.log(stuList.students);
    stuList.students.length > 0 && pagify(stuList.students.length);
  }, [stuList.students]);

  useEffect(() => {
    console.log(stuList.pagification);
  }, [stuList.pagification]);

  const pagify = (pageCount) => {
    const pagification = [];
    console.log(stuList.students.length);
    for (let x = 1; x < pageCount; x++) {
      pagification.push(<li className="pagification__page">{x}</li>);
    }
    console.log(pagification);
    setStuList({ ...stuList, pagification: pagification });
  };

  return (
    <Card className="p-3">
      <h1>Students</h1>
      <hr />
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Grade</th>
            <th>House</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {stuList.students &&
            stuList.students.map(
              (student) =>
                !student.archived && (
                  <tr>
                    <td>{student.firstName}</td>
                    <td>{student.lastName}</td>
                    <td>{student.classGrade}</td>
                    <td>
                      {realms &&
                        realms.houses.map(
                          (house) => house._id === student.house && house.name
                        )}
                    </td>
                    <td></td>
                  </tr>
                )
            )}
        </tbody>
      </table>
      {stuList.pagification.length > 0 && (
        <ul className="pagification">
          {stuList.pagification.map((page) => page)}
        </ul>
      )}
    </Card>
  );
};

export default Admin;
