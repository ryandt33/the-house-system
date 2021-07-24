import React, { useContext, useState, useEffect, Fragment } from "react";
import { Card } from "react-bootstrap";
import PointContext from "../../context/point/pointContext";
import StudentContext from "../../context/student/studentContext";
import AuthContext from "../../context/auth/authContext";
import CategoryContext from "../../context/category/categoryContext";

const Point = ({ point }) => {
  const pointContext = useContext(PointContext);
  const studentContext = useContext(StudentContext);
  const authContext = useContext(AuthContext);
  const categoryContext = useContext(CategoryContext);

  const [visible, setvisible] = useState({
    visible: true,
    bg: "light",
    text: "black",
    category: "",
    value: 0,
    badge: false,
  });

  const deletePoint = async () => {
    await pointContext.deletePoint(point._id, point.receiver);
    setvisible({ ...visible, visible: false, bg: "danger", text: "white" });
    studentContext.getStudent(point.receiver);
  };

  useEffect(() => {
    if (categoryContext.categories !== null) {
      const category = categoryContext.categories.filter(
        (category) => category.name === point.category
      )[0];

      if (category) {
        setvisible({
          ...visible,
          category: category,
          value: category.value,
          badge: true,
        });
        return;
      }
    } else {
      categoryContext.getCategories();
    }
    setvisible({
      ...visible,
      category: point.category,
      value: point.value,
    });
    // eslint-disable-next-line
  }, [categoryContext.categories]);

  return (
    <Card
      className="col-xl-3 col-lg-4 col-xs-12 col-sm-5 pointCards"
      text={visible.text}
      style={{
        backgroundColor: visible.category.backgroundColor,
        color: visible.category.color,
      }}
    >
      {" "}
      {visible.visible ? (
        <Fragment>
          {authContext.user.role === "Admin" && (
            <div className="float-right hover-dark" onClick={deletePoint}>
              X
            </div>
          )}
          <Card.Body
            style={{
              backgroundColor: visible.category.backgroundColor,
              color: visible.category.color,
            }}
          >
            <Card.Title>
              <p>{visible.category.name}</p>
            </Card.Title>
            {point.message}
          </Card.Body>
        </Fragment>
      ) : (
        <Fragment>
          <Card.Body>
            <Card.Title>{point.category}</Card.Title>
            <h3>Deleted</h3>
          </Card.Body>
        </Fragment>
      )}
    </Card>
  );
};

export default Point;
