import React, { useState } from "react";
import CartItem from "../../components/shop/CartItem";

import { useNavigate } from "react-router-dom";
export default function ShoppingCart({
  items,
  cartItems,
  handleDelete,
  handleQuantityChange,
}) {
  const [checkedItems, setCheckedItems] = useState(
    cartItems.map((el) => el.itemId)
  );

  const navigate = useNavigate();

  const buytotal = () => {
    const selectedItems =
      checkedItems?.map((index) => {
        const item = items[index];
        return item ? item.name : null;
      }) || [];

    const data = {
      totalPrice: total.price,
      totalQuantity: total.quantity,
      selectedItems: selectedItems,
    };

    navigate("/payment", { state: data });
  };

  const handleCheckChange = (id) => {
    if (checkedItems.includes(id)) {
      setCheckedItems(checkedItems.filter((el) => el !== id));
    } else {
      setCheckedItems([...checkedItems, id]);
    }
  };

  const handleAllCheck = () => {
    if (checkedItems.length === cartItems.length) {
      setCheckedItems([]);
    } else {
      setCheckedItems(cartItems.map((el) => el.itemId));
    }
  };
  const getTotal = () => {
    let totalPrice = 0;
    let totalQuantity = 0;

    cartItems.forEach((cartItem) => {
      const itemId = cartItem.itemId;
      if (checkedItems.includes(itemId)) {
        const quantity = parseInt(cartItem.quantity, 10);
        const price =
          parseInt(items.find((el) => el.id === itemId)?.price, 10) || 0;

        totalPrice += quantity * price;
        totalQuantity += quantity;
      }
    });

    const total = {
      price: totalPrice,
      quantity: totalQuantity,
    };

    return total;
  };

  const renderItems = items.filter((el) =>
    cartItems.map((el) => el.itemId).includes(el.id)
  );
  const total = getTotal();

  return (
    <>
      <h1>장바구니</h1><hr/>
      <div className="row shopping-div">
        <h5 className="col-8">전체선택</h5>
        <input
        className="col-1"
          type="checkbox"
          checked={checkedItems.length === cartItems.length}
          onChange={(e) => handleAllCheck(e.target.checked)}
        />
      </div><hr/>
      <div>
        {!cartItems.length ? (
          <div>장바구니에 아이템이 없습니다.</div>
        ) : (
          <div>
            {renderItems.map((item, idx) => {
              const quantity =
                cartItems.find((el) => el.itemId === item.id)?.quantity || 0;
              return (
                <CartItem
                  key={idx}
                  handleCheckChange={() => handleCheckChange(item.id)}
                  handleQuantityChange={handleQuantityChange}
                  handleDelete={handleDelete}
                  item={item}
                  checkedItems={checkedItems}
                  quantity={quantity}
                />
              );
            })}
          </div>
        )}

        <div>
          <h3>
            {checkedItems?.map((index) => {
              const item = items[index];
              return item ? item.name : null;
            })}
          </h3>
          <p>총 가격: {total.price}원</p>
          <p>총 수량: {total.quantity}</p>
          <button onClick={buytotal}>구매하기</button>
        </div>
      </div>
    </>
  );
}
