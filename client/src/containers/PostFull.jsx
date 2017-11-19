import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import * as Actions from '../store/actions/postActions';
import * as apiActions from '../store/actions/apiPostActions';
import { setEmailOptions } from '../store/actions/emailActions';
import { formatDate } from '../utils/';

import Spinner from './Spinner';
import ModalSm from './ModalSm';

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
      modal: false,
      valModalOpen: false,
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
      this.props.api.viewPost(token, postId)
        .then((result) => {
          if (result.type === 'VIEW_POST_SUCCESS') {
            this.props.api.incrementPostView(token, postId);
          }
        });
    }
    // force focus on first focusable element trap focus inside modal when opening on postsgrid page
    document.getElementById('username').focus();
  }

  openDeleteModal = () => {
    this.setState({
      modal: true,
    });
    document.getElementsByClassName('.ReactModal__Content')[0].style.background = 'transparent !important';
  }

  openValModal = () => {
    const newState = { ...this.state };
    newState.valModalOpen = true;
    this.setState({
      ...newState,
    });
  }

  deletePost = () => {
    const id = this.props.posts.currentPost._id;
    const token = this.props.appState.authToken;
    this.props.api.deletePost(token, id);
    this.props.closeModal();
    this.props.shuffle();
  }

  handleKeyDown(e) {
    // enter key fires flip / readmore when focused
    const action = e.target.className.split(' ')[0];
    if (e.keyCode === 13 || e.which === 13) {
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
          this.openDeleteModal();
          break;
        case 'dismiss':
          this.setState({ modal: false });
          break;
        case 'like':
          this.props.api.likePost(this.props.appState.authToken, this.props.post._id);
          break;
        default:
          return null;
      }
    }
    return null;
  }

  flip() {
    // handle card flip front/back
    const newState = { ...this.state };
    newState.flip = !this.state.flip;
    this.setState({
      ...newState,
    }, () => PostFull.adjustCardHeight());
  }

  /*
  *  Check to see if there is already a similar connection between the user and poster
  */
  checkConnectionRequest = () => {
    const connections = this.props.connection.connections;
    if (connections.length > 0) {
      for (let i = 0; i < connections.length; i += 1) {
        if (connections[i].initiator === this.props.appState.user._id &&
          connections[i][this.props.post.role] === this.props.post.author._id) {
          this.props.actions.setViewPostModalText('You already have a connection to this poster');
          this.props.actions.setViewPostModalClass('modal__show');
          return;
        }
      }
    } else {
      // TODO: go get connections, then test them as above
    }

    this.props.actions.setEmailOptions({
      recipient: this.props.posts.currentPost.author,
      sender: this.props.profiles.userProfile,
      subject: `co/ment - Contact Request from ${this.props.profiles.userProfile.username}`,
      body: '',
      role: this.props.posts.currentPost.role === 'mentor' ? 'mentee' : 'mentor',
      type: 'request',
      connectionId: '',
    })
      .then(() => {
        this.props.history.push('/connectemail');
      });
  }

  render() {
    let post = {};
    let postWrapper = '';
    let compress = true;
    // check to see if this component recieved a full post object from props
    // (clicked openModal from thumb view)
    // or if it's rendering as a stand-alone view & is pulling data from store.
    // there has got to be a better way to do this...
    if (this.props.post && this.props.post.role) {
      post = { ...this.props.post };
    } else {
      post = { ...this.props.posts.currentPost };
      postWrapper = 'post-full__standalone-wrap';
      compress = false;
    }
    const roleText = (post.role === 'mentor' ? 'mentor' : 'mentee');
    const owner = (this.props.appState.user._id === post.author._id);
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
              onClick={() => this.props.closeModal()}
            >
              <i
                className="close fa fa-compress thumb__icon--compress"
                aria-label="close"
              />
            </button>
          }
          <button
            className="edit post-full__edit"
            aria-label="edit"
            name="edit"
            onKeyDown={e => this.handleKeyDown(e)}
            onClick={() => this.props.history.push(`/editpost/${post._id}`)}>
            <i
              className="fa fa-pencil post-full__icon--edit"
              aria-label="edit"
            />
          </button>
          <button
            className="delete post-full__delete"
            aria-label="delete"
            name="delete"
            onKeyDown={e => this.handleKeyDown(e)}
            onClick={() => this.openDeleteModal()}
          >
            <i
              className="fa fa-trash post-full__icon--delete"
              aria-label="delete"
            />
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
              onClick={() => this.props.closeModal()}
            >
              <i
                className="close fa fa-compress thumb__icon--compress"
                aria-label="close"
              />
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
            className="connect post-full__connect"
            aria-label="request connection"
            name="connect"
            onKeyDown={e => this.handleKeyDown(e)}
            onClick={() => {
              if (!this.props.appState.user.validated) {
                this.openValModal();
              } else {
                this.checkConnectionRequest();
              }
            }
            }
          >
            <i
              className="fa fa-envelope post-full__icon--connect"
              aria-label="connect"
            />
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
      backgroundImage: `url(${post.author.avatarUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
    };

    return (
      <div className={postWrapper}>
        { post.meta ?
          <div className="post-full">
            <div className={post.role === 'mentor' ? 'post-full__ribbon' : 'post-full__ribbon--green'}>
              <span className={post.role === 'mentor' ? 'post-full__ribbon-span' : 'post-full__ribbon-span--green'}>{roleText}</span>
            </div>
            <div className={this.state.flip ? 'post-full__side front flip' : 'post-full__side front'} id="front">
              <div className="post-full__metadata">
                <span className="post-full__views">
                  <i className="fa fa-eye" />
                  &nbsp;
                  {this.props.appState.user._id === post.author._id ?
                    post.meta.views : post.meta.views + 1}
                </span>
                <span className="post-full__likes">
                  <i className="fa fa-heart" />&nbsp;{post.meta.likes}
                </span>
                <div className="post-full__date">
                  <span className="tag-value">
                    <span className="tag-value__label">
                      {formatDate(new Date(post.updatedAt))}
                    </span>
                  </span>
                </div>
              </div>
              <div className="post-full__card-body">
                <div className="post-full__text-wrap">
                  <div className="post-full__title">
                    {post.title}
                  </div>
                  <div className="post-full__body">
                    {post.body}
                  </div>
                  {!this.state.thumb &&
                  <div className="tag-value__wrapper">
                      {keywordsDisp || ''}
                  </div> }
                </div>
                <div className="post-full__image-wrap">
                  <div className="post-full__image-aspect">
                    <Link id="username" className="unstyled-link post-full__username" to={`/viewprofile/${post.author._id}`}>
                      <div className="post-full__image-crop">
                        {post.author.avatarUrl ?
                          <div
                            className="post-full__image"
                            style={backgroundStyle}
                            role="img"
                            aria-label={post.author.username}
                          /> :
                          <i
                            className="fa fa-user-circle fa-5x post-full__icon--avatar"
                            aria-hidden="true"
                          />
                          }
                      </div>
                    </Link>
                  </div>
                  <div className="post-full__name-wrap">
                    <Link
                      id="username"
                      className="unstyled-link"
                      to={`/viewprofile/${post.author._id}`}
                    >
                      <span className="post-full__name">
                        {post.author.name}
                      </span>
                    </Link>
                    <Link
                      id="username"
                      className="unstyled-link post-full__username"
                      to={`/viewprofile/${post.author._id}`}
                    >
                      @{post.author.username}
                    </Link>
                  </div>
                </div>
              </div>
              <div className={!owner ? 'post-full__button-wrap' : 'post-full__button-wrap post-full__button-wrap--edit'}>
                {actions}
              </div>
            </div>
          </div> : <Spinner cssClass={'spinner__show'} />
        }
        <ModalSm
          modalClass={this.state.modal ? 'modal modal__show' : 'modal__hide'}
          modalText="Are you sure? This action cannot be undone."
          modalTitle="Confirm Delete"
          modalType="modal__error"
          modalDanger
          action={() => this.deletePost()}
          dismiss={
            () => {
              this.setState({
                modal: false,
              });
            }
          }
        />
        <ModalSm
          modalClass={this.state.valModalOpen ? 'modal__show' : 'modal__hide'}
          modalText="You must validate your email before contacting another user. Check your inbox for a validation email or visit your profile page to generate a new one"
          modalTitle="Unvalidated user"
          modalType="danger"
          dismiss={
            () => {
              this.setState({ valModalOpen: false });
            }
          }
        />
      </div>
    );
  }
}

PostFull.propTypes = {
  actions: PropTypes.shape({
    clearCurrentPost: PropTypes.func,
    setViewPostModalText: PropTypes.func,
    setViewPostModalClass: PropTypes.func,
    setEmailOptions: PropTypes.func,
  }).isRequired,
  api: PropTypes.shape({
    viewPost: PropTypes.func,
    deletePost: PropTypes.func,
    likePost: PropTypes.func,
    unlikePost: PropTypes.func,
    incrementPostView: PropTypes.func,
  }).isRequired,
  appState: PropTypes.shape({
    loggedIn: PropTypes.bool,
    authToken: PropTypes.string,
    user: PropTypes.shape({
      _id: PropTypes.string,
      avatarUrl: PropTypes.string,
      username: PropTypes.string,
      validated: PropTypes.bool,
    }).isRequired,
  }).isRequired,
  closeModal: PropTypes.func.isRequired,
  connection: PropTypes.shape({
    connections: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    author: PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }),
  }).isRequired,
  posts: PropTypes.shape({
    currentPost: PropTypes.shape({
      _id: PropTypes.string,
      role: PropTypes.string,
      author: PropTypes.shape({
        _id: PropTypes.string,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  profiles: PropTypes.shape({
    userProfile: PropTypes.shape({
      likedPosts: PropTypes.arrayOf(PropTypes.string),
      username: PropTypes.string.isRequired,
    }),
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
  shuffle: PropTypes.func.isRequired,
};

PostFull.defaultProps = {
  match: null,
  posts: {
    currentPost: {
      _id: null,
    },
  },
};

const mapStateToProps = state => ({
  appState: state.appState,
  posts: state.posts,
  connection: state.connection,
  profiles: state.profiles,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...Actions, setEmailOptions }, dispatch),
  api: bindActionCreators(apiActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostFull);
