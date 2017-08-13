import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';

import * as Actions from '../store/actions/profileActions';
import * as apiActions from '../store/actions/apiActions';
import Loading from './Loading';

class ViewProfile extends React.Component {

  componentWillMount() {
    const profileId = this.props.match.params.id;
    this.props.api.getProfile(this.props.appState.authToken, profileId);
    console.log('cWm got profile:');
    console.log(this.props.appState.profile);
    console.log('props:');
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
            {this.props.appState.profile.location &&
            <div className="view-preview__text">{this.props.appState.profile.location}</div> }
            <div className="view-preview__text">
              <span className="view-preview__text--bold">Languages: &nbsp;</span>
              {langDisp ? langDisp : ''}
            </div>
            <div className="view-preview__text">
              <span className="view-preview__text--bold">Time zone: &nbsp;</span>
              {this.props.appState.profile.time_zone}
            </div>
            {this.props.appState.profile.gender &&
              <div className="view-preview__text">
                <span className="view-preview__text--bold">Gender: &nbsp;</span>
                {this.props.appState.profile.gender}
              </div> }
            <div className="view-preview__text">
              <span className="view-preview__text--bold">Skills: &nbsp;</span>
              {skillsDisp ? skillsDisp : ''}
            </div>
            {this.props.appState.profile.about &&
            <div className="view-preview__text">
              <span className="view-preview__text--bold">About me: &nbsp;</span>
              {this.props.appState.profile.about}
            </div> }
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
