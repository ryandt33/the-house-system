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

import React, { useState, useContext, useEffect } from "react";
import AlertContext from "../../../context/alert/alertContext";

const ArchiveToggle = ({ editFunction, obj }) => {
  const alertContext = useContext(AlertContext);
  const [archived, setArchived] = useState(true);

  useEffect(() => {
    setArchived(obj.archived);
  }, []);

  const onChange = async () => {
    setArchived(!archived);
    const res = await editFunction(obj._id);
    res.success
      ? alertContext.setAlert(`${res.msg}`, "success")
      : alertContext.setAlert("Failed to archive/unarchive category", "danger");
  };

  return (
    <div className="archive_toggle" style={{}}>
      <span className="archive_toggle__text">Archived? </span>
      <input type="checkbox" onClick={onChange} checked={archived}></input>
    </div>
  );
};

export default ArchiveToggle;
