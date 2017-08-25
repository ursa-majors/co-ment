import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import Shuffle from 'shufflejs';

import * as Actions from '../store/actions/postActions';
import * as apiActions from '../store/actions/apiPostActions';
import PostThumb from './PostThumb';
import Spinner from './Spinner';
import ModalSm from './ModalSm';
import ModalGuts from './ModalGuts';

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

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  // need to add a window size event listener to set .posts-grid height to 100% OR 100vh, whichever is greater, to keep background image covering viewport height on search results display

  componentDidMount() {
    this.props.api.getAllPosts(this.props.appState.authToken);

    // initialize a shuffle instance.
    this.shuffle = new Shuffle(this.element, {
      itemSelector: '.post',
      sizer: document.getElementsByClassName('sizer')[0],
      delimeter: ',',
    });
    this.shuffle.resetItems();
    this.addShuffleEventListeners();
    PostsGrid.adjustBkgSize();

    // console.log(this.props.posts.entries[0]);
  }

  componentDidUpdate() {
    // Notify shuffle to dump the elements it's currently holding and consider
    // all elements matching the `itemSelector` as new.
    this.shuffle.resetItems();
    PostsGrid.adjustBkgSize();
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
      // console.log('layout. data:', data);
      PostsGrid.adjustBkgSize();
    });

    this.shuffle.on(Shuffle.EventType.REMOVED, (data) => {
      // console.log('removed. data:', data);
      PostsGrid.adjustBkgSize();
    });
  }

  handleFilterClick = (e) => {
    const btn = e.currentTarget;
    const isActive = btn.classList.contains('active');
    const btnGroup = btn.getAttribute('data-group');
    const newState = {...this.state};
    this.removeActiveClassFromChildren(btn.parentNode);
    let filterGroup;
    if (isActive) {
      btn.classList.remove('active');
      filterGroup = Shuffle.ALL_ITEMS;
    } else {
      btn.classList.add('active');
      filterGroup = btnGroup;
    }
    this.shuffle.filter(filterGroup);
  }

  removeActiveClassFromChildren = (parent) => {
    const children = parent.children;
    for (let i = (children.length - 1); i >= 0; i--) {
      children[i].classList.remove('active');
    }
  }

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
    const sortByDate = (element) => {
      return element.getAttribute('data-updated');
    }
    const sortByTitle = (element) => {
      return element.getAttribute('data-title').toLowerCase();
    }
    if (value === 'date-updated') {
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
    }

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
        console.log(element.getAtribute('data-groups'));
        console.log(groups);
        var isElementInCurrentGroup = groups.indexOf(shuffle.group) !== -1;
        // Only search elements in the current group
        if (!isElementInCurrentGroup) {
          return false;
        }
      }
      const titleElement = element.querySelector('.post-thumb__title');
      const titleText = titleElement.textContent.toLowerCase().trim();
      const bodyElement = element.querySelector('.post-thumb__body');
      const bodyText = bodyElement.textContent.toLowerCase().trim();
      // add username ?
      // in order to make keywords, timezone, gender searchable they have to be output to grid even if not visible in thumb view
      const searchBlob = titleText.concat(bodyText);
      return searchBlob.indexOf(searchText) !== -1;
      PostsGrid.adjustBkgSize();
    });
};
  ///
  ///
  ////////// FILTER SORT SEARCH /////////

  render() {
    const modalStyles = { overlay: { zIndex: 10, backgroundColor: 'rgba(0,0,0,.7)', } };
    const title = this.state.post && this.state.post.title ? this.state.post.title : '';
    const reset = this.shuffle ? this.shuffle.resetItems : null;

    return (
      <div className="posts-grid" id="posts-grid">
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
           <div className="flex-row">
            <div className="filters-group">
              <label htmlFor="filters-search-input" className="form__label--white">Search</label>
              <input
                className="form__input form__input--search filter__search js-shuffle-search"
                type="search"
                id="filters-search-input"
                placeholder="Search..."
                onKeyUp={(e)=>this.handleSearchKeyup(e)}
                />
            </div>
              <div className="filters-group">
                <label htmlFor="filter-options" className="form__label--white">Filter</label>
                <div className="btn-group filter-options" id="filter-options">
                  <button
                    className="btn btn--primary"
                    data-group="mentor"
                    onClick={e=>this.handleFilterClick(e)}>
                    Mentors
                  </button>
                  <button
                    className="btn btn--primary"
                    data-group="mentee"
                    onClick={e=>this.handleFilterClick(e)}>
                    Mentees
                  </button>
                </div>
              </div>
              <div className="filters-group">
                <label className="form__label--white">Sort</label>
                <div className="btn-group sort-options">
                  <label className="btn btn--primary active">
                    <input
                      type="radio"
                      name="sort-value"
                      value="dom"
                      onChange={e => this.handleSortChange(e)}/> Default
                  </label>
                  <label className="btn btn--primary">
                    <input
                      type="radio"
                      name="sort-value"
                      value="title"
                      onChange={e => this.handleSortChange(e)}/> Title
                  </label>
                  <label className="btn btn--primary">
                    <input
                      type="radio"
                      name="sort-value"
                      value="date-updated"
                      onChange={e => this.handleSortChange(e)}
                      /> Date Updated
                  </label>
                </div>
              </div>
              <div className="filters-group filters-group__btn">
                <div className="posts__button-wrap">
                  <Link to="/editpost">
                    <button className="posts__button pointer" aria-label="New Post" >
                      <span className="posts__btn--big">New Post</span>
                      <span className="posts__btn--sm">+</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div ref={element => this.element = element} className="flex-row my-shuffle shuffle posts-grid__cont">
          <div className="flex-col-1-sp sizer"></div>
        {this.props.posts.entries.reverse().map((post) => {
          return (
          <div
            key={post._id}
            className="flex-col-12-xs flex-col-6-sm flex-col-4-md flex-col-3-lg flex-col-2-xl shuffle-item shuffle-item--visible post"
            data-groups={post.role}
            data-updated={post.updatedAt}
            data-title={post.title}>
            <PostThumb
              id={post._id}
              post={post}
              shuffle={reset}
              openModal={this.openModal}
              />
          </div>
        )
        })}
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
