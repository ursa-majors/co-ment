import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import * as Actions from '../store/actions';

class Profile extends React.Component {

  componentWillMount() {
    axios.get(`https://co-ment.glitch.me/api/profile/${this.props.appState.userID}`, {
      headers: {
        Authentication: `Bearer ${this.props.appState.authToken}`,
      },
    })
    .then((response) => {
      console.log('response', response);
    });
  }

  render() {
    return (
      <div className="container">
        <h1>Hello</h1>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  appState: state.appState,
  profile: state.profile,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
