import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { setEmailModal } from '../store/actions/emailActions';

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
      <button className="dismiss aria-button modal-close modal-close-sm" onClick={props.dismiss} role="button" tabIndex="0">&times;</button>
    </div>
    <div className="modal__body">
      {props.modalText}
    </div>
    {props.modalDanger ?
      <div className="modal__action">
        <div className="modal__button" onClick={props.dismiss}>Cancel</div>
        <div className="modal__button modal__danger" onClick={props.action}>Delete</div>
      </div>
    :
    <div className="modal__action">
      <div className="modal__button" onClick={props.action || props.dismiss}>Continue</div>
    </div>
  }
  </div>
);

ModalSm.propTypes = {
  modalClass: PropTypes.string.isRequired,
  modalText: PropTypes.string.isRequired,
  modalType: PropTypes.string,
  modalTitle: PropTypes.string,
  action: PropTypes.func,
  dismiss: PropTypes.func.isRequired,
  danger: PropTypes.bool,
};
ModalSm.defaultProps = {
  modalType: 'modal__info',
  modalTitle: '',
  action: null,
};

const mapStateToProps = state => ({
  appState: state.appState,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ setEmailModal }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalSm);
