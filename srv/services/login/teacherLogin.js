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

const bcrypt = require("bcryptjs");

const Teacher = require("../../models/Teacher");

const teacherLogin = async (email, password, teacher) => {
  const isMatch = await bcrypt.compare(password, teacher.password);

  if (!teacher || !isMatch || teacher.archived) {
    return { user: "invalid" };
  }

  const date = new Date();

  await Teacher.findByIdAndUpdate(
    { _id: teacher._id },
    {
      lastLogin: date.getTime(),
    }
  );

  const payload = {
    user: {
      id: teacher.id,
      role: "Teacher",
      tokenDate: Date.now(),
    },
  };

  return payload;
};

module.exports = teacherLogin;
