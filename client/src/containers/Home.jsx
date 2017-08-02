import React from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from 'axios';
import * as Actions from '../store/actions';

class Home extends React.Component {

  componentDidMount() {
    // If we're not logged in, check local storage for authToken
    // if it doesn't exist, it returns the string "undefined"
    if (!this.props.appState.loggedIn) {
      const token = window.localStorage.getItem('authToken');
      if (token && token !== 'undefined') {
        const user = window.localStorage.getItem('userId');
        axios.get(`https://co-ment.glith.me/api/profile/${user}`, {
          headers: {
            Authorization: `Bearer ${this.props.appState.authToken}`,
          },
        })
        .then((response) => {
          this.props.actions.login(response.data.token, response.data.profile);
        })
        .catch((error) => {
          this.props.actions.logout();
        });
      }
    }
  }

  render() {
    let links;
    if (this.props.appState.loggedIn) {
      links = (
        <div className="splash__button-wrap">
          <Link to="/about"className="splash__button">Find a Mentor</Link>
          <Link to="/about" className="splash__button">Be a Mentor</Link>
        </div>
      );
    } else {
      links = (
        <div className="splash__button-wrap">
          <Link to="/register"className="splash__button">Register</Link>
          <Link to="/login" className="splash__button">Login</Link>
        </div>
      );
    }

    return (
      <div className="splash">
        <div className="splash__image" />
        <div className="splash__wrapper">
          <div className="splash__text-wrap">
            <h1 className="splash__headline">co&#47;ment</h1>
            <h2 className="splash__subhead">find your guiding star</h2>
          </div>

          {links}

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
  }
}
//   }
// }

const mapStateToProps = state => ({
  appState: state.appState,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Home);
