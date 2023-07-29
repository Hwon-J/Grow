import React, { useState } from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../reducers/userSlice';
import './navbar.scss';
function NavTop() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.currentUser);  // 로그인 되어있는 유저
  const handleNavItemClick = (e) => {   // Service 아래로 toogle처리
    e.stopPropagation();
    const clickedNavItem = e.currentTarget;
    const siblings = Array.from(
      clickedNavItem.parentElement.children
    ).filter((el) => el !== clickedNavItem);

    siblings.forEach((sibling) => {
      const dropdown = sibling.querySelector('.nav-dropdown');
      if (dropdown) {
        dropdown.style.display = 'none';
      }
    });

    const dropdown = clickedNavItem.querySelector('.nav-dropdown');
    if (dropdown) {
      dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    }
  };

  const handleNavToggle = () => {
    setIsNavOpen((prevIsNavOpen) => !prevIsNavOpen);
  };

  const handleLogout = () => {   // 로그아웃 처리 
    dispatch(logoutUser());   // 로그아웃 dispatch불러오기
    navigate('/home'); // 로그아웃 완료되었을시 home으로 이동
    console.log(currentUser)  
  };

  return (
    <>
      <section className="navigation">
        <div className="nav-container">
          <div className="brand">
            <Link to="/home">
              <img src="./img/logo.png" alt="Home" />
            </Link>
          </div>
          <nav>
            <div className="nav-mobile">
              <a id="nav-toggle" href="#!" onClick={handleNavToggle}>
                <span></span>
              </a>
            </div>
            <ul className={`nav-list ${isNavOpen ? 'open' : ''}`}>
              <li>
                <Link to="/home">Home</Link>
              </li>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <Link to="/register">Regiseter</Link>
              </li>
              <li onClick={handleNavItemClick}>
                <Link to="#">Services</Link>
                <ul className="nav-dropdown">
                  <li onClick={(e) => e.stopPropagation()}>
                    <Link to="/services/web-design">Web Design</Link>
                  </li>
                  <li onClick={(e) => e.stopPropagation()}>
                    <Link to="/services/web-development">Web Development</Link>
                  </li>
                  <li onClick={(e) => e.stopPropagation()}>
                    <Link to="/services/graphic-design">Graphic Design</Link>
                  </li>
                </ul>
              </li>
              <li onClick={handleNavItemClick}>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <p onClick={handleLogout}>Logout</p>
              </li>
              <li onClick={handleNavItemClick}>
                <Link to="/signup">SignUp</Link>
              </li>
            </ul>
          </nav>
        </div>
      </section>
    </>
  );
}

export default NavTop;
