import React from "react";

import "./Header.scss";
import logo from "../../assets/abstracts/logo.png";
import { ReactComponent as Menu } from "../../assets/icons/menu.svg";
import { Link } from "react-router-dom";

interface HeaderProps {
  openSidebar: boolean;
  setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}
const Header: React.FC<HeaderProps> = ({ openSidebar, setOpenSidebar }) => {
  return (
    <header className="header_wrapper">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="logo" width={150} />
        </Link>
      </div>
      <div onClick={() => setOpenSidebar(true)} style={{ cursor: "pointer" }}>
        <Menu />
      </div>
    </header>
  );
};

export default Header;
