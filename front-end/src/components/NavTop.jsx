import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import './NavTop.scss';

function NavTop() {
  return (
    <>
      <Navbar className='navbarColor' data-bs-theme="dark">
      <Container className="navbarContent">
          <Nav className="navLinks">
            <img className="logo" src={process.env.PUBLIC_URL + 'img/logo.png'} alt="error" />
          </Nav>
          <Nav className="navLinks right"> {/* right 클래스 추가 */}
            <Nav.Link href="/home">Home</Nav.Link> 
            <Nav.Link href="/profile">Profile</Nav.Link>
            <Nav.Link href="/Login">Login</Nav.Link>
            <Nav.Link href="/SignUp">SignUp</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavTop;
