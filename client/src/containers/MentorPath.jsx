import React from 'react';

import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as apiActions from '../store/actions/apiActions';

class MentorPath extends React.Component {

  componentDidMount() {
    this.props.api.getPost( this.props.appState.authToken, this.props.appState.profile._id, 'mentor')
  }

  profileComplete() {
    let valid = false;
    if (this.props.appState.profile.languages.length > 0 && this.props.appState.profile.time_zone !== '' &&
      this.props.appState.profile.skills.length > 0  && this.props.appState.profile.validated) {
      valid = true;
    }
    return valid;
  }

  render() {
    // See if user has filled out required profile fields
    let profileDone = '';
    let postDone = '';
    let menteeFound = '';

    if (this.profileComplete()) {
      profileDone = 'mentor__button-done';
    }
    // ComponentDidMount tried to load a mentor post.  If found, this is true
    if (this.props.posts.searchPost) {
      postDone = 'mentor__button-done';
    }

    return (
      <div className="splash">
        <div className="splash__image" />
        <div className="mentor__mentor-path">
          <h1 className="splash__headline" />
          <h2 className="splash__subhead">Become a guiding star</h2>

          <div className="mentor__button-wrap">
            <Link to="/profile"className={`mentor__button ${profileDone}`}>
              Build Profile
            </Link>
            <Link to="/editpost" className={`mentor__button ${postDone}`}>
              Create Ad
            </Link>
            <Link to="/posts" className={`mentor__button ${menteeFound}`}>
              Find Mentee
            </Link>
          </div>

        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  appState: state.appState,
  posts: state.posts,
});

const mapDispatchToProps = dispatch => ({
  api: bindActionCreators(apiActions, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(MentorPath);
