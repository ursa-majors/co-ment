import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as Actions from '../store/actions';

class Registration extends React.Component {

  /* Function handleRegister - Perform basic validation:
  * - username is at least 1 char
  * - password is at least 1 char
  * - password confirmation matches
  * If valid, call the register route; store token in redux, clear password from state
  * , return to Home
  */
  handleRegister() {
    const username = this.props.appState.regUsername;
    const password = this.props.appState.regPassword;
    const confPwd = this.props.appState.regConfirmPwd;

    if (username !== '' && (password === confPwd)) {
      axios.post('http://localhost:3001/api/register', { username, password })
        .then((result) => {
          // TODO: Handle errors such as duplicate user
          this.props.actions.login(result.data.token);
          this.props.actions.clearPwd();
          this.props.history.push('/');
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      // TODO: Handle basic validation failure
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
        this.props.actions.setRegUser(event.target.value);
        break;
      case 'password':
        this.props.actions.setRegPwd(event.target.value);
        break;
      case 'confirm-password':
        this.props.actions.setRegConfPwd(event.target.value);
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <div className="container form">
        <div className="form-body">
          <div className="form-header">Register</div>
          <div className="form-input-group">
            <input className="form-input" type="text" placeholder="Username" id="username" onChange={event => this.handleInput(event)} />
          </div>
          <div className="form-input-group">
            <input className="form-input" type="password" placeholder="Password" id="password" onChange={event => this.handleInput(event)} />
          </div>
          <div className="form-input-group">
            <input className="form-input" type="password" placeholder="Confirm Password" id="confirm-password" onChange={event => this.handleInput(event)} />
          </div>
          <div className="form-input-group">
            <span className="splash__button-wrap">
              <button className="splash__button pointer" id="btn-register" onClick={event => this.handleRegister(event)} >Register</button>
              <Link to="/login"><button className="splash__button pointer" id="btn-login">Sign In</button></Link>
            </span>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  appState: state.appState,
});


const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Registration);
