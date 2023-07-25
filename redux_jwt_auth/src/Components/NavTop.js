import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function NavTop() {
  return (
    <>
      <Navbar className='navbarColor' data-bs-theme="dark">
        <Container className="d-flex justify-content-between align-items-center">
          <Nav className="me-auto">
            <Nav.Link href="/home" className="ml-3">Home</Nav.Link> 

            <Nav.Link href="/Login" className="ml-3">Login</Nav.Link>
            <Nav.Link href="/SignUp" className="ml-3">SignUp</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavTop;
