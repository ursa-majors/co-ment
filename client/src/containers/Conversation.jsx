import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import * as apiActions from '../store/actions/apiConversationActions';
import * as Actions from '../store/actions/conversationActions';
import Spinner from './Spinner';
import ModalSm from './ModalSm';
import { formatDate } from '../utils';

class Conversation extends React.Component {

  componentWillMount() {
    const token = this.props.appState.authToken;
    // fetch the requested conversation
    this.props.actions.clearCurrentConv();
    this.props.api.viewConv(token, this.props.convId);
    }

  render() {
    return (
      <div className="message">
        <Spinner cssClass={this.props.conversation.viewConvSpinnerClass} />
        <ModalSm
          modalClass={this.props.conversation.viewConvModal.class}
          modalText={this.props.conversation.viewConvModal.text}
          modalTitle={this.props.conversation.viewConvModal.title}
          modalType={this.props.conversation.viewConvModal.type}
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
        {this.props.conversation.currentConv && this.props.conversation.currentConv.messages &&
        	<div className="inbox__single">
            <div className="inbox__single-subject">
            {this.props.conversation.currentConv.subject}
            </div>
	          {this.props.conversation.currentConv.messages.map(message => {
	            const sender = this.props.conversation.currentConv.participants.find(participant => participant._id === message.author);
	            const backgroundStyle = {
	              backgroundImage: `url(${sender.avatarUrl})`,
	              backgroundSize: "cover",
	              backgroundPosition: "center center",
	            }
	            return (
	              <div className="inbox__single-message" key={message._id}>
	                <div className="inbox__single-meta">
	                  <div className="inbox__single-from">
	                    <div className="inbox__single-avatar">
	                      <div className="inbox__single-image-aspect">
	                          <div className="h-nav__image-crop">
	                            <div
	                              className="h-nav__image"
	                              style={backgroundStyle}
	                              role="image"
	                              aria-label={sender.name} />
	                         </div>
	                      </div>
	                    </div>
	                    <div className="inbox__single-sender">
	                      {sender.name}
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

export default connect(mapStateToProps, mapDispatchToProps)(Conversation);