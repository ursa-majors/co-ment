import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import * as apiActions from '../store/actions/apiConversationActions';
import * as Actions from '../store/actions/conversationActions';
import Spinner from './Spinner';
import ModalSm from './ModalSm';
import Conversation from './Conversation';
import NewMessage from './NewMessage';
import { formatDateInbox, scrollToBottom } from '../utils';

class Conversations extends React.Component {

  componentDidMount() {
    const token = this.props.appState.authToken;
    this.props.api.getConversations(token)
    .then((result) => {
      if (result.type === 'GET_ALL_CONVERSATIONS_SUCCESS') {
        const sortedConvs = this.props.conversation.conversations.sort((a,b) =>  new Date(b.latestMessage.createdAt) - new Date(a.latestMessage.createdAt));
        const newestConv = sortedConvs[0];
        this.props.api.viewConv(token, newestConv._id)
        }
      });
    }

  render() {
    const token = this.props.appState.authToken;
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
          <div>
          {this.props.conversation.conversations.length ?
          <div className="inbox__wrap">
            <div className="inbox__sidebar">
              <div className="inbox__messagelist">
                {this.props.conversation.conversations.sort((a,b) => new Date(b.latestMessage.createdAt) - new Date(a.latestMessage.createdAt)).map(item => {
                    const sender = item.participants.find(participant => participant._id !== this.props.appState.user._id);
                    const backgroundStyle = {
                      backgroundImage: `url(${sender.avatarUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center center",
                    };
                    const conv2view = { ...item };
                    let formattedDate = formatDateInbox(new Date(item.latestMessage.createdAt));
                    let dateOnly;
                    let am_pm;
                    let smallCaps = false;
                    // format am/pm in small caps because OCD
                    if (formattedDate.substr(formattedDate.length-1, formattedDate.length) === 'm') {
                      dateOnly = formattedDate.substr(0, formattedDate.length-2);
                      am_pm = formattedDate.slice(-2);
                      smallCaps = true;
                    }
                  return(
                    <button
                      key={item._id}
                      className={this.props.conversation.currentConv._id === item._id ? "aria-button inbox__message inbox__message--active" : "aria-button inbox__message"}
                      onClick={()=> {
                        this.props.api.viewConv(token, conv2view._id);
                        scrollToBottom();
                      }}>
                      {item.latestMessage.unread &&
                        <span className="inbox__new" />
                      }
                      <div className="inbox__avatar">
                        <div className="inbox__image-aspect">
                          <div className="h-nav__image-crop">
                            <div
                              className="h-nav__image"
                              style={backgroundStyle}
                              role="image"
                              aria-label={sender.name} />
                          </div>
                        </div>
                      </div>
                      <div className="inbox__message-wrap">
                        <div className="inbox__name">{sender.name}</div>
                        <div className="inbox__subject">{item.subject}</div>
                        <div className="inbox__date">
                            {!smallCaps ?
                              <div>{formattedDate}</div> :
                              <div>
                                <span className="inbox__dateOnly">{dateOnly}</span>
                                <span className="inbox__am_pm">{am_pm}</span>
                              </div>
                            }
                          </div>
                        </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="inbox__messagepane">
              <Spinner cssClass={this.props.conversation.viewConvSpinnerClass} />
              <ModalSm
                modalClass={this.props.conversation.viewConvModal.class}
                modalText={this.props.conversation.viewConvModal.text}
                modalTitle={this.props.conversation.viewConvModal.title}
                modalType={this.props.conversation.viewConvModal.type}
                dismiss={
                  () => {
                    this.props.actions.setConversationModal({
                      class: 'modal__hide',
                      text: '',
                      type: '',
                      title: '',
                    });
                  }
                }
              />
              { this.props.conversation.currentConv._id && this.props.conversation.currentConv.messages && this.props.conversation.currentConv.messages.length ?
                <div>
                  <Conversation
                    convId = {this.props.conversation.currentConv._id} />
                  <NewMessage />
                </div> :
                <div className="inbox__empty--wrap">
                  <strong> No messages! </strong><br/>
                  To start using co/ment messaging,<br/>respond to a&nbsp;
                  <Link to="/posts" className="inbox__link">post</Link>
                </div>
              }
            </div>
          </div> :
          <div className="inbox__empty">
            <div className="inbox__empty--wrap">
              <strong> No messages! </strong><br/>
              To start using co/ment messaging,<br/>respond to a&nbsp;
              <Link to="/posts" className="inbox__link">post</Link>
            </div>
          </div>
        }
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
