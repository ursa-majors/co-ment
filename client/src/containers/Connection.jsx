import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../store/actions/apiActions';

class Connection extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      recipient: this.props.posts.currentPost.author,
      sender: this.props.appState.profile.username,
      subject: `co/ment - Contact Request from ${this.props.appState.profile.username}`,
      body: '',
      formError: '',
    };
  }

  handleChange = (event) => {
    this.setState({ [event.target.id]: event.target.value, error: false });
  }

  sendMsg = () => {
    this.props.api.contact(this.props.appState.authToken, { bodyText: this.state.body }, this.props.posts.currentPost.author_id);
    this.props.history.push('/connectionresult');
  }
  render() {
    return (
      <div className="container form">
        <div className="form__body">
          <div className="form__connection-header">Request Connection</div>
          <div className="form__input-group">
            <label className="form__label" htmlFor="recipient">TO:
            </label>
            <input className="form__input form__connection-input" type="text" id="recipient" value={this.state.recipient} onChange={event => this.handleChange(event)} disabled />
          </div>
          <div className="form__input-group">
            <label className="form__label" htmlFor="sender">FROM:
            </label>
            <input className="form__input form__connection-input" type="text" id="sender" value={this.state.sender} onChange={event => this.handleChange(event)} disabled />
          </div>
          <div className="form__input-group">
            <label className="form__label" htmlFor="sender">Subject:
            </label>
            <input className="form__input form__connection-input" type="text" id="subject" value={this.state.subject} onChange={event => this.handleChange(event)} disabled />
          </div>
          <div className="form__input-group">
            <label className="form__label" htmlFor="timezone">Body:
            </label>
            <textarea className="form__input form__connection-input" id="body" value={this.state.body} onChange={event => this.handleChange(event)} />
          </div>
          <div className="form__input-group">
            <div className="form__error">{this.state.formError}</div>
          </div>
          <div className="form__input-group">
            <div className="form__button-wrap">
              <button className="splash__button pointer" id="btn-add" onClick={() => this.sendMsg()}>Send Request</button>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

const mapStateToProps = state => ({
  appState: state.appState,
  posts: state.posts,
});

const mapDispatchToProps = dispatch => ({
  api: bindActionCreators(Actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Connection);
