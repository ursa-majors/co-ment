import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as Actions from '../store/actions/postActions';


class ViewPost extends React.Component {

  componentDidMount() {
    const postId = this.props.match.params.id;
    // axios default headers
    axios.defaults.baseURL = 'https://co-ment.glitch.me';
    axios.defaults.headers.common.Authorization = `Bearer ${this.props.appState.authToken}`;
    axios.get(`/api/posts?id=${postId}`)
      .then((result) => {
        console.log(result.data[0])
        this.props.actions.setCurrentPost(result.data[0]);
      })
      .catch((error) => {
        console.log(error);
      });
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

  render() {
    const roleText = (this.props.posts.currentPost.role === 'mentor' ? ' Available' : ' Wanted');
    const owner = (this.props.appState.profile._id === this.props.posts.currentPost.author_id);
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
            <span className="post-nav__item-link pointer" onClick={() => this.props.history.push('/connection')}>
              Request Connection
            </span>
          </li>
        </ul>
      );
    }

    return (
      <div className="post-view">
        <div className="single-post">
            <div className="single-post__username">{`Mentor ${roleText}`}</div>
            <div className="single-post__text preview__title">
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
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewPost);
