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
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Teacher = require("../models/Teacher");
const config = require("config");
const auth = require("../middleware/auth");

const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const llHead = config.get("llHead");
const llEndPoint = config.get("llEndPoint");

const router = express.Router();

// @route       GET api/auth
// @desc        Get logged in user
// @access      Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await Teacher.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route       Post api/auth
// @desc        Login user
// @access      Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await Teacher.findOne({ email: email });
      if (!user) {
        return res.status(400).json({ msg: "Invalid User" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      console.log(user);

      if (!user || !isMatch || user.archived) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      const date = new Date();

      await Teacher.findByIdAndUpdate(
        { _id: user._id },
        {
          lastLogin: date.getTime(),
        }
      );

      const payload = {
        user: {
          id: user.id,
          role: user.role,
          tokenDate: Date.now(),
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 3600000,
        },
        (err, token) => {
          if (err) throw err;

          const headers = {
            Authorization: llHead,
            "X-Experience-API-Version": "1.0.3",
            "Content-Type": "application/json",
          };

          const id = uuidv4();
          statement = {
            id: id,
            actor: {
              name: `${user.lastName} ${user.firstName}`,
              mbox: `mailto:${user.email}`,
            },
            verb: {
              id: `https://brindlewaye.com/xAPITerms/verbs/loggedin/`,
              display: {
                en: "logged into",
              },
            },
            object: {
              id: `${llEndPoint}/houses`,
              definition: {
                type: `${llEndPoint}/houses/`,
                name: {
                  en: `OCAC Houses`, //Change this to read the name from some config file
                },
              },
            },
            context: {
              platform: "Houses",
            },
          };

          // axios.put(
          //   `${llEndPoint}/statements?statementId=${statement.id}`,
          //   statement,
          //   { headers: headers }
          // );

          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route       PUT api/auth/:id
// @desc        Set teacher tokens to be valid from current time (revoke all existing tokens)
// @access      Private
router.put("/:id", auth, async (req, res) => {
  try {
    let teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ msg: "User not found" });

    teacher = await Teacher.findByIdAndUpdate(
      { _id: req.params.id },
      {
        validFrom: Date.now(),
      }
    );
    res.json({ validFrom: teacher.validFrom });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      msg: "Server Error",
      route: "api/auth/:id",
      method: "put",
    });
  }
});

// @route       PUT api/auth/pass/:id
// @desc        Change Password
// @access      Private
router.put("/pass/:id", auth, async (req, res) => {
  try {
    let user = await Teacher.findById(req.params.id);
    if (!user) {
      return res.status(400).json({ msg: "Invalid User" });
    }
    const isMatch = await bcrypt.compare(req.body.oldPass, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Old Password is invalid" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const enPass = await bcrypt.hash(req.body.pass1, salt);

      await Teacher.findByIdAndUpdate(req.params.id, {
        password: enPass,
      });

      res.json({ msg: "Password changed successfully" });
    }
  } catch (err) {
    res.status(500).json({
      msg: "Server Error",
      route: "api/auth/pass/:id",
      method: "put",
    });
    console.log(err.message);
  }
});

module.exports = router;
