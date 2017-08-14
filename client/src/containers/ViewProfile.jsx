import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from '../store/actions/profileActions';
import * as apiActions from '../store/actions/apiActions';
import Spinner from './Spinner';
import Modal from './Modal';

class ViewProfile extends React.Component {

  componentWillMount() {
    const profileId = this.props.match.params.id;
    this.props.api.getProfile(this.props.appState.authToken, profileId);
    console.log('cWm got profile:');
    console.log('props:');
    console.log(this.props);
  }


  render() {
    let langDisp;
    let skillsDisp;
    if (this.props.profile.currentProfile.skills) {
      skillsDisp = this.props.profile.currentProfile.skills.join(', ');
    }
    if (this.props.profile.currentProfile.languages) {
       langDisp = this.props.profile.currentProfile.languages.join(', ');
    }

    return (
      <div className="view-profile">
        <Spinner cssClass={`${this.props.profile.profileSpinnerClass}`} />
        <Modal
          modalClass={`${this.props.profile.viewProfileModalClass}`}
          modalText={`${this.props.profile.viewProfileModalText}`}
          dismiss={() => this.props.actions.dismissViewProfileModal()}
        />
        <div className="view-preview">
          <div className="view-preview__image-wrap">
            {this.props.profile.currentProfile.avatarUrl ?
              <img className="view-preview__image" src={this.props.profile.currentProfile.avatarUrl} alt={this.props.profile.currentProfile.username} /> :
              <i className="fa fa-user-circle fa-5x view-preview__icon" aria-hidden="true" />
          }
          </div>
          <div className="view-preview__text-wrap">
            <div className="view-preview__username">{this.props.profile.currentProfile.username}</div>
            <div className="view-preview__text">{this.props.profile.currentProfile.name}</div>
            {this.props.profile.currentProfile.location &&
            <div className="view-preview__text">{this.props.profile.currentProfile.location}</div> }
            <div className="view-preview__text">
              <span className="view-preview__text--bold">Languages: &nbsp;</span>
              {langDisp ? langDisp : ''}
            </div>
            <div className="view-preview__text">
              <span className="view-preview__text--bold">Time zone: &nbsp;</span>
              {this.props.profile.currentProfile.time_zone}
            </div>
            {this.props.profile.currentProfile.gender &&
              <div className="view-preview__text">
                <span className="view-preview__text--bold">Gender: &nbsp;</span>
                {this.props.profile.currentProfile.gender}
              </div> }
            <div className="view-preview__text">
              <span className="view-preview__text--bold">Skills: &nbsp;</span>
              {skillsDisp ? skillsDisp : ''}
            </div>
            {this.props.profile.currentProfile.about &&
            <div className="view-preview__text">
              <span className="view-preview__text--bold">About me: &nbsp;</span>
              {this.props.profile.currentProfile.about}
            </div> }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  appState: state.appState,
  profile: state.profiles,
});

const mapDispatchToProps = dispatch => ({
  api: bindActionCreators(apiActions, dispatch),
  actions: bindActionCreators(Actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewProfile);
