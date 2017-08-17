import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../store/actions/apiActions';
import * as connectActions from '../store/actions/apiConnectionActions';

class Connection extends React.Component {

  constructor(props) {
    super(props);
    const desiredRole = (this.props.posts.currentPost.role.toLowerCase() === 'mentor' ? 'mentee' : 'mentor');
    this.state = {
      recipient: this.props.posts.currentPost.author,
      sender: this.props.profiles.userProfile.username,
      subject: `co/ment - Contact Request from ${this.props.profiles.userProfile.username}`,
      role: desiredRole,
      body: '',
      formError: '',
    };
  }

  handleChange = (event) => {
    this.setState({ [event.target.id]: event.target.value, error: false });
  }

  sendMsg = () => {
    const token = this.props.appState.authToken;
    const connection = {
      mentor: {
        id: (this.state.role === 'mentor' ? this.props.profiles.userProfile._id : this.props.posts.currentPost.author_id ),
        name: (this.state.role === 'mentor' ? this.props.profiles.userProfile.username : this.props.posts.currentPost.author ),
        avatar: (this.state.role === 'mentor' ? this.props.profiles.userProfile.avatarUrl : this.props.posts.currentPost.avatarUrl ),
      },
      mentee: {
        id: (this.state.role === 'mentee' ? this.props.profiles.userProfile._id : this.props.posts.currentPost.author_id ),
        name: (this.state.role === 'mentee' ? this.props.profiles.userProfile.username : this.props.posts.currentPost.author ),
        avatar: (this.state.role === 'mentee' ? this.props.profiles.userProfile.avatarUrl : this.props.posts.currentPost.avatarUrl ),
      },
      initiator: {
        id: this.props.appState.userId,
        name: this.props.profiles.userProfile.username,
      },
      originalPost: {
        id: this.props.posts.currentPost._id,
        title: this.props.posts.currentPost.title,
      },
      status: 'pending',
    };
    this.props.api.contact(token, { bodyText: this.state.body }, this.props.posts.currentPost.author_id);
    this.props.connectActions.connect(token, connection);
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
            <label className="form__label" htmlFor="subject">Subject:
            </label>
            <input className="form__input form__connection-input" type="text" id="subject" value={this.state.subject} onChange={event => this.handleChange(event)} disabled />
          </div>
          <div className="form__input-group">
            <label className="form__label" htmlFor="role">Your Role:
            </label>
            <select className="form__input form__input--select" value={this.state.role} id="role" onChange={event => this.handleChange(event)} >
              <option value="mentor" id="mentor">Mentor</option>
              <option value="mentee" id="mentee">Mentee</option>
            </select>
          </div>
          <div className="form__input-group">
            <label className="form__label" htmlFor="body">Body:
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
  profiles: state.profiles,
});

const mapDispatchToProps = dispatch => ({
  api: bindActionCreators(Actions, dispatch),
  connectActions: bindActionCreators(connectActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Connection);
