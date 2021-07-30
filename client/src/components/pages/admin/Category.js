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
import EditModal from "./EditModal";
import ArchiveToggle from "./ArchiveToggle";

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
      <h1>Categories</h1>
      <hr />
      <TableView
        users={categories}
        fields={[
          {
            attribute: "name",
            name: "Category Name",
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
          {
            attribute: "value",
            name: "Point Value",
            visible: true,
            editable: true,
          },
        ]}
        search={["name"]}
        editFunction={categoryContext.updateCategory}
        additionalFunctions={[
          {
            function: categoryContext.archiveCategory,
            display: ArchiveToggle,
          },
        ]}
        tabs={[
          {
            title: "Create a new category",
            view: EditModal,
            editFunction: categoryContext.createCategory,
          },
        ]}
      />
    </Card>
  );
};

export default Category;
