import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Spinner from './Spinner';
import ModalSm from './ModalSm';
import * as Actions from '../store/actions/emailActions';
import { sendEmail } from '../store/actions/apiActions';
import { setNewConvModal } from '../store/actions/conversationActions';
import * as connectActions from '../store/actions/apiConnectionActions';
import * as conversationActions from '../store/actions/apiConversationActions';
import { adjustTextArea } from '../utils';

class ConnectionEmail extends React.Component {

  componentDidUpdate() {
    adjustTextArea(this.textInput);
  }

  handleChange(event) {
    if (event.target.id === 'body') {
      if (this.props.connectionEmail.body.length > 620) {
        event.preventDefault();
        return null;
      }
      adjustTextArea(event.target);
    }

    this.props.emailActions.setFormField(event.target.id, event.target.value);
    this.props.emailActions.clearFormError();
  }

  sendMsg = () => {
    // validate inputs (form requires only body)
    if (!this.props.connectionEmail.body) {
      this.props.emailActions.setFormError('Your message must have a body');
      return;
    }

    const token = this.props.appState.authToken;
    let email = {
      recipient: this.props.connectionEmail.recipient.username || this.props.connectionEmail.recipient.name,
      sender: this.props.connectionEmail.sender.username,
      copySender: false,
      subject: this.props.connectionEmail.subject,
      body: this.props.connectionEmail.body,
      type: this.props.connectionEmail.type,
      connectionId: this.props.connectionEmail.connectionId,
    };
    const msgBody = {
      recipientId  : this.props.connectionEmail.recipient.id || this.props.connectionEmail.recipient._id,
      conversation : this.props.connectionEmail.conversationId,
      messageBody  : this.props.connectionEmail.body,
    };
    switch(this.props.connectionEmail.type) {
      case 'request':
        // build new conversation and connection objects
        const conversation = {
          recipientId: this.props.connectionEmail.recipient._id,
          message: this.props.connectionEmail.body,
          subject: `Re: ${this.props.posts.currentPost.title}`,
        }
        const connection = {
          mentor: {
            id: this.props.connectionEmail.role === 'mentor' ? this.props.profiles.userProfile._id : this.props.posts.currentPost.author._id ,
            name: this.props.connectionEmail.role === 'mentor' ? this.props.profiles.userProfile.username : this.props.posts.currentPost.author.username,
            avatar: this.props.connectionEmail.role === 'mentor' ? this.props.profiles.userProfile.avatarUrl : this.props.posts.currentPost.author.avatarUrl,
            },
          mentee: {
            id: this.props.connectionEmail.role === 'mentee' ? this.props.profiles.userProfile._id : this.props.posts.currentPost.author._id,
            name: this.props.connectionEmail.role === 'mentee' ? this.props.profiles.userProfile.username : this.props.posts.currentPost.author.username,
            avatar: this.props.connectionEmail.role === 'mentee' ? this.props.profiles.userProfile.avatarUrl : this.props.posts.currentPost.author.avatarUrl,
            },
          initiator: {
            id: this.props.appState.user._id,
            name: this.props.profiles.userProfile.username,
            },
          originalPost: {
            id: this.props.posts.currentPost._id,
            title: this.props.posts.currentPost.title,
            },
          status: 'pending',
          };

        // 1. Save new conversation. Use returned conversation ID to...
        // 2. Save new connection object. If successful...
        // 3. Send connection email

        this.props.conversationActions.postConversation(token, conversation)
        .then((result1) => {
          if (result1.type === "POST_CONV_SUCCESS") {
            // Build new connection object from Redux store values
            connection.conversationId = result1.payload.conversation._id;
            this.props.connectActions.connect(token, connection)
            .then((result2) => {
              console.log(result2.type);
              if (result2.type === 'CONNECTION_SUCCESS') {
                email.connectionId = result2.payload.connectionId;
                this.props.emailActions.sendEmail(token, email)
                .then((result3) => {
                  if (result3.type === "SEND_EMAIL_SUCCESS") {
                    this.props.history.push('/connectionresult');
                    }
                  });
                }
              });
            }
          });
        break;
      case 'accept':
      // send an email
      // build a new message object and post to the existing conversation
        email.copySender = true;
        this.props.emailActions.sendEmail(token, email)
          .then((result) => {
            if (result.type === "SEND_EMAIL_SUCCESS") {
              this.props.conversationActions.postMessage(token,msgBody)
              .then((result2) => {
                console.log(result2);
              });
              this.props.connectActions.updateConnectionStatus(
                token,
                {
                  id: this.props.connectionEmail.connectionId,
                  type: 'ACCEPT',
                },
              )
              .then((result) => {
                if (result.type === 'UPDATE_CONNECTION_STATUS_SUCCESS') {
                  this.props.emailActions.setEmailModal({
                    class: 'modal__show',
                    text: `The email was sent and your connection is now active!\n\nCheck your co/ment inbox to continue the conversation.\n\nGood Luck!`,
                    title: 'SUCCESS',
                    type: 'modal__success',
                    action: () => {
                      this.props.emailActions.setEmailModal({
                        class: 'modal__hide',
                        text: '',
                        title: '',
                        type: '',
                        action: null,
                      });
                      this.props.history.push('/inbox');
                    },
                  });
                }
              });
            }
          });
        break;

      case 'decline':
      // send an email
      // build a new message object and post to the existing conversation
        this.props.emailActions.sendEmail(token, email)
          .then((result) => {
            if (result.type === "SEND_EMAIL_SUCCESS") {
              this.props.conversationActions.postMessage(token,msgBody)
              .then((result2) => {
                console.log(result2);
              });
              this.props.connectActions.updateConnectionStatus(
                token,
                {
                  id: this.props.connectionEmail.connectionId,
                  type: 'DECLINE',
                },
              )
              .then((result) => {
                if (result.type === 'UPDATE_CONNECTION_STATUS_SUCCESS') {
                  this.props.emailActions.setEmailModal({
                    class: 'modal__show',
                    text: `An email was sent to notify ${this.props.connectionEmail.recipient.username || this.props.connectionEmail.recipient.name} that the connection was declined`,
                    title: 'COMPLETE',
                    type: 'modal__success',
                    action: () => {
                      this.props.emailActions.setEmailModal({
                        class: 'modal__hide',
                        text: '',
                        title: '',
                        type: '',
                        action: null,
                      });
                      this.props.history.push('/connections');
                    },
                  });
                }
              });
            }
          });
        break;
      case 'deactivate':
        email.copySender = true;
        this.props.emailActions.sendEmail(token, email)
          .then((result) => {
            if (result.type === 'SEND_EMAIL_SUCCESS') {
              this.props.connectActions.updateConnectionStatus(
                token,
                {
                  id: this.props.connectionEmail.connectionId,
                  type: 'DEACTIVATE',
                },
              )
              .then((result) => {
                if (result.type === 'UPDATE_CONNECTION_STATUS_SUCCESS') {
                  this.props.emailActions.setEmailModal({
                    class: 'modal__show',
                    text: `Your connection with ${this.props.connectionEmail.recipient.username} is now deactivated.\n\nAn email was sent to both users to confirm this action.`,
                    title: 'COMPLETE',
                    type: 'modal__success',
                    action: () => {
                      this.props.emailActions.setEmailModal({
                        class: 'modal__hide',
                        text: '',
                        title: '',
                        type: '',
                        action: null,
                      });
                      this.props.history.push('/connections');
                    },
                  });
                }
              });
            }
          });
        break;
      default:
        // no-op
    }
  }

