import React from 'react';
import PropTypes from 'prop-types';

const Spinner = props => (
  <div className={`spinner ${props.cssClass}`}>
    <i className="fa fa-spinner fa-pulse fa-3x fa-fw" />
    <span className="sr-only">Loading...</span>
  </div>
);

Spinner.propTypes = {
  cssClass: PropTypes.string.isRequired,
};

export default Spinner;
