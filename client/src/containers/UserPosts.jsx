import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from '../store/actions/postActions';
import * as apiActions from '../store/actions/apiPostActions';
import PostFull from './PostFull';
import Spinner from './Spinner';
import ModalSm from './ModalSm';

class UserPosts extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      post: {},
    };
  }

  componentDidMount() {
    const userId = this.props.appState.userId;
    console.log(`&token=${this.props.appState.authToken}&author_id=${userId}`);
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
        <div className="user-posts__wrap">
          <table className="user-posts__table">
            <thead>
              <th>Role</th>
              <th>Title</th>
              <th>Date</th>
            </thead>
            <tbody>
              {this.props.posts.entries && this.props.posts.entries.reverse().map((post) => {
                return (
                  <tr key={post._id} className="user-posts__row">
                    <td className="user-posts__cell"> {post.role} </td>
                    <td className="user-posts__cell"> {post.title} </td>
                    <td className="user-posts__cell"> {post.dateUpdated} </td>
                  </tr>
                  );
                })}
            </tbody>
          </table>
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
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserPosts);
