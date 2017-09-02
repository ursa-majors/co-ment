import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

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
    if (this.props.match.params.id) {
     profileId = this.props.match.params.id;
    } else {
     profileId = this.props.appState.userId;
    }
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
    }, ()=>ViewProfile.adjustCardHeight())
  }

  toggleThumb() {
    // handle toggle thumb / full-size view
    const newState = { ...this.state };
    newState.thumb = !this.state.thumb;
    this.setState({
      ...newState,
    })
  }

  handleKeyDown = (e) => {
    // enter key fires flip / expand / toggle tabs when focused
    const action = e.target.className.split(" ")[0];
    console.log(action);
    if (e.keyCode === 13 || e.which === 13 ) {
      console.log('enter');
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
        default:
          return null;
      }
    }

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
                <span className="full__icon--sm-wrap" key={sm[0]}>
                  <a
                    href={sm[1]}
                    rel="noopener noreferrer"
                    target="_blank"
                    className={`full__icon--sm full__icon--${sm[0]}`}>
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

    let cardSize = this.state.thumb ? 'thumb' : 'full';

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
            <div className={this.state.flip ? "side front flip" : "side front"} id="front">
            { !this.state.thumb &&
              <Link
                className="full__edit"
                to={'/profile'} >
                <i className="fa fa-pencil full__icon--edit" aria-label="edit" />
              </Link> /* edit link */
            } {/* post owner, full size */}
            {/* !this.state.thumb &&
              <div className="thumb__compress">
                <i className="compress fa fa-compress thumb__icon--compress"
                  aria-label="compress"
                  tabIndex={0}
                  onClick={()=>this.toggleThumb()}
                  onKeyDown={(e)=>this.handleKeyDown(e)}/>
                </div>
            } {/* compress button, full only */}
            <div className={`${cardSize}__top-wrap`}>
              <div className={`${cardSize}__image-wrap`}>
                {this.props.profile.currentProfile.avatarUrl ?
                  <img
                    className={`${cardSize}__image`}
                    src={this.props.profile.currentProfile.avatarUrl}
                    alt={this.props.profile.currentProfile.username} /> :
                  <i
                    className={`fa-user-circle fa-5x ${cardSize}__icon--avatar`}
                    aria-hidden="true" />
                }
              </div> {/* images-wrap */}
              <div className={`${cardSize}__card-top ${cardSize}__text-wrap`}>
                <div className={`${cardSize}__name`}>
                  {this.props.profile.currentProfile.name}</div>
                <div className={`${cardSize}__username`}>
                  @{this.props.profile.currentProfile.username}</div>
                {this.props.profile.currentProfile.location &&
                  <div className={`${cardSize}__location-wrap`}>
                    <i className="fa fa-map-marker full__icon--location" aria-hidden="true" />
                    <span className={`${cardSize}__location`}>
                    {this.props.profile.currentProfile.location} &bull; {this.props.profile.currentProfile.time_zone}</span>
                  </div>}
              </div> {/* text-wrap */}
              </div>
              { !this.state.thumb &&
                <div className={"full__card-nav"}>
                  <div
                    className={this.state.tab === 'skills' ? 'skills full__nav-item full__nav-item--active' : 'skills full__nav-item'}
                    name='skills'
                    tabIndex={0}
                    onClick={e => this.onClick(e)}
                    onKeyDown={(e)=>this.handleKeyDown(e)}>
                    <i className="fa fa-code full__icon--nav" aria-hidden="true" />
                    <span
                      className={this.state.tab === 'skills' ?
                      'full__nav-item-text--active' :
                      'full__nav-item-text'}
                      id='skills'>Skills</span>
                  </div> {/* skills */}
                  <div
                    className={this.state.tab === 'languages' ?
                    'languages full__nav-item full__nav-item--active':
                    'languages full__nav-item'}
                    name='languages'
                    tabIndex={0}
                    onClick={e => this.onClick(e)}
                    onKeyDown={(e)=>this.handleKeyDown(e)}
                    >
                    <i className="fa fa-commenting-o full__icon--nav" aria-hidden="true" />
                    <span
                      className={this.state.tab === 'languages' ?
                        'full__nav-item-text--active' :
                        'full__nav-item-text'}
                      id='languages'>Languages</span>
                  </div> {/* languages */}
                  <div
                    className={this.state.tab === 'about' ?
                    'flip-it full__nav-item full__nav-item--active' :
                    'flip-it full__nav-item'}
                    name='about'
                    tabIndex={0}
                    onClick={e => this.flip()}
                    onKeyDown={(e)=>this.handleKeyDown(e)}>
                    <i className="fa fa-user full__icon--nav" aria-hidden="true" />
                    <span className={this.state.tab === 'about' ?
                    'full__nav-item-text--active' :
                    'full__nav-item-text'}
                    id='about'>About</span>
                  </div> {/* about */}
                </div> /* card-nav */
              } {/* !this.state.thumb */}
              { !this.state.thumb &&
                <div>
                <div className="full__card-body">
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
                  </div> {/* full__card-body */}
                  <div className="full__card-footer">
                    {smDisp ? smDisp : ''}
                  </div>
                </div> /* body & footer for full-size view */
              } {/* !this.state.thumb */}
              { this.state.thumb &&
                <div className="thumb__card-body">
                  <div className="tag-value__wrapper">
                    {skillsDisp ? skillsDisp : ''}
                  </div>
                </div> /* thumb body */
              } {/* this.state.thumb */}
              {this.state.thumb &&
              <div className="thumb__expand">
                <i className="expand fa fa-expand thumb__icon--expand"
                  aria-label="expand"
                  tabIndex={0}
                  onClick={()=>this.toggleThumb()}
                  onKeyDown={(e)=>this.handleKeyDown(e)}/>
                </div>
            } {/* expand button, thumb only */}
            </div> {/* card front */}
            { !this.state.thumb &&
              <div className={this.state.flip ? "side back flip" : "side back"} id="back">
                <div className="full__text-wrap full__card-top">
                  <div className="full__name">{this.props.profile.currentProfile.name}</div>
                  <div className="full__username">@{this.props.profile.currentProfile.username}</div>
                </div>
                <div className="full__about-wrap">
                  {aboutText}
                </div>
                <div className="full__card-footer--back">
                  <div
                    className='full__card-nav-item--flip'
                    name='flip'
                    onClick={e => this.flip()}>
                    <i className="fa fa-refresh full__icon--flip" aria-hidden="true" />
                  </div>
                </div>
              </div> /* card back */
            } {/* !thumb */}
          </div> /* pfl card */
        }
      </div> /* view-profile */
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
