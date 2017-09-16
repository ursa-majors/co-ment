import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import * as Actions from '../store/actions/postActions';
import * as apiActions from '../store/actions/apiPostActions';
import { formatDate } from '../utils/';

class PostThumb extends React.Component {

  handleKeyDown(e) {
    // enter key opens modal when focused
    const action = e.target.className.split(" ")[0];
    if (e.keyCode === 13 || e.which === 13 ) {
      switch (action) {
        case 'expand':
          this.props.openModal();
          break;
        default:
          return null;
      }
    }
  }

  render() {
    const roleText = (this.props.post.role === 'mentor' ? 'mentor' : 'mentee');
    let keywordsDisp;
    let keywordsFirstThree;
    let keywordsRest = null;
    // need to render the whole list to make them searchable, but display only first 3 tags in thumb view
    if (this.props.post.keywords) {
      keywordsFirstThree = this.props.post.keywords.slice(0,3);
      if (this.props.post.keywords.length > 3) {
      keywordsRest = this.props.post.keywords.slice(3, this.props.post.keywords.length); }
      keywordsDisp = (<div>
      {keywordsFirstThree.map(word => (
        <span className="tag-value tag-value--thumb" key={word}>
          <span className="tag-value__label tag-value__label--thumb">
            {word}
          </span>
        </span>
       ))}{keywordsRest && keywordsRest.map(word => (<span className="tag-value__label sr-only" key={word}>{word}</span>))}</div>
      )
    }
    const backgroundStyle = {
      backgroundImage: `url(${this.props.post.author_avatar})`,
      backgroundSize: "cover",
      backgroundPosition: "center center",
    }

    return (
      <div>
        <div className="post-thumb">
          <div className={this.props.post.role === 'mentor' ? `post-thumb__ribbon` : `post-thumb__ribbon--green`}>
            <span className={this.props.post.role === 'mentor' ? `post-thumb__ribbon-span` : `post-thumb__ribbon-span--green`}>{roleText}</span>
          </div>
          <div className="side front" id="front">
            <div className="post-thumb__metadata">
              <span className="post-thumb__views">
                 <i className="fa fa-eye" /> &nbsp;{this.props.post.meta.views}
              </span>
              <span className="post-thumb__likes">
                <i className="fa fa-heart" />&nbsp;{this.props.post.meta.likes}
              </span>
              {this.props.post.updatedAt &&
              <div className={`post-thumb__date`}>
                <span className="tag-value">
                  <span className="tag-value__label">
                    {formatDate(new Date(this.props.post.updatedAt))}
                  </span>
                </span>
              </div> }
            </div>
              <div className={`post-thumb__card-body`}>
                <div className={`post-thumb__text-wrap`}>
                    <div className={`post-thumb__title`}>
                      {this.props.post.title}
                    </div>
                    { this.props.post.excerpt ?
                    <div className={`post-thumb__body post-thumb__excerpt`}>
                      {`${this.props.post.excerpt}...`}
                    </div> :
                    <div className={`post-thumb__body`}>
                      {this.props.post.body}
                    </div>
                    }
                    <div className="tag-value__wrapper">
                    {keywordsDisp ? keywordsDisp : ''}
                </div>
                </div>
                <div className={`post-thumb__image-wrap`}>
                  <div className='post-thumb__link-wrap'>
                    <div className={`post-thumb__image-aspect`}>
                      <div className={`post-thumb__image-crop`}>
                        {this.props.post.author_avatar ?
                          <div
                            className={`post-thumb__image`}
                            style={backgroundStyle}
                            role="image"
                            aria-label={this.props.post.author} /> :
                          <i
                            className={`fa fa-user-circle fa-5x post-thumb__icon--avatar`}
                            aria-hidden="true" />
                        }
                      </div>
                    </div>
                    <div className={`post-thumb__name-wrap`}>
                      <Link
                        className="unstyled-link post-thumb__img-link"
                        to={`/viewprofile/${this.props.post.author_id}`}
                        data-taborder="visual">
                        <span className={`post-thumb__username`}>
                          @{this.props.post.author}
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="post-thumb__button-wrap">
                <button
                  className={`expand post-thumb__expand`}
                  aria-label="expand"
                  name="expand"
                  data-taborder="visual"
                  onKeyDown={e => this.handleKeyDown(e)}
                  onClick={
                    () => {
                      if( this.props.appState.userId !== this.props.post.author_id) {
                        this.props.api.incrementPostView(this.props.appState.authToken, this.props.post._id);
                      }
                      this.props.openModal(this.props.post);
                    }
                  }
                >
                  <i
                    className={`fa fa-expand post-thumb__icon--expand`}
                    aria-label="expand"
                  />
                </button>
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

export default connect(mapStateToProps, mapDispatchToProps)(PostThumb);
