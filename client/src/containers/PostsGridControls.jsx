import React from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { languages, skills, timezones } from '../utils';
import InputAutosuggest from './InputAutosuggest';

import * as Actions from '../store/actions/gridControlActions';

const genders = ['Male', 'Female', 'Other'];
const roles = ['Mentor', 'Mentee'];

// seed values for autosuggest fields
const languageList = languages.map(i => (<option key={i}>{i}</option>));
const skillsList = skills.map(i => (<option key={i}>{i}</option>));

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
    for ( let i=0; i < autosug.length; i++ ) {
      autosug[i].classList.add("form__input-grid");
    }
  }

  toggleControls = (type) => {
    const newState = { ...this.state }
    newState[type] = !this.state[type];
    this.setState({ ...newState });
  }

  toggleFilters = () => {
    const newState = { ...this.state }
    newState.showFilters = !this.state.showFilters;
    this.setState({ ...newState });
  }

  onMouseUp = (e) => {
    // clear searchText value on click html5 search input 'clear' button
    const savedTarget = e.target;
    const oldValue = e.target.value;
    if (oldValue == '') return;
    // When this event is fired after clicking on the clear button
    // the value is not cleared yet. We have to wait for it.
    setTimeout(()=> {
      const newValue = savedTarget.value;
      if (newValue == '') {
         this.props.actions.setSearchText('');
        }
      }, 1);
  }

  render() {
    const filterClass = this.state.showFilters ? "flex-row posts-grid__adv-filter-wrap" : "hidden";
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
        <div className={this.state.search || this.state.sort || this.state.filter ? "flex-row no-wrap no-wrap--open" : "flex-row no-wrap"}>
          <div className="filters-group">
            <label htmlFor="filters-search-input" className="form__label--white">Search</label>
            {this.props.appState.windowSize.width>675 || this.state.search ?
              <div className="form__input__search-container">
                <input
                  className="form__input form__input--search filter__search js-shuffle-search"
                  type="search"
                  id="filters-search-input"
                  placeholder="Search..."
                  onKeyUp={e => this.props.actions.setSearchText(e.target.value)}
                  onMouseUp={(e)=>this.onMouseUp(e)}
                  />
                {this.props.appState.windowSize.width<675 && this.state.search ?
                  <button className="aria-button modal-close modal-close--pg" aria-label="close search" onClick={()=>this.toggleControls('search')}>&times;</button> : '' }
              </div>
                :
              <div className="btn-group sort-options">
                <button className="btn btn--primary btn--single" onClick={()=>this.toggleControls('search')}>
                    <i className="fa fa-search" aria-label="search" />
                </button>
              </div>
            }
          </div>
          <div className="filters-group">
            <label className="form__label--white">Sort</label>
            {this.props.appState.windowSize.width>675 || this.state.sort ?
              <div className="btn-group sort-options">
                <label className={`btn btn--primary ${this.props.gridControls.sortBtn['date-updated']}`}>
                  <input
                    type="radio"
                    name="sort-value"
                    value="date-updated"
                    onClick={e => {
                      this.props.actions.setSort(e.target);
                      this.toggleControls('sort');
                      }
                    }
                  /> New
                </label>
                <label className={`btn btn--primary ${this.props.gridControls.sortBtn.title}`}>
                  <input
                    type="radio"
                    name="sort-value"
                    value="popular"
                    onClick={e => {
                      this.props.actions.setSort(e.target);
                      this.toggleControls('sort');
                      }
                    }
                  /> Popular
                </label>
              </div> :
              <div className="btn-group sort-options">
                <button className="btn btn--primary btn--single btn--sort" onClick={()=>this.toggleControls('sort')}>
                    <i className="fa fa-sort" aria-label="sort" />
                </button>
              </div>
            }
          </div>
          <div className="filters-group">
            <label className="form__label--white">Filter</label>
              <div className="btn-group sort-options">
                <button className="btn btn--primary btn--sort" onClick={()=>this.toggleFilters()}>
                  {this.props.appState.windowSize.width>675 &&
                    <span className="label-tiny">show </span> }
                    <i className="fa fa-filter" aria-label="show filter options" />
                </button>
                <button className="btn btn--primary btn--sort" onClick={()=> {this.props.actions.clearFilter();
                } }>
                  {this.props.appState.windowSize.width>675 &&
                  <span className="label-tiny">clear </span> }
                    <i className="fa fa-ban" aria-label="clear filters" />
                </button>
              </div>
          </div>
          <div className="filters-group">
            <label className="form__label--white">New</label>
            <div className="btn-group sort-options">
              <Link to="/editpost">
                <button className="btn btn--primary btn--single" aria-label="New Post">
                <i className="fa fa-edit" aria-label="new post" />
                {this.props.appState.windowSize.width>675 &&
                    <span className="label-tiny"> new post</span> }
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className={filterClass}>
          <button className="aria-button modal-close filters-group--close" onClick={()=>this.toggleFilters()} aria-label="Close Advanced Filters Box">&times;</button>
          <div className="filters-group--flush flex-col-12-xs flex-col-6-sm flex-col-4-md flex-col-2-xl">
            <label htmlFor="role" className="form__label--white">Role</label>
            <select
              className="form__input form__input--select-grid"
              id="role"
              name="role"
              value={this.props.gridControls.filterBtn.role}
              onChange={(e)=>this.props.actions.setFilter(e.target.id, e.target.value)}
            >
              <option disabled>Role</option>
              {rList}
            </select>
          </div>
          <div className="filters-group--flush flex-col-12-xs flex-col-6-sm flex-col-4-md flex-col-2-xl">
            <label htmlFor="language" className="form__label--white">Spoken Language</label>
            <InputAutosuggest
              id="language"
              className="form__input-grid"
              name="language"
              placeholder="Spoken Language"
              onChange={this.props.actions.setFilter}
              list={languages}
              value={this.props.gridControls.filterBtn.language}
              gridControls={true}
              ref={instance => { this.languageInput = instance; }}
            />
          </div>
          <div className="filters-group--flush flex-col-12-xs flex-col-6-sm flex-col-4-md flex-col-2-xl">
            <label htmlFor="keyword" className="form__label--white">Keyword</label>
            <InputAutosuggest
              id="keyword"
              className="form__input-grid"
              name="keyword"
              placeholder="Keyword"
              onChange={this.props.actions.setFilter}
              list={skills}
              value={this.props.gridControls.filterBtn.keyword}
              gridControls={true}
              ref={instance => { this.skillInput = instance; }}
            />
          </div>
          <div className="filters-group--flush flex-col-12-xs flex-col-6-sm flex-col-4-md flex-col-2-xl">
            <label htmlFor="timezone" className="form__label--white">Time Zone</label>
            <select
              className="form__input form__input--select-grid"
              id="timezone"
              name="timezone"
              value={this.props.gridControls.filterBtn.timezone}
              onChange={(e)=>this.props.actions.setFilter(e.target.id, e.target.value)}
            >
              <option disabled>Time zone</option>
              {tzList}
            </select>
          </div>
          <div className="filters-group--flush flex-col-12-xs flex-col-6-sm flex-col-4-md flex-col-2-xl">
            <label htmlFor="gender" className="form__label--white">Gender</label>
            <select
              className="form__input form__input--select-grid"
              id="gender"
              name="gender"
              value={this.props.gridControls.filterBtn.gender}
              onChange={(e)=>this.props.actions.setFilter(e.target.id, e.target.value)}
            >
              <option disabled>Gender</option>
              {gList}
            </select>
          </div>
          <div className="filters-group--flush flex-col-12-xs flex-col-6-sm flex-col-4-md flex-col-2-xl">
          <div className="btn-group sort-options filters-group--button-grid">
            <button
              className="btn btn--primary btn--smaller btn--grid"
              onClick={() => this.props.actions.runFilter()}>
              Apply <i className="fa fa-filter" aria-label="filter" />
            </button>
            <button
              className="btn btn--primary btn--smaller btn--grid"
              onClick={() => this.props.actions.clearFilter().then(console.log('PostGridControls.jsx > 105', this.props.gridControls.filterBtn))}>
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

const mapStateToProps = state => ({
  gridControls: state.gridControls,
  appState: state.appState,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostsGridControls);
