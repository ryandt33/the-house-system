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
const util = require("util");
// const updateClass = require("../services/updateClass");

const Class = require("../models/Class");
const Student = require("../models/Student");

const popClass = async () => {
  const mbConfig = {
    headers: {
      "auth-token": mbAPIKey,
    },
  };

  const pop = async (cls, stu) => {
    try {
      let len = stu.length;
      let stuList = [];
      await Class.findOneAndUpdate({ mbID: cls }, { students: [] });
      for (let x = 0; x < len; x++) {
        stuList[x] = {};
        let student = await Student.find({ mbID: stu[x] });
        stuList[x] = { student: student[0]._id };
      }
      const res = await Class.findOneAndUpdate(
        {
          mbID: cls,
        },
        { $push: { students: stuList } }
      );
    } catch (error) {
      return error.message;
    }

    return true;
  };
  const classes = await Class.find({});
  let res;
  const len = classes.length;
  for (let x = 0; x < len; x++) {
    console.log(`${x} - ${classes[x].mbID}`);
    try {
      res = await axios.get(
        `https://api.managebac.${mbSuffix}/v2/classes/${classes[x].mbID}/students`,
        mbConfig
      );
      await pop(classes[x].mbID, res.data.student_ids);
    } catch (err) {
      if (err.response.status === 429) {
        await new Promise((resolve) => setTimeout(resolve, 40000));
        res = await axios.get(
          `https://api.managebac.${mbSuffix}/v2/classes/${classes[x].mbID}/students`,
          mbConfig
        );
        await pop(classes[x].mbID, res.data.student_ids);
      }
      console.error(err.message);
    }
    if (x % 100 === 0) {
      await new Promise((resolve) => setTimeout(resolve, 40000));
    }
  }
};

module.exports = popClass;
