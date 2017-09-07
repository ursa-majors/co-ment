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
      <span className="modal-close modal-close-sm" onClick={props.dismiss} role="button" tabIndex="0">&times;</span>
    </div>
    <div className="modal__body">
      {props.modalText}
    </div>
    <div className="modal__action">
      <div className="modal__button" onClick={props.action || props.dismiss}>Continue</div>
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
