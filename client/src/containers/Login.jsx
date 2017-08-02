import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import * as Actions from '../store/actions';
// Placeholder component for login //

class Login extends React.Component {

  /* Function handleRegister - Perform basic validation:
  * - username is at least 1 char
  * - password is at least 1 char
  * - password confirmation matches
  * If valid, call the register route; store token in redux, clear password from state
  * , return to Home
  */
  handleLogin() {
    // clear previous errors
    this.props.actions.setLoginError('');
    const username = this.props.login.loginUsername;
    const password = this.props.login.loginPassword;

    if (username && password) {
      axios.post('https://co-ment.glitch.me/api/login', { username, password })
        .then((result) => {
          this.props.actions.login(result.data.token, result.data.profile);
          this.props.actions.clearLoginPwd();
          this.props.history.push('/');
        })
        .catch((error) => {
          this.props.actions.setLoginError(error.response.data.message);
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
  }

  render() {
    console.log(this.props)
    return (
      <div className="container form">
        <div className="form__body">
          <div className="form__header">Sign In</div>
          <div className="form__input-group">
            <input className="form__input" type="text" placeholder="Username" id="username" onChange={event => this.handleInput(event)} />
          </div>
          <div className="form__input-group">
            <input className="form__input" type="password" placeholder="Password" id="password" onChange={event => this.handleInput(event)} />
          </div>
          <div className="form__input-group">
            <div className="form__error">{this.props.login.errorMsg}</div>
          </div>
        </div>
        <div className="form__input-group">
          <div className="form__button-wrap">
            <button className="splash__button pointer" id="btn-login" onClick={() => this.handleLogin()}>Sign In</button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  appState: state.appState,
  login: state.login,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
