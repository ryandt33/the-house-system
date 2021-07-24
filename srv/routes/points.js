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
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const config = require("config");
const authAdmin = require("../middleware/authAdmin");

const llHead = config.get("llHead");
const llEndPoint = config.get("llEndPoint");
const useLL = config.get("useLL");

const auth = require("../middleware/auth");
const router = express.Router();

const Point = require("../models/Point");
const Category = require("../models/Category");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const House = require("../models/House");

// @route       GET api/points
// @desc        Get all points (varying levels of filter)
// @access      Private
router.get("/", auth, async (req, res) => {
  try {
    const points = await Point.find({});
    res.json(points);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/totalToAll", authAdmin, async (req, res) => {
  const houses = await House.find({}, "monthlyPoints yearlyPoints totalPoints");

  for (let house of houses) {
    const hs = await House.findByIdAndUpdate(house._id, {
      monthlyPoints: house.totalPoints,
      yearlyPoints: house.totalPoints,
    });
  }
  res.send("Sent total points to all point categories");
});

// @route       GET api/points/:id
// @desc        Get points belonging to student (varying levels of filter)
// @access      Private
router.get("/:id", auth, async (req, res) => {
  try {
    const points = await Student.find({ _id: req.params.id })
      .select("points")
      .populate("points.point");

    res.json(points[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route       POST api/points
// @desc        Create a point
// @access      Private
router.post(
  "/",
  [
    auth,
    [
      check("value", "Please enter a value").notEmpty(),
      check("category", "Please enter a category").notEmpty(),
      check("receiver", "Please show who will receive the point").notEmpty(),
      check("realm", "Please enter the realm for this ticket").notEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { value, category, message, receiver, realm } = req.body;
    const cat = await Category.findOne({ name: category });
    console.log(cat);

    try {
      const newPoint = new Point({
        value: value,
        category: category,
        message: message,
        giver: req.user.id,
        receiver: receiver,
        realm: realm,
      });

      console.log(category);

      const point = await newPoint.save();
      const sharePoint = {
        point: point._id,
      };

      const tea = await Teacher.findOne({ _id: req.user.id });
      const stu = await Student.findOne({ _id: receiver });

      await Student.findOneAndUpdate(
        {
          _id: receiver,
          "monthlyPoints.realm": realm,
        },
        { $inc: { "monthlyPoints.$.points": value } }
      );

      await Student.findOneAndUpdate(
        {
          _id: receiver,
          "yearlyPoints.realm": realm,
        },
        { $inc: { "yearlyPoints.$.points": value } }
      );

      await Student.findOneAndUpdate(
        {
          _id: receiver,
          "totalPoints.realm": realm,
        },
        {
          $inc: { "totalPoints.$.points": value },
          $push: { points: sharePoint },
        }
      );

      await Teacher.findByIdAndUpdate(req.user.id, {
        $push: { points: sharePoint },
      });

      await House.findByIdAndUpdate(stu.house, {
        // $inc: { monthlyPoints: value, yearlyPoints: value, totalPoints: value },
        $inc: { monthlyPoints: value, yearlyPoints: value, totalPoints: value },

        $push: { points: sharePoint },
      });

      if (useLL) {
        const headers = {
          Authorization: llHead,
          "X-Experience-API-Version": "1.0.3",
          "Content-Type": "application/json",
        };

        const id = uuidv4();
        statement = {
          id: id,
          actor: {
            name: `${stu.lastName} ${stu.firstName}`,
            mbox: `mailto:${stu.email}`,
          },
          verb: {
            id: `${llEndPoint}/verbs/award`,
            display: {
              en: "was awarded",
            },
          },
          object: {
            id: `${llEndPoint}/point/${category}`,
            definition: {
              type: `${llEndPoint}/point/`,
              name: {
                en: `${category}`,
              },
            },
          },
          context: {
            platform: "Houses",
            instructor: {
              name: `${tea.lastName} ${tea.firstName}`,
              mbox: `mailto:${tea.email}`,
            },
          },
        };
        console.log(`${llEndPoint}/statements?statementId=${statement.id}`);

        axios.put(
          `${llEndPoint}/statements?statementId=${statement.id}`,
          statement,
          { headers: headers }
        );
      }

      // if (usePSQL) {
      //   const date = Date.now();
      //   const today = new Date(date);
      //   const payload = {
      //     points: {
      //       context: "houses",
      //       userID: stu.studentID,
      //       supervisorID: tea.mbID.toString(),
      //       space: stu.house,
      //       time: `${today.getUTCFullYear()}-${
      //         today.getUTCMonth() + 1
      //       }-${today.getUTCDate()}`,
      //       point_value: value.toString(),
      //       comment: message,
      //     },
      //   };
      //   try {
      //     await axios.post(psqlURL, payload, {
      //       headers: {
      //         "content-type": "application/json",
      //         token: "123321",
      //       },
      //     });
      //   } catch (err) {
      //     console.error(err.response.data.errors);
      //   }
      // }

      // point.value > 0 &&
      //   req.io.emit("new point", {
      //     student: {
      //       firstName: stu.firstName,
      //       lastName: stu.lastName,
      //       studentID: stu.studentID,
      //     },
      //     teacher: {
      //       firstName: tea.firstName,
      //       lastName: tea.lastName,
      //     },
      //     point: point,
      //     category: {
      //       backgroundColor: cat.backgroundColor,
      //       color: cat.color,
      //     },
      //   });

      res.json(point);
    } catch (err) {
      console.error(err.response.data.warnings);
      res.status(500).send("Server Error");
    }
  }
);

// @route       PUT api/points/:id
// @desc        Edit a point
// @access      Private
// This might not be a great idea - might be better to delete the point and reassign...
router.put(
  "/:id",
  [
    authAdmin,
    [
      check("value", "Please enter a value").notEmpty(),
      check("category", "Please enter a category").notEmpty(),
    ],
  ],
  authAdmin,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { value, category, message } = req.body;

    try {
      await Point.findByIdAndUpdate(req.params.id, {
        value: value,
        category: category,
        message: message,
      });
      res.json({ msg: "Point updated" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route       DELETE api/points/:id
// @desc        Delete a point
// @access      Private
router.delete("/:id", authAdmin, async (req, res) => {
  try {
    let point = await Point.findById(req.params.id);
    if (!point) return res.status(404).json({ msg: "Point not found" });

    const { value, receiver, realm } = point;
    let stu = await Student.findOne({ _id: receiver });

    await Student.findOneAndUpdate(
      {
        _id: receiver,
        "monthlyPoints.realm": realm,
      },
      { $inc: { "monthlyPoints.$.points": -value } }
    );

    await Student.findOneAndUpdate(
      {
        _id: receiver,
        "yearlyPoints.realm": realm,
      },
      { $inc: { "yearlyPoints.$.points": -value } }
    );

    await Student.findOneAndUpdate(
      {
        _id: receiver,
        "totalPoints.realm": realm,
      },
      {
        $inc: { "totalPoints.$.points": -value },
        $pull: { points: { point: req.params.id } },
      }
    );

    await Teacher.findByIdAndUpdate(req.user.id, {
      $pull: { points: { point: req.params.id } },
    });

    console.log(
      await House.findById(stu.house, "monthlyPoints yearlyPoints totalPoints")
    );
    await House.findByIdAndUpdate(stu.house, {
      $inc: {
        monthlyPoints: -value,
      },
    });

    console.log(
      await House.findById(stu.house, "monthlyPoints yearlyPoints totalPoints")
    );

    await House.findByIdAndUpdate(stu.house, {
      $inc: {
        yearlyPoints: -value,
      },
    });

    await House.findByIdAndUpdate(stu.house, {
      $inc: {
        totalPoints: -value,
      },
    });

    console.log(
      await House.findById(stu.house, "monthlyPoints yearlyPoints totalPoints")
    );

    stu = await Student.findById({ _id: receiver });

    res.json(point);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
