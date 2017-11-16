import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import * as Actions from '../store/actions/profileActions';
import * as apiActions from '../store/actions/apiActions';
import Spinner from './Spinner';
import ModalSm from './ModalSm';

class ViewProfile extends React.Component {

  static adjustCardHeight() {
    // expand card height to fit content without scrollbar
    const el1 = document.getElementById('back');
    let adjustedHeight1 = el1.clientHeight;
    adjustedHeight1 = Math.max(el1.scrollHeight, adjustedHeight1);
    if (adjustedHeight1 > el1.clientHeight) { el1.style.height = `${adjustedHeight1}px`; }
  }

  constructor(props) {
    super(props);

    this.state = {
      tab: 'skills',
      flip: false,
      thumb: false,
    };
  }

  componentDidMount() {
    // copy requested profile data into currentProfile
    let profileId;
    if (this.props.match && this.props.match.params.id) {
      profileId = this.props.match.params.id;
    } else {
      profileId = this.props.appState.user._id;
      console.log(profileId);
    }
    this.props.api.getProfile(this.props.appState.authToken, profileId);
  }

  onClick(e) {
    // handle tab navigation in bottom half of profile card
    const newState = { ...this.state };
    newState.tab = e.target.className.split('')[0];
    this.setState({
      ...newState,
    });
  }

  flip() {
    // handle card flip front/back
    const newState = { ...this.state };
    newState.flip = !this.state.flip;
    this.setState({
      ...newState,
    }, () => ViewProfile.adjustCardHeight());
  }

  toggleThumb() {
    // handle toggle thumb / full-size view
    const newState = { ...this.state };
    newState.thumb = !this.state.thumb;
    this.setState({
      ...newState,
    });
  }

  handleKeyDown = (e) => {
    // enter key fires flip / expand / toggle tabs when focused
    const action = e.target.className.split('')[0];
    if (e.keyCode === 13 || e.which === 13) {
      switch (action) {
        case 'flip-it':
          this.flip();
          break;
        case 'expand':
        case 'compress':
          this.toggleThumb();
          break;
        case 'skills':
          this.onClick(e);
          break;
        case 'languages':
          this.onClick(e);
          break;
        default:
          return null;
      }
    } return null;
  }


