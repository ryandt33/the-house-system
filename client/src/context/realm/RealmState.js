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
import RealmContext from "./realmContext";
import realmReducer from "./realmReducer";
import axios from "axios";
import { GET_REALMS, CLEAR_REALMS } from "../types";

const { apiURL } = window["runConfig"];

const RealmState = (props) => {
  const initialState = {
    realms: null,
  };
  const [state, dispatch] = useReducer(realmReducer, initialState);

  const getRealms = async () => {
    try {
      const res = await axios.get(`${apiURL}api/houses`);
      console.log(res.data);
      dispatch({ type: GET_REALMS, payload: res.data });
      return res.data;
    } catch (err) {
      console.error(err.message);
    }
  };

  const createHouse = async (postData) => {
    try {
      await axios.post(`${apiURL}api/houses`, postData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const updateHouse = async (id, postData) => {
    try {
      await axios.put(`${apiURL}api/houses/${id}`, postData);
      getRealms();
    } catch (err) {
      console.error(err.message);
    }
  };

  const clearMonthly = () => {
    try {
      axios.get(`${apiURL}api/triggers/clearMonthly`);
    } catch (err) {
      console.error(err.message);
    }
  };

  const clearYearly = () => {
    try {
      axios.get(`${apiURL}api/triggers/clearYearly`);
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchCSVSample = async () => {
    try {
      await axios
        .get(`${apiURL}api/triggers/genCSVSample`, {
          responseType: "blob",
        })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "import_sample.csv");
          document.body.appendChild(link);
          console.log("??");
          link.click();
        });
    } catch (err) {
      console.error(err.message);
    }
  };

  const updateHousesFromCSV = async (file) => {
    console.log(file);
    const reader = new FileReader();
    const { houses } = await getRealms();

    console.log(houses);

    reader.onload = ((f) => {
      return (e) => {
        const file = e.target.result;
        //call the parse function with the proper line terminator and cell terminator
        // console.log(e.target.result, "\n", ";");
        const csvLines = file.split("\n");
        const keys = csvLines[0].split(",");
        const csvParsed = [];
        console.log(keys);
        for (let line of csvLines) {
          csvParsed.push({});
          const l = line.split(",");

          for (let x = 0; x < keys.length; x++) {
            csvParsed[csvParsed.length - 1][keys[x]] = l[x];
          }
        }

        console.log(csvParsed);
      };
    })(file);

    reader.readAsText(file);
  };

  const clearRealms = async () => {
    dispatch({ type: CLEAR_REALMS });
  };

  return (
    <RealmContext.Provider
      value={{
        realms: state.realms,
        getRealms,
        createHouse,
        clearMonthly,
        clearYearly,
        updateHousesFromCSV,
        fetchCSVSample,
        updateHouse,
        clearRealms,
      }}
    >
      {props.children}
    </RealmContext.Provider>
  );
};

export default RealmState;
