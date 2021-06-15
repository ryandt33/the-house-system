import React, { useEffect, useState } from "react";

const PointCounter = (points) => {
  const [point, setPoints] = useState({
    points: null,
  });

  useEffect(() => {
    let value = 0;
    for (let x = 0; x < points.points.length; x++) {
      !points.points[x].archived && (value += points.points[x].point.value);
    }
    setPoints({ ...points, points: value });
  }, [points]);

  return <span>{point.points}</span>;
};

export default PointCounter;
