import React, { useContext, useState, Fragment } from "react";
import StudentContext from "../../context/student/studentContext";
import StudentItem from "./StudentItem";
import { Form, FormControl, Button } from "react-bootstrap";

const Students = ({ realms }) => {
  const studentContext = useContext(StudentContext);
  const { students } = studentContext;

  const [filter, setFilter] = useState({
    search: "",
  });

  const onChange = (e) => {
    setFilter({ ...filter, search: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await studentContext.filterStudents(filter.search);
  };

  return (
    <Fragment>
      {" "}
      {students !== null ? (
        students.map(
          (student) =>
            !student.archived && (
              <div
                className="col-lg-6 col-md-12 studentCards"
                key={student._id}
              >
                <StudentItem student={student} realms={realms} />
              </div>
            )
        )
      ) : (
        <div>
          <h3>Search for students:</h3>
          <Form onSubmit={onSubmit} inline>
            <FormControl
              type="text"
              name="search"
              placeholder="Search"
              onChange={onChange}
              className="mr-sm-2"
            />
            <Button variant="outline-success" type="submit">
              Search
            </Button>
          </Form>
        </div>
      )}
    </Fragment>
  );
};

export default Students;
