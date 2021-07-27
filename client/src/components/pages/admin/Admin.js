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
import NavbarMenu from "../../layout/NavbarMenu";
import Navtiles from "../../layout/Navtiles";
import Student from "./Student";

const Admin = (props) => {
  const [tiles, setTiles] = useState([
    {
      title: "Students",
      icon: "fas fa-user-graduate",
      link: "/admin/students",
      view: Student,
      active: true,
    },
    {
      title: "Teachers",
      icon: "fas fa-chalkboard-teacher",
      link: "/admin/teachers",
      active: false,
    },
    {
      title: "Classes",
      icon: "fas fa-school",
      link: "/admin/classes",
      active: false,
    },
    {
      title: "Categories",
      icon: "fas fa-medal",
      link: "/admin/categories",
      active: false,
    },
    {
      title: "Houses",
      icon: "fas fa-home",
      link: "/admin/houses",
      active: false,
    },
  ]);

  return (
    <Container fluid>
      <NavbarMenu className="navbar-full-width" props={props} />
      <Card className="p-3">
        <h1>Admin Menu</h1>
        <hr />
        {tiles && <Navtiles tiles={tiles} />}
      </Card>
    </Container>
  );
};

export default Admin;
