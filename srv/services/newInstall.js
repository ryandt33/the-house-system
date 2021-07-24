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
const prompt = require("prompt-sync")();
const Teacher = require("../models/Teacher");
const addTeacher = require("./addTeacher");
const getStudents = require("../mbAPI/getStudents");
const getTeachers = require("../mbAPI/getTeachers");
const assignHouses = require("./assignHouses");
const getClasses = require("../mbAPI/getClasses");
const passGen = require("./passGen");
const popClass = require("../mbAPI/popClass");

const newInstall = async () => {
  const promptCheck = (query, hidden = false) => {
    let res = "";

    while (res === "") {
      hidden ? (res = prompt.hide(query)) : (res = prompt(query));
    }
    return res;
  };
  const teachers = await Teacher.find();

  if (teachers.length === 0) {
    const first_name = promptCheck("Enter the admin's first name: ");
    const last_name = promptCheck("Enter the admin's last name: ");
    const email = promptCheck("Enter the admin's email: ");
    const pass = promptCheck("Enter the admin's password: ", true);

    await addTeacher({
      first_name: first_name,
      last_name: last_name,
      email: email,
      archived: false,
      photo_url: null,
      role: "Admin",
      id: "1",
    });

    let salt = await bcrypt.genSalt(10);
    let enPass = await bcrypt.hash(pass, salt);

    await Teacher.findOneAndUpdate({ password: enPass });
    await getStudents();
    await getTeachers();
    await getClasses();
    await popClass();
  }
};

module.exports = newInstall;
