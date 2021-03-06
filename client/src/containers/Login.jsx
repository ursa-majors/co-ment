import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Spinner from './Spinner';
import ModalSm from './ModalSm';
import * as Actions from '../store/actions';
import * as profileActions from '../store/actions/profileActions';
import * as loginActions from '../store/actions/apiLoginActions';

class Login extends React.Component {

  /* Function handleLogin - Perform basic validation:
  * - username is at least 1 char
  * - password is at least 1 char
  * If valid, call the login route; store token in redux, clear password from state
  * , return to Home
  */
  handleLogin() {
    // clear previous errors
    this.props.actions.setLoginError('');
    const username = this.props.login.loginUsername;
    const password = this.props.login.loginPassword;

    if (username && password) {
      const body = { username, password };
      this.props.api.login(body)
        .then((result) => {
          if (result.type === 'LOGIN_SUCCESS') {
            if (this.props.appState.redirectUrl) {
              this.props.history.push(this.props.appState.redirectUrl);
              this.props.actions.setRedirectUrl('');
            } else {
              this.props.history.push('/');
            }
          }
        });
    } else if (!username) {
      this.props.actions.setLoginError('Username cannot be blank');
    } else if (!password) {
      this.props.actions.setLoginError('Passwords cannot be blank');
    }
  }

  /*
  * Function: handleInput - On Change to the inputs, send updated value to redux store
  * @param {object} event - the change event triggered by the input.  All form inputs will
  *   use this handler; trigger the proper action based on the input ID
  */
  handleInput(event) {
    switch (event.target.id) {
      case 'username':
        this.props.actions.setLoginUser(event.target.value);
        break;
      case 'password':
        this.props.actions.setLoginPwd(event.target.value);
        break;
      default:
        break;
    }
    if (event.which === 13) {
      this.handleLogin();
    }
  }

  resetPassword = () => {
    const username = this.props.login.loginUsername;
    if (!username) {
      this.props.actions.setLoginError('Username required to reset password');
      return;
    }
    this.props.api.sendResetEmail({ username });
  }

  render() {
    const errorClass = this.props.login.errorMsg ? 'error' : 'hidden';
    return (
      <div className="container form">
        <div className="form__body">
          <div className="form__header">Sign In</div>
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
            />
          </div>
          <div className="form__input-group  form__link-group">
            <button className="aria-button form__login-link" onClick={this.resetPassword}>Reset Password</button>
            <Link className="aria-button form__login-link" to="/register">
            Create new account</Link>
          </div>
          <div className="form__input-group">
            <div className={errorClass}>{this.props.login.errorMsg}</div>
          </div>
          <div className="form__input-group">
            <div className="form__button-wrap">
              <button className="form__button pointer" id="btn-login" onClick={() => this.handleLogin()}>Sign In</button>
            </div>
          </div>
        </div>
        <Spinner cssClass={this.props.login.loginSpinnerClass} />
        <ModalSm
          modalClass={this.props.login.loginModalClass}
          modalText={this.props.login.loginModalText}
          modalType="modal__info"
          modalTitle="EMAIL SENT"
          dismiss={
            () => {
              this.props.actions.dismissLoginModal();
            }
          }
        />
      </div>
    );
  }
}

Login.propTypes = {
  appState: PropTypes.shape({
    redirectUrl: PropTypes.string,
  }).isRequired,
  actions: PropTypes.shape({
    setLoginError: PropTypes.func,
    setRedirectUrl: PropTypes.func,
    setLoginUser: PropTypes.func,
    setLoginPwd: PropTypes.func,
    dismissLoginModal: PropTypes.func,
  }).isRequired,
  api: PropTypes.shape({
    login: PropTypes.func,
    sendResetEmail: PropTypes.func,
  }).isRequired,
  login: PropTypes.shape({
    loginUsername: PropTypes.string,
    loginPassword: PropTypes.string,
    errorMsg: PropTypes.string,
    loginSpinnerClass: PropTypes.string,
    loginModalClass: PropTypes.string,
    loginModalText: PropTypes.string,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({
  appState: state.appState,
  login: state.login,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  profileActions: bindActionCreators(profileActions, dispatch),
  api: bindActionCreators(loginActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
