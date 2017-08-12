import React from 'react';
import PropTypes from 'prop-types';

const Modal = props => (
  <div className={`modal ${props.modalClass}`} >
    <i className="fa fa-times modal-close" onClick={props.dismiss} role="button" tabIndex="0" />
    {props.modalText}
  </div>
);

Modal.propTypes = {
  modalClass: PropTypes.string.isRequired,
  modalText: PropTypes.string.isRequired,
  dismiss: PropTypes.func.isRequired,
};

export default Modal;
