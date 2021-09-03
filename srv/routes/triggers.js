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
const auth = require("../middleware/auth");
const router = express.Router();
const config = require("config");
const axios = require("axios");

const getStudents = require("../mbAPI/getStudents");
const getTeachers = require("../mbAPI/getTeachers");
const getClasses = require("../mbAPI/getClasses");
const getPhotos = require("../mbAPI/getPhotos");
const passGen = require("../services/passGen");
const assignHouses = require("../services/assignHousesClean");
const popClass = require("../mbAPI/popClass");
const clearPoints = require("../services/clearPoints");

const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const authAdmin = require("../middleware/authAdmin");
const Point = require("../models/Point");
const House = require("../models/House");
const fs = require("fs");
const path = require("path");

// @route       GET api/triggers/student
// @desc        Get and update students
// @access      Dev
router.get("/students", authAdmin, async (req, res) => {
  try {
    await getStudents();
    await assignHouses();
    res.json({ status: "success", msg: "Fetched MB Users" });
  } catch (error) {
    res.json({ status: "failed", msg: error.msg });
  }
});

// @route       GET api/triggers/teacher
// @desc        Get and update teachers
// @access      Dev
router.get("/teachers", authAdmin, (req, res) => {
  getTeachers();
  res.send("Fetch all teachers and update");
});

// @route       GET api/triggers/photos
// @desc        Get photos
// @access      Dev
router.get("/photos", authAdmin, async (req, res) => {
  getPhotos();
  res.send("Fetching photos");
});

// @route       GET api/triggers/teacher/pass
// @desc        Get and update teachers
// @access      Dev
router.get("/teachers/pass", authAdmin, async (req, res) => {
  const users = await passGen(Teacher);
  res.send(users);
});

// @route       GET api/triggers/houses
// @desc        Assign students to houses
// @access      Dev
router.get("/houses", authAdmin, async (req, res) => {
  try {
    assignHouses();
    res.json({ msg: "House assignment ongoing" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route       GET api/triggers/classes
// @desc        Get and update classes
// @access      Dev
router.get("/classes", authAdmin, async (req, res) => {
  try {
    await getClasses();
    res.json({ msg: "Classes were fetched" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route       GET api/triggers/classes/students
// @desc        Get and populate classes
// @access      Dev
router.get("/classes/students", authAdmin, async (req, res) => {
  try {
    await popClass();
    res.json({ msg: "Students were Added" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/clearMonthly", authAdmin, async (req, res) => {
  try {
    await clearPoints("monthlyPoints");
    res.send("Cleared Monthly Points");
  } catch (err) {
    console.error(err.message);
  }
});

router.get("/clearYearly", authAdmin, async (req, res) => {
  try {
    await clearPoints("yearlyPoints");
    res.send("Cleared Yearly Points");
  } catch (err) {
    console.error(err.message);
  }
});

router.get("/genCSVSample", authAdmin, async (req, res) => {
  try {
    let csv = "first_name,last_name,email,house";

    const students = await Student.find().sort("archived");

    const houses = await House.find();

    for (let s of students) {
      if (!s.archived) {
        const house = houses.find(
          (h) => h._id.toString() === s.house.toString()
        );
        csv += `\n${s.firstName},${s.lastName},${s.email},${
          house && house.name
        }`;
      }
    }

    fs.writeFileSync(`${__dirname}/../sharedFiles/import_template.csv`, csv);

    res.sendFile(path.resolve("./srv/sharedFiles/import_template.csv"));
  } catch (err) {
    console.error(err.message);

    res.status(500).json({ msg: err.message });
  }
});

// router.get("/postOldPoints", authAdmin, async (req, res) => {
//   try {
//     const allPoints = await Point.find();
//     for (point of allPoints) {
//       const stu = await Student.findById(point.receiver);
//       const tea = await Teacher.findById(point.giver);
//       const date = Date.now();
//       const today = new Date(date);
//       const payload = {
//         points: {
//           context: "houses",
//           userID: stu.studentID,
//           supervisorID: tea.mbID.toString(),
//           space: stu.house,
//           time: `${today.getUTCFullYear()}-${
//             today.getUTCMonth() + 1
//           }-${today.getUTCDate()}`,
//           point_value: point.value.toString(),
//           comment: point.message,
//         },
//       };
//       await axios.post(psqlURL, payload, {
//         headers: {
//           "content-type": "application/json",
//           token: "123321",
//         },
//       });
//     }
//   } catch (error) {
//     console.error(error);
//   }
//   res.send("Posted all points to PSQL");
// });

// router.get("/pics/compress", auth, async (req, res) => {
//   try {
//     await compressImages();
//     res.json({ msg: "Images were compressed" });
//   } catch (err) {
//     console.error(err.message);
//   }
// });

module.exports = router;
