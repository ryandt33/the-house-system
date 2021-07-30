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
const anyAuth = require("../middleware/anyAuth");

const Category = require("../models/Category");

// @route       GET api/categories
// @desc        Get all categories
// @access      Private
router.get("/", anyAuth, async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json({ categories });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route       Post api/categories
// @desc        Create a new category
// @access      Private
router.post(
  "/",
  [
    authAdmin,
    [
      check("name", "Please include a valid, unique category name").notEmpty(),
      check(
        "backgroundColor",
        "Please include a valid category background color"
      ).notEmpty(),
      check("color", "Please include a valid category color").notEmpty(),
      check("realm", "Please include a valid realm").notEmpty(),
      check("value", "Please include a valid value for the category")
        .notEmpty()
        .isNumeric(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, backgroundColor, color, realm, value } = req.body;
    try {
      const newCategory = new Category({
        name: name,
        backgroundColor: backgroundColor,
        color: color,
        realm: realm,
        value: value,
      });
      const cat = await newCategory.save();
      res.json(cat);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

router.put("/:id", authAdmin, async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);

    //Check if these values have been passed... if so, update
    req.body.name && (cat.name = req.body.name);
    req.body.backgroundColor &&
      (cat.backgroundColor = req.body.backgroundColor);
    req.body.color && (cat.color = req.body.color);
    req.body.realm && (cat.realm = req.body.realm);
    req.body.value && (cat.value = req.body.value);
    req.body.hasOwnProperty("archived") && (cat.archived = req.body.archived);

    await Category.findByIdAndUpdate(req.params.id, {
      name: cat.name,
      backgroundColor: cat.backgroundColor,
      color: cat.color,
      realm: cat.realm,
      value: cat.value,
      archived: cat.archived,
    });

    res.send(`${cat.name} has been updated`);
  } catch (err) {
    console.error(err.message);
  }
});

// @route       PATCH api/categories/:id
// @desc        Archive/unarchive a category
// @access      ADMIN only
router.patch("/:id", authAdmin, async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(400).json({ msg: "Invalid category ID." });
  } else {
    await Category.findByIdAndUpdate(req.params.id, {
      archived: !category.archived,
    });

    res.status(200).json({
      msg: `${category.name} was ${
        !category.archived ? "archived" : "unarchived"
      }.`,
    });
  }
});

// @route       DELETE api/categories/:id
// @desc        Delete a vategory
// @access      Private
router.delete("/:id", authAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndRemove({ _id: req.params.id });
    console.log(category);
    if (!category) {
      res.send("Invalid category");
    }
    res.send("Category deleted.");
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
