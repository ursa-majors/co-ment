import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import * as Actions from '../store/actions/tourActions';


const About = props => (
  <div className="tour">
    <div className="tour__slide">
      <div className="tour__slide-header">
        {props.tour.slides[props.tour.imageIndex].title}
        {/* Dot-controls for carousel */}
        <div className="tour__controls">
          {
            props.tour.slides.map((slide, index) => {
              const active = (props.tour.imageIndex === index ? '-active' : '');
              return (
                <div
                  className={`tour__dot${active}`}
                  key={slide.slideId}
                  id={index}
                  onClick={(e) => { props.actions.setIndex(parseInt(e.target.id, 10)); }}
                >
                  <i className="fa fa-circle" id={index} />
                </div>
              );
            })
          }
        </div>
        <div className="tour__chevron-left">
          <i
            className="fa fa-chevron-left"
            onClick={
              () => {
                let newIndex = props.tour.imageIndex - 1;
                if (newIndex < 0) {
                  newIndex = props.tour.slides.length - 1;
                }
                props.actions.setIndex(newIndex);
              }
            }
          />
        </div>
        <div className="tour__chevron-right">
          <i
            className="fa fa-chevron-right"
            onClick={
              () => {
                let newIndex = props.tour.imageIndex + 1;
                if (newIndex > props.tour.slides.length - 1) {
                  newIndex = 0;
                }
                props.actions.setIndex(newIndex);
              }
            }
          />
        </div>
      </div>
      <div className="tour__slide-content">
        <div className="tour__slide-text" dangerouslySetInnerHTML={props.tour.slides[props.tour.imageIndex]}>
        </div>
        <div className="tour__image">
          <img src={`${props.tour.slides[props.tour.imageIndex].image}`} alt={props.tour.slides[props.tour.imageIndex].imageAlt} />
        </div>
      </div>
    </div>
    <div className="faq">
      <div className="faq__header">
        FAQ
      </div>
      {props.tour.faq.map(question => (
        <div key={question.id}>
          <div
            className="faq__question"
            onClick={
              () => {
                const el = document.getElementById(`${question.id}-answer`)
                const classes = el.classList
                console.log(classes)
                if (classes.contains('faq__answer-expanded')) {
                  console.log('removing')
                  el.classList.remove('faq__answer-expanded')
                } else {
                  console.log('adding')
                  el.classList.add('faq__answer-expanded')
                }
              }
            }
          >
            {question.question}
          </div>
          <div id={`${question.id}-answer`} className="faq__answer ">
            {question.answer}
          </div>
        </div>
      ))}
    </div>
  </div>
);

About.propTypes = {
  tour: PropTypes.shape({
    imageIndex: PropTypes.Number,
    slides: PropTypes.Array,
  }).isRequired,
  actions: PropTypes.shape({
    setIndex: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({
  tour: state.tour,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(About);
