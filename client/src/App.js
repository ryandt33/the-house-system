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

import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import StudentState from "./context/student/StudentState";
import RealmState from "./context/realm/RealmState";
import CategoryState from "./context/category/CategoryState";
import PointState from "./context/point/PointState";
import AuthState from "./context/auth/AuthState";
import ClassState from "./context/class/classState";
import AlertState from "./context/alert/AlertState";
import PrivateRoute from "./components/routing/PrivateRoute";
import AdminRoute from "./components/routing/AdminRoute";

import Home from "./components/pages/Home";
import Homeroom from "./components/pages/Homeroom";
import StudentList from "./components/pages/StudentList";
import Student from "./components/pages/Student";
import Class from "./components/pages/Class";
import StudentSelector from "./components/pages/StudentSelector";
import Groups from "./components/pages/Groups";
import Admin from "./components/pages/Admin";
import Login from "./components/auth/Login";
import PassChange from "./components/auth/PassChange";
import Barcode from "./components/pages/Barcode";
import Showcase from "./components/pages/Showcase";
import Footer from "./components/layout/Footer";

import setAuthToken from "./utils/setAuthToken";
import "./App.css";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  return (
    <AuthState>
      <StudentState>
        <RealmState>
          <ClassState>
            <CategoryState>
              <PointState>
                <AlertState>
                  <Router>
                    <Fragment>
                      <div className='wrapper'>
                        <Switch>
                          <PrivateRoute exact path='/' component={Home} />
                          <PrivateRoute
                            exact
                            path='/list'
                            component={StudentList}
                          />
                          <PrivateRoute
                            exact
                            path='/student/:id'
                            component={Student}
                          />
                          <PrivateRoute
                            exact
                            path='/class/:id'
                            component={Class}
                          />
                          <PrivateRoute
                            exact
                            path='/class/selector/:id'
                            component={StudentSelector}
                          />
                          <PrivateRoute
                            exact
                            path='/class/groups/:id'
                            component={Groups}
                          />
                          <PrivateRoute
                            exact
                            path='/camera'
                            component={Barcode}
                          />
                          <PrivateRoute
                            exact
                            path='/passchange'
                            component={PassChange}
                          />
                          <PrivateRoute exact path='/hr' component={Homeroom} />
                          <PrivateRoute
                            exact
                            path='/showcase'
                            component={Showcase}
                          />
                          <AdminRoute exact path='/admin' component={Admin} />
                          <Route exact path='/login' component={Login} />
                        </Switch>
                        <Footer />
                      </div>
                    </Fragment>
                  </Router>
                </AlertState>
              </PointState>
            </CategoryState>
          </ClassState>
        </RealmState>
      </StudentState>
    </AuthState>
  );
};

export default App;
