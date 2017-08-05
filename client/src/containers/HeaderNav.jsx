import React from 'react';
import { NavLink } from 'react-router-dom';

const HeaderNav = props => (
  <nav>
    <ul className="h-nav">
      <li className="h-nav__item">
        {props.links.map(item =>
          <NavLink to={props.starting ? '/' : `/${item}`} className={`h-nav__item-link h-nav__item-link--login ${props.css}`} activeClassName="h-nav__item-link--active" key={item}>{item}</NavLink>,
        )}
      </li>
    </ul>
  </nav>
    );

export default HeaderNav;
