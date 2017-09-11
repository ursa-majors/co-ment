import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Spinner from './Spinner';
import ModalSm from './ModalSm';
import * as Actions from '../store/actions/apiActions';
import * as connectActions from '../store/actions/apiConnectionActions';
import { adjustTextArea } from '../utils';

class Connection extends React.Component {

  constructor(props) {
    super(props);
    const desiredRole = (this.props.posts.currentPost.role.toLowerCase() === 'mentor' ? 'mentee' : 'mentor');
    this.state = {
      recipient: this.props.posts.currentPost.author,
      sender: this.props.profiles.userProfile.username,
      subject: `co/ment - Contact Request from ${this.props.profiles.userProfile.username}`,
      role: desiredRole,
      body: '',
      formError: '',
      formErrorClass: 'form__hidden'
    };
  }

  componentDidUpdate() {
    adjustTextArea(this.textInput);
  }

  handleChange = (event) => {
    if (event.target.id === 'body') {
      if (body.length  > 620) {
        event.preventDefault;
        return null;
      }
      adjustTextArea(event.target);
    }

    this.setState(
      {
        [event.target.id]: event.target.value,
        formError: '',
        formErrorClass: 'form__hidden',
      },
    );
  }

  sendMsg = () => {
    // validate inputs (form requires only body)
    if (!this.state.body) {
      this.setState(
        {
          formError: 'Your message must have a body',
          formErrorClass: 'form__error',
        },
      );
      return;
    }

    // validate that this is not a duplicate connection request
    const conns = this.props.connection.connections
    for (let i = 0; i < conns.length; i += 1) {
      if (conns[i].initiator.id === this.props.profiles.userProfile._id) {
        if (this.state.role === 'mentor' && conns[i].mentor.id === this.props.profiles.userProfile._id && conns[i].mentee.id === this.props.posts.currentPost.author_id) {
          this.setState(
            {
              formError: `You already have a ${this.state.role} connection with ${this.props.posts.currentPost.author}` ,
              formErrorClass: 'form__error',
            },
          );
          return;
        }
        if (this.state.role === 'mentee' && conns[i].mentee.id === this.props.profiles.userProfile._id && conns[i].mentor.id === this.props.posts.currentPost.author_id) {
          this.setState(
            {
              formError: `You already have a ${this.state.role} connection with ${this.props.posts.currentPost.author}` ,
              formErrorClass: 'form__error',
            },
          );
          return;
        }
      }
    }

    const token = this.props.appState.authToken;
    const connection = {
      mentor: {
        id: (this.state.role === 'mentor' ? this.props.profiles.userProfile._id : this.props.posts.currentPost.author_id ),
        name: (this.state.role === 'mentor' ? this.props.profiles.userProfile.username : this.props.posts.currentPost.author ),
        avatar: (this.state.role === 'mentor' ? this.props.profiles.userProfile.avatarUrl : this.props.posts.currentPost.author_avatar ),
      },
      mentee: {
        id: (this.state.role === 'mentee' ? this.props.profiles.userProfile._id : this.props.posts.currentPost.author_id ),
        name: (this.state.role === 'mentee' ? this.props.profiles.userProfile.username : this.props.posts.currentPost.author ),
        avatar: (this.state.role === 'mentee' ? this.props.profiles.userProfile.avatarUrl : this.props.posts.currentPost.author_avatar ),
      },
      initiator: {
        id: this.props.appState.userId,
        name: this.props.profiles.userProfile.username,
      },
      originalPost: {
        id: this.props.posts.currentPost._id,
        title: this.props.posts.currentPost.title,
      },
      status: 'pending',
    };

     this.props.connectActions.connect(token, connection)
      .then((result1) => {
        if (result1.type === 'CONNECTION_SUCCESS') {
          this.props.api.contact(token, this.state.body, this.props.connection.connectionId, this.props.posts.currentPost.author_id)
          .then((result2) => {
            console.log('Connection.jsx > 114');
            console.log(result2);
            if (result2.type === "CONTACT_SUCCESS") {
              this.props.history.push('/connectionresult');
            }
          });
        }
      });
  }

  render() {
    return (
      <div className="container form">
        <Spinner cssClass={this.props.connection.connectionSpinnerClass} />
        <ModalSm
          modalClass={this.props.connection.connectionModal.class}
          modalText={this.props.connection.connectionModal.text}
          modalTitle={this.props.connection.connectionModal.title}
          modalType={this.props.connection.connectionModal.type}
          dismiss={
            () => {
              this.props.connectActions.setConnModal({
                text: '',
                class: 'modal__hide',
                title: '',
                type: '',
              });
            }
          }
        />
        <div className="form__body">
          <div className="form__connection-header">Request Connection</div>
          <div className="form__input-group">
            <label className="form__label" htmlFor="recipient">TO:
            </label>
            <input className="form__input form__connection-input" type="text" id="recipient" value={this.state.recipient} onChange={event => this.handleChange(event)} disabled />
          </div>
          <div className="form__input-group">
            <label className="form__label" htmlFor="sender">FROM:
            </label>
            <input className="form__input form__connection-input" type="text" id="sender" value={this.state.sender} onChange={event => this.handleChange(event)} disabled />
          </div>
          <div className="form__input-group">
            <label className="form__label" htmlFor="subject">Subject:
            </label>
            <input className="form__input form__connection-input" type="text" id="subject" value={this.state.subject} onChange={event => this.handleChange(event)} disabled />
          </div>
          <div className="form__input-group">
            <label className="form__label" htmlFor="role">Your Role:
            </label>
            <select className="form__input form__input--select" value={this.state.role} id="role" onChange={event => this.handleChange(event)} >
              <option value="mentor" id="mentor">Mentor</option>
              <option value="mentee" id="mentee">Mentee</option>
            </select>
          </div>
          <div className="form__input-group">
            <label className="form__label" htmlFor="body">Body:
            </label>
            <textarea className="form__input form__connection-input" id="body" value={this.state.body} onChange={event => this.handleChange(event)} ref={(input) => { this.textInput = input; }}/>
            {this.state.body &&
              <div className="character-count"> {620 - this.state.body.length} characters remaining</div> }
          </div>
          <div className="form__input-group">
            <div className={`${this.state.formErrorClass}`}>{this.state.formError}</div>
          </div>
          <div className="form__input-group">
            <div className="form__button-wrap">
              <button className="form__button pointer" id="btn-add" onClick={() => this.sendMsg()}>Send Request</button>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

const mapStateToProps = state => ({
  appState: state.appState,
  posts: state.posts,
  profiles: state.profiles,
  connection: state.connection,
});

const mapDispatchToProps = dispatch => ({
  api: bindActionCreators(Actions, dispatch),
  connectActions: bindActionCreators(connectActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Connection);
