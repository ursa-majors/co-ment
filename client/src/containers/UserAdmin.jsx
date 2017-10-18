import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import * as Actions from '../store/actions/postActions';
import * as apiActions from '../store/actions/apiPostActions';
import ViewProfile from './ViewProfile';
import UserPosts from './UserPosts';


class UserAdmin extends React.Component {

  componentDidMount() {
    const userId = this.props.appState.user._id;
    this.props.api.getUserPosts(this.props.appState.authToken, userId);
  }

  render() {
    return (
      <div className="user-admin">
        <ViewProfile />
        {this.props.posts.entries.length ? <UserPosts /> : ''}
      </div>
    );
  }
}

UserAdmin.propTypes = {
  appState: PropTypes.shape({
    authToken: PropTypes.string,
    userId: PropTypes.string,
  }).isRequired,
  posts: PropTypes.shape({
    entries: PropTypes.Array,
  }).isRequired,
  api: PropTypes.shape({
    getUserPosts: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({
  appState: state.appState,
  posts: state.posts,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserAdmin);
