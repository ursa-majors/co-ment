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
      thumb: true,
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

  handleKeyDown(e) {
    // enter key fires flip / readmore when focused
    const action = e.target.className.split(" ")[0];
    console.log(action);
    if (e.keyCode === 13 || e.which === 13 ) {
      console.log('enter');
      switch (action) {
        case 'flip-it':
          this.flip();
          break;
        case 'edit':
          this.props.history.push(`/editpost/${this.props.posts.currentPost._id}`);
          break;
        case 'connect':
          this.checkConnectionRequest();
          break;
        case 'delete':
          this.deletePost();
        case 'expand':
        case 'compress':
          this.toggleThumb();
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
    })
  }

  toggleThumb() {
    // handle toggle thumb / full-size view
    const newState = { ...this.state };
    newState.thumb = !this.state.thumb;
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
    const cardSize = this.state.thumb ? 'post-thumb' : 'post-full';
    const roleText = (this.props.posts.currentPost.role === 'mentor' ? 'mentor' : 'mentee');
    const owner = (this.props.appState.userId === this.props.posts.currentPost.author_id);
    let actions;
    if (owner) {
      actions = (
        <div>
        {!this.state.thumb &&
          <div>
          <button
            className={`edit ${cardSize}__edit`}
            aria-label="edit"
            name="edit"
            onKeyDown={e => this.handleKeyDown(e)}
            onClick={() => this.props.history.push(`/editpost/${this.props.posts.currentPost._id}`)}>
            <i className={`fa fa-pencil ${cardSize}__icon--edit`}
             aria-label="edit" />
          </button>
          <button
            className={`delete ${cardSize}__delete`}
            aria-label="delete"
            name="delete"
            onKeyDown={e => this.handleKeyDown(e)}
            onClick={() => this.deletePost()}>
            <i className={`fa fa-trash ${cardSize}__icon--delete`} aria-label="delet4e" />
          </button>
          {!this.state.flip &&
            <button
              className={`expand ${cardSize}__compress`}
              aria-label="compress"
              name="compress"
              onKeyDown={e => this.handleKeyDown(e)}
              onClick={() => this.toggleThumb()}>
              <i className={`fa fa-compress ${cardSize}__icon--compress`} aria-label="compress" />
            </button>
          }
          </div>
        }
        {this.state.thumb &&
          <button
            className={`expand ${cardSize}__expand`}
            aria-label="expand"
            name="expand"
            onKeyDown={e => this.handleKeyDown(e)}
            onClick={() => this.toggleThumb()}>
            <i className={`fa fa-expand ${cardSize}__icon--expand`}
            aria-label="expand" />
          </button>
        }
        </div>
      );
    } else {
      actions = (
        <div>
        {!this.state.thumb &&
          <div>
            <button
              className={`compress ${cardSize}__compress`}
              aria-label="compress"
              name="compress"
              onKeyDown={e => this.handleKeyDown(e)}
              onClick={() => this.toggleThumb()}>
              <i className={`fa fa-compress ${cardSize}__icon--compress`} aria-label="compress" />
            </button>
            <button
              className={`connect ${cardSize}__connect`}
              aria-label="request connection"
              name="connect"
              onKeyDown={e => this.handleKeyDown(e)}
              onClick={this.checkConnectionRequest}>
              <i className={`fa fa-envelope ${cardSize}__icon--connect`}
              aria-label="connect" />
            </button>
          </div>
        }
        {this.state.thumb &&
          <button
            className={`expand ${cardSize}__expand`}
            aria-label="expand"
            name="expand"
            onKeyDown={e => this.handleKeyDown(e)}
            onClick={() => this.toggleThumb()}>
            <i className={`fa fa-expand ${cardSize}__icon--expand`}
            aria-label="expand" />
          </button>
        }
        </div>
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
        <div className={cardSize}>
        {!this.state.flip &&
          <div className={this.props.posts.currentPost.role === 'mentor' ? `${cardSize}__ribbon` : `${cardSize}__ribbon--green`}>
            <span className={this.props.posts.currentPost.role === 'mentor' ? `${cardSize}__ribbon-span` : `${cardSize}__ribbon-span--green`}>{roleText}</span>
          </div> }
          <div className={this.state.flip ? "side front flip" : "side front"} id="front">
            <div className={`${cardSize}__date`}>
              <span className="tag-value">
                <span className="tag-value__label">
                  {formatDate(new Date(this.props.posts.currentPost.updatedAt))}
                </span>
              </span>
            </div>
            {!this.state.thumb &&
              <div className={`${cardSize}__card-body`}>
                <div className={`${cardSize}__image-wrap`}>
                  <Link className="unstyled-link" to={`/viewprofile/${this.props.posts.currentPost.author_id}`}>
                    {this.props.posts.currentPost.author_avatar ?
                      <img
                        className={`${cardSize}__image`}
                        src={this.props.posts.currentPost.author_avatar}
                        alt={this.props.posts.currentPost.author} /> :
                      <i className={`fa fa-user-circle fa-5x ${cardSize}__icon--avatar`} aria-hidden="true" /> }
                      <div className={`${cardSize}__name-wrap`}>
                        <span className={`${cardSize}__name`}>
                          {this.props.posts.currentPost.author_name}</span>
                        <span className={`${cardSize}__username`}>
                          @{this.props.posts.currentPost.author}
                        </span>
                      </div>
                  </Link>
                </div>
                <div className={`${cardSize}__text-wrap`}>
                  <div className={`${cardSize}__title`}>
                    {this.props.posts.currentPost.title}
                  </div>
                  { this.props.posts.excerpt ?
                  <div className={`${cardSize}__body ${cardSize}__excerpt`}>
                    {`${this.props.posts.excerpt}...`}
                    {!this.state.thumb &&
                    <span
                      className="flip-it post-full__readmore tag-value"
                      onClick={()=>this.flip()}
                      tabIndex={0}
                      name='flip'
                      aria-label='flip'
                      onKeyDown={e => this.handleKeyDown(e)}
                      >
                      <span className="tag-value__label">
                      more &nbsp;
                      <i className="fa fa-chevron-right post-full__icon--readmore" aria-hidden="true" />
                      </span>
                    </span> }
                  </div> :
                  <div className={`${cardSize}__body`}>
                    {this.props.posts.currentPost.body}
                  </div>
                  }
                  {!this.state.thumb &&
                  <div className="tag-value__wrapper">
                      {keywordsDisp ? keywordsDisp : ''}
                  </div> }
                </div>
              </div>
            }
            {this.state.thumb &&
              <div className={`${cardSize}__card-body`}>
                <div className={`${cardSize}__text-wrap`}>
                    <div className={`${cardSize}__title`}>
                      {this.props.posts.currentPost.title}
                    </div>
                    { this.props.posts.excerpt ?
                    <div className={`${cardSize}__body ${cardSize}__excerpt`}>
                      {`${this.props.posts.excerpt}...`}
                      {!this.state.thumb &&
                      <span
                        className="flip-it post-full__readmore tag-value"
                        onClick={()=>this.flip()}
                        tabIndex={0}
                        name='flip'
                        aria-label='flip'
                        onKeyDown={e => this.handleKeyDown(e)}
                        >
                        <span className="tag-value__label">
                        more &nbsp;
                        <i className="fa fa-chevron-right post-full__icon--readmore" aria-hidden="true" />
                        </span>
                      </span> }
                    </div> :
                    <div className={`${cardSize}__body`}>
                      {this.props.posts.currentPost.body}
                    </div>
                    }
                    {!this.state.thumb &&
                    <div className="tag-value__wrapper">
                        {keywordsDisp ? keywordsDisp : ''}
                    </div> }
                </div>
                <div className={`${cardSize}__image-wrap`}>
                  <Link className="unstyled-link post-thumb__img-link" to={`/viewprofile/${this.props.posts.currentPost.author_id}`}>
                    {this.props.posts.currentPost.author_avatar ?
                      <img
                        className={`${cardSize}__image`}
                        src={this.props.posts.currentPost.author_avatar}
                        alt={this.props.posts.currentPost.author} /> :
                      <i className={`fa fa-user-circle fa-5x ${cardSize}__icon--avatar`} aria-hidden="true" /> }
                      <div className={`${cardSize}__name-wrap`}>
                        <span className={`${cardSize}__username`}>
                          @{this.props.posts.currentPost.author}
                        </span>
                      </div>
                  </Link>
                </div>

              </div>
            }
              <div className={ !owner ? `${cardSize}__button-wrap` : `${cardSize}__button-wrap ${cardSize}__button-wrap--edit`}>
              { actions }
              </div>
            </div>
            {this.props.posts.excerpt && !this.state.thumb &&
              <div className={this.state.flip ? "side back flip" : "side back"} id="back">
                <div className="post-full__date">
                <span className="tag-value">
                  <span className="tag-value__label">
                    {formatDate(new Date(this.props.posts.currentPost.updatedAt))}
                  </span>
                </span>
              </div>
              <div className="post-full__back-wrap">
                <div className="post-full__title">
                  {this.props.posts.currentPost.title}
                  </div>
                  <div className="post-full__body">
                  {this.props.posts.currentPost.body}
                  </div>
                  <div className={ !owner ? "post-full__button-wrap" : "post-full__button-wrap post-full__button-wrap--edit"}>
              { actions }
              </div>
                  <div className="post-full__card-footer--back">
                    <div
                      className='flip-it post-full__nav-item--flip'
                      name='flip'
                      aria-label='flip'
                      onKeyDown={e => this.handleKeyDown(e)}
                      onClick={() => this.flip()}
                      tabIndex={0}>
                      <i className="fa fa-refresh post-full__icon--flip" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </div>
            }
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
