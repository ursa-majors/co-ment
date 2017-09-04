import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from '../store/actions/tourActions';

const About = props => (
  <div className="container">
    <h2 className="tour-title">About</h2>
    <div className="tour">
      <div className="tour__slide">
        <div className="tour__slide-header">
          {props.tour.slides[props.tour.imageIndex].title}
        </div>
        <div>
          <img className="tour__image" src={props.tour.slides[props.tour.imageIndex].image} />
        </div>
      </div>
      {/* Dot-controls for carousel */}
      <div className="tour__controls">
        {
          props.tour.slides.map((slide,index) => {
            return (
              <div
                className="tour__dot"
                key={slide+index}
                id={index}
                onClick={(e) => { props.actions.setIndex(e.target.id); }}
              >
                <i className="fa fa-circle" id={index}/>
              </div>
            );
          })
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
