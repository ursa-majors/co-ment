import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const PostActions = (props) => (
  <Link className="f-nav__icon-link" to={props.link} onClick={e => props.clickHandler(e)}>
    {props.name}
  </Link>
);


PostActions.propTypes = {
  name: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};

export default PostActions;
