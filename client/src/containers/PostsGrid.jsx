import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import Shuffle from 'shufflejs';

import * as Actions from '../store/actions/postActions';
import * as apiActions from '../store/actions/apiPostActions';
import { formatDate } from '../utils/';
import PostThumb from './PostThumb';
import Spinner from './Spinner';
import ModalSm from './ModalSm';
import ModalGuts from './ModalGuts';

class PostsGrid extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      post: {},
      modalOpen: false,
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
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

  closeModal = () => {
    console.log('close');
    const newState = {...this.state};
    newState.modalOpen = false;
    newState.modalTitle = '';
    this.setState({
      ...newState,
   }, ()=>{console.log(this.state)});
  }

  openModal = (post) => {
    this.setState({ modalOpen: true, post, }, ()=>{console.log('65',post);});
  }

  render() {
      const searchCriteria = this.props.posts.searchCriteria;
      const modalStyles = { overlay: { zIndex: 10 } };
      const title = this.state.post && this.state.post.title ? this.state.post.title : '';
      const reset = this.shuffle ? this.shuffle.resetItems : null;

    return (
      <div className="posts-grid">
        <Spinner cssClass={`${this.props.posts.loadPostsSpinnerClass}`} />
        <ModalSm
          modalClass={`${this.props.posts.loadPostsModalClass}`}
          modalText={`${this.props.posts.loadPostsModalText}`}
          dismiss={() =>
            {
              this.props.actions.setLoadPostsModalText('');
              this.props.actions.setLoadPostsModalClass('modal__hide');
            }
          }
        />
        <Modal
          style={modalStyles}
          isOpen={this.state.modalOpen}
          onRequestClose={this.closeModal}
          className="post__modal"
          post={this.state.post}
          contentLabel={title}
        >
          <ModalGuts
            closeModal={this.closeModal}
            title={title}
            post={this.state.post}
            history={this.props.history}
          />
        </Modal>
        <div>
        <div className="posts-grid__controls">
          <span className="posts__button-wrap">
            <Link to="/editpost">
              <button className="posts__button pointer" aria-label="New Post" >
                <span className="posts__btn--big">New Post</span>
                <span className="posts__btn--sm">+</span>
              </button>
            </Link>
          </span>
          </div>
          <div ref={element => this.element = element} className="flex-row my-shuffle shuffle posts-grid__cont">
          <div className="flex-col-1-sp sizer"></div>
        {this.props.posts.entries.reverse().map((post) => (
          <div key={post._id} className="flex-col-12-xs flex-col-6-sm flex-col-4-md flex-col-3-lg flex-col-2-xl picture-item shuffle-item shuffle-item--visible post">
            <PostThumb
              id={post._id}
              post={post}
              shuffle={reset}
              openModal={this.openModal}
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
