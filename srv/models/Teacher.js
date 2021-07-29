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

const TeacherSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
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
  archived: {
    type: Boolean,
    required: true,
    default: false,
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
  },
  role: {
    type: String,
    required: true,
    enum: ["Advisor", "Admin"],
  },
  points: [
    {
      point: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "points",
      },
    },
  ],
  lastLogin: {
    type: Number,
  },
  validFrom: {
    type: Number,
  },
});

module.exports = mongoose.model("teachers", TeacherSchema, "teachers");
