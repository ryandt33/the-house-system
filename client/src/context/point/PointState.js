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
import axios from "axios";
import PointContext from "./pointContext";
import pointReducer from "./pointReducer";
import {
  POINT_ERROR,
  GET_POINTS,
  CLEAR_POINTS,
  CLEAR_ERRORS,
  GET_MY_POINTS,
} from "../types";
const { apiURL } = window["runConfig"];

const PointState = (props) => {
  const initialState = {
    points: [],
    loading: true,
    errors: null,
  };

  const [state, dispatch] = useReducer(pointReducer, initialState);

  // Add Point
  const addPoint = async (point) => {
    try {
      const res = await axios.post(`${apiURL}api/points`, point);
      console.log(res);
      getUserPoints(point.receiver);
    } catch (err) {
      dispatch({ type: POINT_ERROR, payload: err.response.data.errors });
      setTimeout(function () {
        dispatch({ type: CLEAR_ERRORS });
      }, 5000);
    }
  };

  // Get Points for a User
  const getUserPoints = async (id) => {
    try {
      const res = await axios.get(`${apiURL}api/points/${id}`);
      dispatch({ type: GET_POINTS, payload: res.data.points });
    } catch (err) {
      dispatch({ type: POINT_ERROR });
    }
  };

  const getMyPoints = async () => {
    try {
      const res = await axios.get(`${apiURL}api/points/me`);
      dispatch({ type: GET_MY_POINTS, payload: res.data.points });
    } catch (err) {
      dispatch({ type: POINT_ERROR });
    }
  };

  const deletePoint = async (id, receiver) => {
    try {
      await axios.delete(`${apiURL}api/points/${id}`);
      getUserPoints(receiver);
    } catch (err) {
      dispatch({ type: POINT_ERROR });
    }
  };

  const clearState = async () => {
    dispatch({ type: CLEAR_POINTS });
  };

  return (
    <PointContext.Provider
      value={{
        points: state.points,
        loading: state.loading,
        errors: state.errors,
        addPoint,
        getUserPoints,
        getMyPoints,
        deletePoint,
        clearState,
      }}
    >
      {props.children}
    </PointContext.Provider>
  );
};

export default PointState;
