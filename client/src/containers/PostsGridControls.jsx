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
    };
  }

  componentDidMount() {
    // fix style on autosuggest inputs
    const autosug = document.getElementsByClassName('react-autosuggest__input');
    for ( let i=0; i < autosug.length; i++ ) {
      autosug[i].classList.add("form__input-grid");
    }
  }

  toggleFilters = () => {
    const newState = { ...this.state }
    newState.showFilters = !this.state.showFilters;
    this.setState({ ...newState });
  }

  render() {
    const filterClass = this.state.showFilters ? "flex-row posts-grid__adv-filter-wrap" : "hidden";
    console.log(this.props.gridControls.filterGroup);
    let filtersAppliedList;
    if (this.props.gridControls.filterGroup === 'all') {
      filtersAppliedList = "No Filters Applied"
    } else {
      filtersAppliedList = this.props.gridControls.filterGroup.map(filter => (
        <span className="posts-grid__filter-item" key={filter}>{filter}</span>
        ));
    }

    return (
      <div className="posts-grid__controls">
        <div className="flex-row no-wrap">
          <div className="filters-group">
            <label htmlFor="filters-search-input" className="form__label--white">Search</label>
            <input
              className="form__input form__input--search filter__search js-shuffle-search"
              type="search"
              id="filters-search-input"
              placeholder="Search..."
              onKeyUp={e => this.props.actions.setSearchText(e.target.value)}
            />
          </div>
          <div className="filters-group">
            <label className="form__label--white">Sort</label>
            <div className="btn-group sort-options">
              <label className={`btn btn--primary ${this.props.gridControls.sortBtn['date-updated']}`}>
                <input
                  type="radio"
                  name="sort-value"
                  value="date-updated"
                  onClick={e => this.props.actions.setSort(e.target)}
                /> New
              </label>
              <label className={`btn btn--primary ${this.props.gridControls.sortBtn.title}`}>
                <input
                  type="radio"
                  name="sort-value"
                  value="popular"
                  onClick={e => this.props.actions.setSort(e.target)}
                /> Popular
              </label>
            </div>
          </div>
          <div className="filters-group">
            <label className="form__label--white">Filter</label>
            <div className="btn-group sort-options">
              <button className="btn btn--primary" onClick={()=>this.toggleFilters()}>
                <span className="label-tiny">show </span>
                {this.props.appState.width>675 &&
                  <i className="fa fa-filter" aria-label="show filter options" /> }
              </button>
              <button className="btn btn--primary" onClick={()=>this.props.actions.clearFilter()}>
                <span className="label-tiny">clear </span>
                {this.props.appState.width>675 &&
                  <i className="fa fa-filter" aria-label="clear filters" /> }
              </button>
            </div>
          </div>
          <div className="filters-group filters-group__btn">
            <div className="posts-grid__button-wrap">
              <Link to="/editpost">
                <button className="posts-grid__button pointer" aria-label="New Post" >
                  <span className="posts-grid__btn--big">New Post</span>
                  <span className="posts-grid__btn--sm">+</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex-row">
          <div className="posts-grid__filters-applied">
          {filtersAppliedList !== "No Filters Applied" ?
            <span>Filtered by: </span> : ''}
            {filtersAppliedList}
          </div>
        </div>
        <div className={filterClass}>
          <button className="aria-button modal-close filters-group--close" onClick={()=>this.toggleFilters()} aria-label="Close Advanced Filters Box">&times;</button>
          <div className="filters-group--flush flex-col-12-xs flex-col-4-sm flex-col-3-md flex-col-2-lg">
            <label htmlFor="fole" className="form__label--white">Role</label>
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
          <div className="filters-group--flush flex-col-12-xs flex-col-4-sm flex-col-3-md flex-col-2-lg">
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
          <div className="filters-group--flush flex-col-12-xs flex-col-4-sm flex-col-3-md flex-col-2-lg">
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
          <div className="filters-group--flush flex-col-12-xs flex-col-4-sm flex-col-3-md flex-col-2-lg">
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
          <div className="filters-group--flush flex-col-12-xs flex-col-4-sm flex-col-3-md flex-col-2-lg">
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
          <div className="filters-group--flush flex-col-12-xs flex-col-4-sm flex-col-3-md flex-col-2-lg">
          <div className="btn-group sort-options filters-group--button">
            <button
              className="btn btn--primary btn--smaller"
              onClick={() => this.props.actions.runFilter()}>
              Apply <i className="fa fa-filter" aria-label="filter" />
            </button>
            <button
              className="btn btn--primary btn--smaller"
              onClick={() => this.props.actions.clearFilter().then(console.log('PostGridControls.jsx > 105', this.props.gridControls.filterBtn))}>
              Clear <i className="fa fa-filter" aria-label="filter" />
            </button>
            </div>
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
