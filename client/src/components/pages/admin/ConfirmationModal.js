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

const ConfirmationModal = ({ dictionary, visible, editFunction }) => {
  const closeModal = (updated = false) => {
    visible.setEdit({
      ...visible.edit,
      visible: false,
      updated: updated,
    });
  };

  const actionConfirmed = async () => {
    editFunction();
    closeModal();
  };
  return (
    <div>
      {visible.edit.visible && (
        <div>
          <div className="editmodal__background" onClick={closeModal}></div>
          <div className="confirmationmodal">
            <h2>{dictionary.title}</h2>
            <div className="editmodal__close" onClick={closeModal}>
              X
            </div>
            <p>{dictionary.body}</p>
            <div
              className="confirmationmodal__buttons"
              style={{ textAlign: "center" }}
            >
              <input
                type="submit"
                value="Confirm"
                className="btn btn-primary editmodal__button"
                onClick={actionConfirmed}
              />{" "}
              <input
                type="cancel"
                value="Cancel"
                className="btn btn-secondary editmodal__button"
                onClick={actionConfirmed}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmationModal;
