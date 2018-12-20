import React from "react";
import moment from "moment";

const Footer = () => {
  return (
    <footer className="footer">
      <span className="footer__text">
        <a
          className="footer__link"
          href="https://justinformentin.com/"
          target="_blank"
        >
          Justin Formentin
        </a>
        {" "}&copy; {moment().year()}
      </span>
    </footer>
  );
};

export default Footer;
