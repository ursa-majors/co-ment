import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import * as Actions from '../store/actions/postActions';
import * as apiActions from '../store/actions/apiPostActions';
import Spinner from './Spinner';
import ModalSm from './ModalSm';
import { formatDate } from '../utils/';

class UserPosts extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      post: {},
    };
  }

  componentDidMount() {
    const userId = this.props.appState.user._id;
    this.props.api.getUserPosts(this.props.appState.authToken, userId);
  }

  render() {
    return (
      <div className="user-posts">
        <Spinner cssClass={`${this.props.posts.loadPostsSpinnerClass}`} />
        <ModalSm
          modalClass={this.props.posts.loadPostsModal.class}
          modalText={this.props.posts.loadPostsModal.text}
          modalTitle={this.props.posts.loadPostsModal.title}
          modalType={this.props.posts.loadPostsModal.type}
          dismiss={
            () => {
              this.props.actions.setLoadPostsModal({
                type: '',
                text: '',
                class: 'modal__hide',
                title: '',
              });
            }
          }
        />
        {this.props.posts.entries.length && this.props.posts.loadPostsSpinnerClass === 'spinner__hide' ?
          <div className="user-posts__wrap">
            <div className="user-posts__header">
              posts
            </div>
            <table className="user-posts__table">
              <thead className="user-posts__thead">
                <tr>
                  <th className="user-posts__th">Role</th>
                  <th className="user-posts__th">Title</th>
                  <th className="user-posts__th">Date</th>
                  <th className="user-posts__th"><i className="fa fa-eye" /></th>
                  <th className="user-posts__th"><i className="fa fa-heart" /></th>
                </tr>
              </thead>
              <tbody className="user-posts__tbody">
                {this.props.posts.entries &&
                  this.props.posts.entries.sort((a, b) =>
                    Date.parse(a.updatedAt) - Date.parse(b.updatedAt))
                  .reverse()
                  .map(post => (
                    <tr key={post._id} className="user-posts__tr">
                      <td className="user-posts__td"> {post.role} </td>
                      <td className="user-posts__td">
                        <button
                          className="aria-button user-posts__link"
                          onClick={
                            () => {
                              this.props.actions.setCurrentPost(post);
                              this.props.history.push(`/editpost/${post._id}`);
                            }
                          }
                        >
                          {post.title}
                        </button>
                      </td>
                      <td className="user-posts__td"> {formatDate(new Date(post.updatedAt))} </td>
                      <td className="user-posts__td"> {post.meta.views} </td>
                      <td className="user-posts__td"> {post.meta.likes} </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div> : ''}
      </div>
    );
  }
}

UserPosts.propTypes = {
  actions: PropTypes.shape({
    clearCurrentPost: PropTypes.func,
    setCurrentPost: PropTypes.func,
    setViewPostModalText: PropTypes.func,
    setViewPostModalClass: PropTypes.func,
    setEmailOptions: PropTypes.func,
    setLoadPostsModal: PropTypes.func,
  }).isRequired,
  api: PropTypes.shape({
    viewPost: PropTypes.func,
    getUserPosts: PropTypes.func,
  }).isRequired,
  appState: PropTypes.shape({
    loggedIn: PropTypes.bool,
    authToken: PropTypes.string,
    user: PropTypes.shape({
      _id: PropTypes.string,
      avatarUrl: PropTypes.string,
      username: PropTypes.string,
    }).isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  posts: PropTypes.shape({
    loadPostsSpinnerClass: PropTypes.string,
    loadPostsModal: PropTypes.shape({
      type: PropTypes.string,
      text: PropTypes.string,
      class: PropTypes.string,
      title: PropTypes.string,
    }),
    entries: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string,
    })),
    currentPost: PropTypes.shape({
      _id: PropTypes.string,
      role: PropTypes.string,
      author: PropTypes.shape({
        _id: PropTypes.string,
      }).isRequired,
    }).isRequired,
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserPosts));
