import React from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as apiActions from '../store/actions/apiPostActions';
import * as Actions from '../store/actions/postActions';

const searchObj = {
  role: 'mentee',
  title: '',
  author: '',
  keywords: [],
};

class MentorPath extends React.Component {

  componentDidMount() {
    this.props.api.getPost(this.props.appState.authToken, this.props.appState.userId, 'mentor');
  }

  profileComplete() {
    let valid = false;
    if (this.props.profiles.userProfile.languages.length > 0 &&
        this.props.profiles.userProfile.time_zone !== '' &&
        this.props.profiles.userProfile.skills.length > 0 &&
        this.props.profiles.userProfile.validated) {
      valid = true;
    }
    return valid;
  }

  render() {
    let profileDone = '';
    let postDone = '';
    const menteeFound = '';

    // See if user has filled out required profile fields
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
          <h2 className="splash__subhead">Become a guiding star</h2>

          <div className="mentor__button-wrap">
            <Link
              to="/profile"
              className={`mentor__button ${profileDone}`}
            >
              Build Profile
            </Link>
            <Link
              to="/editpost"
              className={`mentor__button ${postDone}`}
            >
              Create Ad
            </Link>
            <Link
              to="/posts"
              className={`mentor__button ${menteeFound}`}
              onClick={() => { this.props.actions.setSearchCriteria(searchObj); }}
            >
              Find Mentee
            </Link>
          </div>

        </div>
      </div>
    );
  }
}

MentorPath.propTypes = {
  appState: PropTypes.shape({
    authToken: PropTypes.String,
    userId: PropTypes.String,
  }).isRequired,
  posts: PropTypes.shape({
    searchPost: PropTypes.object,
  }).isRequired,
  profiles: PropTypes.shape({
    userProfile: PropTypes.object,
  }).isRequired,
  actions: PropTypes.shape({
    setSearchCriteria: PropTypes.func,
  }).isRequired,
  api: PropTypes.shape({
    getPost: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({
  appState: state.appState,
  posts: state.posts,
  profiles: state.profiles,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiActions, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(MentorPath);
