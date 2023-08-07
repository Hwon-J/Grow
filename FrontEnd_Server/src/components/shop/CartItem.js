import React from "react";
import { Row, Col, Form, Button, Container } from "react-bootstrap";
import "./cartitem.css";
const CartItem = ({
  item,
  checkedItems,
  quantity,
  handleCheckChange,
  handleQuantityChange,
  handleDelete,
}) => {
  return (
    <div className="cartitem-div">
      <Row className="my-3 cart-row">
        <Col sm={12}>
          <p>
            {item.name} 가격: {item.price}원
          </p>
        </Col>
        <Col sm={12}>
          <Row className="row-cart-center">
            <Col sm={5} className="col-cart-left">
              <input
                type="number"
                value={quantity}
                onChange={(event) =>
                  handleQuantityChange(item.id, event.target.value)
                }
                className="w-100" // Add w-100 class to fill the Col width
              />
            </Col>
            <Col sm={5} className="col-cart-right">
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(item.id)}
              >
                삭제
              </button>
              <input
              className="checkbox-col"
                type="checkbox"
                checked={checkedItems.includes(item.id)}
                onChange={() => handleCheckChange(item.id)}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <hr />
    </div>
  );
};

export default CartItem;
