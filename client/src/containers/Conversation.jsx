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

  // componentDidMount() {
  //   const token = this.props.appState.authToken;
  //   // fetch the requested conversation
  //   console.log('Conversation.jsx > 17', this.props.conversation.currentConv);
  //   if (this.props.conversation.currentConv._id) {
  //   	this.props.conversation.viewConv(token, this.props.conversation.currentConv._id);
  //   }
  //   }


  // componentWillReceiveProps(nextProps) {
  //   const token = this.props.appState.authToken;
  //   // fetch the requested conversation

  //   if (nextProps.conversation.currentConv._id !== this.props.conversation.currentConv._id ) {
  //   	console.log('Conversation.jsx > 27', nextProps.conversation.currentConv);
  //   	// this.props.api.viewConv(token, nextProps.conversation.currentConv._id);
  //   }
  //   }

  render() {
    return (
      <div className="message">
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