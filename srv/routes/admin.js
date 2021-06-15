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

const express = require("express");
const bcrypt = require("bcryptjs");

const Teacher = require("../models/Teacher");
const authAdmin = require("../middleware/authAdmin");

const router = express.Router();

// @route       PUT api/admin/pass/:id
// @desc        Change or add a password for a different user
// @access      Private - Admin only
router.put("/pass/:id", authAdmin, async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const { password } = req.body;

  try {
    const enPass = await bcrypt.hash(password, salt);
    await Teacher.findByIdAndUpdate(req.params.id, {
      password: enPass,
    });
    res.json({ msg: `Setting password for user with ${req.params.id}` });
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
