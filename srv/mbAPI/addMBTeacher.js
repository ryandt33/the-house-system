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
const util = require("util");

const addMBTeacher = async (tea) => {
  const {
    first_name,
    last_name,
    email,
    archived,
    gender,
    photo_url,
    role,
    id,
  } = tea;
  // console.log(util.inspect(tea, true, null, true));
  try {
    const newTeacher = new Teacher({
      firstName: first_name,
      lastName: last_name,
      email: email,
      archived: archived,
      gender: gender,
      photoURL: photo_url,
      role: role,
      mbID: id,
    });
    const teacher = await newTeacher.save();
    return teacher;
  } catch (err) {
    console.error(err.message);
    return false;
  }
};

module.exports = addMBTeacher;
