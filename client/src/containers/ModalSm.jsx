import React from 'react';
import PropTypes from 'prop-types';

// TODO:
// tab trapping
// keypress event handlers (enter or esc should dismiss modal)
// click anywhere outside of modal should dismiss
// look up other WCAG modal accessibility issues & implement,
// or wrap in react-modal if it's too complicated

const ModalSm = props => (
  <div className={`modal ${props.modalClass}`} >
    <div className={`modal__header ${props.modalType}`}>
      {props.modalTitle}
      <i className="fa fa-times modal-close" onClick={props.dismiss} role="button" tabIndex="0" />
    </div>
    <div className="modal__body">
      {props.modalText}
    </div>
    <div className="modal__action">
      <div className="h-nav__item-link" onClick={props.action || props.dismiss}>Continue</div>
    </div>
  </div>
);

ModalSm.propTypes = {
  modalClass: PropTypes.string.isRequired,
  modalText: PropTypes.string.isRequired,
  modalType: PropTypes.string,
  modalTitle: PropTypes.string,
  action: PropTypes.func,
  dismiss: PropTypes.func.isRequired,
};
ModalSm.defaultProps = {
  modalType: 'modal__info',
  modalTitle: '',
  action: null,
};

export default ModalSm;
