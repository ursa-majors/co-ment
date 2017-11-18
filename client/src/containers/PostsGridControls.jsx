import React from 'react';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { languages, skills, timezones } from '../utils';
import InputAutosuggest from './InputAutosuggest';

import * as Actions from '../store/actions/gridControlActions';
import ResponsiveTabOrder from '../utils/responsive-tab-order';

const genders = ['Male', 'Female', 'Other'];
const roles = ['Mentor', 'Mentee'];

// render timezone, gender, and role selects
const tzList = timezones.map(i => (
  <option key={i[1]} value={`UTC ${i[0]}`}>{`(UTC ${i[0]}) ${i[1]}`}</option>
  ));
const gList = genders.map(i => (<option key={i}>{i}</option>));
const rList = roles.map(i => (<option key={i}>{i}</option>));

class PostsGridControls extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      showFilters: false,
      search: false,
      sort: false,
      filter: false,
    };
  }

  componentDidMount() {
    // fix style on autosuggest inputs
    const autosug = document.getElementsByClassName('react-autosuggest__input');
    for (let i = 0; i < autosug.length; i++) {
      autosug[i].classList.add('form__input-grid');
    }
  }

  onMouseUp = (e) => {
    // clear searchText value on click html5 search input 'clear' button
    const savedTarget = e.target;
    const oldValue = e.target.value;
    if (oldValue === '') return;
    // When this event is fired after clicking on the clear button
    // the value is not cleared yet. We have to wait for it.
    setTimeout(() => {
      const newValue = savedTarget.value;
      if (newValue === '') {
        this.props.actions.setSearchText('');
      }
    }, 1);
  }

  toggleControls = (type) => {
    // show/hide expanded controls on smaller screens
    const large = document.getElementsByClassName(`${type}__large`);
    const small = document.getElementsByClassName(`${type}__small`);
    for (let i = 0; i < large.length; i++) {
      large[i].classList.toggle('visible');
    }
    for (let i = 0; i < small.length; i++) {
      small[i].classList.toggle('hidden');
    }
    const newState = { ...this.state };
    newState[type] = !this.state[type];
    this.setState({ ...newState });
  }

  toggleFilters = () => {
    // show/hide advanced filter controls box
    const newState = { ...this.state };
    newState.showFilters = !this.state.showFilters;
    this.setState({ ...newState }, () => {
      // set data attribute taborder = 'visual' on autosuggest hidden inputs
      const focusable = document.getElementsByClassName('react-autosuggest__input');
      for (let i = 0; i < focusable.length; i++) {
        focusable[i].setAttribute('data-taborder', 'visual');
      }
      // add or remove advanced controls from tab order
      ResponsiveTabOrder.updateTabOrder();
    });
  }

  render() {
    const filterClass = this.state.showFilters ? 'flex-row posts-grid__adv-filter-wrap' : 'hidden';
    let filtersAppliedList;
    if (this.props.gridControls.filterGroup === 'all' || this.props.gridControls.filterGroup === []) {
      filtersAppliedList = '';
    } else {
      filtersAppliedList = this.props.gridControls.filterGroup.map(filter => (
        <span className="posts-grid__filter-item" key={filter}>{filter}</span>
        ));
    }

    return (
      <div className="posts-grid__controls">
        <div className={this.state.search || this.state.sort || this.state.filter ? 'flex-row no-wrap no-wrap--open' : 'flex-row no-wrap'}>
          <div className="filters-group">
            <label htmlFor="filters-search-input" className="form__label--white">Search</label>
            <div className="form__input__search-container search__large">
              <input
                className="form__input form__input--search filter__search js-shuffle-search"
                data-taborder="visual"
                type="search"
                id="filters-search-input"
                placeholder="Search..."
                onKeyUp={e => this.props.actions.setSearchText(e.target.value)}
                onMouseUp={e => this.onMouseUp(e)}
              />
              {this.props.appState.windowSize.width < 675 && this.state.search ?
                <button
                  className="aria-button modal-close modal-close--pg search__large visible"
                  data-taborder="visual"
                  aria-label="close search"
                  onClick={() => this.toggleControls('search')}
                >
                  &times;
                </button> : ''
                }
            </div>
            <div className="btn-group sort-options">
              <button
                className="btn btn--primary btn--single search__small"
                data-taborder="visual"
                aria-label="search"
                onClick={() => this.toggleControls('search')}
              >
                <i className="fa fa-search" aria-hidden />
              </button>
            </div>
          </div> {/* SEARCH */}
          <div className="filters-group">
            <span className="form__label--white">Sort</span>
            <div className="btn-group sort-options sort__large">
              <button
                className={`btn btn--primary ${this.props.gridControls.sortBtn['date-updated']}`}
                data-taborder="visual"
                value="date-updated"
                aria-label="sort by date"
                onClick={(e) => {
                  this.props.actions.setSort(e.target);
                  this.toggleControls('sort');
                }
                }
                onKeyDown={(e) => {
                  if (e.charCode === 13 || e.which === 13) {
                    this.props.actions.setSort(e.target);
                    this.toggleControls('sort');
                  }
                }
                }
              > New
              </button>
              <button
                className={`btn btn--primary ${this.props.gridControls.sortBtn.popular}`}
                data-taborder="visual"
                aria-label="sort by popular"
                value="popular"
                onClick={(e) => {
                  this.props.actions.setSort(e.target);
                  this.toggleControls('sort');
                }
                }
                onKeyDown={(e) => {
                  if (e.charCode === 13 || e.which === 13) {
                    this.props.actions.setSort(e.target);
                    this.toggleControls('sort');
                  }
                }
                }
              > Popular
              </button>
            </div>
            <div className="btn-group sort-options sort__small">
              <button
                className="btn btn--primary btn--single btn--sort"
                data-taborder="visual"
                aria-label="sort"
                onClick={() => this.toggleControls('sort')}
              >
                <i className="fa fa-sort" aria-hidden />
              </button>
            </div>
          </div> {/* SORT */}
          <div className="filters-group">
            <span className="form__label--white">Filter</span>
            <div className="btn-group sort-options">
              <button
                className="btn btn--primary btn--sort"
                data-taborder="visual"
                aria-label="show filter options"
                onClick={() => this.toggleFilters()}
              >
                <span className="label-tiny filter__large">show&nbsp;</span>
                <i className="fa fa-filter filter__icon" aria-hidden />
              </button>
              <button
                className="btn btn--primary btn--sort"
                data-taborder="visual"
                aria-label="clear filters"
                onClick={() => this.props.actions.clearFilter()}
              >
                <span className="label-tiny filter__large">clear&nbsp;</span>
                <i className="fa fa-ban" aria-hidden />
              </button>
            </div>
          </div> {/* FILTER */}
          <div className="filters-group">
            <span className="form__label--white">New</span>
            <div className="btn-group sort-options">
              <button
                className="btn btn--primary btn--single"
                data-taborder="visual"
                aria-label="New Post"
                onClick={() => {
                  if (this.props.appState.user.validated) {
                    this.props.history.push('/editpost');
                  } else {
                    this.props.openValModal();
                  }
                }}
              >
                <i className="fa fa-edit edit__icon" aria-hidden />
                <span className="label-tiny newpost__large">&nbsp;new post
                </span>
              </button>
            </div>
          </div> {/* NEW POST */}
        </div>
        <div className={filterClass}>
          <button
            className="aria-button modal-close filters-group--close"
            data-taborder="visual"
            onClick={() => this.toggleFilters()}
            aria-label="Close Advanced Filters Box"
          >&times;</button>
          <div className="filters-group--flush flex-col-12-xs flex-col-6-sm flex-col-4-md flex-col-2-xl">
            <label htmlFor="role" className="form__label--white">Role</label>
            <select
              className="form__input form__input--select-grid"
              data-taborder="visual"
              id="role"
              name="role"
              value={this.props.gridControls.filterBtn.role}
              onChange={e => this.props.actions.setFilter(e.target.id, e.target.value)}
            >
              <option disabled>Role</option>
              {rList}
            </select>
          </div>
          <div className="filters-group--flush flex-col-12-xs flex-col-6-sm flex-col-4-md flex-col-2-xl">
            <label htmlFor="language" className="form__label--white">Spoken Language</label>
            <InputAutosuggest
              data-taborder="visual"
              id="language"
              className="form__input-grid"
              name="language"
              placeholder="Spoken Language"
              onChange={this.props.actions.setFilter}
              list={languages}
              value={this.props.gridControls.filterBtn.language}
              gridControls
              ref={(instance) => { this.languageInput = instance; }}
            />
          </div>
          <div className="filters-group--flush flex-col-12-xs flex-col-6-sm flex-col-4-md flex-col-2-xl">
            <label htmlFor="keyword" className="form__label--white">Keyword</label>
            <InputAutosuggest
              data-taborder="visual"
              id="keyword"
              className="form__input-grid"
              name="keyword"
              placeholder="Keyword"
              onChange={this.props.actions.setFilter}
              list={skills}
              value={this.props.gridControls.filterBtn.keyword}
              gridControls
              ref={(instance) => { this.skillInput = instance; }}
            />
          </div>
          <div className="filters-group--flush flex-col-12-xs flex-col-6-sm flex-col-4-md flex-col-2-xl">
            <label htmlFor="timezone" className="form__label--white">Time Zone</label>
            <select
              className="form__input form__input--select-grid"
              data-taborder="visual"
              id="timezone"
              name="timezone"
              value={this.props.gridControls.filterBtn.timezone}
              onChange={e => this.props.actions.setFilter(e.target.id, e.target.value)}
            >
              <option disabled>Time zone</option>
              {tzList}
            </select>
          </div>
          <div className="filters-group--flush flex-col-12-xs flex-col-6-sm flex-col-4-md flex-col-2-xl">
            <label htmlFor="gender" className="form__label--white">Gender</label>
            <select
              className="form__input form__input--select-grid"
              data-taborder="visual"
              id="gender"
              name="gender"
              value={this.props.gridControls.filterBtn.gender}
              onChange={e => this.props.actions.setFilter(e.target.id, e.target.value)}
            >
              <option disabled>Gender</option>
              {gList}
            </select>
          </div>
          <div className="filters-group--flush flex-col-12-xs flex-col-6-sm flex-col-4-md flex-col-2-xl">
            <div className="btn-group sort-options filters-group--button-grid">
              <button
                className="btn btn--primary btn--smaller btn--grid"
                data-taborder="visual"
                onClick={() => this.props.actions.runFilter()}
              >
                Apply <i className="fa fa-filter" aria-label="filter" />
              </button>
              <button
                className="btn btn--primary btn--smaller btn--grid"
                data-taborder="visual"
                onClick={() => this.props.actions.clearFilter()}
              >
                Clear <i className="fa fa-filter" aria-label="filter" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex-row">
          <div className="posts-grid__filters-applied">
            {this.props.gridControls.searchText !== '' ?
              <span>Current Search: {this.props.gridControls.searchText}</span> : ''}
            {this.props.gridControls.searchText !== '' && filtersAppliedList !== '' ? <span>&nbsp;&nbsp; | &nbsp;&nbsp;</span> : ''}
            {filtersAppliedList !== '' && this.props.gridControls.filterGroup.length > 0 ?
              <span>Filtered by: {filtersAppliedList}</span> : ''}
          </div>
        </div>
      </div>
    );
  }
}