  render() {
    let langDisp;
    let skillsDisp;
    const smArr = [];
    const {
      skills,
      languages,
      twitter,
      facebook,
      link,
      linkedin,
      codepen,
      github,
    } = this.props.profile.currentProfile;
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
    if (github) { smArr.push(['github', github]); }
    if (twitter) { smArr.push(['twitter', twitter]); }
    if (facebook) { smArr.push(['facebook', facebook]); }
    if (link) { smArr.push(['link', link]); }
    if (linkedin) { smArr.push(['linkedin', linkedin]); }
    if (codepen) { smArr.push(['codepen', codepen]); }
    // render social media icons & links for profile card
    const smDisp = smArr.map(sm => (
      <span className="full__icon--sm-wrap" key={sm[0]}>
        <a
          href={sm[1]}
          rel="noopener noreferrer"
          target="_blank"
          className={`full__icon--sm full__icon--${sm[0]}`}
        >
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

    const cardSize = this.state.thumb ? 'thumb' : 'full';
    let owner;
    if (!this.props.match) {
      owner = true;
    } else if (this.props.match && this.props.appState.user._id === this.props.match.params.id) {
      owner = true;
    } else {
      owner = false;
    }
    console.log(`owner: ${owner}`);
    let avatar;
    if (this.props.profile.currentProfile) {
      if (!this.props.profile.currentProfile.avatarUrl) {
        avatar = 'https://raw.githubusercontent.com/ursa-majors/co-ment/master/design/android-chrome-384x384.png';
      } else {
        avatar = this.props.profile.currentProfile.avatarUrl;
      }
    }
    const backgroundStyle = {
      backgroundImage: `url(${avatar})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
    };

    return (
      <div className="view-profile" id="view-profile">
        <Spinner cssClass={`${this.props.profile.profileSpinnerClass}`} />
        <ModalSm
          modalClass={`${this.props.profile.viewProfileModalClass}`}
          modalText={`${this.props.profile.viewProfileModalText}`}
          modalType={this.props.profile.viewProfileModalType}
          modalTitle="PROFILE"
          dismiss={() => this.props.actions.dismissViewProfileModal()}
        />
        {this.props.profile.getSuccess &&
          <div className={cardSize}>
            <div
              className={this.state.flip ? 'side front flip' : 'side front'}
              id="front"
            >
              {!this.state.thumb && owner ?
                <Link
                  className="full__edit"
                  to={`/editprofile/${this.props.appState.user._id}`}
                >
                  <i className="fa fa-pencil full__icon--edit" aria-label="edit" />
                </Link> : ''/* edit link */
            } {/* post owner, full size */}
              <div className={`${cardSize}__top-wrap`}>
                <div className={`${cardSize}__image-wrap`}>
                  <div className={`${cardSize}__image-aspect`}>
                    <div className={`${cardSize}__image-crop`}>
                      <div
                        className={`${cardSize}__image`}
                        style={backgroundStyle}
                        role="img"
                        aria-label={this.props.profile.currentProfile.username}
                      />
                    </div>
                  </div>
                </div> {/* image-wrap */}
                <div className={`${cardSize}__card-top ${cardSize}__text-wrap`}>
                  <div className={`${cardSize}__name`}>
                    {this.props.profile.currentProfile.name}</div>
                  <div className={`${cardSize}__username`}>
                    @{this.props.profile.currentProfile.username}</div>
                  {this.props.profile.currentProfile.location &&
                    <div className={`${cardSize}__location-wrap`}>
                      <i className="fa fa-map-marker full__icon--location" aria-hidden="true" />
                      <span className={`${cardSize}__location`}>
                        {this.props.profile.currentProfile.location} &bull;
                        {this.props.profile.currentProfile.time_zone}</span>
                    </div>}
                </div> {/* text-wrap */}
              </div>
              { !this.state.thumb &&
                <div className="full__card-nav">
                  <button
                    className="skills aria-button"
                    tabIndex={0}
                    onClick={e => this.onClick(e)}
                    onKeyDown={e => this.handleKeyDown(e)}
                  >
                    <div
                      className={this.state.tab === 'skills' ? 'skills full__nav-item full__nav-item--active' : 'skills full__nav-item'}
                    >
                      <i
                        className="skills fa fa-code full__icon--nav"
                        aria-hidden="true"
                      />
                      <span
                        className={this.state.tab === 'skills' ?
                        'skills full__nav-item-text--active' :
                        'skills full__nav-item-text'}
                        id="skills"
                      >Skills</span>
                    </div> {/* skills */}
                  </button>
                  <button
                    className="languages aria-button"
                    tabIndex={0}
                    onClick={e => this.onClick(e)}
                    onKeyDown={e => this.handleKeyDown(e)}
                  >
                    <div
                      className={this.state.tab === 'languages' ?
                      'languages full__nav-item full__nav-item--active' :
                      'languages full__nav-item'}
                    >
                      <i className="languages fa fa-commenting-o full__icon--nav" aria-hidden="true" />
                      <span
                        className={this.state.tab === 'languages' ?
                          'languages full__nav-item-text--active' :
                          'languages full__nav-item-text'}
                        id="languages"
                      >Languages</span>
                    </div> {/* languages */}
                  </button>
                  <button
                    className="about aria-button"
                    tabIndex={0}
                    onClick={() => this.flip()}
                    onKeyDown={e => this.handleKeyDown(e)}
                  >
                    <div
                      className={this.state.tab === 'about' ?
                      'about flip-it full__nav-item full__nav-item--active' :
                      'about flip-it full__nav-item'}
                    >
                      <i className="about fa fa-user full__icon--nav" aria-hidden="true" />
                      <span
                        className={this.state.tab === 'about' ?
                      'about full__nav-item-text--active' :
                      'about full__nav-item-text'}
                        id="about"
                      >About</span>
                    </div> {/* about */}
                  </button>
                </div> /* card-nav */
              } {/* !this.state.thumb */}
              { !this.state.thumb &&
                <div>
                  <div className="full__card-body">
                    {this.state.tab === 'skills' &&
                      <div className="tag-value__wrapper">
                        {skillsDisp || ''}
                      </div>}
                    {this.state.tab === 'languages' &&
                      <div className="tag-value__wrapper">
                        {langDisp || ''}
                      </div>}
                    {this.state.tab === 'about' &&
                      this.props.profile.currentProfile.about &&
                      <div className="tag-value__wrapper">
                        {this.props.profile.currentProfile.about }
                      </div>}
                  </div> {/* full__card-body */}
                  <div className="full__card-footer">
                    {smDisp || ''}
                  </div>
                </div> /* body & footer for full-size view */
              } {/* !this.state.thumb */}
              { this.state.thumb &&
                <div className="thumb__card-body">
                  <div className="tag-value__wrapper">
                    {skillsDisp || ''}
                  </div>
                </div> /* thumb body */
              } {/* this.state.thumb */}
              {this.state.thumb &&
              <div className="thumb__expand">
                <button
                  className="expand fa fa-expand thumb__icon--expand aria-button"
                  aria-label="expand"
                  tabIndex={0}
                  onClick={() => this.toggleThumb()}
                  onKeyDown={e => this.handleKeyDown(e)}
                />
                </div>
            } {/* expand button, thumb only */}
            </div> {/* card front */}
            { !this.state.thumb &&
              <div
                className={this.state.flip ? 'side back flip' : 'side back'}
                id="back"
              >
                <div className="full__text-wrap full__card-top">
                  <div className="full__name">{this.props.profile.currentProfile.name}</div>
                  <div className="full__username">@{this.props.profile.currentProfile.username}</div>
                </div>
                <div className="full__about-wrap">
                  {aboutText}
                </div>
                <div className="full__card-footer--back">
                  <button
                    className="full__card-nav-item--flip aria-button"
                    name="flip"
                    onClick={() => this.flip()}
                  >
                    <i className="fa fa-refresh full__icon--flip" aria-hidden="true" />
                  </button>
                </div>
              </div> /* card back */
            } {/* !thumb */}
          </div> /* pfl card */
        }
      </div> /* view-profile */
    );
  }
}

ViewProfile.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
  appState: PropTypes.shape({
    authToken: PropTypes.string,
    user: PropTypes.shape({
      _id: PropTypes.string,
    }).isRequired,
    windowSize: PropTypes.shape({
      mobile: PropTypes.bool,
    }).isRequired,
  }).isRequired,
  api: PropTypes.shape({
    getProfile: PropTypes.func,
  }).isRequired,
  actions: PropTypes.shape({
    dismissViewProfileModal: PropTypes.func,
    setUpdProfileModal: PropTypes.func,
  }).isRequired,
  profile: PropTypes.shape({
    getSuccess: PropTypes.bool,
    profileSpinnerClass: PropTypes.string,
    viewProfileModalClass: PropTypes.string,
    viewProfileModalText: PropTypes.string,
    viewProfileModalType: PropTypes.string,
    currentProfile: PropTypes.shape({
      languages: PropTypes.array,
      skills: PropTypes.array,
      name: PropTypes.string,
      username: PropTypes.string,
      email: PropTypes.string,
      time_zone: PropTypes.string,
      github: PropTypes.string,
      twitter: PropTypes.string,
      facebook: PropTypes.string,
      link: PropTypes.string,
      codepen: PropTypes.string,
      linkedin: PropTypes.string,
      avatarUrl: PropTypes.string,
      gender: PropTypes.string,
      location: PropTypes.string,
      about: PropTypes.string,
      errMsg: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

ViewProfile.defaultProps = {
  match: null,
};

const mapStateToProps = state => ({
  appState: state.appState,
  profile: state.profiles,
});

const mapDispatchToProps = dispatch => ({
  api: bindActionCreators(apiActions, dispatch),
  actions: bindActionCreators(Actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewProfile);
