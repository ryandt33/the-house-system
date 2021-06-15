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

const ClassSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
  },
  section: {
    type: String,
  },
  created: {
    type: Date,
    required: true,
  },
  updated: {
    type: Date,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
  levels: {
    //MB uses this for HL/SL, but we will also include phasings for Language classes other optional parameters
    type: [String],
  },
  program: {
    type: String,
  },
  subjectName: {
    type: String,
  },
  subjectGroup: {
    type: String,
  },
  teachers: [
    {
      teacher: { type: mongoose.Schema.Types.ObjectId, ref: "teachers" },
      onReport: { type: Boolean, required: true },
    },
  ],
  students: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: "students" },
      level: { type: String },
      //Based on the levels identified above - validation needs to happen elsewhere... you could just set this to nothing if it does not match the levels identified above
    },
  ],
  assignments: {
    type: [mongoose.Schema.Types.ObjectId],
  },
  terms: {
    type: [mongoose.Schema.Types.ObjectId],
  },
  units: [
    {
      name: {
        type: String,
        required: true,
      },
      weight: {
        type: Number,
        required: true,
      },
      mbID: {
        type: Number,
      },
    },
  ],
  categories: [
    {
      name: {
        type: String,
        required: true,
      },
      weight: {
        type: Number,
        required: true,
      },
      mbID: {
        type: Number,
      },
    },
  ],

  // MB Specific Fields
  mbID: {
    type: Number,
    unique: true,
  },
  mbSubjectID: {
    type: Number,
  },
  archived: {
    type: Boolean,
  },
});

module.exports = mongoose.model("class", ClassSchema, "classes");
