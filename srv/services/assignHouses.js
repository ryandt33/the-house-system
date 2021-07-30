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

const House = require("../models/House");
const Student = require("../models/Student");

const assignHouses = async () => {
  const students = await Student.find({});
  const houses = await House.find({});
  let classGrade = [];
  let maleStu;
  let femaleStu;
  let nullStu;
  let stuID;
  let cGrade = [];
  try {
    const yearGroupCheck = (ygID) => {
      for (let y = 0; y < classGrade.length; y++) {
        if (ygID === classGrade[y] || ygID === undefined) return;
      }
      classGrade.push(ygID);
    };

    for (let x = 0; x < students.length; x++) {
      yearGroupCheck(students[x].classGrade);
    }
    let houseCount = 0;

    for (let x = 0; x < classGrade.length; x++) {
      maleStu = await Student.find({
        gender: "Male",
        classGrade: classGrade[x],
        house: null,
      });
      femaleStu = await Student.find({
        gender: "Female",
        classGrade: classGrade[x],
        house: null,
      });
      nullStu = await Student.find({
        classGrade: classGrade[x],
        house: null,
      });

      for (let y = 0; y < maleStu.length; y++) {
        if (houseCount === houses.length) houseCount = 0;
        await Student.findByIdAndUpdate(maleStu[y]._id, {
          house: houses[houseCount]._id,
          $push: {
            monthlyPoints: { realm: houses[houseCount].id },
            yearlyPoints: { realm: houses[houseCount].id },
            totalPoints: { realm: houses[houseCount].id },
          },
        });
        stuID = { student: maleStu[y]._id };
        await House.findByIdAndUpdate(houses[houseCount]._id, {
          $push: { students: stuID },
        });
        houseCount++;
      }

      for (let y = 0; y < femaleStu.length; y++) {
        if (houseCount === houses.length) houseCount = 0;
        await Student.findByIdAndUpdate(femaleStu[y]._id, {
          house: houses[houseCount]._id,
          $push: {
            monthlyPoints: { realm: houses[houseCount].id },
            yearlyPoints: { realm: houses[houseCount].id },
            totalPoints: { realm: houses[houseCount].id },
          },
        });
        stuID = { student: femaleStu[y]._id };
        await House.findByIdAndUpdate(houses[houseCount]._id, {
          $push: { students: stuID },
        });
        houseCount++;
      }

      for (let y = 0; y < nullStu.length; y++) {
        if (houseCount === houses.length) houseCount = 0;
        await Student.findByIdAndUpdate(nullStu[y]._id, {
          house: houses[houseCount]._id,
          $push: {
            monthlyPoints: { realm: houses[houseCount].id },
            yearlyPoints: { realm: houses[houseCount].id },
            totalPoints: { realm: houses[houseCount].id },
          },
        });
        stuID = { student: nullStu[y]._id };
        await House.findByIdAndUpdate(houses[houseCount]._id, {
          $push: { students: stuID },
        });
        houseCount++;
      }
    }

    return;
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = assignHouses;
