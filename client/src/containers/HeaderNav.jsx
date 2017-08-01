import React from 'react';
import { NavLink } from 'react-router-dom';

const HeaderNav = () => (
  <nav>
    <ul className="h-nav">
      <li className="h-nav__item">
        <NavLink to="/login" className="h-nav__item-link h-nav__item-link--login" activeClassName="h-nav__item-link--active">Login</NavLink></li>
    </ul>
  </nav>
    );

export default HeaderNav;
