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

const Navtiles = ({ tiles }) => {
  const [tileView, setTileView] = useState({ tiles: tiles, change: false });

  useEffect(() => {
    console.log(tileView);
    tileView.change && setTileView({ ...tileView, change: false });
  }, [tileView]);

  const showTile = (e) => {
    for (let tile of tiles) {
      tile.title === e.target.dataset.tile
        ? (tile.active = true)
        : (tile.active = false);
    }
    setTileView({ change: true, tiles: tiles });
    console.log(tileView);
  };

  return (
    <div className="navtiles">
      <nav className="navtiles__holder">
        {tiles &&
          tiles.map((tile) => (
            <div
              data-tile={tile.title}
              className="navtiles__tile"
              onClick={showTile}
              key={tile.title}
            >
              <div className="navtiles__icon" data-tile={tile.title}>
                <i className={`${tile.icon}`} data-tile={tile.title}></i>
              </div>
              <h4 className="navtiles__title" data-tile={tile.title}>
                {tile.title}
              </h4>
              <div className="navtiles__overlay" data-tile={tile.title}></div>
            </div>
          ))}
      </nav>
      <hr />
      {tileView.tiles.length > 0 &&
        tileView.tiles.map(
          (tile) =>
            tile.active && <tile.view key={`${tile.title}-view`}></tile.view>
        )}
    </div>
  );
};

export default Navtiles;
