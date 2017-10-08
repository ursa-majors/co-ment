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

  constructor(props) {
    super(props);

    this.state = {
      view: 'inbox',
      message: '',
    };

  }

  componentDidMount() {
    const token = this.props.appState.authToken;
    this.props.api.getConversations(token);
  }

  setView = (view, message) => {
    const newState = { ...this.state };
    newState.view = view;
    newState.message = message;
    this.setState({
      ...newState
    });
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
                  className="aria-button inbox__button"
                  onClick={() => this.setView('inbox')}>
                  <li className="inbox__admin-item">
                    <i className='fa fa-inbox'/>Inbox
                  </li>
                </button>
                <button
                  className="aria-button inbox__button"
                  onClick={() => this.setView('sent')}>
                  <li className="inbox__admin-item">
                    <i className='fa fa-send-o'/>Sent
                  </li>
                </button>
                <button
                  className="aria-button inbox__button"
                  onClick={() => this.setView('drafts')}>
                <li className="inbox__admin-item">
                  <i className='fa fa-file-o'/>Drafts
                </li>
                </button>
                <button
                  className="aria-button inbox__button"
                  onClick={() => this.setView('trash')}>
                  <li className="inbox__admin-item">
                    <i className='fa fa-trash-o'/>Trash
                  </li>
                </button>
              </ul>
            </div>
            <ul className="inbox__messagelist">
            {this.props.conversation.conversations.map(item => {
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
                      <div className="inbox__name">{sender[0].name}</div>
                      <div className="inbox__subject">
                        <button
                          className="aria-button aria-button--link inbox__link"
                          onClick={()=> this.setView('single', item._id)}>
                          {item.latestMessage.subject || 'The subject line of the thread'}
                        </button>
                      </div>
                      <div className="inbox__body">{item.latestMessage.body}</div>
                    </div>
                  </li>
                )
              })}
            </ul>
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
