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

const axios = require("axios");
const config = require("config");
const mbAPIKey = config.get("mbAPIKey");
const mbSuffix = config.get("mbSuffix");
const addMBTeacher = require("./addMBTeacher");
const updateMBTeacher = require("./updateMBTeacher");

const Teacher = require("../models/Teacher");

const getTeachers = async () => {
  const mbConfig = {
    headers: {
      "auth-token": mbAPIKey,
    },
  };
  //Move the check here and then run a put/post if Teacher exists
  const checkUnique = async (teacher) => {
    const tea =
      (await Teacher.findOne({ email: teacher.email })) ||
      (await Teacher.findOne({ mbID: teacher.id }));

    if (!tea) {
      try {
        addMBTeacher(teacher);
      } catch (err) {
        console.error(err.message);
      }
    } else {
      const { first_name, last_name, email, archived, gender, role, id } =
        teacher;

      const change =
        tea.firstName !== first_name ||
        tea.lastName !== last_name ||
        tea.email !== email ||
        tea.archived !== archived ||
        tea.gender !== gender ||
        tea.role !== role ||
        tea.mbID !== id;
      try {
        change && updateMBTeacher(teacher, tea._id);
      } catch (err) {
        console.error(err.message);
      }
    }
  };

  try {
    let page = 0;
    let res;
    do {
      page++;
      res = await axios.get(
        `https://api.managebac.${mbSuffix}/v2/teachers/?page=${page}`,
        mbConfig
      );
      for (let x = 0; x < res.data.teachers.length; x++) {
        checkUnique(res.data.teachers[x]);
      }
      console.log(`Finished checking page ${page}`);
    } while (res.data.meta.current_page !== res.data.meta.total_pages);
  } catch (err) {
    console.error(err.message);
  }

  console.log("Teacher import finished");
};

module.exports = getTeachers;
