import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import * as Actions from '../store/actions/postActions';
import * as apiActions from '../store/actions/apiPostActions';
import PostFull from './PostFull';
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
    const userId = this.props.appState.userId;
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
        {this.props.posts.entries.length &&
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
                </tr>
              </thead>
              <tbody className="user-posts__tbody">
                {this.props.posts.entries && this.props.posts.entries.sort((a, b) => { return Date.parse(a.updatedAt) - Date.parse(b.updatedAt); }).reverse().map((post) => {
                  return (
                    <tr key={post._id} className="user-posts__tr">
                      <td className="user-posts__td"> {post.role} </td>
                      <td className="user-posts__td">
                        <Link to={`/editpost/${post._id}`} className="user-posts__link">
                          {post.title}
                        </Link>
                      </td>
                      <td className="user-posts__td"> {formatDate(new Date(post.updatedAt))} </td>
                    </tr>
                    );
                  })}
              </tbody>
            </table>
          </div> }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  appState: state.appState,
  posts: state.posts,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserPosts);
