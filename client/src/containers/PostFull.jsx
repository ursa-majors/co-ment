import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import * as Actions from '../store/actions/postActions';
import * as apiActions from '../store/actions/apiPostActions';
import { formatDate } from '../utils/';

import Spinner from './Spinner';

class PostFull extends React.Component {

  static adjustCardHeight() {
    // expand card height to fit content without scrollbar
    const el = document.getElementById('back');
    let adjustedHeight = el.clientHeight;
    adjustedHeight = Math.max(el.scrollHeight, adjustedHeight);
    if (adjustedHeight > el.clientHeight) { el.style.height = `${adjustedHeight}px`; }
  }

  constructor(props) {
    super(props);
    this.state = {
      flip: false,
      post: {},
    };
  }

  componentDidMount() {
    let postId;
    if (this.props.match && this.props.match.params.id) {
     postId = this.props.match.params.id;
    } else {
     postId = this.props.post._id;
    }
    const token = this.props.appState.authToken;
        if (this.props.posts.currentPost._id !== postId) {
      this.props.actions.clearCurrentPost();
      this.props.api.viewPost(token, postId);
    }
    }

  deletePost = (event) => {
    const postId = this.props.post._id;
    const token = this.props.appState.authToken;
    this.props.api.deletePost(token, postId);
    this.props.closeModal();
    this.props.shuffle();
  }

  handleKeyDown(e) {
    // enter key fires flip / readmore when focused
    const action = e.target.className.split(" ")[0];
    if (e.keyCode === 13 || e.which === 13 ) {
      switch (action) {
        case 'flip-it':
          this.flip();
          break;
        case 'edit':
          this.props.history.push(`/editpost/${this.props.post._id}`);
          break;
        case 'connect':
          this.checkConnectionRequest();
          break;
        case 'delete':
          this.deletePost();
          break;
        case 'close':
          this.props.closeModal();
          break;
        case 'like':
          this.props.api.likePost(this.props.appState.authToken, this.props.post._id);
          break;
        default:
          return null;
      }
    }

  }

  flip() {
    // handle card flip front/back
    const newState = { ...this.state };
    newState.flip = !this.state.flip;
    this.setState({
      ...newState,
    }, ()=>PostFull.adjustCardHeight() )
  }

