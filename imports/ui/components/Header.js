import React from "react";
import { Session } from "meteor/session";
import { withTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export const Header = ({ handleNavToggle, isNavOpen }) => {
  return (
    <div className="top-header">
      <div className="top-header__nav-toogle" onClick={() => handleNavToggle()}>
        {isNavOpen ? xSvg : barsSvg}
      </div>
      <Link className="top-header__logo" to="/">
        <img src="logo.png" className="top-header__image" alt="Lstner logo" />
        <h2 className="top-header__text">Lstner</h2>
      </Link>
    </div>
  );
};
  
Header.propTypes = {
  handleNavToggle: PropTypes.func.isRequired,
  isNavOpen: PropTypes.bool.isRequired
};

Header.defaultProps = {
  handleNavToggle: () => {},
  isNavOpen: false
};

export default withTracker(() => {
  return {
    handleNavToggle: () => Session.set("isNavOpen", !Session.get("isNavOpen")),
    isNavOpen: Session.get("isNavOpen")
  };
})(Header);

const barsSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="200"
    height="200"
    viewBox="0 0 200 200"
  >
    <g fill="none">
      <g fill="#fafafa">
        <rect y="27" width="200" height="25.2" />
        <rect y="87.3" width="200" height="25.2" />
        <rect y="147.6" width="200" height="25.2" />
      </g>
    </g>
  </svg>
);

const xSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="200"
    height="200"
    viewBox="0 0 200 200"
  >
    <g fill="none">
      <g fill="#fafafa">
        <rect
          transform="translate(100.171201 99.58)rotate(45)"
          x="-124.2"
          y="-12.6"
          width="248.3"
          height="25.2"
        />
        <rect
          transform="translate(100.171201 99.58)rotate(-45)"
          x="-124.2"
          y="-12.6"
          width="248.3"
          height="25.2"
        />
      </g>
    </g>
  </svg>
);
