import React from 'react';

import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from 'axios';
import * as Actions from '../store/actions';

class MentorPath extends React.Component {

  componentDidMount() {
    axios.get('/api/posts')
      .then((response) => {
        // future use
      })
      .catch((error) => {
        throw (error);
      });
  }

  profileComplete() {
    let valid = false;
    if (this.props.appState.profile.pref_lang !== '' && this.props.appState.profile.time_zone !== '' &&
      this.props.appState.profile.certs.length > 0) {
      valid = true;
    }
    return valid;
  }

  render() {
    // See if user has filled out required profile fields
    let profileDone = '';
    if (this.profileComplete()) {
      profileDone = ' splash__button-done';
    }

    return (
      <div className="splash">
        <div className="splash__image" />
        <div className="splash__wrapper">
          <h1 className="splash__headline" />
          <h2 className="splash__subhead">Become a guiding star</h2>

          <div className="splash__button-wrap">
            <Link to="/profile"className={`splash__button ${profileDone}`}>Complete Profile</Link>
            <Link to="/addpost" className="splash__button">Create an Ad</Link>
            <Link to="/posts" className="splash__button">Find a Mentee</Link>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  appState: state.appState,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(MentorPath);
