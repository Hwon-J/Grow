import React from 'react';
import Item from '../../components/shop/Item';
import { Col, Row } from 'react-bootstrap';
import './itemlist.css'
function ItemList({ items, handleAdd }) {
  return (
    <Row className='itemList-row'>
      {items.map((item, idx) => (
        <Col className="ltemList-col" key={idx} md={4} xs={6}>
          <Item item={item} handleClick={() => handleAdd(item.id)} />
        </Col>
      ))}
    </Row>
  );
}

export default ItemList;
