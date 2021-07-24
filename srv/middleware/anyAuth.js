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

const jwt = require("jsonwebtoken");
const config = require("config");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");

module.exports = async function (req, res, next) {
  // Get token from header
  const token = req.header("x-auth-token");
  // Check if not token
  if (!token) {
    res.status(401).json({ msg: "Unauthorized Access - No token" });
    return;
  }

  try {
    let user;
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    console.log(decoded.user.role.slice(0, 1));
    decoded.user.role === "Teacher"
      ? (user = await Teacher.findById({ _id: decoded.user.id }))
      : (user = await Student.findById({ _id: decoded.user.id }));

    if (decoded.user.tokenDate < user.validFrom) {
      res.status(401).json({ msg: "Token has expired" });
      return;
    }
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
    return;
  }
};