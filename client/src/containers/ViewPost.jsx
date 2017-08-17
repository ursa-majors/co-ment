import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import * as Actions from '../store/actions/postActions';
import * as apiActions from '../store/actions/apiPostActions';
import Spinner from '../containers/Spinner';
import Modal from '../containers/Modal';

class ViewPost extends React.Component {

  /*
  *  If the URL Parameter does not match the ID of the redux currentPost,
  *   clear the current post from memory and go fetch the matching post from API.
  */
  componentDidMount() {
    const postId = this.props.match.params.id;
    const token = this.props.appState.authToken;
    if (this.props.posts.currentPost._id !== postId) {
      this.props.actions.clearCurrentPost();
      this.props.api.viewPost(token, postId);
    }
  }

  deletePost = (event) => {
    //event.preventDefault();
    //event.stopPropagation();
    axios.defaults.baseURL = 'https://co-ment.glitch.me';
    axios.defaults.headers.common.Authorization = `Bearer ${this.props.appState.authToken}`;

    axios.delete(`/api/posts/${this.props.posts.currentPost._id}`)
      .then((result) => {
        this.props.history.push('/posts');
      })
      .catch((error) => {
        // TODO: Handle error here?
        console.log(error);
      });
  }

  /**
  *  Check to see if there is already a similar connection between the user and poster
  **/
  checkConnectionRequest = () => {
    const connections = this.props.connection.connections;
    if (connections.length > 0) {
      for (let i = 0; i < connections.length; i += 1) {
        if (connections[i].initiator === this.props.appState.userId &&
          connections[i][this.props.posts.currentPost.role] === this.props.posts.currentPost.author_id) {
          this.props.actions.setViewPostModalText('You already have a connection to this poster');
          this.props.actions.setViewPostModalClass('modal__show');
          return;
        }
      }
    } else {
      // TODO: go get connections, then test them as above
    }
    this.props.history.push('/connection');
  }

  render() {
    const roleText = (this.props.posts.currentPost.role === 'mentor' ? ' Available' : ' Wanted');
    const owner = (this.props.appState.userId === this.props.posts.currentPost.author_id);
    let actions;
    if (owner) {
      actions = (
        <ul className="post-nav">
          <li className="post-nav__item" >
            <span className="post-nav__item-link pointer" onClick={() => this.props.history.push(`/editpost/${this.props.posts.currentPost._id}`)}>
              Edit
            </span>
          </li>
          <li className="post-nav__item" >
            <span className="post-nav__item-link pointer" onClick={() => this.deletePost()}>
              Delete
            </span>
          </li>
        </ul>
      );
    } else {
      actions = (
        <ul className="post-nav">
          <li className="post-nav__item" >
            <span className="post-nav__item-link pointer" onClick={this.checkConnectionRequest}>
              Request Connection
            </span>
          </li>
        </ul>
      );
    }

    return (
      <div className="post-view">
        <Spinner cssClass={this.props.posts.viewPostSpinnerClass} />
        <Modal
          modalClass={this.props.posts.viewPostModalClass}
          modalText={this.props.posts.viewPostModalText}
          dismiss={() => { this.props.actions.setModalText(''); this.props.actions.setModalClass('modal__hide'); }}
        />
        <div className="single-post">
            <div className="single-post__username">{`Mentor ${roleText}`}</div>
            <div className="preview__title">
              {this.props.posts.currentPost.title}
            </div>
            <div className="single-post__text">
              <span className="single-post__text--bold">Author: </span>
              <Link to={`/viewprofile/${this.props.posts.currentPost.author_id}`}>
                {this.props.posts.currentPost.author}
              </Link>
            </div>
            <div className="single-post__text">
              <span className="single-post__text--bold">Keywords: </span>
              {
                this.props.posts.currentPost.keywords.map(i => (
                  <li className="single-post__skill-item" key={i}>{i}, </li>))
              }
            </div>
            <div className="single-post__text single-post__text--body">
              {`${this.props.posts.currentPost.body}`}
            </div>
            <div className="single-post__text single-post_text-bottom">
              <span className="single-post__text--bold">Updated: </span>
              {new Date(this.props.posts.currentPost.updatedAt).toUTCString()}
              <div className="single-post__button-wrap">
              { actions }
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
  connection: state.connection,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewPost);
