import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as apiActions from '../store/actions/apiConversationActions';
import * as Actions from '../store/actions/conversationActions';
import { formatDateInbox, scrollToBottom } from '../utils';

class Conversation extends React.Component {

	componentDidMount() {
		scrollToBottom();
	}

	componentDidUpdate() {
		scrollToBottom();
	}

	setScrollClass = () => {
		const el = document.getElementById('msgPane');
    const subject = document.getElementById('subject');
    const newMsg = document.getElementById('newMsg');
		if (el.scrollTop > 0) {
		// add shadow to bottom of subject div, overflow hidden at top of thread
      subject.classList.add('inbox__single-subject--scrolled');
    } else if (el.scrollTop === 0 && subject.classList.contains('inbox__single-subject--scrolled')) {
      subject.classList.remove('inbox__single-subject--scrolled');
    }
    const isScrolledToBottom = el.scrollHeight - el.clientHeight <= el.scrollTop + 1;
    // add shadow to top of new msg div, overflow hidden at bottom of thread
    if (!isScrolledToBottom) {
    	newMsg.classList.add('message__new--scrolled');
    } else if (isScrolledToBottom && newMsg.classList.contains('message__new--scrolled')) {
      newMsg.classList.remove('message__new--scrolled');
    }
	}

  render() {
  	const el = document.getElementById('msgPane');
  	let scrolled;
  	if (el) {
  		scrolled = el.scrollTop > 0;
  	}
  	console.log(this.props.conversation.currentConv);
  	console.log(this.props.conversation.currentConv.messages);
    return (
    	<div>
    	<div id="subject" className={scrolled ? "inbox__single-subject inbox__single-subject--scrolled" : "inbox__single-subject"}>
        {this.props.conversation.currentConv.subject}
      </div>
      <div className="message" id='msgPane' onScroll={()=>this.setScrollClass()}>
        {this.props.conversation.currentConv && this.props.conversation.currentConv.messages && this.props.conversation.currentConv.messages.length &&
        	<div className="inbox__single">
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