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
  INVALID_PASSWORD,
  CLEAR_TEACHER,
  CLEAR_TEACHERS,
} from "../types";
const { apiURL } = window["runConfig"];

const TeacherState = (props) => {
  const initialState = {
    teachers: null,
    loading: false,
    teacher: null,
    errors: null,
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

  // Create a new teacher
  const createTeacher = async (postData) => {
    try {
      await axios.post(`${apiURL}api/teachers`, postData);
    } catch (err) {
      console.error(err.message);
    }
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

  const updateTeacherPassword = async (id, password) => {
    try {
      if (!password || password.length < 8) {
        dispatch({
          type: INVALID_PASSWORD,
          payload: {
            msg: "Password needs to be at least 8 characters in length.",
          },
        });
        return false;
      }
      console.log("Passed length check");
      await axios.put(`${apiURL}api/admin/pass/${id}`, {
        password: password,
        userType: "teacher",
      });

      return true;
    } catch (err) {
      console.error(err.message);
      dispatch({
        type: INVALID_PASSWORD,
        payload: {
          msg: err.response.data.msg,
        },
      });
      return false;
    }
  };

  // Clear current student
  const clearTeacher = () => {
    dispatch({ type: CLEAR_TEACHER });
  };

  const clearState = () => {
    dispatch({ type: CLEAR_TEACHERS });
  };

  const updateFromMB = async () => {
    try {
      await axios.get(`${apiURL}api/triggers/teachers`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <TeacherContext.Provider
      value={{
        teachers: state.teachers,
        loading: state.loading,
        teacher: state.teacher,
        errors: state.errors,
        getTeachers,
        getTeacher,
        createTeacher,
        updateTeacher,
        updateTeacherPassword,
        clearTeacher,
        clearState,
        updateFromMB,
      }}
    >
      {props.children}
    </TeacherContext.Provider>
  );
};

export default TeacherState;
