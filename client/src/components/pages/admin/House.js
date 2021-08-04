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

import React, { useContext, useEffect, useState } from "react";
import { Card, Container } from "react-bootstrap";
import RealmContext from "../../../context/realm/realmContext";
import TableView from "../../layout/TableView";
import EditModal from "./EditModal";
import ConfirmationModal from "./ConfirmationModal";
import UploadModal from "./UploadModal";

const House = (props) => {
  const realmContext = useContext(RealmContext);

  console.log(realmContext);
  const { realms } = realmContext;

  useEffect(() => {
    realmContext.clearRealms();
    realmContext.getRealms();
  }, []);

  return (
    <Card className="p-3">
      <h1>Realms</h1>
      <hr />
      <TableView
        users={realms && realms.houses}
        fields={[
          {
            attribute: "name",
            name: "House Name",
            visible: true,
            editable: true,
          },
          {
            attribute: "backgroundColor",
            name: "Background",
            visible: true,
            editable: true,
          },
          {
            attribute: "color",
            name: "Text Color",
            visible: true,
            editable: true,
          },
        ]}
        search={["name"]}
        editFunction={realmContext.updateHouse}
        tabs={[
          {
            title: "Clear monthly points",
            view: ConfirmationModal,
            editFunction: realmContext.clearMonthly,
            input: {
              title: "Clear monthly points",
              body: "Are you sure you want to clear the monthly points? THIS ACTION CANNOT BE UNDONE!",
            },
          },
          {
            title: "Clear yearly points",
            view: ConfirmationModal,
            editFunction: realmContext.clearYearly,
            input: {
              title: "Clear yearly points",
              body: "Are you sure you want to clear the yearly points? THIS ACTION CANNOT BE UNDONE!",
            },
          },
          {
            title: "Upload CSV to assign student houses",
            view: UploadModal,
            requiredKeys: [
              "archived",
              "first_name",
              "last_name",
              "email",
              "house",
            ],
            input: {
              title: "Upload CSV to assign student houses",
              body: (
                <div>
                  <p>
                    Please upload a csv file to assign students to houses.{" "}
                    <a href="#" onClick={realmContext.fetchCSVSample}>
                      You can download a template populated with current details
                      here.
                    </a>
                  </p>
                </div>
              ),
            },
          },
          //   {
          //     title: "Create a new house",
          //     view: EditModal,
          //     editFunction: realmContext.createHouse,
          //   },
        ]}
      />
    </Card>
  );
};

export default House;
