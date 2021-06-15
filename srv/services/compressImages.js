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

const compressImages = require("compress-images");
const fs = require("fs");
const path = require("path");

const compress = async () => {
  const dirPath = path.join(__dirname, "../images");

  fs.readdir(dirPath, (err, files) => {
    if (err) {
      return console.log(`Unable to scan director: ${err}`);
    }
    files.forEach(function (file) {
      const stats = fs.statSync(dirPath + "/" + file);
      if (stats["size"] / 100000 > 10) {
        compressImages(
          `${dirPath}/${file}`,
          `${dirPath}/.../smallImages/`,
          { compress_force: false, statistic: true, autoupdate: true },
          false,
          { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
          { png: { engine: "pngquant", command: ["--quality=20-50"] } },
          { svg: { engine: "svgo", command: "--multipass" } },
          {
            gif: {
              engine: "giflossy",
              command: ["--colors", "64", "--use-col=web"],
            },
          },
          function (error, completed, statistic) {
            console.log("-------------");
            console.log(error);
            console.log(completed);
            console.log(statistic);
            console.log("-------------");
          }
        );
      }
    });
  });
};

module.exports = compress;
