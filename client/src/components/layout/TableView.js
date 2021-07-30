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
import RealmContext from "../../context/realm/realmContext";
import TeacherContext from "../../context/teacher/teacherContext";
import ClassContext from "../../context/class/classContext";
import { Link } from "react-router-dom";
import { Form, Button, Table } from "react-bootstrap";
import EditModal from "../pages/admin/EditModal";
import Navtab from "./Navtab";

const TableView = ({
  users,
  fields,
  search,
  editFunction,
  additionalFunctions,
  tabs,
}) => {
  const realmContext = useContext(RealmContext);
  const teacherContext = useContext(TeacherContext);
  const classContext = useContext(ClassContext);
  const { realms } = realmContext;
  const { teachers } = teacherContext;
  const { classes } = classContext;

  const [userList, setUserList] = useState({
    users: [],
    page: 0,
    pagification: [],
  });

  const [sorted, setSorted] = useState([]);

  const [filter, setFilter] = useState({
    search: "",
  });

  const [edit, setEdit] = useState({
    fields: null,
    visible: false,
    id: null,
    updated: false,
    create: false,
  });

  useEffect(() => {
    if (edit.updated) {
      const u = sorted.find((user) => user._id === edit.id);

      for (let key in edit.fields) {
        u[key] = edit.fields[key];
      }
    }
    //eslint-disable-next-line
  }, [edit]);

  useEffect(() => {
    realmContext.getRealms();
    teacherContext.getTeachers();
    classContext.getClasses();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    users && sorted.length === 0 && setSorted(users);
    //eslint-disable-next-line
  }, [users]);

  useEffect(() => {
    sorted.length > 0 &&
      userList.users.length === 0 &&
      setUserList({
        users: sorted.slice(0, 20),
        page: 1,
        pagification: [],
      });
    //eslint-disable-next-line
  }, [sorted]);

  useEffect(() => {
    userList.users.length > 0 && pagify(Math.ceil(sorted.length / 20));
    //eslint-disable-next-line
  }, [userList.users]);

  const changePage = (e) => {
    const page = parseInt(e.target.innerHTML);
    setUserList({
      ...userList,
      users: sorted.slice(20 * (page - 1), 20 * (page - 1) + 20),
      page: page,
    });
  };

  const pagify = (pageCount) => {
    const pagification = [];
    for (let x = 1; x <= pageCount; x++) {
      pagification.push(
        <li
          className={`pagification__page ${
            userList.page === x && "pagification__page__active"
          }`}
          onClick={changePage}
        >
          {x}
        </li>
      );
    }
    setUserList({ ...userList, pagification: pagification });
  };

  const userListSort = (e) => {
    const sort = e.target.dataset.attribute;
    const dir = e.target.dataset.direction === "descending" ? 1 : -1;
    const newSort = sorted.sort((a, b) => {
      if (a[sort] < b[sort]) {
        return -dir;
      }
      if (a[sort] > b[sort]) {
        return dir;
      }
      return 0;
    });
    setSorted(newSort);
    setUserList({
      ...userList,
      users: sorted.slice(0, 20),
      page: 1,
    });
  };

  const onChange = (e) => {
    setFilter({ ...filter, search: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const search = filter.search;
    let sName = [];
    let cursor = 0;
    let output = [];

    for (let x = 0; x < search.length; x++) {
      if (search.charAt(x) === " ") {
        sName[sName.length] = search.substring(cursor, x);
        cursor = x + 1;
      }
    }
    sName[sName.length] = search.substring(cursor, search.length);

    // const res = await axios.get(`${apiURL}api/currentRows/filter/${sName[0]}`);
    if (users.length > 1 && sName.length >= 1) {
      for (let x = 0; x < sName.length; x++) {
        for (let y = 0; y < users.length; y++) {
          if (checkOtherName(sName, users[y])) {
            !checkExistingSearchList(output, users[y]) && output.push(users[y]);
          }
        }
      }
      setSorted(output);
      setUserList({
        ...userList,
        users: output.slice(0, 20),
        page: 1,
      });
    }
    setFilter({ ...filter, search: "" });
  };

  const checkOtherName = (names, user) => {
    const fields = search;

    const check_name = (patt) => {
      for (let field of fields) {
        if (user[field].match(patt)) return true;
      }
      return false;
    };

    for (let n of names) {
      const patt = new RegExp(n, "i");
      if (!check_name(patt)) return false;
    }

    return true;
  };

  const checkExistingSearchList = (searchList, user) => {
    for (let u of searchList) {
      if (u === user) return true;
    }
    return false;
  };

  const clearSearch = () => {
    setSorted(users);
    setUserList({
      ...userList,
      users: users.slice(0, 20),
      page: 1,
    });
    setFilter({ ...filter, search: "" });
  };

  const editOn = (e) => {
    const user = users.find((u) => u._id === e.target.dataset.row);

    const userObject = {};

    for (let field of fields) {
      userObject[field.attribute] = user[field.attribute];
    }
    setEdit({
      ...edit,
      fields: userObject,
      visible: true,
      id: e.target.dataset.row,
    });
  };

  return (
    <div>
      {tabs && <Navtab tabs={tabs} fields={fields}></Navtab>}
      <Form inline onSubmit={onSubmit} className="userTable__search">
        <div className="userTable__search__holder">
          <Form.Control
            type="text"
            name="search"
            placeholder="Search"
            onChange={onChange}
            value={filter.search}
            className="mr-2 col-6 userTable__search__input"
          />

          <Button variant="outline-success" type="submit">
            Search
          </Button>
          <Button
            variant="outline-danger"
            onClick={clearSearch}
            className="userTable__clear"
          >
            Clear Search
          </Button>
        </div>
      </Form>
      <Table striped bordered hover className="userTable">
        <thead>
          <tr>
            {fields.map(
              (field) =>
                field.visible && (
                  <th
                    style={{
                      width: `${
                        100 /
                        (fields.reduce((acc, x) => {
                          if (x.visible) return acc + 1;
                        }, 0) +
                          1)
                      }%`,
                    }}
                  >
                    {field.name === "Teachers" ? (
                      <span>{field.name}</span>
                    ) : (
                      <span>
                        {field.name}
                        <span
                          data-direction="descending"
                          data-attribute={field.attribute}
                          onClick={userListSort}
                          className="userTable__sort_arrow"
                        >
                          &darr;
                        </span>
                        <span
                          data-direction="ascending"
                          data-attribute={field.attribute}
                          onClick={userListSort}
                          className="userTable__sort_arrow"
                        >
                          &uarr;
                        </span>
                      </span>
                    )}
                  </th>
                )
            )}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {userList.users &&
            userList.users.map((currentRow) => (
              <tr>
                {fields.map(
                  (field) =>
                    field.visible &&
                    (field.attribute === "house" ? (
                      realms &&
                      realms.houses.map(
                        (house) =>
                          house._id === currentRow.house && (
                            <td
                              data-attribute={field.attribute}
                              key={house._id}
                            >
                              {house.name}
                            </td>
                          )
                      )
                    ) : field.attribute === "teachers" ? (
                      <td data-attribute={field.attribute}>
                        <ul className="userTable__inner_list__item">
                          {teachers &&
                            currentRow[field.attribute].map((u) =>
                              teachers.map(
                                (t) =>
                                  t._id === u.teacher && (
                                    <li
                                      className="userTable__inner_list__item"
                                      key={`${u.teacher}`}
                                    >
                                      {t.firstName} {t.lastName}
                                    </li>
                                  )
                              )
                            )}
                        </ul>
                      </td>
                    ) : field.name === "Class Name" ? (
                      classes && (
                        <td data-attribute={field.attribute}>
                          <Link to={`/class/${currentRow["_id"]}`}>
                            {" "}
                            {currentRow[field.attribute]}
                          </Link>
                        </td>
                      )
                    ) : field.attribute === "backgroundColor" ? (
                      <td data-attribute={field.attribute}>
                        <div
                          style={{
                            background: currentRow["backgroundColor"],
                            color: currentRow["color"],
                            border: "3px solid rgba(255,255,255,0.3)",
                            textAlign: "center",
                            width: "50%",
                            margin: "auto",
                            padding: "5px",
                          }}
                        >
                          {currentRow[field.attribute]}
                        </div>
                      </td>
                    ) : field.attribute === "color" ? (
                      <td data-attribute={field.attribute}>
                        <div
                          style={{
                            background: currentRow["backgroundColor"],
                            color: currentRow["color"],
                            border: "3px solid rgba(255,255,255,0.3)",
                            textAlign: "center",
                            width: "50%",
                            margin: "auto",
                            padding: "5px",
                          }}
                        >
                          {currentRow[field.attribute]}
                        </div>
                      </td>
                    ) : (
                      <td data-attribute={field.attribute}>
                        {currentRow[field.attribute]}
                      </td>
                    ))
                )}
                <td style={{ textAlign: "center" }}>
                  <div
                    className="userTable__edit"
                    style={{
                      display: "inline-block",
                      position: "relative",
                    }}
                  >
                    <i class="fas fa-edit"></i>
                    <div
                      style={{
                        position: "absolute",
                        top: "0px",
                        left: "0px",
                        width: "100%",
                        height: "100%",
                      }}
                      onClick={editOn}
                      data-row={currentRow["_id"]}
                    ></div>
                  </div>
                  {additionalFunctions &&
                    additionalFunctions.map((aF) => (
                      <aF.display
                        editFunction={aF.function}
                        obj={currentRow}
                      ></aF.display>
                    ))}
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      {userList.pagification.length > 0 && (
        <ul className="pagification">
          {userList.pagification.map((page) => page)}
        </ul>
      )}
      <EditModal
        dictionary={fields}
        visible={{ edit: edit, setEdit: setEdit }}
        editFunction={editFunction}
        additionalFunctions={additionalFunctions}
      ></EditModal>
    </div>
  );
};

export default TableView;
