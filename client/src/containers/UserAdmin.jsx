import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../store/actions/postActions';
import * as apiActions from '../store/actions/apiPostActions';

import ViewProfile from './ViewProfile';
import UserPosts from './UserPosts';


class UserAdmin extends React.Component {

  componentDidMount() {
    const userId = this.props.appState.userId;
    this.props.api.getUserPosts(this.props.appState.authToken, userId);
  }

  render() {
    return (
      <div className="user-admin">
	      <ViewProfile />
	      {this.props.posts.entries.length && <UserPosts /> }
      </div>
      );
  }}

const mapStateToProps = state => ({
  appState: state.appState,
  posts: state.posts,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserAdmin);