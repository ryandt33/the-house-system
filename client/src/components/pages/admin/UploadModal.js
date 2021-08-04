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
import RealmContext from "../../../context/realm/realmContext";
import StudentContext from "../../../context/student/studentContext";

const UploadModal = ({ dictionary, visible, requiredKeys }) => {
  const alertContext = useContext(AlertContext);
  const studentContext = useContext(StudentContext);
  const realmContext = useContext(RealmContext);

  const [file, setFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [updating, setUpdating] = useState({ status: false, domView: [] });

  const closeModal = (updated = false) => {
    visible.setEdit({
      ...visible.edit,
      visible: false,
      updated: updated,
    });
  };

  const changeHandler = (e) => {
    setFile(e.target.files[0]);
    setIsFilePicked(true);
  };

  const updateHouse = async (users) => {
    setUpdating({ ...updating, status: true });
    const domView = [];
    for (let user of users) {
      const success = await studentContext.editHouse(user.id, user.house);
      if (success) {
        domView.push(`${user.first_name} ${user.last_name} has been updated.`);
        setUpdating({
          status: true,
          domView: domView,
        });
        console.log(`${user.first_name} ${user.last_name} has been updated.`);
      }
    }

    setUpdating({ status: false, domView: [] });
    alertContext.setAlert("Houses updated successfully!", "success");
    closeModal();
  };

  const actionConfirmed = async (e) => {
    if (!isFilePicked) alertContext.setAlert("No file was uploaded.", "danger");
    else {
      const reader = new FileReader();
      const { houses } = await realmContext.getRealms();
      const students = await studentContext.getStudents();

      console.log(students);

      console.log(houses);

      reader.onload = ((f) => {
        return (e) => {
          const file = e.target.result;
          //call the parse function with the proper line terminator and cell terminator
          // console.log(e.target.result, "\n", ";");
          const csvLines = file.split("\n");
          const keys = csvLines[0].split(",");
          for (let key of requiredKeys) {
            if (!keys.includes(key)) {
              alertContext.setAlert(
                `Columns ${key} is a required field`,
                "danger"
              );
              return false;
            }
          }
          csvLines.shift();
          const csvParsed = [];
          const updatedUserList = [];
          for (let line of csvLines) {
            const l = line.split(",");
            if (l.length > 0 && l[0] !== undefined) {
              csvParsed.push({});

              for (let x = 1; x < keys.length; x++) {
                if (l[x]) {
                  if (keys[x].trim() === "house") {
                    const house = houses.find((h) => h.name === l[x].trim());
                    if (house)
                      csvParsed[csvParsed.length - 1].house = house._id;
                    else {
                      alertContext.setAlert(
                        `${l[x]} was not found in the system!`,
                        "danger"
                      );
                      return false;
                    }
                  } else csvParsed[csvParsed.length - 1][keys[x]] = l[x];
                }
              }

              if (csvParsed[csvParsed.length - 1].email === undefined)
                csvParsed.pop();
              else {
                const stu = students.find(
                  (s) => s.email === csvParsed[csvParsed.length - 1].email
                );
                if (!stu) {
                  console.log(csvParsed[csvParsed.length - 1]);
                  console.log(l);
                  alertContext.setAlert(
                    `${
                      csvParsed[csvParsed.length - 1].email
                    } was not found in the system!`,
                    "danger"
                  );
                  return false;
                } else {
                  if (!(stu.house === csvParsed[csvParsed.length - 1].house)) {
                    csvParsed[csvParsed.length - 1].id = stu._id;
                    updatedUserList.push(csvParsed.pop());
                  }
                }
              }
            }
          }
          updateHouse(updatedUserList);
        };
      })(file);

      reader.readAsText(file);
    }
  };

  return (
    <div>
      {visible.edit.visible && (
        <div>
          <div className="editmodal__background" onClick={closeModal}></div>
          <div className="confirmationmodal">
            <div className="editmodal__close" onClick={closeModal}>
              X
            </div>
            {!updating.status ? (
              <div>
                <h2>{dictionary.title}</h2>

                <p>{dictionary.body}</p>
                <div
                  className="confirmationmodal__buttons"
                  style={{ textAlign: "center" }}
                >
                  <Form>
                    <input type="file" onChange={changeHandler}></input>
                    <br />
                    <br />
                    <input
                      value="Confirm"
                      className="btn btn-primary editmodal__button"
                      onClick={actionConfirmed}
                    />{" "}
                    <input
                      type="cancel"
                      value="Cancel"
                      className="btn btn-secondary editmodal__button"
                      onClick={closeModal}
                    />
                  </Form>
                </div>
              </div>
            ) : (
              <div>
                {updating.domView &&
                  updating.domView.map((update) => <p>{update}</p>)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadModal;
