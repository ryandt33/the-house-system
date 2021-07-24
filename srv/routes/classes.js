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
const auth = require("../middleware/auth");
const config = require("config");
const authAdmin = require("../middleware/authAdmin");
const mbAPIKey = config.get("mbAPIKey");
const mbSuffix = config.get("mbSuffix");
const router = express.Router();
const addClass = require("../services/addClass");
const axios = require("axios");
const Fs = require("fs");
const Path = require("path");

const Class = require("../models/Class");
const Student = require("../models/Student");

// @route       GET api/classes
// @desc        Get all classes
// @access      Private
router.get("/", auth, async (req, res) => {
  try {
    const classes = await Class.find({});

    res.json(classes);
  } catch (err) {
    console.error(err.message);
  }
});

// @route       GET api/classes/:id
// @desc        Get a specific Class
// @access      Private
router.get("/:id", auth, async (req, res) => {
  try {
    const classes = await Class.findById({ _id: req.params.id });

    res.json(classes);
  } catch (err) {
    console.error(err.message);
  }
});

// @route       GET api/classes/teacher/:id
// @desc        Get classes belonging to a teacher
// @access      Private
router.get("/teacher/:id", auth, async (req, res) => {
  try {
    const classes = await Class.find(
      {
        "teachers.teacher": req.params.id,
      },
      "_id, name archived"
    );
    console.log(classes);
    res.json(classes);
  } catch (err) {
    console.error(err.message);
  }
});

// @route       GET api/classes/students/:id
// @desc        Get students in a class
// @access      Private
router.get("/students/:id", auth, async (req, res) => {
  try {
    const students = await Class.findById(
      { _id: req.params.id },
      "students"
    ).populate("students.student students.student.points");
    console.log(students);
    res.json(students);
  } catch (err) {
    console.error(err.message);
  }
});

// // @route       GET api/classes/filter/:search
// // @desc        Filter classes by name
// // @access      Private
// router.get("/filter/:search", auth, async (req, res) => {
//   try {
//     // Try and change the state that projects to this... if there is a space in the string it sends in two strings that are then searched then use the $and operator... could be another function... or it could resolve itself on the client side
//     let classes = await Class.find({
//       $or: [
//         { firstName: { $regex: `${req.params.search}`, $options: "gi" } },
//         { ClassID: { $regex: `${req.params.search}`, $options: "g" } },
//         { lastName: { $regex: `${req.params.search}`, $options: "gi" } },
//         { otherName: { $regex: `${req.params.search}`, $options: "gi" } },
//       ],
//     });
//     res.json(classes);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

// @route       POST api/classes
// @desc        Create a Class
// @access      Private
router.post("/", authAdmin, async (req, res) => {
  const Class = await addClass(req.body);
  if (Class) {
    res.json(Class);
  } else {
    res.status(500).send("Server error");
  }
});

// // @route       PUT api/classes/:id
// // @desc        Edit a Class
// // @access      Private
// router.put("/:id", async (req, res) => {
//   try {
//     updateClass(req.body, req.params.id);
//     res.send("Class updated");
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// @route       DELETE api/classes/:id
// @desc        Delete a Class
// @access      Private
router.delete("/:id", authAdmin, async (req, res) => {
  try {
    let Class = await Class.findById(req.params.id);
    if (!Class) return res.status(404).json({ msg: "Class not found" });

    if (req.user.role !== "Admin") {
      return res.status(401).json({ msg: "Invalid permissions" });
    }
    await Class.findByIdAndRemove({ _id: req.params.id });

    res.send("Class deleted.");
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
