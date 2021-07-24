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

import React, { useContext, useEffect, useState, Fragment } from "react";
import { Link } from "react-router-dom";
import { Navbar, Form, Nav, Button, Dropdown } from "react-bootstrap";
import PropTypes from "prop-types";
import AuthContext from "../../context/auth/authContext";
import StudentContext from "../../context/student/studentContext";
import Alert from "./Alerts";
import AlertContext from "../../context/alert/alertContext";
import PointContext from "../../context/point/pointContext";
import CategoryContext from "../../context/category/categoryContext";
import RealmContext from "../../context/realm/realmContext";
import ClassContext from "../../context/class/classContext";

const NavbarMenu = ({ props }) => {
  const alertContext = useContext(AlertContext);
  const authContext = useContext(AuthContext);
  const studentContext = useContext(StudentContext);
  const pointContext = useContext(PointContext);
  const categoryContext = useContext(CategoryContext);
  const realmContext = useContext(RealmContext);
  const classContext = useContext(ClassContext);

  const [filter, setFilter] = useState({
    search: "",
  });
  useEffect(() => {
    authContext.loadUser();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (authContext.user && !authContext.user.studentID) {
      !classContext.classes && classContext.getClasses(authContext.user._id);
    }
    // eslint-disable-next-line
  }, [authContext.user]);

  const logoutUser = () => {
    categoryContext.clearCategories();
    pointContext.clearState();
    realmContext.clearRealms();
    studentContext.clearState();
    classContext.clearState();
    authContext.logout();
  };

  const onChange = (e) => {
    setFilter({ ...filter, search: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    await studentContext.filterStudents(filter.search);
    props.history.push("/list");
  };

  useEffect(() => {
    if (studentContext.error) {
      alertContext.setAlert(studentContext.error.msg, "danger");
    }
    // eslint-disable-next-line
  }, [studentContext.error]);

  useEffect(() => {
    pointContext.errors &&
      alertContext.setAlert(pointContext.errors[0].msg, "danger");
    // eslint-disable-next-line
  }, [pointContext.errors]);

  return (
    <div>
      <div className="navbar-spacer">
        {" "}
        <div className="fixed-nav">
          <div className="navbar-wrapper">
            <Navbar
              bg="light"
              className="navbar-light navbar-full-width"
              expand="lg"
              style={{ zIndex: 2 }}
            >
              <Navbar.Brand>
                <i className="fas fa-home"></i>{" "}
                <Link to="/" className="nav-item navbar-dark-link">
                  Houses
                </Link>
              </Navbar.Brand>{" "}
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                {!authContext.isAuthenticated ? (
                  <Nav className="ml-auto">
                    <Link to="/login" className="navbar-dark-link nav-item">
                      Login
                    </Link>
                  </Nav>
                ) : (
                  <Fragment>
                    {/* <Link to='/list' className='navbar-dark-link nav-item'>
                  Student List
                </Link>
              </Nav> */}
                    <Dropdown>
                      <Dropdown.Toggle
                        id="dropdown-basic-button"
                        className="dropdown-light"
                      >
                        {authContext.user &&
                          `${authContext.user.firstName} ${authContext.user.lastName}`}
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="navbar-light">
                        {" "}
                        {authContext.user && authContext.user.studentID ? (
                          <div></div>
                        ) : (
                          <div>
                            <span className="dropdown-item" role="button">
                              <Link to="/hr">Homeroom</Link>
                            </span>
                            {classContext.classes &&
                              classContext.classes.map(
                                (cls) =>
                                  !cls.archived && (
                                    <span
                                      key={cls._id}
                                      className="dropdown-item"
                                      role="button"
                                    >
                                      <Link
                                        to={`/class/${cls._id}`}
                                      >{`${cls.name}`}</Link>
                                    </span>
                                  )
                              )}
                          </div>
                        )}
                        <span className="dropdown-item" role="button">
                          <Link to="/passchange">Change your password</Link>
                        </span>
                        <span
                          className="dropdown-item"
                          role="button"
                          onClick={logoutUser}
                        >
                          <Link to="/login">
                            <i
                              className="fas fa-sign-out-alt"
                              color="black"
                            ></i>
                            <span className="hide-sm navbar-dark-link nav-item">
                              Logout
                            </span>
                          </Link>
                        </span>
                      </Dropdown.Menu>
                    </Dropdown>
                    <Nav className="ml-auto">
                      <Link to="/camera" className="navbar-dark-link nav-item">
                        <div className="nav-camera">
                          <i className="fas fa-camera" /> Camera
                        </div>
                      </Link>{" "}
                    </Nav>
                    <Form inline onSubmit={onSubmit}>
                      <Form.Control
                        type="text"
                        name="search"
                        placeholder="Search"
                        onChange={onChange}
                        className="mr-2 col-6"
                      />

                      <Button variant="outline-success" type="submit">
                        Search
                      </Button>
                    </Form>
                  </Fragment>
                )}
              </Navbar.Collapse>
            </Navbar>
          </div>
        </div>{" "}
      </div>
      <Alert />
    </div>
  );
};

NavbarMenu.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
};

NavbarMenu.defaultProps = {
  title: "Houses",
  icon: "fas fa-home",
};

export default NavbarMenu;
