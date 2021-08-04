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

const Student = require("../models/Student");

const updateHouse = async (student, mongoID) => {
  const termCheck = (term) => {
    for (let x = 0; x < term.object.length - 1; x++) {
      if (term.object[x].realm === term.object[x + 1].realm) {
        return { status: true, count: x };
      } else return { status: false, count: null };
    }
  };
  try {
    const { house } = student;
    const oldHouse = await Student.findById(mongoID);

    const houseCheck = [
      { name: "monthlyPoints", object: oldHouse.monthlyPoints },
      { name: "yearlyPoints", object: oldHouse.yearlyPoints },
      { name: "totalPoints", object: oldHouse.totalPoints },
    ];

    for (let term of houseCheck) {
      if (term.object.length > 1) {
        const duplicateTerms = termCheck(term);
        if (duplicateTerms.status) {
          const newTerm = term.object.slice(
            duplicateTerms.count,
            duplicateTerms.count + 1
          );
          await Student.findByIdAndUpdate(mongoID, {
            [term.name]: newTerm,
          });
        }
      }
    }

    await Student.findOneAndUpdate(
      {
        _id: mongoID,
        "monthlyPoints.realm": oldHouse.house,
      },
      { "monthlyPoints.$.realm": house }
    );

    await Student.findOneAndUpdate(
      {
        _id: mongoID,
        "yearlyPoints.realm": oldHouse.house,
      },
      { "yearlyPoints.$.realm": house }
    );

    await Student.findOneAndUpdate(
      {
        _id: mongoID,
        "totalPoints.realm": oldHouse.house,
      },
      {
        "totalPoints.$.realm": house,
        house: house,
      }
    );

    const change = await Student.findById(mongoID);
    return change;
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = updateHouse;
