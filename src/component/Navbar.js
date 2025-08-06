import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import logo from '../assets/infinitio-01.png';
import logo1 from '../assets/download.jpeg';

function Navbar() {
  return (
    <div className="Navbar">
      <div className="leftSide">
        <div className="logo-container-horizontal">
          <img src={logo1} alt="download.jpeg" className="logo1" />
          <span className="logo-title">
            Municipal Corporation of Sangli Miraj and Kupwad City
          </span>
        </div>

        {/* Keep these lines for future use */}
        {/* 
        <div className="logo-text-container">
          <span className="logo-text">INFINITO DIGITAL</span>
          <span className="logo-subtext">PRIVATE LIMITED</span>
        </div> 
        */}
      </div>

      <div className="rightSide">
        {/* <Link to="/Logout">Log Out</Link> */}
      </div>
    </div>
  );
}

export default Navbar;
