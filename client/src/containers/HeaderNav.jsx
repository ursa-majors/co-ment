import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

const HeaderNav = props => (
  <nav>
    <ul className="h-nav">
      <li className="h-nav__item">
        <NavLink to={`/${props.link}`} className="h-nav__item-link h-nav__item-link--login" activeClassName="h-nav__item-link--active">{props.link}</NavLink></li>
    </ul>
  </nav>
    );

HeaderNav.propTypes = {
  link: PropTypes.string.isRequired,
};

export default HeaderNav;
