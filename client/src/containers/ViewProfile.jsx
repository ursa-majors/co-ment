import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';

import * as apiActions from '../store/actions/apiActions';

class ViewProfile extends React.Component {

  componentDidMount() {
    // const profileId = this.props.match.params.id;
    // // axios default headers
    // axios.defaults.baseURL = 'https://co-ment.glitch.me';
    // axios.defaults.headers.common.Authorization = `Bearer ${this.props.appState.authToken}`;
    // axios.get(`/api/profile/${profileId}`)
    //   .then((result) => {
    //     this.setState({ profile: result.data });
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    // this.props.api.getProfile(this.props.appState.authToken, this.props.appState.profile._id);
    console.log(this.props);
  }


  render() {
    let langDisp;
    let skillsDisp;
    if (this.props.appState.profile.skills && this.props.appState.profile.languages) {
       skillsDisp = this.props.appState.profile.skills.join(', ');
       langDisp = this.props.appState.profile.languages.join(', ');
    }

    return (
      <div className="view-profile">
        <div className="view-preview">
          <div className="view-preview__image-wrap">
            {this.props.appState.profile.avatarUrl ?
              <img className="view-preview__image" src={this.props.appState.profile.avatarUrl} alt={this.props.appState.profile.username} /> :
              <i className="fa fa-user-circle fa-5x view-preview__icon" aria-hidden="true" />
          }
          </div>
          <div className="view-preview__text-wrap">
            <div className="view-preview__username">{this.props.appState.profile.username}</div>
            <div className="view-preview__text">{this.props.appState.profile.name}</div>
            <div className="view-preview__text">
              <span className="view-preview__text--bold">Languages: &nbsp;</span>
              {langDisp ? langDisp : ''}
            </div>
            <div className="view-preview__text">
              <span className="view-preview__text--bold">Time zone: &nbsp;</span>
              {this.props.appState.profile.time_zone}
            </div>
            <div className="view-preview__text">
              <span className="view-preview__text--bold">Gender: &nbsp;</span>
              {this.props.appState.profile.gender}
            </div>
            <div className="view-preview__text">
              <span className="view-preview__text--bold">Skills: &nbsp;</span>
              {skillsDisp ? skillsDisp : ''}
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
  api: bindActionCreators(apiActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewProfile);
