import React from 'react';
import { NavLink } from 'react-router-dom';

const FooterNav = () => (
  <nav>
    <ul className="f-nav">
      <li className="f-nav__item" >
        <NavLink to="/" className="f-nav__item-link" activeClassName="f-nav__item-link--active f-nav__item-link--home">Home </NavLink></li>
      <li className="f-nav__item">
        <NavLink to="/about" className="f-nav__item-link f-nav__item-link--about" activeClassName="f-nav__item-link--active">About</NavLink></li>
      <li className="f-nav__item">
        <NavLink to="https://github.com/ursa-majors/co-ment/issues" target="_blank" className="f-nav__item-link f-nav__item-link--bug" activeClassName="f-nav__item-link--active">Report Bug</NavLink></li>
    </ul>
  </nav>
    );

export default FooterNav;
