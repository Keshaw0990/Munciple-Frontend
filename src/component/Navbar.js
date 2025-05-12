import React, { useState } from "react";


import { Link } from "react-router-dom";
//import ReorderIcon from "@mui/icons-material/Reorder";
import "../styles/Navbar.css";

function Navbar() {
 const [openLinks] = useState(false);
  return (
    <div className="Navbar">
      <div className="leftSide">
  
</div>

      <div className="rightSide">
      
      
        {/* <Link to="/Logout"> Log Out </Link> */}
       
    
      </div>
    </div>
  );
}

export default Navbar;