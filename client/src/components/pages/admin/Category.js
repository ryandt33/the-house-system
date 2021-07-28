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
import CategoryContext from "../../../context/category/categoryContext";
import TableView from "../../layout/TableView";

const Category = (props) => {
  const categoryContext = useContext(CategoryContext);

  const { categories } = categoryContext;

  useEffect(() => {
    categoryContext.clearCategories();
    categoryContext.getCategories();

    // return () => {
    //   studentContext.clearState();
    // };
  }, []);

  return (
    <Card className="p-3">
      <h1>Teachers</h1>
      <hr />
      <TableView
        users={categories}
        fields={[
          { attribute: "name", name: "Category Name" },
          { attribute: "backgroundColor", name: "Background" },
          { attribute: "color", name: "Text Color" },
          { attribute: "value", name: "Point Value" },
        ]}
        search={["name"]}
        editFunction={categoryContext.updateCategory}
      />
    </Card>
  );
};

export default Category;
