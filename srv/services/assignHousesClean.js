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
  const updateHouse = async (students, houses) => {
    let houseCount = 0;
    for (const stu of students) {
      houseCount === houses.length && (houseCount = 0);

      house = houses[houseCount];
      //Check if student already has a house

      console.log(stu.house);
      if (stu.house !== undefined) {
        //Check the monthly/yearly/total points
        if (
          stu.monthlyPoints.length > 1 ||
          stu.yearlyPoints.length > 1 ||
          stu.totalPoints.length > 1
        ) {
          console.log(`${stu.firstName} ${stu.lastName} has too many realms`);
        }
      } else {
        await Student.findByIdAndUpdate(stu.id, {
          house: house.id,
          $push: {
            monthlyPoints: { realm: house.id },
            yearlyPoints: { realm: house.id },
            totalPoints: { realm: house.id },
          },
        });
      }
    }
  };
  const students = await Student.find({});
  const houses = await House.find({});
  let classGrade = [];
  let maleStu;
  let femaleStu;
  let nullStu;
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

    for (let x = 0; x < classGrade.length; x++) {
      maleStu = await Student.find({
        gender: "Male",
        classGrade: classGrade[x],
        house: null,
      });

      await updateHouse(maleStu, houses);

      femaleStu = await Student.find({
        gender: "Female",
        classGrade: classGrade[x],
        house: null,
      });
      await updateHouse(femaleStu, houses);

      nullStu = await Student.find({
        classGrade: classGrade[x],
        house: null,
      });
      await updateHouse(nullStu, houses);
    }

    return;
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = assignHouses;
