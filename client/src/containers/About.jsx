import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from '../store/actions/tourActions';

const About = props => (
  <div className="container">
    <h2 className="tour-title">About</h2>
    <div className="tour">
      <div className="tour__image">
        {props.tour.images[props.tour.imageIndex]}
      </div>
      <div className="tour__controls">
        {
          props.tour.images.map((image,index) => (
            <div className="tour__dot" key={image+index} onClick={(index) => {props.actions.setIndex(index)}}>
              <i className="fa fa-circle" />
            </div>
          ))
        }
      </div>
    </div>
  </div>
);

const mapStateToProps = state => ({
  tour: state.tour,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(About);
