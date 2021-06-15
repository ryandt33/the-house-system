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

const fs = require("fs");

const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

const exportToCsv = async () => {
  let csv = "last name,first name,house,email,grade,homeroom teacher,monthly points,total points\n";
  const students = await Student.find({}).populate("house points.point");

  for (stu of students) {
    if (!stu.archived && stu.house) {
      let pCount = 0;
      let tCount = 0;
      if (stu.points.length > 0) {
        for (point of stu.points) {
          !point.archived && (pCount += point.point.value);
	  tCount += point.point.value;
        }
      }
      const tea = await Teacher.findOne({ mbID: stu.homeroomID });
      csv += `${stu.lastName},${stu.firstName},${stu.house.name},${stu.email},${stu.classGrade},${tea.email},${pCount},${tCount}\n`;
    }
  }

  fs.writeFile(__dirname + "/studentExport.csv", csv, (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });
};

module.exports = exportToCsv;
