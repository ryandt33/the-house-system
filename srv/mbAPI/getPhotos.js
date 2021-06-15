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
const Fs = require("fs");
const Path = require("path");

const Student = require("../models/Student");

const getPhotos = async () => {
  const delay = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 30000);
    });
  };

  try {
    const mbConfig = {
      responseType: "stream",
      headers: {
        "auth-token": mbAPIKey,
      },
    };
    const patt = new RegExp("avatar", "i");
    const avatar = Path.resolve(__dirname, "../images/avatar.png");
    const noPhoto = await Student.find({ photoURL: null });
    for (let x = 0; x < noPhoto.length; x++) {
      let student = noPhoto[x];
      await Student.findOneAndUpdate(
        { mbID: student.mbID },
        { photoURL: avatar }
      );
    }
    const students = await Student.find({ photoURL: { $ne: null } });
    for (let x = 0; x < students.length; x++) {
      let student = students[x];

      if (student.photoURL.match(patt)) {
        console.log(
          `${x}: Processing ${student.firstName} ${student.lastName}`
        );
        let path = Path.resolve(
          __dirname,
          "../images",
          `${student.studentID}.jpg`
        );
        let writer = Fs.createWriteStream(path);
        try {
          let photo = await axios.get(
            `https://api.managebac.${mbSuffix}/v2/avatars/${student.mbID}`,
            mbConfig
          );
          photo.data.pipe(writer);
          new Promise(async (resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
            await Student.findOneAndUpdate(
              { mbID: student.mbID },
              { photoURL: path }
            );
          });
        } catch (err) {
    if (err.response.status === 429) {
      console.log("429 error, waiting 30 seconds and retrying.\n");
      await delay();
    } else {
      console.error(err.response.status);
    }
        }
      }
    }
    return students;
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = getPhotos;
