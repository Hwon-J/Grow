import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../reducers/userSlice';
import './navbar.scss';
import logo from '../assets/logo.png';

function NavTop() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser);

  const handleLogout = () => {
    dispatch(logoutUser());
    console.log(currentUser);
  };

  return (
    <>
      <section className="navigation">
        <div className="nav-container">
          <div className="brand">
            <NavLink to="/home" style={{ textDecoration: 'none' }}>
              <img src={logo} alt="Home" />
            </NavLink>
          </div>
          <nav>
            <ul className="nav-list">
              <li>
                <NavLink to="/" style={{ textDecoration: 'none' }}>Home</NavLink>
              </li>
              <li>
                <NavLink to="/profile" style={{ textDecoration: 'none' }}>Profile</NavLink>
              </li>
              <li>
                <NavLink to="/plantinfo" style={{ textDecoration: 'none' }}>plantinfo</NavLink>
              </li>
              <li>
                {!currentUser.token ? (
                  <NavLink to="/login" style={{ textDecoration: 'none' }}>Login</NavLink>
                ) : (
                  <NavLink onClick={handleLogout} to="/login" style={{ textDecoration: 'none' }}>Logout</NavLink>
                )}
              </li>
              <li>
                <NavLink to="/signup" style={{ textDecoration: 'none' }}>SignUp</NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </section>
    </>
  );
}

export default NavTop;
