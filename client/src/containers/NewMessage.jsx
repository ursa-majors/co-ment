import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as apiActions from '../store/actions/apiConversationActions';
import * as Actions from '../store/actions/conversationActions';

class NewMessage extends React.Component {

	componentWillUnmount() {
		this.props.actions.clearMsgBody();
	}

	handleChange = (e) => {
		this.props.actions.setMsgBody(e.target.value);
	}

  render() {
  	const token = this.props.appState.authToken;
  	let recipient;
  	let body;
  	if (this.props.conversation.currentConv.participants.length) {
	  	recipient = this.props.conversation.currentConv.participants.find((participant) => participant._id !== this.props.appState.user._id);
  	  body = {
  		recipientId  : recipient._id,
  		conversation : this.props.conversation.currentConv._id,
      messageBody  : this.props.conversation.newMsgBody,
    	};
    }

    return (
      <div className="message__new">
      	<div className="message__input-wrap">
          <input
          	className="message__input form__input"
          	placeholder="Message"
          	type="text"
          	value={this.props.conversation.newMsgBody}
          	onChange={(e) => this.handleChange(e)} />
          <button
              className="aria-button message__send"
              aria-label="send"
              name="send"
              onClick={() => this.props.api.postMessage(token,body)}>
                  <i className="send fa fa-send message__icon--send" />
          </button>
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

export default connect(mapStateToProps, mapDispatchToProps)(NewMessage);