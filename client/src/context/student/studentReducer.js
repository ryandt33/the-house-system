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

export default (state, action) => {
  switch (action.type) {
    case FILTER_STUDENT:
    case GET_STUDENTS:
      return {
        ...state,
        students: action.payload,
        loading: false,
        student: null,
      };
    case EDIT_HOUSE:
    case GET_STUDENT:
      return {
        ...state,
        student: action.payload,
        loading: false,
      };
    case FILTER_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    case CLEAR_STUDENT:
      return {
        ...state,
        loading: false,
        student: null,
        top: null,
        error: null,
        pic: null,
      };
    case CLEAR_STUDENTS:
      return {
        ...state,
        loading: false,
        student: null,
        top: null,
        error: null,
        pic: null,
        students: null,
      };
    case TOP_STUDENTS:
      return {
        ...state,
        top: action.payload,
      };
    case SET_PIC:
      return {
        ...state,
        pic: action.paload,
        loading: false,
      };
    default:
      return state;
  }
};
