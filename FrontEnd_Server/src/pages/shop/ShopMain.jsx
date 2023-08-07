import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../utils/Urls";
import NavTop from "../../components/NavTop";
import { updateCartItems } from "../../reducers/shop";
import {
  Form,
  Row,
  Col,
  Stack,
  Container,
  Card,
  InputGroup,
  Offcanvas,
} from "react-bootstrap";
import { initialState } from "./Initial";
import ShoppingCart from "./ShoppingCart";
import ItemList from "./ItemList";
import "./shop.css";

function ShopMain() {
  const storecart = useSelector((state) => state.cartList.cartItems);
  const dispatch = useDispatch();
  const [items, setItems] = useState(initialState.items);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    setCartItems(storecart);
  }, []);

  useEffect(() => {
    dispatch(updateCartItems(cartItems));
  }, [cartItems]);

  // 장바구니에 아이템을 추가하여 cartItems에 넣는 메소드
  const addToCart = (itemId) => {
    const found = cartItems.filter((el) => el.itemId === itemId)[0];

    // 이미 장바구니에 있는 상품을 추가하는 경우, 해당 요소의 quantity의 숫자를 1 올려주기
    if (found) {
      setQuantity(itemId, found.quantity + 1);
    } else {
      // 장바구니에 없는 상품을 추가할 경우, cartItems에 새로운 엘리먼트로 추가하기
      setCartItems([
        ...cartItems,
        {
          itemId,
          quantity: 1,
        },
      ]);
    }
  };

  // 이미 장바구니에 있는 상품의 cartItems의 quantity를 변경하는 메소드
  const setQuantity = (itemId, quantity) => {
    // itemId로 배열에서 해당 상품을 찾고, 그것의 인덱스를 구하기
    const found = cartItems.filter((cart) => cart.itemId === itemId)[0];
    const idx = cartItems.indexOf(found);

    // 배열에 삽입할 객체 형태의 엘리먼트 선언하기
    const cartItem = {
      itemId,
      quantity,
    };

    // quantity값이 변경되었으므로 기존의 엘리먼트를 삭제하고 새로운 엘리먼트 삽입
    setCartItems([
      ...cartItems.slice(0, idx),
      cartItem,
      ...cartItems.slice(idx + 1),
    ]);
  };

  // 상품을 장바구니에서 삭제하는 메소드
  const handleDelete = (itemId) => {
    setCartItems(
      cartItems.filter((item) => {
        return item.itemId !== itemId;
      })
    );
  };
  return (
    <>
      <NavTop />
      <Container>
        <Row>
          <Col lg={7} xs={12} className="main-col">
            <ItemList handleAdd={addToCart} items={items} />
          </Col>
          <Col lg={4} xs={12} className="shop-cart-main">
            <ShoppingCart
              cartItems={cartItems}
              items={items}
              handleDelete={handleDelete}
              handleQuantityChange={setQuantity}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ShopMain;
