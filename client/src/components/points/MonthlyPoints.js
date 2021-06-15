import React, { useEffect, useState } from "react";

const MonthlyPoints = data => {
  const [monthly, setMonthly] = useState({
    monthlyPoints: data.point.points
  });

  useEffect(() => {
    setMonthly({ ...monthly, monthlyPoints: data.point.points });
    // eslint-disable-next-line
  }, [data.point.points]);

  return <span className='point-display'>{data.point.points}</span>;
};

export default MonthlyPoints;
