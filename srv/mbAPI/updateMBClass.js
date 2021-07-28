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

const updateMBClass = async (cls, mongoID) => {
  const { name, uniq_id, class_section, updated_at, teachers } = cls;
  let tea = [];
  if (teachers) {
    for (let x = 0; x < teachers.length; x++) {
      tea[x] = {};
      let teacher = await Teacher.find({ mbID: teachers[x].teacher_id });
      tea[x] = { teacher: teacher[0]._id };
      tea[x].onReport = teachers[x].show_on_reports;
    }
  }

  try {
    await Class.findByIdAndUpdate(mongoID, {
      name: name,
      shortCode: uniq_id,
      section: class_section,
      updated: updated_at,
      teachers: tea,
    });
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = updateMBClass;
