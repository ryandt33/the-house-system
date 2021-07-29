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

const mongoose = require("mongoose");

const StudentSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  otherName: {
    type: String,
  },
  nickname: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mbID: {
    type: Number,
    unique: true,
  },
  studentID: {
    type: String,
    required: true,
    unique: true,
  },
  archived: {
    type: Boolean,
    required: true,
    default: false,
  },
  classGrade: {
    type: String,
  },
  gender: {
    type: String,
  },
  password: {
    type: String,
    min: [8, "Password is too short."],
  },
  photoURL: {
    type: String,
    default: `${__dirname.split("/models")[0]}/images/avatar.png`,
  },
  homeroomID: {
    type: Number,
  },
  house: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "houses",
  },
  yeargroupID: {
    type: Number,
  },
  points: [
    {
      point: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "points",
      },
      archived: {
        type: Boolean,
        default: false,
      },
    },
  ],
  monthlyPoints: [
    {
      realm: {
        type: String,
      },
      points: {
        type: Number,
        default: 0,
      },
    },
  ],
  yearlyPoints: [
    {
      realm: {
        type: String,
      },
      points: {
        type: Number,
        default: 0,
      },
    },
  ],
  totalPoints: [
    {
      realm: {
        type: String,
      },
      points: {
        type: Number,
        default: 0,
      },
    },
  ],
  password: {
    type: String,
    min: [8, "Password is too short."],
  },
  lastLogin: {
    type: Number,
  },
  validFrom: {
    type: Number,
  },
});

module.exports = mongoose.model("students", StudentSchema, "students");
