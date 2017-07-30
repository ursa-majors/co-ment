import React from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../store/actions';


// eslint freaks out about "useless constructors" and won't let me commit...
// so i'm commenting out the constructor out until we add some state to this thing

// class Home extends React.Component {
//   constructor(props) {
//     super(props);
//   }
// render() {
//     console.log(this.props.appState);
    // return (
const Home = () => (
  <div className="splash">
    <div className="splash__image" />
    <div className="splash__wrapper">
      <div className="splash__text-wrap">
        <h1 className="splash__headline">co&#47;ment</h1>
        <h2 className="splash__subhead">find your guiding star</h2>
      </div>
      <div className="splash__button-wrap">
        <Link to="/mentors" className="splash__button">Find a Mentor</Link>
        <Link to="/mentees" className="splash__button">Be a Mentor</Link>
      </div>
    </div>
    <div className="splash__overlay">
      <div className="splash__bracket--l" />
      <p className="splash__body">
        <span className="splash__body--spaced">co/ment:</span> a unique matchmaking service for mentors and mentees. Find the perfect guide for your coding journey.
          </p>
      <div className="splash__bracket--r" />
    </div>
  </div>
    );
//   }
// }

const mapStateToProps = state => ({
  appState: state.appState,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Home);
