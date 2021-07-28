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
const anyAuth = require("../middleware/anyAuth");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const config = require("config");
const mbAPIKey = config.get("mbAPIKey");
const mbSuffix = config.get("mbSuffix");
const router = express.Router();
const addStudent = require("../services/addStudent");
const updateStudent = require("../services/updateStudent");
const updateHouse = require("../services/updateHouse");
const axios = require("axios");
const Fs = require("fs");
const Path = require("path");
const bcrypt = require("bcryptjs");
const Student = require("../models/Student");
const House = require("../models/House");
const exportToCsv = require("../services/exportToCsv");
const authStudent = require("../middleware/authStudent");

// @route       GET api/students
// @desc        Get all students
// @access      Private
router.get("/", auth, async (req, res) => {
  try {
    const students = await Student.find({});

    res.json(students);
  } catch (err) {
    console.error(err.message);
  }
});

// @route       GET api/students/me
// @desc        Get students' own data
// @access      Private to Student
router.get("/me", authStudent, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);

    res.json(student);
  } catch (err) {
    console.error(err.message);
  }
});

// @route       GET api/students/hr/:id
// @desc        Get all students in a homeroom
// @access      Private
router.get("/hr/:id", auth, async (req, res) => {
  try {
    const students = await Student.find({
      homeroomID: req.params.id,
      archived: false,
    })
      .populate("points.point")
      .sort({
        "monthlyPoints.points": -1,
      });

    res.json(students);
  } catch (err) {
    console.error(err.message);
  }
});

// @route       GET api/students/top
// @desc        Get top ten students in school
// @access      Private
router.get("/top", auth, async (req, res) => {
  try {
    const students = await Student.find(
      { archived: false },
      "firstName lastName studentID realm monthlyPoints.points points otherName nickname house photoURL"
    )
      .populate("points.point")
      .sort({ "monthlyPoints.points": -1 })
      .limit(12);
    res.json(students);
  } catch (err) {
    console.error(err.message);
  }
  // db.students.find({"monthlyPoints.realm":"5e10344a3830750b79e38403"}).sort({"monthlyPoints.$.points": -1})
  // THE ABOVE CODE SHOULD DO THE SEARCH FOR THE MOST PART
});

router.get("/csv", authAdmin, async (req, res) => {
  try {
    await exportToCsv();
    res.send("Exporting to CSV");
  } catch (err) {
    console.error(err.message);
  }
});

// @route       GET api/students/:id
// @desc        Get a specific student
// @access      Private
router.get("/:id", auth, async (req, res) => {
  try {
    const students = await Student.findById({ _id: req.params.id }).populate(
      "points.point"
    );
    res.json(students);
  } catch (err) {
    console.error(err.message);
  }
});

// @route       GET api/students/pic/:mbid
// @desc        Get a specific student's picture
// @access      Private
router.get("/pic/:id", anyAuth, async (req, res) => {
  try {
    // const student = await Student.findOne({ mbID: req.params.mbid });

    // const path = Path.resolve(
    //   __dirname,
    //   "../images",
    //   `${student.studentID}.jpg`
    // );
    // const writer = Fs.createWriteStream(path);
    // const mbConfig = {
    //   responseType: "stream",
    //   headers: {
    //     "auth-token": mbAPIKey
    //   }
    // };

    // const photo = await axios.get(
    //   `https://api.managebac.${mbSuffix}/v2/avatars/${req.params.mbid}/v1`,
    //   mbConfig
    // );
    // photo.data.pipe(writer);
    // return new Promise(async (resolve, reject) => {
    //   writer.on("finish", resolve);
    //   writer.on("error", reject);
    //   await Student.findOneAndUpdate(
    //     { mbID: req.params.mbid },
    //     { photoURL: path }
    //   );
    const stu = await Student.findOne({ studentID: req.params.id });
    if (stu.photoURL) {
      res.sendFile(stu.photoURL);
    } else {
      res.status(404).send("Photo Missing");
    }
    // });
  } catch (err) {
    console.error(err.message);
  }
});

