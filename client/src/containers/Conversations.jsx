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
            <div className="conn-details__title">Inbox</div>
          </div>
          <div className="inbox__messagewrap">
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
                      <div className="h-nav__image-aspect">
                        <div className="h-nav__image-crop">
                          <div
                            className="h-nav__image"
                            style={backgroundStyle}
                            role="image"
                            aria-label={sender[0].name} />
                        </div>
                      </div>
                    </div>
                    <span className="inbox__name">{sender[0].name}</span>

                    <div className="inbox__subject">
                      <Link className="inbox__link" to={`/conversationdetails/${item._id}`}>
                        {item.latestMessage.subject || 'message subject'}
                      </Link>
                    </div>
                    <div className="inbox__bocy">{item.latestMessage.body}</div>
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
