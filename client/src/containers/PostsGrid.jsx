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
      activeFilters: [],
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
    this.addShuffleEventListeners();
    this.addFilterButtons();
    this.addSorting();
    this.addSearchFilter();

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
    const newState = {...this.state};
    newState.modalOpen = false;
    newState.modalTitle = '';
    this.setState({
      ...newState,
   });
  }

  openModal = (post) => {
    const newState = {...this.state};
    newState.modalOpen = true;
    newState.post = post;
    this.setState({
      ...newState,
   });
  }

  ////////// FILTER SORT SEARCH ////////
  /// need to add html, add classes for document.queryselector calls, add data-attributes for filtering and sorting
  ///


  addShuffleEventListeners = () => {
    this.shuffle.on(Shuffle.EventType.LAYOUT, (data) => {
      console.log('layout. data:', data);
    });

    this.shuffle.on(Shuffle.EventType.REMOVED, (data) => {
      console.log('removed. data:', data);
    });
  }

  addFilterButtons = () => {
    const options = document.querySelector('.filter-options');
    if (!options) {
      return;
    }

    const filterButtons = Array.from(options.children);

    filterButtons.forEach((button) => {
      button.addEventListener('click', this.handleFilterClick.bind(this), false);
    }, this);
  };

  handleFilterClick = (e) => {
    const btn = e.currentTarget;
    const isActive = btn.classList.contains('active');
    const btnGroup = btn.getAttribute('data-group');
    const newState = {...this.state};

    if (isActive) {
      newState.activeFilters.splice(this.state.activeFilters.indexOf(btnGroup));
      } else {
        newState.activeFilters.push(btnGroup);
      }

    this.setState({
      ...newState,
      }, () => {
        btn.classList.toggle('active');
        this.shuffle.filter(this.state.activeFilters);
    });
  }

  removeActiveClassFromChildren = (parent) => {
    const children = parent.children;
    for (let i = (children.length - 1); i >= 0; i--) {
      children[i].classList.remove('active');
    }
  }

  addSorting = () => {
  const buttonGroup = document.querySelector('.sort-options');
    if (!buttonGroup) {
      return;
    }
  buttonGroup.addEventListener('change', this.handleSortChange.bind(this));
  };

  handleSortChange = (e) => {
  // Add and remove `active` class from buttons.
  const wrapper = e.currentTarget;
  const buttons = Array.from(e.currentTarget.children);
  buttons.forEach((button) => {
    if (button.querySelector('input').value === e.target.value) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });

  // Create the sort options to give to Shuffle.
  const value = e.target.value;
  let options = {};

  sortByDate = (element) => {
    return element.getAttribute('data-created');
  }

  sortByTitle = (element) => {
    return element.getAttribute('data-title').toLowerCase();
  }

  if (value === 'date-created') {
    options = {
      reverse: true,
      by: sortByDate,
    };
  } else if (value === 'title') {
    options = {
      by: sortByTitle,
    };
  }

  this.shuffle.sort(options);
  };

// Advanced filtering
  addSearchFilter =  () => {
  const searchInput = document.querySelector('.js-shuffle-search');

  if (!searchInput) {
    return;
  }

  searchInput.addEventListener('keyup', this.handleSearchKeyup.bind(this));
};

/**
 * Filter the shuffle instance by items with a title that matches the search input.
 * @param {Event} e Event object.
 */
  handleSearchKeyup = (e) => {
  const searchText = e.target.value.toLowerCase();

  this.shuffle.filter((element, shuffle) => {

    // If there is a current filter applied, ignore elements that don't match it.
    if (shuffle.group !== Shuffle.ALL_ITEMS) {
      // Get the item's groups.
      var groups = JSON.parse(element.getAttribute('data-groups'));
      var isElementInCurrentGroup = groups.indexOf(shuffle.group) !== -1;

      // Only search elements in the current group
      if (!isElementInCurrentGroup) {
        return false;
      }
    }

    var titleElement = element.querySelector('.picture-item__title');
    var titleText = titleElement.textContent.toLowerCase().trim();

    return titleText.indexOf(searchText) !== -1;
  });
};
  ///
  ///
  ////////// FILTER SORT SEARCH /////////

  render() {
      const searchCriteria = this.props.posts.searchCriteria;
      const modalStyles = { overlay: { zIndex: 10, backgroundColor: 'rgba(0,0,0,.7)', } };
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
