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

const mongoose = require("mongoose");

const Student = require("../models/Student");
const House = require("../models/House");

const clearPoints = async (term) => {
  //Clear Houses
  const houses = await House.find({}, "_id");

  for (house of houses) {
    await House.findByIdAndUpdate(house._id, {
      [term]: 0,
    });
  }

  const students = await Student.find({});

  for (student of students) {
    if (student.points.length > 0) {
      for (point of student.points) {
        await Student.findOneAndUpdate(
          {
            _id: student._id,
            "points._id": point._id,
          },
          {
            "points.$.archived": true,
          }
        );
      }
      const pointId = student[term].find(
        (mp) => mp.realm === student.house.toString()
      );
      console.log(pointId);
      const stu = await Student.findOneAndUpdate(
        {
          _id: student._id,
          [`${term}._id`]: pointId._id,
        },
        {
          [`${term}.$.points`]: 0,
        }
      );
      //   console.log(student.monthlyPoints[0].realm === student.house.toString());
    }
  }
};

module.exports = clearPoints;
