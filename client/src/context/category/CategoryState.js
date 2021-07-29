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
import CategoryContext from "./categoryContext";
import categoryReducer from "./categoryReducer";
import { GET_CATEGORIES, CLEAR_CATEGORIES } from "../types";

const { apiURL } = window["runConfig"];

const CategoryState = (props) => {
  const initialState = {
    categories: null,
    category: null,
  };

  const [state, dispatch] = useReducer(categoryReducer, initialState);

  // Set Category
  const getCategories = async () => {
    const res = await axios.get(`${apiURL}api/categories`);
    dispatch({
      type: GET_CATEGORIES,
      payload: res.data,
    });
    // SET CATEGORY ERROR
    // setTimeout(() => dispatch({ type: CLEAR_ALERT, payload: id }), timeout);
  };

  const createCategory = async (postData) => {
    try {
      postData.realm = "houses";
      await axios.post(`${apiURL}api/categories`, postData);

      await getCategories();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit Category
  const updateCategory = async (id, postData) => {
    try {
      await axios.put(`${apiURL}api/categories/${id}`, postData);
      getCategories();
    } catch (err) {
      console.log(err.message);
    }
  };

  const clearCategories = async () => {
    dispatch({ type: CLEAR_CATEGORIES });
  };

  return (
    <CategoryContext.Provider
      value={{
        categories: state.categories,
        category: state.category,
        getCategories,
        createCategory,
        updateCategory,
        clearCategories,
      }}
    >
      {props.children}
    </CategoryContext.Provider>
  );
};

export default CategoryState;
