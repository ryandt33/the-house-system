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
  GET_CLASSES,
  GET_TEACHER_CLASSES,
  GET_CLASS,
  GET_SS_CLASS,
  CLEAR_CLASSES,
  CLEAR_SS,
} from "../types";

export default (state, action) => {
  switch (action.type) {
    case GET_CLASSES:
      return {
        ...state,
        classes: action.payload,
        loading: false,
      };
    case GET_TEACHER_CLASSES:
      return {
        ...state,
        teacherClasses: action.payload,
        loading: false,
      };
    case GET_CLASS:
      return {
        ...state,
        class: action.payload,
        loading: false,
      };
    case GET_SS_CLASS:
      return {
        ...state,
        students: action.payload,
        loading: false,
      };
    case CLEAR_CLASSES:
      return {
        ...state,
        classes: null,
        teacherClasses: null,
        class: null,
        students: null,
      };
    case CLEAR_SS:
      return {
        ...state,
        students: null,
        class: null,
      };
    default:
      return state;
  }
};
