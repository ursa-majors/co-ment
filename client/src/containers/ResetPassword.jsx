import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

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

  handleReset = (event) => {
    event.preventDefault();

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
      this.handleSubmit();
    }
  }

  render() {
    const showError = (this.state.error ? '' : 'form__hidden');
    return (
      <div className="container form">
        <form className="form__body">
          <div className="form__header">
            Reset Password
          </div>
          <div className="form__input-group">
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
              <button className="splash__button pointer" id="btn-reset" onClick={(e) => this.handleReset(e)}>Reset</button>
              <Link to="/login">
                <button className="splash__button pointer" id="btn-login">Sign In</button>
              </Link>
            </div>
          </div>
        </form>
        <Spinner cssClass={this.props.login.pwResetSpinnerClass} />
        <ModalSm
          modalClass={this.props.login.pwResetModalClass}
          modalText={this.props.login.pwResetModalText}
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

const mapStateToProps = state => ({
  login: state.login,
});


const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
