import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import logo from '../assets/infinitio-01.png';

function Navbar() {
  return (
<div className="Navbar">
  <div className="leftSide">
    <div className="logo-container">
      <img src={logo} alt="Infinitio Logo" className="logo" />
      <div className="logo-text-container">
        <span className="logo-text">INFINITO DIGITAL</span>
        <span className="logo-subtext">PRIVATE LIMITED</span>
      </div>
    </div>
  </div>

  <div className="rightSide">
    {/* <Link to="/Logout">Log Out</Link> */}
  </div>
</div>


  );
}

export default Navbar;
