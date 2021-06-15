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
const { check, validationResult } = require("express-validator");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const Teacher = require("../models/Teacher");
const addTeacher = require("../services/addTeacher");
const updateTeacher = require("../services/updateTeacher");

// @route       GET api/teachers
// @desc        Get all teachers
// @access      Private
router.get("/", auth, async (req, res) => {
  try {
    const teachers = await Teacher.find({});
    res.json(teachers);
  } catch (err) {
    console.error(err.message);
  }
});

// @route       POST api/teachers
// @desc        Create a teacher
// @access      Private
router.post("/", auth, async (req, res) => {
  const teacher = await addTeacher(req.body);
  if (teacher) {
    res.json(teacher);
  } else {
    res.status(500).send("Server Error");
  }
});

// @route       PUT api/teachers/:id
// @desc        Edit a teacher
// @access      Private
router.put("/:id", auth, async (req, res) => {
  try {
    updateTeacher(req.body, req.params.id);
    res.send("Student Patched");
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route       PUT api/teachers/pass/:id
// @desc        Change or add a password
// @access      Private
router.put(
  "/pass/:id",
  [
    check(
      "password",
      "Please enter a password with 8 or more characters."
    ).isLength({
      min: 8,
    }),
  ],
  auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const salt = await bcrypt.genSalt(10);
    const { password, oldPassword } = req.body;

    try {
      const enPass = await bcrypt.hash(password, salt);

      const tea = await Teacher.findOne({ _id: req.params.id });

      if (
        tea.password &&
        (!oldPassword || !(await bcrypt.compare(oldPassword, tea.password)))
      ) {
        res.status(400).json({ msg: "Invalid current password" });
      } else {
        await Teacher.findByIdAndUpdate(req.params.id, {
          password: enPass,
        });
        res.json(tea);
      }
    } catch (err) {
      console.error(err.message);
    }
  }
);

// @route       DELETE api/teachers/:id
// @desc        Delete a teacher
// @access      Private
router.delete("/:id", auth, async (req, res) => {
  try {
    let teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ msg: "Contact not found" });

    if (req.user.role !== "Admin") {
      return res.status(401).json({ msg: "Invalid permissions" });
    }
    await Teacher.findByIdAndRemove({ _id: req.params.id });

    res.send("Teacher deleted.");
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      msg: "Server Error",
      route: "api/teachers/:id",
      method: "delete",
    });
  }
});

module.exports = router;
