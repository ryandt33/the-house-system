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
const addMBStudent = require("./addMBStudent");
const updateMBStudent = require("./updateMBStudent");

const Student = require("../models/Student");

const getStudents = async () => {
  const mbConfig = {
    headers: {
      "auth-token": mbAPIKey,
    },
  };
  //Move the check here and then run a put/post if student exists
  const checkUnique = async (student) => {
    const stu = await Student.findOne({ studentID: student.student_id });
    if (!stu) {
      try {
        addMBStudent(student);
      } catch (err) {
        console.error(err.message);
        return false;
      }
    } else {
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

      const fixed_student_id = !student_id ? stu.student_id : student_id;

      const change =
        stu.firstName !== first_name ||
        stu.lastName !== last_name ||
        stu.otherName !== other_name ||
        stu.email !== email ||
        stu.mbID !== id ||
        stu.studentID !== fixed_student_id ||
        stu.archived !== archived ||
        stu.classGrade !== class_grade ||
        stu.gender !== gender ||
        stu.homeroomID !== homeroom_advisor_id ||
        stu.yeargroupID !== ib_group_id ||
        stu.nickname !== nickname;
      change && console.log(student);
      try {
        change && (await updateMBStudent(student, stu._id));
      } catch (err) {
        console.error(err.message);
        return false;
      }
    }
    return true;
  };

  try {
    let page = 0;
    let res;

    try {
      do {
        page++;
        res = await axios.get(
          `https://api.managebac.${mbSuffix}/v2/students/?page=${page}`,
          mbConfig
        );
        for (let x = 0; x < res.data.students.length; x++) {
          checkUnique(res.data.students[x]);
        }

        console.log(`Finished checking page ${page}`);
      } while (res.data.meta.current_page !== res.data.meta.total_pages);
    } catch (err) {
      console.error(err.message);
    }
  } catch (err) {
    console.error(err.message);
  }

  console.log("Student import finished");
};

module.exports = getStudents;
