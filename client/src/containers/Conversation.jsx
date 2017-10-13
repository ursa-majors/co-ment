import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as apiActions from '../store/actions/apiConversationActions';
import * as Actions from '../store/actions/conversationActions';
import { formatDateInbox } from '../utils';

class Conversation extends React.Component {

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
	            let formattedDate = formatDateInbox(new Date(message.createdAt));
					  	let dateOnly;
					  	let am_pm;
					  	let smallCaps = false;
					  	// format am/pm in small caps because OCD
					  	if (formattedDate.substr(formattedDate.length-1, formattedDate.length) === 'm') {
					  		dateOnly = formattedDate.substr(0, formattedDate.length-2);
					  		am_pm = formattedDate.slice(-2);
					  		smallCaps = true;
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
	                    <div className="inbox__single-date">
	                    {!smallCaps ?
	                    	<div>{formattedDate}</div> :
	                    	<div>
		                    	<span className="inbox__dateOnly">{dateOnly}</span>
		                    	<span className="inbox__am_pm">{am_pm}</span>
	                    	</div>
	                    }
	                  	</div>
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