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
import { Form } from "react-bootstrap";
import RealmContext from "../../../context/realm/realmContext";

const EditModal = ({ dictionary, visible, editFunction }) => {
  const realmContext = useContext(RealmContext);
  const { realms } = realmContext;

  const [fields, setFields] = useState({});

  useEffect(() => {
    realmContext.getRealms();
  }, []);

  useEffect(() => {
    if (visible.edit.fields) {
      visible.edit.fields.house === "" &&
        visible.setEdit({
          ...visible.edit,
          fields: { ...visible.edit.fields, house: realms.houses[0]._id },
        });
      visible.edit.fields.role === "" &&
        visible.setEdit({
          ...visible.edit,
          fields: { ...visible.edit.fields, role: "Advisor" },
        });
    }
    visible.edit.visible && setFields(visible.edit.fields);
  }, [visible.edit.visible]);

  const closeModal = (updated = false) => {
    visible.setEdit({
      ...visible.edit,
      visible: false,
      updated: updated,
      fields: fields,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(fields);
    visible.edit.create
      ? editFunction(fields)
      : editFunction(visible.edit.id, fields);

    visible.setEdit({ ...visible.edit, updated: true, fields: null });

    closeModal(true);
  };

  const onChange = (e) => {
    setFields({
      ...fields,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      {visible.edit.visible && fields && (
        <div>
          <div className="editmodal__background" onClick={closeModal}></div>
          <div className="editmodal">
            <h2>{visible.edit.create ? "Create:" : "Edit:"}</h2>
            <div className="editmodal__close" onClick={closeModal}>
              X
            </div>
            <Form onSubmit={onSubmit} className="editmodal__form">
              {" "}
              {Object.keys(visible.edit.fields).map(
                (fieldName) =>
                  fieldName !== "teachers" && (
                    <Form.Group>
                      <Form.Label>
                        {dictionary.find((d) => d.attribute === fieldName).name}
                      </Form.Label>
                      {!dictionary.find((d) => d.attribute === fieldName)
                        .editable ? (
                        visible.edit.create ? (
                          <Form.Control
                            type="input"
                            name={fieldName}
                            value={fields[fieldName]}
                            onChange={onChange}
                          />
                        ) : (
                          <Form.Control
                            type="input"
                            name={fieldName}
                            value={fields[fieldName]}
                            onChange={onChange}
                            disabled
                          />
                        )
                      ) : fieldName === "house" ? (
                        <Form.Control
                          as="select"
                          type="select"
                          name={fieldName}
                          value={fields[fieldName]}
                          defaultValue={realms.houses[0]._id}
                          onChange={onChange}
                        >
                          {realms.houses.map((house) => (
                            <option value={house._id}>{house.name}</option>
                          ))}
                        </Form.Control>
                      ) : fieldName === "role" ? (
                        <Form.Control
                          as="select"
                          type="select"
                          name={fieldName}
                          value={fields[fieldName]}
                          onChange={onChange}
                        >
                          <option value="Admin">Admin</option>
                          <option value="Advisor">Advisor</option>
                        </Form.Control>
                      ) : (
                        <Form.Control
                          type="input"
                          name={fieldName}
                          value={fields[fieldName]}
                          onChange={onChange}
                        />
                      )}
                    </Form.Group>
                  )
              )}
              <div style={{ textAlign: "center" }}>
                <input
                  type="submit"
                  value="Update"
                  className="btn btn-primary editmodal__button"
                />{" "}
                <input
                  type="cancel"
                  value="Cancel"
                  className="btn btn-secondary editmodal__button"
                  onClick={closeModal}
                />
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditModal;