// @route       GET api/students/filter/:search
// @desc        Filter students by name
// @access      Private
router.get("/filter/:search", auth, async (req, res) => {
  try {
    // Try and change the state that projects to this... if there is a space in the string it sends in two strings that are then searched then use the $and operator... could be another function... or it could resolve itself on the client side
    let students = await Student.find({
      $or: [
        { firstName: { $regex: `${req.params.search}`, $options: "gi" } },
        { studentID: { $regex: `${req.params.search}`, $options: "g" } },
        { lastName: { $regex: `${req.params.search}`, $options: "gi" } },
        { otherName: { $regex: `${req.params.search}`, $options: "gi" } },
        { nickname: { $regex: `${req.params.search}`, $options: "gi" } },
      ],
      archived: false,
    });
    res.json(students);
  } catch (err) {
    console.error(err.message);
  }
});

// @route       GET api/students/sid/:id
// @desc        Get a specific student by student id
// @access      Private
router.get("/sid/:id", auth, async (req, res) => {
  try {
    const students = await Student.findOne({
      studentID: req.params.id,
    }).populate("points.point");

    res.json(students);
  } catch (err) {
    console.error(err.message);
  }
});

// @route       POST api/students
// @desc        Create a student
// @access      Private
router.post("/", authAdmin, async (req, res) => {
  const student = await addStudent(req.body);
  if (student) {
    res.json(student);
  } else {
    res.status(500).send("Server error");
  }
});

// @route       PUT api/students/:id
// @desc        Edit a student
// @access      Private
router.put("/:id", authAdmin, async (req, res) => {
  try {
    console.log(req.body);
    updateStudent(req.body, req.params.id);
    res.send("Student updated");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route       PUT api/students/house/:id
// @desc        Edit a student
// @access      Private
router.put("/house/:id", authAdmin, async (req, res) => {
  try {
    const student = await updateHouse(req.body, req.params.id);
    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// // @route       PUT api/students/house/:id
// // @desc        Edit a student's house
// // @access      Private
// router.put("/house/:id", auth, async (req, res) => {
//   try {
//     const houseID = await House.findOne({ name: req.body.name });

//     if (!houseID) {
//       res.json({ msg: "Invalid house" });
//       return;
//     }
//     await Student.findByIdAndUpdate(req.params.id, {
//       house: houseID._id
//     });
//     await Student.findOneAndUpdate(
//       {
//         _id: req.params.id,
//         "monthlyPoints.realm": oldHouse
//       },
//       { "monthlyPoints.$.realm": houseID }
//     );

//     await Student.findOneAndUpdate(
//       {
//         _id: req.params.id,
//         "yearlyPoints.realm": realm
//       },
//       { "yearlyPoints.$.realm": houseID }
//     );

//     await Student.findOneAndUpdate(
//       {
//         _id: req.params.id,
//         "totalPoints.realm": realm
//       },
//       {
//         "totalPoints.$.realm": houseID
//       }
//     );
//     console.log("hi");
//     console.log(Student.findById(req.params.id));
//     res.json(houseID);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// @route       DELETE api/students/:id
// @desc        Delete a student
// @access      Private
router.delete("/:id", authAdmin, async (req, res) => {
  try {
    let student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ msg: "Contact not found" });

    if (req.user.role !== "Admin") {
      return res.status(401).json({ msg: "Invalid permissions" });
    }
    await Student.findByIdAndRemove({ _id: req.params.id });

    res.send("Student deleted.");
  } catch (err) {
    console.error(err);
  }
});

// @route       PUT api/students/pass/:id
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

      const stu = await Student.findOne({ _id: req.params.id });

      if (
        stu.password &&
        (!oldPassword || !(await bcrypt.compare(oldPassword, stu.password)))
      ) {
        res.status(400).json({ msg: "Invalid current password" });
      } else {
        await Student.findByIdAndUpdate(req.params.id, {
          password: enPass,
        });
        res.json(stu);
      }
    } catch (err) {
      console.error(err.message);
    }
  }
);

module.exports = router;
