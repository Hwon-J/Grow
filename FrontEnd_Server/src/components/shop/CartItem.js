import React from 'react';

const CartItem = ({
  item,
  checkedItems,
  quantity,
  handleCheckChange,
  handleQuantityChange,
  handleDelete
}) => {
  return (
    <div>
      <h5>{item.name}</h5>
      <p>가격: {item.price}원</p>
      <input
        type="checkbox"
        checked={checkedItems.includes(item.id)}
        onChange={() => handleCheckChange(item.id)}
      />
      <input
        type="number"
        value={quantity}
        onChange={(event) => handleQuantityChange(item.id, event.target.value)}
      />
      <button onClick={() => handleDelete(item.id)}>삭제</button>
    </div>
  );
};

export default CartItem;
