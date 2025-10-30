import React from "react";
import logo from "../assets/images/logo.png";
import "./Header.css";

function Header() {
    return(
        <header className="common-header">
            <img src={logo} alt="Company Logo" className="bank-logo" />
        </header>
    )
}

export default Header;