import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import * as apiActions from '../store/actions/apiConversationActions';
import * as Actions from '../store/actions/conversationActions';
import Spinner from './Spinner';
import ModalSm from './ModalSm';
import { formatDate } from '../utils';

class Conversations extends React.Component {

  componentDidMount() {
    const token = this.props.appState.authToken;
    this.props.api.getConversations(token);
  }

  render() {
    return (
      <div className="connections">
        <Spinner cssClass={this.props.conversation.getConversationsSpinnerClass} />
        <ModalSm
          modalClass={this.props.conversation.getConversationsModal.class}
          modalText={this.props.conversation.getConversationsModal.text}
          modalTitle={this.props.conversation.getConversationsModal.title}
          modalType={this.props.conversation.getConversationsModal.type}
          dismiss={
            () => {
              this.props.actions.setConversationsModal({
                class: 'modal__hide',
                text: '',
                type: '',
                title: '',
              });
            }
          }
        />
        <div className="conn-details__preview">
          <div className="conn-details__text-wrap">
            <div className="conn-details__title">Messages</div>
          </div>
          <div className="inbox__wrap">
            <div className="inbox__sidebar">
              <ul className="inbox__admin">
                <li className="inbox__admin-item inbox__admin-title">
                  Mailbox
                </li>
                <button
                  className={this.props.conversation.messageView === 'inbox' ? "aria-button inbox__button inbox__button--active" : "aria-button inbox__button"}
                  onClick={() => this.props.actions.setMessageView('inbox')}>
                  <li className="inbox__admin-item">
                    <i className='fa fa-inbox'/>Inbox
                  </li>
                </button>
                <button
                  className={this.props.conversation.messageView === 'sent' ? "aria-button inbox__button inbox__button--active" : "aria-button inbox__button"}
                  onClick={() => this.props.actions.setMessageView('sent')}>
                  <li className="inbox__admin-item">
                    <i className='fa fa-send-o'/>Sent
                  </li>
                </button>
                <button
                  className={this.props.conversation.messageView === 'drafts' ? "aria-button inbox__button inbox__button--active" : "aria-button inbox__button"}
                  onClick={() => this.props.actions.setMessageView('drafts')}>
                <li className="inbox__admin-item">
                  <i className='fa fa-file-o'/>Drafts
                </li>
                </button>
                <button
                  className={this.props.conversation.messageView  === 'trash' ? "aria-button inbox__button inbox__button--active" : "aria-button inbox__button"}
                  onClick={() => this.props.actions.setMessageView('trash')}>
                  <li className="inbox__admin-item">
                    <i className='fa fa-trash-o'/>Trash
                  </li>
                </button>
              </ul>
            </div>
            <div>
              {this.props.conversation.messageView !=='single' &&
                <ul className="inbox__messagelist">
                  {this.props.conversation.conversations.sort((a,b) => new Date(b.latestMessage.createdAt) - new Date(a.latestMessage.createdAt)).map(item => {
                      const sender = item.participants.filter(participant => participant._id !== this.props.appState.user._id);
                      const backgroundStyle = {
                        backgroundImage: `url(${sender[0].avatarUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center center",
                      }
                    return(
                      <li className="inbox__message" key={item._id}>
                        <div className="inbox__avatar">
                          <div className="inbox__image-aspect">
                            <div className="h-nav__image-crop">
                              <div
                                className="h-nav__image"
                                style={backgroundStyle}
                                role="image"
                                aria-label={sender[0].name} />
                            </div>
                          </div>
                        </div>
                        <div className="inbox__message-wrap">
                          <div className="inbox__name-date">
                            <div className="inbox__name">{sender[0].name}</div>
                            <div className="inbox__date">{formatDate(new Date(item.latestMessage.createdAt))}</div>
                          </div>
                          <div className="inbox__subject">
                            <button
                              className="aria-button aria-button--link inbox__link"
                              onClick={()=> {
                                this.props.api.getConversation(this.props.appState.authToken, item._id)
                                  .then((result) => {
                                    if (result.type === 'GET_CONVERSATION_SUCCESS') {
                                      this.props.actions.setMessageView('single')
                                      .then(() => console.log(this.props.conversation.messageView));
                                    }
                                  })
                                  .catch((error) => {
                                    console.log('an error has occurred');
                                  })
                              }}>
                              {item.subject || 'The subject line of the thread'}
                            </button>
                          </div>
                          <div className="inbox__body">{item.latestMessage.body}</div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              }
            </div>
            <div>
              { this.props.conversation.messageView === 'single' &&
                <div className="inbox__single">
                  {this.props.conversation.conversation.conversation.subject}
                  {this.props.conversation.conversation.conversation.map(message => {
                    const backgroundStyle = {
                      backgroundImage: `url(${message.author.avatarUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center center",
                    }
                    return (
                      <div className="inbox__single-message">
                        <div className="inbox__single-subject">
                        </div>
                        <div className="inbox__single-meta">
                          <div className="inbox__single-from">
                            <div className="inbox__single-avatar">
                              <div className="inbox__single-image-aspect">
                                  <div className="h-nav__image-crop">
                                    <div
                                      className="h-nav__image"
                                      style={backgroundStyle}
                                      role="image"
                                      aria-label={message.author.name} />
                                 </div>
                              </div>
                            </div>
                            <div className="inbox__single-sender">
                              {message.author.name}
                            </div>
                          </div>
                          <div className="inbox__single-date">
                            {formatDate(new Date(message.createdAt))}
                          </div>
                        </div>
                        <div className="inbox__single-body">
                          {message.body}
                        </div>
                      </div>
                      );
                  })}
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  appState: state.appState,
  conversation: state.conversation,
});

const mapDispatchToProps = dispatch => ({
  api: bindActionCreators(apiActions, dispatch),
  actions: bindActionCreators(Actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Conversations);
