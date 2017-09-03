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

const PostsGridControls = props => (
  <div className="posts-grid__controls">
    <div className="flex-row">
      <div className="filters-group">
        <label htmlFor="filters-search-input" className="form__label--white">Search</label>
        <input
          className="form__input form__input--search filter__search js-shuffle-search"
          type="search"
          id="filters-search-input"
          placeholder="Search..."
          onKeyUp={e => props.actions.setSearchText(e.target.value)}
        />
      </div>
      <div className="filters-group">
        <label className="form__label--white">Sort</label>
        <div className="btn-group sort-options">
          <label className={`btn btn--primary ${props.gridControls.sortBtn.title}`}>
            <input
              type="radio"
              name="sort-value"
              value="title"
              onClick={e => props.actions.setSort(e.target)}
            /> Title
          </label>
          <label className={`btn btn--primary ${props.gridControls.sortBtn['date-updated']}`}>
            <input
              type="radio"
              name="sort-value"
              value="date-updated"
              onClick={e => props.actions.setSort(e.target)}
            /> Date Updated
          </label>
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
    <div className="flex-row posts-grid__adv-filter-wrap">
      <label htmlFor="filters-adv-filter" className="form__label--white">Advanced Filter</label>
      <div className="filters-group flex-col-12-xs flex-col-6-sm flex-col-4-md flex-col-3-lg flex-col-2-xl">
        <label htmlFor="fole" className="form__label--white">Role</label>
        <select
          className="form__input form__input--select"
          id="role"
          name="role"
          value={props.gridControls.filterBtn.role}
          onChange={(e)=>props.actions.setFilter(e.target.id, e.target.value)}
        >
          <option disabled>Role</option>
          {rList}
        </select>
      </div>
      <div className="filters-group flex-col-12-xs flex-col-6-sm flex-col-4-md flex-col-3-lg flex-col-2-xl">
        <label htmlFor="language" className="form__label--white">Spoken Language</label>
        <InputAutosuggest
          id="language"
          name="language"
          placeholder="Spoken Language"
          onChange={props.actions.setFilter}
          list={languages}
          value={props.gridControls.filterBtn.language}
          gridControls={true}
          ref={instance => { this.languageInput = instance; }}
        />
      </div>
      <div className="filters-group flex-col-12-xs flex-col-6-sm flex-col-4-md flex-col-3-lg flex-col-2-xl">
        <label htmlFor="keyword" className="form__label--white">Keyword</label>
        <InputAutosuggest
          id="keyword"
          name="keyword"
          placeholder="Keyword"
          onChange={props.actions.setFilter}
          list={skills}
          value={props.gridControls.filterBtn.keyword}
          gridControls={true}
          ref={instance => { this.skillInput = instance; }}
        />
      </div>
      <div className="filters-group flex-col-12-xs flex-col-6-sm flex-col-4-md flex-col-3-lg flex-col-2-xl">
        <label htmlFor="timezone" className="form__label--white">Time Zone</label>
        <select
          className="form__input form__input--select"
          id="timezone"
          name="timezone"
          value={props.gridControls.filterBtn.timezone}
          onChange={(e)=>props.actions.setFilter(e.target.id, e.target.value)}
        >
          <option disabled>Time zone</option>
          {tzList}
        </select>
      </div>
      <div className="filters-group flex-col-12-xs flex-col-6-sm flex-col-4-md flex-col-3-lg flex-col-2-xl">
        <label htmlFor="gender" className="form__label--white">Gender</label>
        <select
          className="form__input form__input--select"
          id="gender"
          name="gender"
          value={props.gridControls.filterBtn.gender}
          onChange={(e)=>props.actions.setFilter(e.target.id, e.target.value)}
        >
          <option disabled>Gender</option>
          {gList}
        </select>
      </div>
      <div className="filters-group flex-col-12-xs flex-col-6-sm flex-col-4-md flex-col-3-lg flex-col-2-xl">
        <button
          onClick={() => props.actions.runFilter()}>
          Filter!
        </button>
        <button
          onClick={() => props.actions.clearFilter().then(console.log('PostGridControls.jsx > 105', props.gridControls.filterBtn))}>
          Clear Filters
        </button>
      </div>
    </div>
  </div>
);

const mapStateToProps = state => ({
  gridControls: state.gridControls,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostsGridControls);
