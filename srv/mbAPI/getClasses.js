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
const addClass = require("../services/addClass");
const updateClass = require("../services/updateClass");

const Class = require("../models/Class");

const getClasses = async () => {
  const wait = async () => {
    console.log("hi");
    new Promise((resolve) => {
      setTimeout(() => resolve(), 5000);
    });
  };
  const mbConfig = {
    headers: {
      "auth-token": mbAPIKey,
    },
  };

  const checkExists = async () => {
    //This function will go through each class in the system, ping MB, and see if it still exists
    const classes = await Class.find({});
    for (let x = 0; x < classes.length; x++) {
      try {
        console.log(`${x} - Checking if ${classes[x].name} exists`);
        const res = await axios.get(
          `https://api.managebac.cn/v2/classes/${classes[x].mbID}`,
          mbConfig
        );
        await Class.findByIdAndUpdate(classes[x]._id, { archived: false });
      } catch (err) {
        if (err.response.status === 404) {
          await Class.findByIdAndUpdate(classes[x]._id, { archived: true });
          console.log(
            `${classes[x].name} cannot be found and will be archived.`
          );
        } else if (err.response.status === 429) {
          console.log("Going to fast, will wait 30 seconds");
          await new Promise((resolve) => setTimeout(resolve, 30000));
        }
      }
    }
  };

  const checkUnique = async (newClass) => {
    console.log(`${newClass.name} - ${newClass.id}`);
    const cls = await Class.findOne({ mbID: newClass.id });
    if (!cls) {
      try {
        console.log(`Creating ${newClass.name}`);
        await addClass(newClass);
      } catch (err) {
        console.error(err.message);
      }
    } else {
      // UPDATE CLASSES
      const { name, shortCode, section, updated, teachers } = cls;
      const change =
        newClass.name !== name ||
        newClass.uniq_id !== shortCode ||
        newClass.class_section !== section;
      try {
        await updateClass(newClass, cls._id);
      } catch (err) {
        console.error(err.message);
      }
    }
  };

  try {
    await checkExists();
    let page = 0;
    let res;
    do {
      page++;
      res = await axios.get(
        `https://api.managebac.${mbSuffix}/v2/classes?per_page=500&page=${page}`,
        mbConfig
      );
      for (let x = 0; x < res.data.classes.length; x++) {
        await checkUnique(res.data.classes[x]);
      }
      console.log(res.data.meta.total_pages);
    } while (res.data.meta.current_page !== res.data.meta.total_pages);
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = getClasses;
