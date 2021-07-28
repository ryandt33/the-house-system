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
  GET_TEACHERS,
  GET_TEACHER,
  CLEAR_TEACHER,
  CLEAR_TEACHERS,
} from "../types";

export default (state, action) => {
  switch (action.type) {
    case GET_TEACHERS:
      return {
        ...state,
        teachers: action.payload,
        loading: false,
        teacher: null,
      };
    case GET_TEACHER:
      return {
        ...state,
        teacher: action.payload,
        loading: false,
      };
    case CLEAR_TEACHER:
      return {
        ...state,
        loading: false,
        teacher: null,
        error: null,
      };
    case CLEAR_TEACHERS:
      return {
        ...state,
        loading: false,
        teacher: null,
        error: null,
        teachers: null,
      };
    default:
      return state;
  }
};
