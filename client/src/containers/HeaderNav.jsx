import React from 'react';
import { NavLink } from 'react-router-dom';

const HeaderNav = props => (
  <nav>
    <ul className="h-nav">
        {props.links.map(item =>
          <li className="h-nav__item" key={item}>
            <NavLink
              to={`/${item}`}
              className="h-nav__item-link h-nav__item-link--login"
              activeClassName="h-nav__item-link--active">
              {item}
            </NavLink>
          </li>
        )}
    </ul>
  </nav>
    );

export default HeaderNav;
