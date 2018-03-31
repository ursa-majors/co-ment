import React from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getPost } from '../store/actions/apiPostActions';
import { getConnections } from '../store/actions/apiConnectionActions';
import { setFilter, runFilter } from '../store/actions/gridControlActions';
import * as Actions from '../store/actions/postActions';

class MentorPath extends React.Component {

  componentDidMount() {
    this.props.api.getPost(this.props.appState.authToken, this.props.appState.user._id, 'mentor')
      .then(() => {
        this.props.api.getConnections(this.props.appState.authToken);
      });
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
    let menteeFound = '';

    // See if user has filled out required profile fields
    if (this.profileComplete()) {
      profileDone = 'mentor__button-done';
    }

    // ComponentDidMount tried to load a mentor post.  If found, this is true
    if (this.props.posts.searchPost) {
      postDone = 'mentor__button-done';
    }

    // ComponentDidMount tried to load connections.  Does this user already have a Mentee?
    const conns = this.props.connection.connections;
    for (let i = 0; i < conns.length; i += 1) {
      if (conns[i].mentor.id === this.props.appState.user._id &&
          (conns[i].status === 'pending' || conns[i].status === 'accepted')) {
        menteeFound = 'mentor__button-done';
      }
    }

    // Highlight the next step on the Mentor Path
    if (profileDone === '') {
      profileDone = 'mentor-starting';
    } else if (postDone === '') {
      postDone = 'mentor-starting';
    } else if (menteeFound === '') {
      menteeFound = 'mentor-starting';
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
            <button
              className={`mentor__button aria-button ${menteeFound}`}
              onClick={
                () => {
                  this.props.actions.setFilter('role', 'Mentee');
                  this.props.actions.runFilter();
                  this.props.history.push('/posts');
                }
              }
            >
              Find Mentee
            </button>
          </div>

        </div>
      </div>
    );
  }
}

MentorPath.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  appState: PropTypes.shape({
    authToken: PropTypes.string,
    user: PropTypes.shape({
      _id: PropTypes.string,
    }),
  }).isRequired,
  posts: PropTypes.shape({
    searchPost: PropTypes.object,
  }).isRequired,
  profiles: PropTypes.shape({
    userProfile: PropTypes.object,
  }).isRequired,
  connection: PropTypes.shape({
    connections: PropTypes.array,
  }).isRequired,
  actions: PropTypes.shape({
    setSearchCriteria: PropTypes.func,
    setFilter: PropTypes.func,
    runFilter: PropTypes.func,
  }).isRequired,
  api: PropTypes.shape({
    getPost: PropTypes.func,
    getConnections: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({
  appState: state.appState,
  posts: state.posts,
  profiles: state.profiles,
  connection: state.connection,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ Actions, setFilter, runFilter }, dispatch),
  api: bindActionCreators({ getPost, getConnections }, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(MentorPath);
