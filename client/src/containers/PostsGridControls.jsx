import React from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../store/actions/gridControlActions';

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
        <label htmlFor="filter-options" className="form__label--white">Filter</label>
        <div className="btn-group filter-options" id="filter-options">
          <button
            className={`btn btn--primary ${props.gridControls.filterBtn.mentor}`}
            data-group="mentor"
            id="mentor"
            onClick={e => props.actions.setFilter(e.target)}
          >
            Mentors
          </button>
          <button
            className={`btn btn--primary ${props.gridControls.filterBtn.mentee}`}
            data-group="mentee"
            id="mentee"
            onClick={e => props.actions.setFilter(e.target)}
          >
            Mentees
          </button>
        </div>
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
  </div>
);

const mapStateToProps = state => ({
  gridControls: state.gridControls,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostsGridControls);
