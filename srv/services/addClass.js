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

const Class = require("../models/Class");
const Teacher = require("../models/Teacher");
const util = require("util");

const addClass = async (cls) => {
  const {
    id,
    name,
    uniq_id,
    class_section,
    created_at,
    updated_at,
    grade,
    program,
    subject_name,
    subject_group,
    teachers,
  } = cls;
  let tea = [];
  try {
    if (teachers) {
      for (let x = 0; x < teachers.length; x++) {
        tea[x] = {};
        let teacher = await Teacher.find({ mbID: teachers[x].teacher_id });
        console.log(teacher)
	teacher.length > 0 && (tea[x] = { teacher: teacher[0]._id });
        tea[x].onReport = teachers[x].show_on_reports;
      }
    }

    const newClass = new Class({
      mbID: id,
      name: name,
      shortCode: uniq_id,
      section: class_section,
      created: created_at,
      updated: updated_at,
      grade: grade,
      program: program,
      subjectName: subject_name,
      subjectGroup: subject_group,
      teachers: tea,
    });

    const addCls = await newClass.save();
    return addCls;
  } catch (err) {
    console.error(err.message);
    return false;
  }
};

module.exports = addClass;
