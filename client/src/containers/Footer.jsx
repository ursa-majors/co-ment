import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <div className="footer">
    &copy; 2017 The Ursa Majors
    <div className="">
      <Link className="footer__link" to="/privacy">Privacy</Link>
    </div>
    <a
      href="https://github.com/ursa-majors/co-ment"
      data-taborder=""
      rel="noopener noreferrer"
      target="_blank"
      className="footer__link"
    >
      <i className="fa fa-github footer__icon" />
    </a>
  </div>
);

export default Footer;