  render() {
    let buttonText = 'Send Request';
    let bodyPlaceholder = 'Include a short message to explain why you want to connect with this user...';
    if (this.props.connectionEmail.type === 'accept') {
      buttonText = 'Accept Request';
      bodyPlaceholder = `Include a personal message...`;
    }
    if (this.props.connectionEmail.type === 'decline') {
      buttonText = 'Decline Request';
      bodyPlaceholder = 'Include a short message to explain why you are declining...';
    }
    if (this.props.connectionEmail.type === 'deactivate') {
      buttonText = 'End Connection';
      bodyPlaceholder = 'Include a personal message to conclude your Connection...';
    }
    return (
      <div className="container form">
        <div className="form__body">
          <div className="form__connection-header">{this.props.connectionEmail.type} Connection</div>
          <div className="form__input-group">
            <label className="form__label" htmlFor="recipient">TO:
            </label>
            <input className="form__input form__connection-input" type="text" id="recipient" value={this.props.connectionEmail.recipient.username || this.props.connectionEmail.recipient.name} disabled />
          </div>
          <div className="form__input-group">
            <label className="form__label" htmlFor="sender">FROM:
            </label>
            <input className="form__input form__connection-input" type="text" id="sender" value={this.props.connectionEmail.sender.username} onChange={event => this.handleChange(event)} disabled />
          </div>
          <div className="form__input-group">
            <label className="form__label" htmlFor="subject">Subject:
            </label>
            <input className="form__input form__connection-input" type="text" id="subject" value={this.props.connectionEmail.subject} onChange={event => this.handleChange(event)} disabled />
          </div>
          <div className="form__input-group">
            <label className="form__label" htmlFor="role">Your Role:
            </label>
            <select className="form__input form__input--select" value={this.props.connectionEmail.role} id="role" onChange={event => this.handleChange(event)} >
              <option value="mentor" id="mentor">Mentor</option>
              <option value="mentee" id="mentee">Mentee</option>
            </select>
          </div>
          <div className="form__input-group">
            <label className="form__label" htmlFor="body">Body:
            </label>
            <textarea
              className="form__input form__connection-input"
              id="body" value={this.props.connectionEmail.body}
              onChange={event => this.handleChange(event)}
              ref={(input) => { this.textInput = input; }}
              placeholder={bodyPlaceholder}
            />
            {this.props.connectionEmail.body &&
              <div className="character-count"> {620 - this.props.connectionEmail.body.length} characters remaining</div> }
          </div>
          <div className="form__input-group">
            <div className={`${this.props.connectionEmail.formErrorClass}`}>{this.props.connectionEmail.formError}</div>
          </div>
          <div className="form__input-group">
            <div className="form__button-wrap">
              <button className="form__button pointer" id="btn-add" onClick={() => this.sendMsg()}>{buttonText}</button>
            </div>
          </div>
        </div>
        <Spinner cssClass={this.props.connectionEmail.emailSpinnerClass} />
        <ModalSm
          modalClass={this.props.connectionEmail.emailModal.class}
          modalText={this.props.connectionEmail.emailModal.text}
          modalTitle={this.props.connectionEmail.emailModal.title}
          modalType={this.props.connectionEmail.emailModal.type}
          action={this.props.connectionEmail.emailModal.action}
          dismiss={
            () => {
              this.props.emailActions.setEmailModal({
                text: '',
                class: 'modal__hide',
                title: '',
                type: '',
              });
            }
          }
        />
        <Spinner cssClass={this.props.conversation.newConvSpinnerClass} />
        <ModalSm
          modalClass={this.props.conversation.newConvModal.class}
          modalText={this.props.conversation.newConvModal.text}
          modalTitle={this.props.conversation.newConvModal.title}
          modalType={this.props.conversation.newConvModal.type}
          action={this.props.conversation.newConvModal.action}
          dismiss={
            () => {
              this.props.conversationActions.setNewConvModal({
                text: '',
                class: 'modal__hide',
                title: '',
                type: '',
              });
            }
          }
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  appState: state.appState,
  posts: state.posts,
  profiles: state.profiles,
  connectionEmail: state.connectionEmail,
  conversation: state.conversation,
});

const mapDispatchToProps = dispatch => ({
  emailActions: bindActionCreators({ ...Actions, sendEmail }, dispatch),
  connectActions: bindActionCreators(connectActions, dispatch),
  conversationActions: bindActionCreators({ ...conversationActions, setNewConvModal }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionEmail);