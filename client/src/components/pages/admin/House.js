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
          { attribute: "name", name: "House Name" },
          { attribute: "backgroundColor", name: "Background" },
          { attribute: "color", name: "Text Color" },
        ]}
        search={["name"]}
        editFunction={realmContext.updateHouse}
      />
    </Card>
  );
};

export default House;
