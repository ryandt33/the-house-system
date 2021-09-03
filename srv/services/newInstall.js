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
const House = require("../models/House");
const addTeacher = require("./addTeacher");
const getStudents = require("../mbAPI/getStudents");
const getTeachers = require("../mbAPI/getTeachers");
const assignHouses = require("./assignHousesClean");
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
      firstName: first_name,
      lastName: last_name,
      email: email,
      archived: false,
      photo_url: null,
      role: "Admin",
      mbID: "1",
    });

    let salt = await bcrypt.genSalt(10);
    let enPass = await bcrypt.hash(pass, salt);

    await Teacher.findOneAndUpdate({ password: enPass });
    console.log("Fetching students from MB");
    await getStudents();
    console.log("Fetching teachers from MB");
    await getTeachers();
    console.log("Fetching classes from MB");
    await getClasses();
    console.log("Populating classes");
    await popClass();

    let houseName = "";
    let finished = "";

    do {
      houseName = promptCheck(
        "Enter your house name (you can change this later): "
      );
      const newHouse = new House({
        name: houseName,
        backgroundColor: "white",
        color: "black",
      });
      await newHouse.save();

      console.log(
        "Are you finished creating houses? (y terminates, everything else continues): "
      );
      finished = promptCheck("");
    } while (finished !== "y");
    console.log("Assigning houses...");
    await assignHouses();
    console.log("Setup complete");
  }
};

module.exports = newInstall;
