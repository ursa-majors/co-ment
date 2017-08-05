import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as Actions from '../store/actions/postActions';


class ViewPost extends React.Component {

  componentDidMount() {
    const postId = this.props.match.params.id;
    //axios default headers
    axios.defaults.baseURL = 'https://co-ment.glitch.me';
    axios.defaults.headers.common['Authorization'] = `Bearer ${this.props.appState.authToken}`;
    axios.get(`/api/posts?id=${postId}`)
      .then((result) => {
        this.props.actions.setCurrentPost(result.data[0]);
      })
      .catch((error) => {
        console.log(error)
      });
  }

  // remove currentPost to prevent flash of old post on navigation
  componentWillUnmount() {
    this.props.actions.setCurrentPost({
      active: '',
      author: '',
      author_id: '',
      availability: '',
      keywords: [],
      body: '',
      role: 'mentor',
      updated: Date.now(),
    })
  }

  render() {
    console.log(this.props.posts.currentPost)
    const roleText = (this.props.posts.currentPost.role === 'mentor' ? ' Available' : ' Wanted')
    return (
      <div className="posts">
        <div className="preview">
          <div className="preview__text-wrap">
            <div className="preview__username">{`${this.props.posts.currentPost.role} ${roleText}`}</div>
            <div className="preview__text preview__title">
              {this.props.posts.currentPost.title}
            </div>
            <div className="preview__text">
              <span className="preview__text--bold">Author: </span>
              <Link to={`/profile/${this.props.posts.currentPost.author_id}`}>
                {this.props.posts.currentPost.author}
              </Link>
            </div>
            <div className="preview__text">
              <span className="preview__text--bold">Keywords: </span>
                {
                  this.props.posts.currentPost.keywords.map(i => (
                   <li className="preview__skill-item" key={i}>{i}, </li>) )
                }
            </div>
            <div className="preview__text preview__text--body">
              {`${this.props.posts.currentPost.body}`}
            </div>
            <div className="preview__text preview_text-bottom">
              <span className="preview__text--bold">Last Updated: </span>
              {new Date(this.props.posts.currentPost.updated).toUTCString()}
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