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

import React, { useReducer } from "react";
import StudentContext from "./studentContext";
import studentReducer from "./studentReducer";
import axios from "axios";
import {
  GET_STUDENTS,
  GET_STUDENT,
  EDIT_HOUSE,
  FILTER_STUDENT,
  CLEAR_STUDENT,
  CLEAR_STUDENTS,
  TOP_STUDENTS,
  SET_PIC,
  FILTER_ERROR,
  CLEAR_ERRORS,
} from "../types";
const { apiURL } = window["runConfig"];

const StudentState = (props) => {
  const initialState = {
    students: null,
    loading: false,
    student: null,
    top: null,
    error: null,
    pic: null,
  };

  const [state, dispatch] = useReducer(studentReducer, initialState);

  // Get Students
  const getStudents = async () => {
    try {
      state.loading = true;
      const res = await axios.get(`${apiURL}api/students`).select("-photoURL");
      if (res.data) {
        dispatch({ type: GET_STUDENTS, payload: res.data });
      } else {
        console.log("Unable to fetch students");
      }
    } catch (err) {
      console.log("Error loading students");
    }
  };

  const getHomeroom = async (hrID) => {
    try {
      state.loading = true;
      const res = await axios.get(`${apiURL}api/students/hr/${hrID}`);
      if (res.data) {
        dispatch({ type: GET_STUDENTS, payload: res.data });
      } else {
        console.log("Unable to fetch students");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  // Get a photo
  const getPhoto = async (id) => {
    try {
      state.loading = true;
      const pic = await axios
        .get(`${apiURL}api/students/pic/${id}`, { responseType: "arraybuffer" })
        .then((response) =>
          Buffer.from(response.data, "binary").toString("base64")
        );
      dispatch({ type: SET_PIC, payload: pic });
      return pic;
    } catch (err) {
      console.log(err.message);
    }
  };

  // Get a Single Student
  const getStudent = async (id) => {
    try {
      state.loading = true;
      const res = await axios.get(`${apiURL}api/students/${id}`);

      dispatch({ type: GET_STUDENT, payload: res.data });
    } catch (err) {}
  };

  // Get a student by their Student ID
  const getStudentbyID = async (id) => {
    try {
      state.loading = true;
      const res = await axios.get(`${apiURL}api/students/sid/${id}`);
      // console.log(res.data.photoURL);
      // res.data.photoURL && (await getPhoto(id));
      dispatch({ type: GET_STUDENT, payload: res.data });
    } catch (error) {
      console.log(error.message);
    }
  };

  // Add Student

  // Delete Student

  // Edit Student
  const editHouse = async (id, house) => {
    try {
      const config = {
        headers: {
          "content-type": "application/json",
        },
      };
      const data = {
        house: house,
      };
      state.loading = true;
      // await axios.put(`/api/students/house/${id}`, data, config);
      const res = await axios.put(
        `${apiURL}api/students/house/${id}`,
        data,
        config
      );
      dispatch({ type: EDIT_HOUSE, payload: res.data });
    } catch (err) {
      console.error(err.message);
    }
  };

  // Set current student

  // Clear current student
  const clearStudent = () => {
    dispatch({ type: CLEAR_STUDENT });
  };

  const clearState = () => {
    dispatch({ type: CLEAR_STUDENTS });
  };
  // Update student

  // Filter students
  const filterStudents = async (search) => {
    try {
      let sName = [];
      let cursor = 0;
      for (let x = 0; x < search.length; x++) {
        if (search.charAt(x) === " ") {
          sName[sName.length] = search.substring(cursor, x);
          cursor = x + 1;
        }
      }
      sName[sName.length] = search.substring(cursor, search.length);
      const res = await axios.get(`${apiURL}api/students/filter/${sName[0]}`);
      res.out = [];
      if (res.data.length > 1 && sName.length > 1) {
        let patt;
        for (let x = 1; x < sName.length; x++) {
          patt = new RegExp(`${sName[x]}`, "i");
          for (let y = 0; y < res.data.length; y++) {
            (res.data[y].lastName.match(patt) ||
              res.data[y].firstName.match(patt)) &&
              (res.out[res.out.length] = res.data[y]);
          }
        }
      } else if (res.data.length === 1 || sName.length === 1) {
        res.data.length > 49 && (res.data = res.data.splice(0, 49));
        res.out = res.data;
      }

      if (res.out.length === 0) {
        dispatch({ type: FILTER_ERROR, payload: { msg: "No students found" } });
        setTimeout(dispatch({ type: CLEAR_ERRORS }), 5000);
        return;
      }
      dispatch({ type: FILTER_STUDENT, payload: res.out });
    } catch (err) {
      console.log(err.message);
    }
  };

  // Get Top Students
  const getTop = async () => {
    try {
      const res = await axios.get(`${apiURL}api/students/top`);
      dispatch({ type: TOP_STUDENTS, payload: res.data });
    } catch (err) {
      console.error(err.message);
    }
  };
  // Clear filter

  return (
    <StudentContext.Provider
      value={{
        students: state.students,
        loading: state.loading,
        student: state.student,
        top: state.top,
        error: state.error,
        pic: state.pic,
        getStudents,
        getHomeroom,
        getStudent,
        getStudentbyID,
        filterStudents,
        clearStudent,
        clearState,
        getTop,
        getPhoto,
        editHouse,
      }}
    >
      {props.children}
    </StudentContext.Provider>
  );
};

export default StudentState;
