import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';

import * as Actions from '../store/actions';

class ViewProfile extends React.Component {

  constructor(props) {
     super(props);
     this.state = {
      profile: {}
      }
    }

  componentDidMount(){
    const profileId = this.props.match.params.id;
    console.log(profileId);
    //axios default headers
    axios.defaults.baseURL = 'https://co-ment.glitch.me';
    axios.defaults.headers.common['Authorization'] = `Bearer ${this.props.appState.authToken}`;
    axios.get(`/api/profile/${profileId}`)
      .then((result) => {
        this.setState({ profile: result.data });
       })
      .catch((error) => {
        console.log(error);
      });
  }


  render() {
    const skillsDisp = this.state.profile.certs ?
    this.state.profile.certs.join(', ') : '';

    return (
      <div className="profile">
        <div className="preview">
          <div className="preview__image-wrap">
          {this.state.profile.ghProfile && this.state.profile.ghProfile.avatar_url ?
            <img className="preview__image" src={this.state.profile.ghProfile.avatar_url } alt={this.state.profile.ghProfile.name}/> :
            <i className="fa fa-user-circle fa-5x preview__icon" aria-hidden="true"></i>
          }
          </div>
          <div className="preview__text-wrap">
            <div className="preview__username">{this.state.profile.username}</div>
            {this.state.profile.ghProfile && <div className="preview__text">{this.state.profile.ghProfile.name}</div> }
            <div className="preview__text">
              <span className="preview__text--bold">Language: &nbsp;</span>
               {this.state.profile.pref_lang}
            </div>
            <div className="preview__text">
              <span className="preview__text--bold">Time zone: &nbsp;</span>
               {this.state.profile.time_zone}
            </div>
            <div className="preview__text">
              <span className="preview__text--bold">Skills: &nbsp;</span>
              <ul className="preview__skill-list">{skillsDisp}</ul>
            </div>

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

export default connect(mapStateToProps, mapDispatchToProps)(ViewProfile);
