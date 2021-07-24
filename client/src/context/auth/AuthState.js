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
import AuthContext from "./authContext";
import authReducer from "./authReducer";
import axios from "axios";
import setAuthToken from "../../utils/setAuthToken";

import {
  USER_LOADED,
  LOAD_FAILED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CHANGE_PASS_FAILED,
  CLEAR_ERRORS,
} from "../types";

const { apiURL } = window["runConfig"];

const AuthState = (props) => {
  const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load User
  const loadUser = async () => {
    try {
      if (localStorage.token) {
        setAuthToken(localStorage.token);

        const res = await axios.get(`${apiURL}api/auth`);
        dispatch({ type: USER_LOADED, payload: res.data });
      } else {
        dispatch({ type: LOAD_FAILED });
      }
    } catch (err) {
      console.log(err.response);
      dispatch({ type: AUTH_ERROR, payload: err.response.data.msg });
    }
  };

  // Register User

  // Login User
  const login = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.post(`${apiURL}api/auth`, formData, config);
      console.log(localStorage);
      clearErrors();
      // loadUser();
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
      return true;
    } catch (err) {
      dispatch({
        type: LOGIN_FAIL,
        payload: err.response.data.msg,
      });
      return err;
    }
  };

  // Logout User
  const logout = () => dispatch({ type: LOGOUT });

  // Change Password
  const changePass = async (pass) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      await axios.put(`${apiURL}api/auth/pass/${state.user._id}`, pass, config);
      return true;
    } catch (err) {
      dispatch({
        type: CHANGE_PASS_FAILED,
        payload: err.response.data.msg,
      });
      return false;
    }
  };

  // Clear Errors
  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        error: state.error,
        user: state.user,
        loadUser,
        login,
        logout,
        clearErrors,
        changePass,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
