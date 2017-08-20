import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import * as Actions from '../store/actions/postActions';
import * as apiActions from '../store/actions/apiPostActions';
import { formatDate } from '../utils/';
import Spinner from '../containers/Spinner';
import Modal from '../containers/Modal';

class ViewPost extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      flip: false,
    };
  }

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
    const postId = this.props.match.params.id;
    const token = this.props.appState.authToken;
    this.props.api.deletePost(token, postId);
    this.props.history.push('/posts');
  }

  flip() {
    // handle card flip front/back
    const newState = { ...this.state };
    newState.flip = !this.state.flip;
    this.setState({
      ...newState,
    })
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
    const roleText = (this.props.posts.currentPost.role === 'mentor' ? 'mentor' : 'mentee');
    const owner = (this.props.appState.userId === this.props.posts.currentPost.author_id);
    let actions;
    if (owner) {
      actions = (
        <div>
          <button
            className="single-post__edit"
            aria-label="edit"
            onClick={() => this.props.history.push(`/editpost/${this.props.posts.currentPost._id}`)}>
            <i className="fa fa-pencil single-post__icon--edit" aria-hidden="true" />
          </button>
          <button
            className="single-post__delete"
            aria-label="delete"
            onClick={() => this.deletePost()}>
            <i className="fa fa-trash single-post__icon--delete" aria-hidden="true" />
          </button>
        </div>
      );
    } else {
      actions = (
        <button
          className="single-post__connect"
          aria-label="request connection"
          onClick={this.checkConnectionRequest}>
          <i className="fa fa-envelope single-post__icon--connect" aria-hidden="true" />
        </button>
      );
    }
    let keywordsDisp;
    if (this.props.posts.currentPost.keywords) {
      keywordsDisp = this.props.posts.currentPost.keywords.map(word => (
        <span className="tag-value" key={word}>
          <span className="tag-value__label">
            {word}
          </span>
        </span>
       ));
      }

    return (
      <div className="post-view">
        <Spinner cssClass={this.props.posts.viewPostSpinnerClass} />
        <Modal
          modalClass={this.props.posts.viewPostModalClass}
          modalText={this.props.posts.viewPostModalText}
          dismiss={
            () => {
              this.props.actions.setViewPostModalText('');
              this.props.actions.setViewPostModalClass('modal__hide');
            }
          }
        />
        <div className="single-post">
          <div className={this.props.posts.currentPost.role === 'mentor' ? 'single-post__ribbon' : 'single-post__ribbon--green'}>
            <span className={this.props.posts.currentPost.role === 'mentor' ? 'single-post__ribbon-span' : 'single-post__ribbon-span--green'}>{roleText}</span>
          </div>
          <div className={this.state.flip ? "side front flip" : "side front"} id="front">
            <div className="single-post__date">
              <span className="tag-value">
                <span className="tag-value__label">
                  {formatDate(new Date(this.props.posts.currentPost.updatedAt))}
                </span>
              </span>
            </div>
            <div className="single-post__card-body">
              <div className="single-post__image-wrap">
                <Link className="unstyled-link" to={`/viewprofile/${this.props.posts.currentPost.author_id}`}>
                  {this.props.posts.currentPost.author_avatar ?
                    <img
                      className="single-post__image"
                      src={this.props.posts.currentPost.author_avatar}
                      alt={this.props.posts.currentPost.author} /> :
                    <i className="fa fa-user-circle fa-5x view-preview__icon--avatar" aria-hidden="true" /> }
                    <div className="single-post__name-wrap">
                      <span className="single-post__name">{this.props.posts.currentPost.author_name}</span>
                      <span className="single-post__username">
                        @{this.props.posts.currentPost.author}
                      </span>
                    </div>
                </Link>
              </div>
              <div className="single-post__text-wrap">
                <div className="single-post__title">
                  {this.props.posts.currentPost.title}
                </div>
                <div className="single-post__body">
                  {`${this.props.posts.currentPost.body}`}
                </div>
                <div className="tag-value__wrapper">
                    {keywordsDisp ? keywordsDisp : ''}
                </div>
              </div>
            </div>
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
