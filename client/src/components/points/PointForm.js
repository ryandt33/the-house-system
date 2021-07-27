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

  const [categories, setCategories] = useState({
    catList: [],
    cats: [],
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

  useEffect(() => {
    categoryContext.categories !== null &&
      categories.catList.length === 0 &&
      // setCategories({
      //   catList: categoryContext.categories.map((category) => {
      //     return {
      //       cat: createCategory(category),
      //       active: false,
      //       name: category.name,
      //     };
      //   }),
      // });
      setCategories({
        cats: categoryContext.categories,
        catList: categoryContext.categories.map((category) => {
          return {
            cat: createCategory(category, false),
            active: false,
            name: category.name,
            category: category,
          };
        }),
      });
  }, [categoryContext.categories]);

  useEffect(() => {
    console.log(categories.catList);

    console.log("updating");
    const list = categories.catList;
    for (let x = 0; x < list.length; x++) {
      list[x].active
        ? list.splice(x, 1, {
            ...list[x],
            cat: createCategory(list[x].category, true),
          })
        : list.splice(x, 1, {
            ...list[x],
            cat: createCategory(list[x].category, false),
          });
    }

    setCategories({ ...categories, catList: list });
  }, [categories.catList]);

  useEffect(() => {
    console.log(point);

    setCategories({
      ...categories,
      catList: categories.catList.map((category) => {
        console.log(category);
        if (category.name === point.category) {
          console.log(category.cat.props.className);

          return { ...category, active: true };
        } else {
          return { ...category, active: false };
        }
      }),
    });
  }, [point]);

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

    window.scrollTo(0, 0);
  };

  const catChange = (e) => {
    console.log(e.target.classList.add("active"));
    const { value, name } = getCategory(e.target.dataset.category);
    setPoint({
      ...point,
      category: name,
      value: value,
    });
  };

  const getCategory = (id) => {
    return categoryContext.categories.find((category) => category._id === id);
  };

  const createCategory = (category, active) => {
    console.log(active);
    return (
      !category.archived && (
        <div className={`categories`} key={category._id}>
          <Badge
            className={`category-badge ${
              active ? "categories-badge-active" : ""
            }`}
            as="span"
            style={{
              background: category.backgroundColor,
              color: category.color,
              width: "100%",
              marginBottom: "1rem",
            }}
            data-category={category._id}
            onClick={catChange}
          >
            {category.name}
          </Badge>
        </div>
      )
    );
  };

  return (
    <Form onSubmit={onSubmit} className="mb-5 mb-sm-0">
      {" "}
      <Form.Label>Choose a category</Form.Label>
      <Container style={{ padding: "0px" }}>
        <Form.Group onChange={catChange} style={{ textAlign: "center" }}>
          {categoryContext.categories !== null &&
            categories.catList.map((category) => category.cat)}
        </Form.Group>
      </Container>
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
