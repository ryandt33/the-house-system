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
import StudentContext from "../../context/student/studentContext";

const StudentPic = ({ props }) => {
  const { student, width, height } = props;
  const studentContext = useContext(StudentContext);

  const [display, setDisplay] = useState({
    img: "",
    loaded: false,
  });

  useEffect(() => {
    const loadData = async () => {
      await getPhoto();
    };
    !display.loaded && loadData();
    return () => {
      setDisplay({ img: "" });
    };
    // eslint-disable-next-line
  }, []);

  const getPhoto = async () => {
    const pic = await studentContext.getPhoto(student.studentID);
    setDisplay({ ...display, img: pic, loaded: true });
  };

  //   getPhoto();

  return (
    <div>
      {width && height ? (
        <div className='stuPic' style={{ width: width, height: height }}>
          {display.loaded ? (
            <img
              src={`data:image/jpg;base64, ${display.img}`}
              alt={`${student.firstName} ${student.lastName}`}
            />
          ) : (
            <img src='/spinner.gif' alt='Loading' />
          )}
        </div>
      ) : (
        <div className='stuPic'>
          {display.loaded ? (
            <img
              src={`data:image/jpg;base64, ${display.img}`}
              alt={`${student.firstName} ${student.lastName}`}
            />
          ) : (
            <img src='/spinner.gif' alt='Loading' />
          )}
        </div>
      )}
    </div>
  );
};

export default StudentPic;
