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

import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Navtiles = ({ tiles }) => {
  useEffect(() => {
    for (let tile of tiles) {
      // tile.view && (tile.active = false);
    }
  }, []);
  return (
    <div className="navtiles">
      <nav className="navtiles__holder">
        {tiles &&
          tiles.map((tile) => (
            <Link to={tile.link}>
              <div className="navtiles__tile" key={tile.name}>
                <div className="navtiles__icon">
                  <i className={`${tile.icon}`}></i>
                </div>
                <h4 className="navtiles__title">{tile.title}</h4>
              </div>
            </Link>
          ))}
      </nav>
      <hr />
      {tiles && tiles.map((tile) => tile.active && <tile.view></tile.view>)}
    </div>
  );
};

export default Navtiles;
