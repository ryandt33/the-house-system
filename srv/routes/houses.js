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
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

const House = require("../models/House");
const Student = require("../models/Student");

// @route       GET api/houses
// @desc        Get all houses
// @access      Private
router.get("/", auth, async (req, res) => {
  try {
    const houses = await House.find({}).select("-students -points");
    res.json({ houses });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route       POST api/houses
// @desc        Create a house
// @access      Private
router.post(
  "/",
  [
    authAdmin,
    [check("name", "Please include a valid, unique house name").notEmpty()],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, picture } = req.body;

    try {
      const newHouse = new House({
        name: name,
        picture: picture,
      });
      const house = await newHouse.save();
      res.json(house);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route       PUT api/houses/:id
// @desc        Edit a house
// @access      Private
router.put(
  "/:id",
  [
    authAdmin,
    [check("name", "Please include a valid, unique house name").notEmpty()],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, picture, color, backgroundColor } = req.body;

    try {
      await House.findByIdAndUpdate(req.params.id, {
        name: name,
        picture: picture,
        color: color,
        backgroundColor,
        backgroundColor,
      });
      res.json({ msg: "House updated" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route       DELETE api/houses/:id
// @desc        Delete a house
// @access      Private
router.delete("/:id", authAdmin, async (req, res) => {
  try {
    await Student.updateMany(
      { house: req.params.id },
      {
        house: null,
      }
    );

    await House.findByIdAndRemove({ _id: req.params.id });

    res.send("House deleted.");
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
