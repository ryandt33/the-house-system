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

import React, { useEffect, useState } from "react";

const Navtabs = ({ fields, tabs }) => {
  const [tabView, setTabView] = useState({ tabs: tabs, change: false });
  const [dictionary, setDictionary] = useState([]);

  const [edit, setEdit] = useState({
    fields: null,
    visible: false,
    id: null,
    updated: false,
    create: true,
  });

  useEffect(() => {
    const newFields = {};
    const dic = [];

    for (let item of fields) {
      newFields[item.attribute] = "";
      dic.push({ attribute: item.attribute });
    }

    console.log(newFields);

    setEdit({ ...edit, fields: newFields });

    setDictionary(dic);
    console.log(tabs);
  }, []);

  useEffect(() => {
    console.log(dictionary);
  }, [dictionary]);

  useEffect(() => {
    console.log(edit);
  }, [edit]);

  useEffect(() => {
    tabView.change && setTabView({ ...tabView, change: false });
  }, [tabView]);

  useEffect(() => {
    if (edit.visible === false) {
      for (let tab of tabs) {
        tab.active = false;
      }
    }
    console.log("Tab closed");
  }, [edit.visible]);

  const openModal = (e) => {
    const tabName = e.target.dataset.tab;
    const tab = tabs.find((t) => t.title === tabName);

    tab.active = true;
    console.log(tabs);
    setTabView({ change: true, tabs: tabs });
    setEdit({ ...edit, visible: true });
  };

  return (
    <div className="navtabs">
      <nav className="navtabs__holder">
        {tabs &&
          tabs.map((tab) => (
            <div
              data-tab={tab.title}
              className="navtabs__tab"
              onClick={openModal}
              key={tab.title}
            >
              <h4 className="navtabs__title" data-tab={tab.title}>
                {tab.title}
              </h4>
              <div className="navtabs__overlay" data-tab={tab.title}></div>
            </div>
          ))}
      </nav>
      <hr />
      {tabView.tabs.length > 0 &&
        tabView.tabs.map(
          (tab) =>
            tab.active && (
              <tab.view
                key={`${tab.title}-view`}
                visible={{ edit: edit, setEdit: setEdit }}
                dictionary={tab.input ? tab.input : fields}
                editFunction={tab.editFunction}
                requiredKeys={tab.requiredKeys}
              ></tab.view>
            )
        )}
    </div>
  );
};

export default Navtabs;
