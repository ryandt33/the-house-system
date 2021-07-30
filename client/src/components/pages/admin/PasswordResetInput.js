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

import React, { useState, useContext } from "react";
import { Form } from "react-bootstrap";
import AlertContext from "../../../context/alert/alertContext";
import TeacherContext from "../../../context/teacher/teacherContext";

const PasswordResetInput = ({ editFunction, obj }) => {
  const alertContext = useContext(AlertContext);
  const teacherContext = useContext(TeacherContext);
  const [visible, setVisible] = useState({
    visibility: "hidden",
    height: "0px",
  });

  const [password, setPassword] = useState("");

  const resetVisibility = () => {
    visible.visibility === "hidden"
      ? setVisible({ visibility: "visible", height: "auto" })
      : setVisible({ visibility: "hidden", height: "0px" });
  };

  const onChange = (e) => {
    e.preventDefault();
    setPassword(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(password);
    const success = await editFunction(obj._id, password);
    console.log(success);
    if (success) {
      setPassword("");
      alertContext.setAlert("Successfully changed password.", "success");
      setVisible({ visibility: "hidden", height: "0px" });
    }
    console.log(teacherContext);
  };

  return (
    <div className="password_reset" style={{}}>
      <div
        className="password_reset__icon"
        style={{
          display: "inline-block",
          position: "relative",
        }}
      >
        <i class="fas fa-key"></i>
        <div
          style={{
            position: "absolute",
            top: "0px",
            left: "0px",
            width: "100%",
            height: "100%",
          }}
          onClick={resetVisibility}
          // data-row={currentRow["_id"]}
        ></div>
      </div>
      <Form
        onSubmit={onSubmit}
        className="password_reset__form"
        style={visible}
      >
        <Form.Group>
          <Form.Control
            type="password"
            name="passChange"
            value={password}
            onChange={onChange}
          />
        </Form.Group>
        <input
          type="submit"
          value="Update"
          className="btn btn-primary btn-block"
        />
      </Form>
    </div>
  );
};

export default PasswordResetInput;
