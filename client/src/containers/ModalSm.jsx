import React from 'react';
import PropTypes from 'prop-types';

/// TODO:
/// tab trapping
/// keypress event handlers (enter or esc should dismiss modal)
/// click anywhere outside of modal should dismiss
/// look up other WCAG modal accessibility issues & implement, or wrap in react-modal if it's too complicated

const ModalSm = props => (
  <div className={`modal ${props.modalClass}`} >
    <i className="fa fa-times modal-close" onClick={props.dismiss} role="button" tabIndex="0" />
    {props.modalText}
  </div>
);

ModalSm.propTypes = {
  modalClass: PropTypes.string.isRequired,
  modalText: PropTypes.string.isRequired,
  dismiss: PropTypes.func.isRequired,
};

export default ModalSm;