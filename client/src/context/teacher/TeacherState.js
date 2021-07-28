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
import TeacherContext from "./teacherContext";
import teacherReducer from "./teacherReducer";
import axios from "axios";
import {
  GET_TEACHERS,
  GET_TEACHER,
  CLEAR_TEACHER,
  CLEAR_TEACHERS,
} from "../types";
const { apiURL } = window["runConfig"];

const TeacherState = (props) => {
  const initialState = {
    teachers: null,
    loading: false,
    teacher: null,
    error: null,
  };

  const [state, dispatch] = useReducer(teacherReducer, initialState);

  // Get Students
  const getTeachers = async () => {
    try {
      state.loading = true;
      const res = await axios.get(`${apiURL}api/teachers`);
      if (res.data) {
        dispatch({ type: GET_TEACHERS, payload: res.data });
      } else {
        console.log("Unable to fetch teachers");
      }
    } catch (err) {
      console.log(err);
      console.log("Error loading students");
    }
  };

  // Get a Single Teacher
  const getTeacher = async (id) => {
    try {
      state.loading = true;
      const res = await axios.get(`${apiURL}api/teachers/${id}`);

      dispatch({ type: GET_TEACHER, payload: res.data });
    } catch (err) {}
  };

  // Update Teachers
  const updateTeacher = async (id, postBody) => {
    try {
      await axios.put(`${apiURL}api/teachers/${id}`, postBody);
      getTeachers();
    } catch (err) {
      console.error(err.message);
    }
  };

  // Clear current student
  const clearTeacher = () => {
    dispatch({ type: CLEAR_TEACHER });
  };

  const clearState = () => {
    dispatch({ type: CLEAR_TEACHERS });
  };
  // Update student

  return (
    <TeacherContext.Provider
      value={{
        teachers: state.teachers,
        loading: state.loading,
        teacher: state.teacher,
        error: state.error,
        getTeachers,
        getTeacher,
        updateTeacher,
        clearTeacher,
        clearState,
      }}
    >
      {props.children}
    </TeacherContext.Provider>
  );
};

export default TeacherState;