PostsGridControls.propTypes = {
  actions: PropTypes.shape({
    setSort: PropTypes.func,
    setSearchText: PropTypes.func,
    clearFilter: PropTypes.func,
    setFilter: PropTypes.func,
    runFilter: PropTypes.func,
  }).isRequired,
  appState: PropTypes.shape({
    loggedIn: PropTypes.bool,
    authToken: PropTypes.string,
    windowSize: PropTypes.shape({
      width: PropTypes.number,
    }),
    user: PropTypes.shape({
      _id: PropTypes.string,
      avatarUrl: PropTypes.string,
      username: PropTypes.string,
      validated: PropTypes.bool,
    }).isRequired,
  }).isRequired,
  gridControls: PropTypes.shape({
    filterGroup: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
    ]),
    operation: PropTypes.string,
    searchText: PropTypes.string,
    sortBtn: PropTypes.shape({
      dateUpdated: PropTypes.string,
      popular: PropTypes.string,
    }),
    sortOptions: PropTypes.shape({
      by: PropTypes.func,
      reverse: PropTypes.bool,
    }),
    filterBtn: PropTypes.shape({
      role: PropTypes.string,
      language: PropTypes.string,
      keyword: PropTypes.string,
      timezone: PropTypes.string,
      gender: PropTypes.string,
    }),
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  openValModal: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  gridControls: state.gridControls,
  appState: state.appState,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PostsGridControls));
