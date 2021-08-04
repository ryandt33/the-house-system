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
import classContext from "./classContext";
import classReducer from "./classReducer";
import axios from "axios";
import {
  GET_CLASSES,
  GET_TEACHER_CLASSES,
  GET_CLASS,
  GET_SS_CLASS,
  CLEAR_CLASSES,
  CLEAR_SS,
} from "../types";
const { apiURL } = window["runConfig"];

const ClassState = (props) => {
  const initialState = {
    classes: null,
    teacherClasses: null,
    class: null,
    students: null,
    loading: false,
  };

  const [state, dispatch] = useReducer(classReducer, initialState);

  // Get all classes
  const getClasses = async () => {
    try {
      state.loading = true;
      const res = await axios.get(`${apiURL}api/classes`);
      dispatch({ type: GET_CLASSES, payload: res.data });
    } catch (err) {
      console.log(err);
    }
  };

  // Get Classes belonging to Teacher
  const getTeacherClasses = async (tID) => {
    try {
      state.loading = true;
      const res = await axios.get(`${apiURL}api/classes/teacher/${tID}`);
      if (res.data) {
        dispatch({ type: GET_TEACHER_CLASSES, payload: res.data });
      } else {
        console.log("Unable to get teacher's classes");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const getClass = async (cID) => {
    try {
      state.loading = true;
      const res = await axios.get(`${apiURL}api/classes/${cID}`);
      if (res.data) {
        dispatch({ type: GET_CLASS, payload: res.data });
      } else {
        console.log("Unable to fetch class");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  // Get Students in a Class
  const getSsClass = async (cID) => {
    try {
      const stu = [];
      state.loading = true;
      const res = await axios.get(`${apiURL}api/classes/students/${cID}`);
      console.log(res.data);
      if (res.data) {
        let len = res.data.students.length;
        for (let x = 0; x < len; x++) {
          stu.push(res.data.students[x].student);
        }

        dispatch({ type: GET_SS_CLASS, payload: res.data.students });
      } else {
        console.log(`Unable to get students from class ${cID}`);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const updateClass = async (id, postData) => {
    try {
      const res = await axios.put(`${apiURL}api/classes/${id}`, postData);
      console.log(res);
      getClasses();
    } catch (err) {
      console.error(err.message);
    }
  };

  const clearStudents = () => {
    dispatch({ type: CLEAR_SS });
  };

  const fetchClasses = () => {
    try {
      axios.get(`${apiURL}api/triggers/classes`);
    } catch (err) {
      console.error(err.message);
    }
  };

  const populateClasses = () => {
    try {
      axios.get(`${apiURL}api/triggers/classes/students`);
    } catch (err) {
      console.error(err.message);
    }
  };

  const clearState = () => {
    dispatch({ type: CLEAR_CLASSES });
  };

  return (
    <classContext.Provider
      value={{
        classes: state.classes,
        class: state.class,
        students: state.students,
        loading: state.loading,
        teacherClasses: state.teacherClasses,
        getClasses,
        getTeacherClasses,
        getClass,
        getSsClass,
        updateClass,
        fetchClasses,
        populateClasses,
        clearStudents,
        clearState,
      }}
    >
      {" "}
      {props.children}
    </classContext.Provider>
  );
};

export default ClassState;
