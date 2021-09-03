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
const House = require("../models/House");

const updateHouse = async ({ house }, mongoID) => {
  const termCheck = async (term) => {
    let houses = [];
    for (let { realm } of term.object) {
      const house = await House.findById(realm);
      house && (houses = [...houses, house]);
    }

    if (houses.length > 1) {
      return { status: true, count: houses };
    } else return { status: false, count: null };
  };
  try {
    const oldHouse = await Student.findById(mongoID);

    const houseCheck = [
      { name: "monthlyPoints", object: oldHouse.monthlyPoints },
      { name: "yearlyPoints", object: oldHouse.yearlyPoints },
      { name: "totalPoints", object: oldHouse.totalPoints },
    ];

    for (let term of houseCheck) {
      if (term.object.length > 1) {
        const duplicateTerms = await termCheck(term);
        if (duplicateTerms.status) {
          const newTerm = [
            {
              points: duplicateTerms.count.reduce((acc, house) => {
                console.log(house);
                acc += house.points;
                return acc;
              }, 0),
              realm: house,
            },
          ];
          await Student.findByIdAndUpdate(mongoID, {
            [term.name]: newTerm,
          });
        }
      } else {
        const newTerm = [
          {
            points: term.object[0].points,
            realm: house,
          },
        ];

        await Student.findByIdAndUpdate(mongoID, {
          [term.name]: newTerm,
        });
      }
    }

    await Student.findByIdAndUpdate(mongoID, {
      house: house,
    });

    // await Student.findOneAndUpdate(
    //   {
    //     _id: mongoID,
    //     "monthlyPoints.realm": oldHouse.house,
    //   },
    //   { "monthlyPoints.$.realm": house }
    // );

    // await Student.findOneAndUpdate(
    //   {
    //     _id: mongoID,
    //     "yearlyPoints.realm": oldHouse.house,
    //   },
    //   { "yearlyPoints.$.realm": house }
    // );

    // await Student.findOneAndUpdate(
    //   {
    //     _id: mongoID,
    //     "totalPoints.realm": oldHouse.house,
    //   },
    //   {
    //     "totalPoints.$.realm": house,
    //     house: house,
    //   }
    // );

    const change = await Student.findById(mongoID);
    console.log(house);
    return change;
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = updateHouse;
