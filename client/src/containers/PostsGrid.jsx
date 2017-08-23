import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import Shuffle from 'shufflejs';

import * as Actions from '../store/actions/postActions';
import * as apiActions from '../store/actions/apiPostActions';
import { formatDate } from '../utils/';
import PostThumb from './PostThumb';
import Spinner from './Spinner';
import Modal from './Modal';

class PostsGrid extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      active: null,
    };
  }

  componentDidMount() {
    this.props.api.getAllPosts(this.props.appState.authToken);

    // initialize a shuffle instance.
    this.shuffle = new Shuffle(this.element, {
      itemSelector: '.post',
      sizer: document.getElementsByClassName('sizer')[0],
    });
    this.shuffle.resetItems();

    // console.log(this.props.posts.entries[0]);

  }

  componentDidUpdate() {
    // Notify shuffle to dump the elements it's currently holding and consider
    // all elements matching the `itemSelector` as new.
    this.shuffle.resetItems();
  }

  componentWillUnmount() {
    // Dispose of shuffle when it will be removed from the DOM.
    this.shuffle.destroy();
    this.shuffle = null;
  }

  render() {
      const searchCriteria = this.props.posts.searchCriteria;

    return (
      <div className="posts-grid">
        <Spinner cssClass={`${this.props.posts.loadPostsSpinnerClass}`} />
        <Modal
          modalClass={`${this.props.posts.loadPostsModalClass}`}
          modalText={`${this.props.posts.loadPostsModalText}`}
          dismiss={() =>
            {
              this.props.actions.setLoadPostsModalText('');
              this.props.actions.setLoadPostsModalClass('modal__hide');
            }
          }
        />
        <div>
          <div ref={element => this.element = element} className="flex-row my-shuffle shuffle posts-grid__cont">
          <div className="flex-col-1-sp sizer"></div>
        {this.props.posts.entries.reverse().map((post) => (
          <div key={post._id} className="flex-col-12-xs flex-col-6-sm flex-col-4-md flex-col-3-lg flex-col-2-xl picture-item shuffle-item shuffle-item--visible post">
            <PostThumb
              id={post._id}
              active={this.state.active===post._id}
              post={post}
              shuffle={this.shuffle.resetItems}
              />
          </div>
        ))}
        <div ref={element => this.sizer = element} className="col-1@xs col-1@sm post-grid__sizer"></div>
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
  api: bindActionCreators(apiActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostsGrid);