  /**
  *  Check to see if there is already a similar connection between the user and poster
  **/
  checkConnectionRequest = () => {
    const connections = this.props.connection.connections;
    if (connections.length > 0) {
      for (let i = 0; i < connections.length; i += 1) {
        if (connections[i].initiator === this.props.appState.userId &&
          connections[i][this.props.post.role] === this.props.post.author_id) {
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
    let post = {}
    let postWrapper = '';
    let compress = true;
    // check to see if this component recieved a full post object from props
    // (clicked openModal from thumb view)
    // or if it's rendering as a stand-alone view & is pulling data from store.
    // there has got to be a better way to do this...
    if (this.props.post && this.props.post.role) {
      post = { ...this.props.post }
    } else {
      post = { ...this.props.posts.currentPost }
      postWrapper = 'post-full__standalone-wrap';
      compress = false;
    }
    const roleText = (post.role === 'mentor' ? 'mentor' : 'mentee');
    const owner = (this.props.appState.userId === post.author_id);
    const isLiked = this.props.profiles.userProfile.likedPosts.includes(post._id) ?
      'post-full__liked' :
      '';
    let actions;
    if (owner) {
      actions = (
        <div>
          {compress &&
            <button
              className="close post-full__compress"
              aria-label="close"
              name="close"
              data-dismiss="modal"
              onKeyDown={e => this.handleKeyDown(e)}
              onClick={()=>this.props.closeModal()}>
                  <i className="close fa fa-compress thumb__icon--compress"
                    aria-label="close"/>
            </button>
          }
          <button
            className={`edit post-full__edit`}
            aria-label="edit"
            name="edit"
            onKeyDown={e => this.handleKeyDown(e)}
            onClick={() => this.props.history.push(`/editpost/${post._id}`)}>
            <i className={`fa fa-pencil post-full__icon--edit`}
             aria-label="edit" />
          </button>
          <button
            className={`delete post-full__delete`}
            aria-label="delete"
            name="delete"
            onKeyDown={e => this.handleKeyDown(e)}
            onClick={() => this.deletePost()}>
            <i className={`fa fa-trash post-full__icon--delete`} aria-label="delete" />
          </button>
        </div>
      );
    } else {
      actions = (
        <div>
          {compress &&
            <button
              className="close post-full__compress"
              aria-label="close"
              name="close"
              data-dismiss="modal"
              onKeyDown={e => this.handleKeyDown(e)}
              onClick={()=>this.props.closeModal()}>
                  <i className="close fa fa-compress thumb__icon--compress"
                    aria-label="close"/>
            </button>
          }
          <button
            className="like post-full__like"
            aria-label="like"
            name="like"
            data-dismiss="modal"
            onKeyDown={e => this.handleKeyDown(e)}
            onClick={
               () => {
                 if (!this.props.profiles.userProfile.likedPosts.includes(post._id)) {
                   this.props.api.likePost(this.props.appState.authToken, post._id);
                 } else {
                   this.props.api.unlikePost(this.props.appState.authToken, post._id);
                 }
               }
             }
          >
            <i
              className={`fa fa-heart thumb__icon--heart ${isLiked}`}
              aria-label="like"
            />
          </button>
          <button
            className={`connect post-full__connect`}
            aria-label="request connection"
            name="connect"
            onKeyDown={e => this.handleKeyDown(e)}
            onClick={this.checkConnectionRequest}>
            <i className={`fa fa-envelope post-full__icon--connect`}
            aria-label="connect" />
          </button>
        </div>
      );
    }

    let keywordsDisp;
    if (post.keywords) {
      keywordsDisp = post.keywords.map(word => (
        <span className="tag-value" key={word}>
          <span className="tag-value__label">
            {word}
          </span>
        </span>
       ));
      }

    const backgroundStyle = {
      backgroundImage: `url(${post.author_avatar})`,
      backgroundSize: "cover",
      backgroundPosition: "center center",
    }

    return (
      <div className={postWrapper}>
      { post.meta ?
        <div className="post-full">
          <div className={post.role === 'mentor' ? `post-full__ribbon` : `post-full__ribbon--green`}>
            <span className={post.role === 'mentor' ? `post-full__ribbon-span` : `post-full__ribbon-span--green`}>{roleText}</span>
          </div>
          <div className={this.state.flip ? "post-full__side front flip" : "post-full__side front"} id="front">
            <div className="post-full__metadata">
              <span className="post-full__views">
                <i className="fa fa-eye" />
                &nbsp;
                {this.props.appState.userId === post.author_id ? post.meta.views : post.meta.views + 1}
              </span>
              <span className="post-full__likes">
                <i className="fa fa-heart" />&nbsp;{post.meta.likes}
              </span>
              <div className={`post-full__date`}>
                <span className="tag-value">
                  <span className="tag-value__label">
                    {formatDate(new Date(post.updatedAt))}
                  </span>
                </span>
              </div>
            </div>
            <div className={`post-full__card-body`}>
              <div className={`post-full__text-wrap`}>
                <div className={`post-full__title`}>
                  {post.title}
                </div>
                  <div className={`post-full__body`}>
                    {post.body}
                  </div>
                {!this.state.thumb &&
                <div className="tag-value__wrapper">
                    {keywordsDisp ? keywordsDisp : ''}
                </div> }
              </div>
              <div className={`post-full__image-wrap`}>
                <div className={`post-full__image-aspect`}>
                    <div className={`post-full__image-crop`}>
                      {post.author_avatar ?
                        <div
                          className={`post-full__image`}
                          style={backgroundStyle}
                          role="image"
                          aria-label={post.author} /> :
                        <i
                          className={`fa fa-user-circle fa-5x post-full__icon--avatar`}
                          aria-hidden="true" />
                        }
                    </div>
                  </div>
                <div className={`post-full__name-wrap`}>
                  <span className={`post-full__name`}>
                    {post.author_name}</span>
                  <Link className="unstyled-link post-full__username" to={`/viewprofile/${post.author_id}`}>
                      @{post.author}
                </Link>
                </div>
              </div>
            </div>
            <div className={ !owner ? `post-full__button-wrap` : `post-full__button-wrap post-full__button-wrap--edit`}>
            { actions }
            </div>
           </div>
        </div> : <Spinner cssClass={'spinner__show'} /> }
        </div>
    );
  }
}

const mapStateToProps = state => ({
  appState: state.appState,
  posts: state.posts,
  connection: state.connection,
  profiles: state.profiles,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostFull);
