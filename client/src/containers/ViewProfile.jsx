import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import * as Actions from '../store/actions/profileActions';
import * as apiActions from '../store/actions/apiActions';
import Spinner from './Spinner';
import Modal from './Modal';

class ViewProfile extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      tab: 'skills',
      flip: false,
    };
  }

  componentDidMount() {
    // copy requested profile data into currentProfile
    const profileId = this.props.match.params.id;
    this.props.api.getProfile(this.props.appState.authToken, profileId);
  }

  onClick(e) {
    // handle tab navigation in bottom half of profile card
    const newState = { ...this.state };
    newState.tab = e.target.id;
    this.setState({
      ...newState,
    })
  }

  flip() {
    // handle card flip front/back
    const newState = { ...this.state };
    newState.flip = !this.state.flip;
    this.setState({
      ...newState,
    })
  }


  render() {
    let langDisp;
    let skillsDisp;
    let smDisp;
    let smArr = [];
    const { skills, languages, twitter, facebook, link, linkedin, codepen, ghProfile } = this.props.profile.currentProfile;
    // render skills tags for profile card
    if (skills) {
      skillsDisp = this.props.profile.currentProfile.skills.map(skill => (
                  <span className="tag-value" key={skill}>
                    <span className="tag-value__label">
                      {skill}
                    </span>
                  </span>
                 ));
    }
    // render language tags for profile card
    if (languages) {
       langDisp = this.props.profile.currentProfile.languages.map(lang => (
                  <span className="tag-value" key={lang}>
                    <span className="tag-value__label">
                      {lang}
                    </span>
                  </span>
                 ));
    }
    // generate a 2d array of social media links
    if (ghProfile) { smArr.push([ 'github', ghProfile.html_url ]); }
    if (twitter) { smArr.push([ 'twitter', twitter]); }
    if (facebook) { smArr.push([ 'facebook', facebook]); }
    if (link) { smArr.push([ 'link', link]); }
    if (linkedin) { smArr.push([ 'linkedin', linkedin]); }
    if (codepen) { smArr.push([ 'codepen', codepen]); }
    // render social media icons & links for profile card
    smDisp = smArr.map(sm => (
                <span className="view-preview__icon--sm-wrap" key={sm[0]}>
                  <a
                    href={sm[1]}
                    rel="noopener noreferrer"
                    target="_blank"
                    className={`view-preview__icon--sm view-preview__icon--${sm[0]}`}>
                    <i className={`fa fa-${sm[0]}`} aria-hidden="true" />
                  </a>
                  </span>
               ));
    // placeholder for empty bio field:
    let aboutText;
    if (!this.props.profile.currentProfile.about) {
        aboutText = 'This user has not yet added a bio.';
    } else {
      aboutText = this.props.profile.currentProfile.about;
    }

    return (
      <div className="view-profile">
        <Spinner cssClass={`${this.props.profile.profileSpinnerClass}`} />
        <Modal
          modalClass={`${this.props.profile.viewProfileModalClass}`}
          modalText={`${this.props.profile.viewProfileModalText}`}
          dismiss={() => this.props.actions.dismissViewProfileModal()}
        />
        {this.props.profile.getSuccess &&
          <div className="view-preview">
            <div className={this.state.flip ? "side front flip" : "side front"} id="front">
            { this.props.appState.userId === this.props.match.params.id &&
              <Link
                className="view-preview__edit"
                to={'/profile'} >
                <i className="fa fa-pencil view-preview__icon--edit" aria-hidden="true" />
              </Link> }
              <div className="view-preview__image-wrap">
                {this.props.profile.currentProfile.avatarUrl ?
                  <img
                    className="view-preview__image"
                    src={this.props.profile.currentProfile.avatarUrl}
                    alt={this.props.profile.currentProfile.username} /> :
                  <i className="fa fa-user-circle fa-5x view-preview__icon--avatar" aria-hidden="true" /> }
              </div>
              <div className="view-preview__text-wrap view-preview__card-top">
                <div className="view-preview__name">{this.props.profile.currentProfile.name}</div>
                <div className="view-preview__username">@{this.props.profile.currentProfile.username}</div>
                {this.props.profile.currentProfile.location &&
                  <div className="view-preview__location-wrap">
                    <i className="fa fa-map-marker view-preview__icon--location" aria-hidden="true" />
                    <span className="view-preview__location">{this.props.profile.currentProfile.location} &bull; {this.props.profile.currentProfile.time_zone}</span>
                  </div>}
              </div>
              <div className="view-preview__card-nav">
                <div
                  className={this.state.tab === 'skills' ? 'view-preview__card-nav-item view-preview__card-nav-item--active' : 'view-preview__card-nav-item'}
                  name='skills'
                  onClick={e => this.onClick(e)}
                  >
                  <i className="fa fa-code view-preview__icon--nav" aria-hidden="true" />
                  <span
                    className={this.state.tab === 'skills' ? 'view-preview__card-nav-item-text--active' : 'view-preview__card-nav-item-text'}
                    id='skills'>Skills</span>
                </div>
                <div
                  className={this.state.tab === 'languages' ? 'view-preview__card-nav-item view-preview__card-nav-item--active' : 'view-preview__card-nav-item'}
                  name='languages'
                  onClick={e => this.onClick(e)}>
                  <i className="fa fa-commenting-o view-preview__icon--nav" aria-hidden="true" />
                  <span className={this.state.tab === 'languages' ? 'view-preview__card-nav-item-text--active' : 'view-preview__card-nav-item-text'}
                  id='languages'>Languages</span>
                </div>
                <div
                  className={this.state.tab === 'about' ? 'view-preview__card-nav-item view-preview__card-nav-item--active' : 'view-preview__card-nav-item'}
                  name='about'
                  onClick={e => this.flip()}>
                  <i className="fa fa-user view-preview__icon--nav" aria-hidden="true" />
                  <span className={this.state.tab === 'about' ? 'view-preview__card-nav-item-text--active' : 'view-preview__card-nav-item-text'}
                  id='about'>About</span>
                </div>
              </div>
              <div className="view-preview__card-body">
                {this.state.tab === 'skills' &&
                  <div className="tag-value__wrapper">
                    {skillsDisp ? skillsDisp : ''}
                  </div>}
                {this.state.tab === 'languages' &&
                  <div className="tag-value__wrapper">
                    {langDisp ? langDisp : ''}
                  </div>}
                {this.state.tab === 'about' &&
                  this.props.profile.currentProfile.about &&
                  <div className="tag-value__wrapper">
                    {this.props.profile.currentProfile.about }
                  </div>}
              </div>
              <div className="view-preview__card-footer">
                {smDisp ? smDisp : ''}
              </div>
            </div>
              <div className={this.state.flip ? "side back flip" : "side back"} id="back">
                <div className="view-preview__text-wrap view-preview__card-top">
                  <div className="view-preview__name">{this.props.profile.currentProfile.name}</div>
                  <div className="view-preview__username">@{this.props.profile.currentProfile.username}</div>
                </div>
                <div className="view-preview__about-wrap">
                  {aboutText}
                </div>
                <div className="view-preview__card-footer--back">
                  <div
                    className='view-preview__card-nav-item--flip'
                    name='flip'
                    onClick={e => this.flip()}>
                    <i className="fa fa-refresh view-preview__icon--flip" aria-hidden="true" />
                  </div>
                </div>
              </div>
          </div>
        }
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
