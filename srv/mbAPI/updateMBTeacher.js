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

const Teacher = require("../models/Teacher");

const updateMBTeacher = async (teacher, mongoID) => {
  const {
    first_name,
    last_name,
    other_name,
    email,
    id,
    teacher_id,
    archived,
    class_grade,
    gender,
    photo_url,
    homeroom_advisor_id,
  } = teacher;

  try {
    await Teacher.findByIdAndUpdate(mongoID, {
      firstName: first_name,
      lastName: last_name,
      otherName: other_name,
      email: email,
      mbID: id,
      teacherID: teacher_id,
      archived: archived,
      classGrade: class_grade,
      gender: gender,
      photoURL: photo_url,
      homeroomID: homeroom_advisor_id,
    });
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = updateMBTeacher;
