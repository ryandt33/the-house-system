import React, { useState, useContext, useEffect } from "react";
import { Form, Button, Row, Badge, Container } from "react-bootstrap";
import PointContext from "../../context/point/pointContext";
import AuthContext from "../../context/auth/authContext";
import AlertContext from "../../context/alert/alertContext";
import StudentContext from "../../context/student/studentContext";
import CategoryContext from "../../context/category/categoryContext";

const PointForm = ({ student }) => {
  const pointContext = useContext(PointContext);
  const authContext = useContext(AuthContext);
  const studentContext = useContext(StudentContext);
  const categoryContext = useContext(CategoryContext);
  const alertContext = useContext(AlertContext);

  !student && (student = studentContext.student);

  const [point, setPoint] = useState({
    value: 1,
    category: "",
    message: "",
    realm: student.house,
    receiver: student._id,
    giver: authContext.user._id,
  });

  const { message } = point;

  const onChange = (e) => {
    setPoint({
      ...point,
      [e.target.name]: e.target.value,
      receiver: student._id,
    });
  };

  useEffect(() => {
    setPoint({
      ...point,
      realm: student.house,
    });
    categoryContext.getCategories();
    // eslint-disable-next-line
  }, [student.house]);

  const onSubmit = async (e) => {
    e.preventDefault();
    await pointContext.addPoint(point);
    setPoint({
      ...point,
      category: "",
      message: "",
      value: 1,
    });
    await studentContext.getStudent(student._id);
    student.otherName
      ? alertContext.setAlert(
          `${point.category} was awarded to ${studentContext.student.lastName} ${studentContext.student.firstName}(${studentContext.student.otherName})`,
          "success"
        )
      : alertContext.setAlert(
          `${point.category} was awarded to ${studentContext.student.lastName} ${studentContext.student.firstName}`,
          "success"
        );
  };

  const catChange = (e) => {
    const { value, name } = getCategory(e.target.value);
    setPoint({
      ...point,
      category: name,
      value: value,
    });
  };

  const getCategory = (id) => {
    return categoryContext.categories.filter(
      (category) => category._id === id
    )[0];
  };

  return (
    <Form onSubmit={onSubmit} className="mb-5 mb-sm-0">
      {" "}
      <Form.Label>Choose a category</Form.Label>
      <Container>
        <Form.Group onChange={catChange}>
          {categoryContext.categories !== null &&
            categoryContext.categories.map(
              (category) =>
                !category.archived && (
                  <div className="categories" key={category._id}>
                    <Badge
                      className="category-badge"
                      as="span"
                      style={{
                        background: category.backgroundColor,
                        color: category.color,
                        width: "100%",
                        marginBottom: "1rem",
                      }}
                    >
                      <Form.Check
                        type="radio"
                        name="category"
                        value={category._id}
                        checked={point.category === category.name}
                        onChange={catChange}
                      />

                      {category.name}
                    </Badge>
                  </div>
                )
            )}
        </Form.Group>
      </Container>
      {/* <Form.Control
        placeholder='Enter Point Category'
        name='category'
        value={category}
        onChange={onChange}
        required
      />
      <br />
      <Form.Label>Value</Form.Label>
      <Form.Control
        placeholder='Enter Message'
        name='value'
        value={value}
        onChange={onChange}
        required
        type='number'
      />
      <br /> */}
      <Form.Label>Message</Form.Label>
      <Form.Control
        placeholder="Enter Message"
        name="message"
        value={message}
        onChange={onChange}
        as="textarea"
        rows="3"
      />
      <div className="centered">
        <Button variant="primary" type="submit">
          Submit Point
        </Button>
      </div>
    </Form>
  );
};

export default PointForm;
