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

const addTeacher = async (teacher) => {
  const addObj = {};
  for (let key in teacher) {
    addObj[key] = teacher[key];
  }

  try {
    const tea = new Teacher(addObj);
    return { success: true, msg: await tea.save() };
  } catch (err) {
    return { success: false, msg: err.message };
  }
};

module.exports = addTeacher;
