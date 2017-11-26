import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Spinner from './Spinner';
import ModalSm from './ModalSm';
import * as Actions from '../store/actions';
import * as apiActions from '../store/actions/apiLoginActions';

class ResetPassword extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      confirmPwd: '',
      error: false,
      errorMsg: '',
    };
  }

  handleReset = () => {
    const key = this.props.match.params.key;
    const username = this.state.username;
    const password = this.state.password;
    const confirmPwd = this.state.confirmPwd;
    // validate form data
    if (username && password && (password === confirmPwd)) {
      const body = {
        username, password, key,
      };
      this.props.api.resetPassword(body);
    } else {
      if (!username) {
        this.setState({
          error: true,
          errorMsg: 'Username is required',
        });
      }
      if (!password) {
        this.setState({
          error: true,
          errorMsg: 'Password is required',
        });
      }
      if (!password === confirmPwd) {
        this.setState({
          error: true,
          errorMsg: 'Passwords do not match',
        });
      }
    }
  }
  /*
  * Function: handleInput - On Change to the inputs, send updated value to redux store
  * @param {object} event - the change event triggered by the input.  All form inputs will
  *   use this handler; trigger the proper action based on the input ID
  */
  handleInput(event) {
    this.setState({ [event.target.id]: event.target.value, error: false });
    if (event.which === 13) {
      this.handleReset();
    }
  }

  render() {
    const showError = (this.state.error ? '' : 'form__hidden');
    return (
      <div className="container form">
        <div className="form__body">
          <div className="form__header">
            Reset Password
          </div>
          <div className="form__input-group">
            <label htmlFor="username" className="form__label">
              UserName
            </label>
            <input
              className="form__input"
              type="text"
              placeholder="Username"
              id="username"
              onChange={event => this.handleInput(event)}
              required
            />
          </div>
          <div className="form__input-group">
            <label htmlFor="username" className="form__label">
              Password
            </label>
            <input
              className="form__input"
              type="password"
              placeholder="Password"
              id="password"
              onChange={event => this.handleInput(event)}
              onKeyUp={event => this.handleInput(event)}
              required
            />
          </div>
          <div className="form__input-group">
            <label htmlFor="username" className="form__label">
              Confirm password
            </label>
            <input
              className="form__input"
              type="password"
              placeholder="Confirm Password"
              id="confirmPwd"
              onChange={event => this.handleInput(event)}
              onKeyUp={event => this.handleInput(event)}
              required
            />
          </div>
          <div className="form__input-group">
            <div className={`form__error ${showError}`}>{this.state.errorMsg}</div>
          </div>
          <div className="form__input-group">
            <div className="form__button-wrap">
              <button className="form__button pointer" id="btn-reset" onClick={() => this.handleReset()}>Reset</button>
            </div>
          </div>
        </div>
        <Spinner cssClass={this.props.login.pwResetSpinnerClass} />
        <ModalSm
          modalClass={this.props.login.pwResetModalClass}
          modalText={this.props.login.pwResetModalText}
          modalTitle="RESET PASSWORD"
          modalType={this.props.login.pwResetModalType}
          dismiss={
            () => {
              this.props.actions.dismissPWResetModal();
            }
          }
        />
      </div>
    );
  }
}

ResetPassword.propTypes = {
  actions: PropTypes.shape({
    dismissPWResetModal: PropTypes.func,
  }).isRequired,
  api: PropTypes.shape({
    resetPassword: PropTypes.func,
  }).isRequired,
  login: PropTypes.shape({
    pwResetModalType: PropTypes.string,
    pwResetSpinnerClass: PropTypes.string,
    pwResetModalClass: PropTypes.string,
    pwResetModalText: PropTypes.string,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      key: PropTypes.string,
    }),
  }).isRequired,
};

const mapStateToProps = state => ({
  login: state.login,
});


const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
