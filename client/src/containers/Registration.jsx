import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import Spinner from './Spinner';
import ModalSm from './ModalSm';
import { setRegError, dismissRegModal } from '../store/actions/regActions';
import { register } from '../store/actions/apiLoginActions';

class Registration extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      email: '',
      password: '',
      confirmPwd: '',
      error: false,
    };
  }
  /* Function handleRegister - Perform basic validation:
  * - username is at least 1 char
  * - password is at least 1 char
  * - password confirmation matches
  * If valid, call the register route; store token in redux, clear password from state
  * , return to Home
  */
  handleRegister() {
    // clear previous errors
    this.setState({ error: false });
    const username = this.state.username;
    const email = this.state.email;
    const password = this.state.password;
    const confPwd = this.state.confirmPwd;

    if (username && email && (password === confPwd)) {
      const body = { username, password, email };
      this.props.api.register(body)
        .then((result) => {
          if (result.type === 'REGISTRATION_FAILURE') {
            this.setState({ error: true });
          }
          if (result.type === 'REGISTRATION_SUCCESS') {
            // clear form
            this.setState({
              username: '',
              email: '',
              password: '',
              confirmPwd: '',
              error: false,
            });
            // this.props.history.push('/');
          }
        })
        .catch((error) => {
          this.props.actions.setRegError(error.response.data.message);
          this.setState({ error: true });
        });
    } else if (!username) {
      this.props.actions.setRegError('Username cannot be blank');
      this.setState({ error: true });
    } else if (!email) {
      this.props.actions.setRegError('Email cannot be blank');
      this.setState({ error: true });
    } else if (password !== confPwd) {
      this.props.actions.setRegError('Passwords do not match');
      this.setState({ error: true });
    } else {
      this.props.actions.setRegError('Please complete the form');
      this.setState({ error: true });
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
      this.handleRegister();
    }
  }

  render() {
    const showError = (this.state.error ? '' : 'form__hidden');
    return (
      <div className="container form">
        <div className="form__body">
          <div className="form__header">
            Create account
          </div>
          <div className="form__input-group">
            <label htmlFor="username" className="form__label">
              UserName
            </label>
            <input className="form__input" type="text" placeholder="Username" id="username" onChange={event => this.handleInput(event)} required />
          </div>
          <div className="form__input-group">
            <label htmlFor="email" className="form__label">
              Email
            </label>
            <input className="form__input" type="email" placeholder="Email" id="email" onChange={event => this.handleInput(event)} required />
          </div>
          <div className="form__input-group">
            <label htmlFor="password" className="form__label">
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
            <label htmlFor="confirmPwd" className="form__label">
              Confirm Password
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
            <div className={`form__error ${showError}`}>{this.props.register.regErrorMsg}</div>
          </div>
          <div className="form__input-group">
            <div className="form__button-wrap">
              <button className="form__button pointer" type="submit" id="btn-register" onClick={() => this.handleRegister()} >Register</button>
            </div>
          </div>
        </div>
        <Spinner cssClass={this.props.register.registrationSpinnerClass} />
        <ModalSm
          modalClass={this.props.register.registrationModalClass}
          modalText={this.props.register.registrationModalText}
          modalType="modal__success"
          modalTitle="SUCCESS"
          action={
            () => {
              this.props.actions.dismissRegModal();
              this.props.history.push('/');
            }
          }
          dismiss={
            () => {
              this.props.actions.dismissRegModal();
            }
          }
        />
      </div>
    );
  }
}

Registration.propTypes = {
  api: PropTypes.shape({
    register: PropTypes.func,
  }).isRequired,
  actions: PropTypes.shape({
    setRegError: PropTypes.func,
    dismissRegModal: PropTypes.func,
  }).isRequired,
  register: PropTypes.shape({
    registrationSpinnerClass: PropTypes.string,
    registrationModalText: PropTypes.string,
    registrationModalClass: PropTypes.string,
    regErrorMsg: PropTypes.string,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({
  register: state.register,
});


const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ setRegError, dismissRegModal }, dispatch),
  api: bindActionCreators({ register }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Registration);
