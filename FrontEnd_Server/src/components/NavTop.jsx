import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../reducers/userSlice";
import "./navbar.scss";
import logo from "../assets/logo.png";

function NavTop() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser);

  const handleLogout = () => {
    dispatch(logoutUser());
    console.log(currentUser);
  };

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  // 로그인여부에 따라 navtop의 메뉴가 달라진다.
  return (
    <>
      <section className="navigation" style={{marginBottom:"0px"}}>
        <div className="nav-container">
          <div className="brand">
            <NavLink to="/home#sectionOne" style={{ textDecoration: "none" }}>
              <img style={{height:"50px"}} src={logo} alt="Home" />
            </NavLink>
          </div>
          {windowWidth <= 600 && (
            <div className="nav-mobile" onClick={toggleMobileMenu}>
              <span
                className={`hamburger ${showMobileMenu ? "open" : ""}`}
              ></span>
            </div>
          )}
          <nav>
            <ul className={`nav-list ${showMobileMenu ? "mobile-show" : ""}`}>
              <li>
                <NavLink to="/home" style={{ textDecoration: "none" }}>
                  Home
                </NavLink>
              </li>
              {currentUser.token ? (
                <>
                  <li>
                    <NavLink to="/profile" style={{ textDecoration: "none" }}>
                      Profile
                    </NavLink>
                  </li>
                </>
              ) : null}
              <li>
                {!currentUser.token ? (
                  <NavLink to="/login" style={{ textDecoration: "none" }}>
                    Login
                  </NavLink>
                ) : (
                  <NavLink
                    onClick={handleLogout}
                    to="/login"
                    style={{ textDecoration: "none" }}
                  >
                    Logout
                  </NavLink>
                )}
              </li>
              <li>
                {!currentUser.token ? (
                  <NavLink to="/signup" style={{ textDecoration: "none" }}>
                    SignUp
                  </NavLink>
                ) : null}
              </li>
            </ul>
          </nav>
        </div>
      </section>
    </>
  );
}

export default NavTop;
