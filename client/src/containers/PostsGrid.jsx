import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from 'react-modal';
import Shuffle from 'shufflejs';

import * as Actions from '../store/actions/postActions';
import * as apiActions from '../store/actions/apiPostActions';
import PostThumb from './PostThumb';
import Spinner from './Spinner';
import ModalSm from './ModalSm';
import ModalGuts from './ModalGuts';
import PostsGridControls from './PostsGridControls';

class PostsGrid extends React.Component {

  static adjustBkgSize() {
    // adjust background size to fit content
    const el = document.getElementById('posts-grid');
    let adjustedHeight = el.clientHeight;
    adjustedHeight = Math.max(el.scrollHeight, window.innerHeight);
    if (adjustedHeight > el.clientHeight) { el.style.height = `${adjustedHeight}px`; }
  }

  constructor(props) {
    super(props);
    this.state = {
      post: {},
      modalOpen: false,
    };

  }

  componentDidMount() {
    let filterGroup = ['all'];
    if (this.props.gridControls.filterGroup === []) {
      filterGroup = 'all';
    } else {
      filterGroup = this.props.gridControls.filterGroup;
    }
    console.log('PostsGrid.jsx > 37',filterGroup);
    const sortByDate = (element) => {
      return element.getAttribute('data-updated');
    };
    this.props.api.getAllPosts(this.props.appState.authToken)
      .then(() => {
        // initialize a shuffle instance.
        this.shuffle = new Shuffle(this.element, {
          itemSelector: '.post',
          sizer: document.getElementsByClassName('sizer')[0],
          delimeter: ',',
          initialSort: {
            by: sortByDate,
            reverse: true,
          },
          // group: filterGroup,
        });
        this.shuffle.resetItems();
        this.addShuffleEventListeners();
      });
  }

  componentDidUpdate() {
    if (this.shuffle) {
      switch (this.props.gridControls.operation) {
        case 'FILTER':
          this.shuffle.group = this.props.gridControls.filterGroup;
          console.log('PostsGrid.jsx > 68 this.shuffle.group', this.shuffle.group);
          this.shuffle.filter((element, shuffle) => {
            // If there is a current filter applied, ignore elements that don't match it.
            if (shuffle.group !== Shuffle.ALL_ITEMS) {
              // Get the item's groups.
              const groups = element.getAttribute('data-groups');
              // remove empty values from filter list
              let activeFilters = shuffle.group.filter((el) => el !== '');
              // for each active filter, check against element groups
              for (i=0; i<activeFilters.length; i++) {
                const isElementInCurrentGroup = groups.indexOf(activeFilters[i]) !== -1;;
              // Only return elements in the current group
                if (!isElementInCurrentGroup) {
                  return false;
                }
              }
            }
            // define searchable text (title, body, keywords)
            const titleElement = element.querySelector('.post-thumb__title');
            const titleText = titleElement.textContent.toLowerCase().trim();
            const bodyElement = element.querySelector('.post-thumb__body');
            const bodyText = bodyElement.textContent.toLowerCase().trim();
            const keywordsElements = element.querySelectorAll('.tag-value__label'); //returns NodeList, have to convert to array
            let keywordsElementsArray = [];
            for (var i = 0; i < keywordsElements.length; i++) {
                keywordsElementsArray.push(keywordsElements[i]);
            }
            const keywordsText = keywordsElementsArray.map((el) => el.textContent.toLowerCase().trim());
            const searchBlob = titleText.concat(bodyText).concat(keywordsText);
            return searchBlob.indexOf(this.props.gridControls.searchText) !== -1;
          });
          PostsGrid.adjustBkgSize();
          break;

        case 'SORT':
          this.shuffle.sort(this.props.gridControls.sortOptions);
          break;

        case 'ADD':
          this.shuffle.update();
        default:
          this.shuffle.resetItems();

      }
    }
  }

  componentWillUnmount() {
    // Dispose of shuffle when it will be removed from the DOM.
    this.shuffle.destroy();
    this.shuffle = null;
  }

  closeModal = () => {
    const newState = { ...this.state };
    newState.modalOpen = false;
    newState.modalTitle = '';
    this.setState({
      ...newState,
    });
  }

  openModal = (post) => {
    const newState = { ...this.state };
    newState.modalOpen = true;
    newState.post = post;
    this.setState({
      ...newState,
    });
  }

  addShuffleEventListeners = () => {
    this.shuffle.on(Shuffle.EventType.LAYOUT, (data) => {
      // console.log('layout. data:', data);
      PostsGrid.adjustBkgSize();
    });

    this.shuffle.on(Shuffle.EventType.REMOVED, (data) => {
      // console.log('removed. data:', data);
      PostsGrid.adjustBkgSize();
    });
  }

  render() {
    const modalStyles = { overlay: { zIndex: 1001, backgroundColor: 'rgba(0,0,0,.7)', } };
    const title = this.state.post && this.state.post.title ? this.state.post.title : '';
    const reset = this.shuffle ? this.shuffle.resetItems : null;

    return (
      <div className="posts-grid" id="posts-grid">
        <Spinner cssClass={`${this.props.posts.loadPostsSpinnerClass}`} />
        <ModalSm
          modalClass={this.props.posts.loadPostsModal.class}
          modalText={this.props.posts.loadPostsModal.text}
          modalTitle={this.props.posts.loadPostsModal.title}
          modalType={this.props.posts.loadPostsModal.type}
          dismiss={
            () => {
              this.props.actions.setLoadPostsModal({
                type: '',
                text: '',
                class: 'modal__hide',
                title: '',
              });
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
            shuffle={reset}
            history={this.props.history}
          />
        </Modal>
        <div className="posts-grid__wrap">
          <PostsGridControls />
          <div ref={element => this.element = element} className="flex-row my-shuffle shuffle posts-grid__cont">
            <div className="flex-col-1-sp sizer" />
            {this.props.posts.entries.map((post) => {
              const languages = post.author_languages ? post.author_languages.map(lang => lang.toLowerCase()) : [];
              const keywords = post.keywords ? post.keywords.map(keyword => keyword.toLowerCase()) : [];
              const gender = post.author_gender ? post.author_gender.toLowerCase() : '';
              return (
                <div
                  key={post._id}
                  className="flex-col-12-xs flex-col-6-sm flex-col-4-md flex-col-3-lg flex-col-2-xl shuffle-item shuffle-item--visible post"
                  data-groups={[post.role, gender, post.author_timezone, languages, keywords]}
                  data-updated={post.updatedAt}
                  data-title={post.title}
                >
                  <PostThumb
                    id={post._id}
                    post={post}
                    shuffle={reset}
                    openModal={this.openModal}
                  />
                </div>
              );
            },
          )}
        <div ref={element => this.sizer = element} className="col-1@xs col-1@sm post-grid__sizer" />
        </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  appState: state.appState,
  posts: state.posts,
  gridControls: state.gridControls,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostsGrid);
