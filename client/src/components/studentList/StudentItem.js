import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Badge, Container } from "react-bootstrap";
import StudentContext from "../../context/student/studentContext";

const StudentItem = ({ student, realms }) => {
  const studentContext = useContext(StudentContext);

  const [button, setButton] = useState({
    buttonTitle: "Assign Points",
    img: "",
  });

  useEffect(() => {
    if (student !== null) {
      updateStudent();
    }

    // eslint-disable-next-line
  }, []);
  const updateStudent = async () => {
    if (student.photoURL !== undefined) {
      await getPhoto();
    }
  };

  const getPhoto = async () => {
    const pic = await studentContext.getPhoto(student.studentID);
    setButton({ ...button, img: pic });
  };
  return (
    <Card
      className='col-lg-11 col-sm-11 stuCard'
      style={{
        boxShadow: `3px 3px 3px ${
          realms.find((realm) => realm._id === student.house).backgroundColor
        }`,
      }}
    >
      <Card.Body className='stu-card-body'>
        <div>
          {" "}
          <Link className='student-link' to={`/student/${student.studentID}`}>
            <span className='student-card-spacer'>
              <Container fluid>
                {" "}
                {student.photoURL && (
                  <div className='student-pic'>
                    <img
                      src={`data:image/jpg;base64, ${button.img}`}
                      alt={`${student.lastName} ${student.firstName}`}
                    />
                  </div>
                )}
                <div className='student-info-name'>
                  {student.lastName} {student.firstName} - {student.studentID}{" "}
                  {student.otherName && " (" + student.otherName + ")"}
                  {student.nickname && ` | ${student.nickname}`}
                </div>
              </Container>
            </span>
          </Link>
          <Badge
            variant='info'
            className='student-card-spacer'
            style={{
              backgroundColor: realms.find(
                (realm) => realm._id === student.house
              ).backgroundColor,
              color: realms.find((realm) => realm._id === student.house).color,
            }}
          >
            {realms.find((realm) => realm._id === student.house).name} -{" "}
            {student.classGrade}
          </Badge>
        </div>
        {/* <Card.Subtitle>
            {" "}
            <div className='centered'></div>            </div>

          </Card.Subtitle>
          {/* <Accordion>
            <hr />{" "}
            <div className='centered'>
              
          </Accordion> */}{" "}
      </Card.Body>
    </Card>
  );
};

export default StudentItem;
