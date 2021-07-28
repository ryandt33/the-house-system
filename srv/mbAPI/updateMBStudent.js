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

const Student = require("../models/Student");

const updateMBStudent = async (student, mongoID) => {
  const {
    first_name,
    last_name,
    other_name,
    email,
    id,
    student_id,
    archived,
    class_grade,
    gender,
    homeroom_advisor_id,
    ib_group_id,
    nickname,
  } = student;

  try {
    await Student.findByIdAndUpdate(mongoID, {
      firstName: first_name,
      lastName: last_name,
      otherName: other_name,
      email: email,
      mbID: id,
      studentID: student_id,
      archived: archived,
      classGrade: class_grade,
      gender: gender,
      homeroomID: homeroom_advisor_id,
      yeargroupID: ib_group_id,
      nickname: nickname,
    });
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = updateMBStudent;
