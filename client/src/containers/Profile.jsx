import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../store/actions/profileActions';
import * as apiActions from '../store/actions/apiActions';

import InputAutosuggest from './InputAutosuggest';
import SocMedia from './SocMedia';
import RadioGroup from './RadioGroup';
import {languages, skills, timezones } from '../utils';
import parseSKill from '../utils/skillsparser';

class Profile extends React.Component {

  static adjustTextArea(target) {
    const el = target;
    let adjustedHeight = el.clientHeight;
    adjustedHeight = Math.max(el.scrollHeight, adjustedHeight);
    if (adjustedHeight > el.clientHeight) { el.style.height = `${adjustedHeight + 20}px`; }
  }

  constructor(props) {
    super(props);

    this.state = {
      suggestions: [],
      value: '',
      showFields: false,
      pageOne: true,
    };

    this.onChange = this.onChange.bind(this);
    this.addLanguage = this.addLanguage.bind(this);
    this.addSkill = this.addSkill.bind(this);
    this.removeLanguage = this.removeLanguage.bind(this);
    this.removeSkill = this.removeSkill.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
  }

  componentWillMount() {
    // copy the current profile properties into the editable object
    this.props.actions.setEditProfile(this.props.profiles.userProfile);
  }

  componentDidMount() {
    // maatch textarea height to content
    Profile.adjustTextArea(this.textInput);
  }

  togglePage(){
    // navigate between form pages
    const newState = { ...this.state }
    newState.pageOne = !this.state.pageOne;
    this.setState({ ...newState });
  }

  handleInput(e) {
    // send form field values to editForm object
    this.props.actions.setFormField(e.target.name, e.target.value);
  }

  handleTextAreaInput(e) {
    // handle input and expand textarea height to match content
    this.props.actions.setFormField(e.target.name, e.target.value);
    Profile.adjustTextArea(e.target);
  }

  handleRadioChange(e) {
    // handle radio group value change
    this.props.actions.setFormField('gender', e.target.value);
  }

  checkGHProfile(e) {
    // check to see if user has entered valid github username.
    // if field is empty or gh profile not found, display optional form fields (full name, location, avatar url).
    // if field is filled but no profile found, display error message (TODO)
    if (e.target.value) {
      const ghProfile = this.props.api.githubProfile(e.target.value);
      console.log(ghProfile);
      const newState = { ...this.state };
      this.setState({ ...newState, showFields: false, });
      if (ghProfile === undefined || this.props.profiles.getGHError) {
        console.log('user not found');
        // need error handling here
        const newState = { ...this.state };
        this.setState({ ...newState, showFields: true, });
      }
    } else {
        const newState = { ...this.state };
        this.setState({ ...newState, showFields: true, });
      }
  }

  addLanguage() {
    // add field value to array of languages, display tags above input field, clear input
    const newLang = this.props.profiles.editForm.language;
    for (let i = 0; i < this.props.profiles.editForm.languages.length; i ++ ) {
      if (this.props.profiles.editForm.languages[i] === newLang) {
        this.props.actions.setFormField('language', '');
        return;
      }
    }
    this.props.actions.addLanguage(newLang);
  }

  addSkill() {
    // add field value to array of skills, display tags above input field, clear input
    const newSkill = this.props.profiles.editForm.skill;
    for (let i = 0; i < this.props.profiles.editForm.skills.length; i ++ ) {
      if (this.props.profiles.editForm.skills[i] === newSkill) {
        this.props.actions.setFormField('skill', '');
        return;
      }
    }
    this.props.actions.addSkill(parseSKill(newSkill));
  }

  handleKeyPressAdd(e) {
    // add tags on comma or enter keypress
    if (e.charCode === 44 || e.which === 44 || e.charCode === 13 || e.which === 13) {
      e.preventDefault();
      const type = e.target.name;
      if (type === 'language') {
        this.addLanguage();
      } else if (type === 'skill') {
        this.addSkill();
      }
    }
  }

  handleKeyDownRemove(e) {
    // when tag label is focused, backspace or enter will remove tag
    if (e.charCode === 13 || e.which === 13 || e.keyCode === 8 || e.which === 8) {
      const type = e.target.className;
      if (type === 'language') {
        this.removeLanguage(e);
      } else if (type === 'skill') {
        this.removeSkill(e);
      }
    }
  }

 removeLanguage(e) {
  // remove language from array
  const newArray = this.props.profiles.editForm.languages;
  for (let i = 0; i < this.props.profiles.editForm.languages.length; i ++ ) {
    if (this.props.profiles.editForm.languages[i] === e.target.id) {
      this.props.actions.removeLanguage(i);
      break;
    }
  }
}

  removeSkill(e) {
    // remove skill from array
    const newArray = this.props.profiles.editForm.skills;
    for (let i = 0; i < this.props.profiles.editForm.skills.length; i ++ ) {
      if (this.props.profiles.editForm.skills[i] === e.target.id) {
        this.props.actions.removeSkill(i);
        break;
      }
    }
  }

  validateInputs() {
    // name is only required if github userName is empty
    let msg = '';
    if (this.props.profiles.editForm.ghUserName === '' && this.props.profiles.editForm.name === '') {
      msg = 'Name is required.  ';
    }
    if (this.props.profiles.editForm.time_zone === 'Choose your time zone' || this.props.profiles.editForm.time_zone === '') {
      msg = 'Time zone is required.  ';
    }
    if (this.props.profiles.editForm.skills.length === 0) {
      msg += 'At least one skill is required.  ';
    }
    if (this.props.profiles.editForm.languages.length === 0) {
        msg += 'At least one language is required.  ';
      }
    if (this.props.profiles.editForm.twitter && document.getElementById('twitter').checkValidity() === false) {
        msg += 'Twitter URL is invalid.  ';
    }
    if (this.props.profiles.editForm.facebook && document.getElementById('facebook').checkValidity() === false) {
        msg += 'Facebook URL is invalid.  ';
    }
    if (this.props.profiles.editForm.link && document.getElementById('link').checkValidity() === false) {
        msg += 'Portfolio URL is invalid.  ';
    }
    if (this.props.profiles.editForm.linkedin && document.getElementById('linkedin').checkValidity() === false) {
        msg += 'LinkedIn URL is invalid.  ';
    }
    if (this.props.profiles.editForm.codepen && document.getElementById('codepen').checkValidity() === false) {
        msg += 'CodePen URL is invalid.  ';
    }
    if (msg.length > 0) {
      this.props.actions.setFormField( 'errMsg', msg);
      this.props.actions.setFormField( 'hideErr', '');
      return false;
    }
    return true;
  }

  handleSubmit() {
    // clear previous errors
    this.props.actions.setFormField('hideErr', 'posts__hidden');

    // if user has entered a tag, but not added it to the array, add it now
    if (this.props.profiles.editForm.skill !== '') {
      this.addSkill();
    }
    if (this.props.profiles.editForm.language !== '') {
      this.addLanguage();
    }

    // check for required fields
    // message will be displayed; exit if validate fails
    if (!this.validateInputs()) { return; }

    const body = {
      ghUserName: this.props.profiles.editForm.ghUserName,
      name: this.props.profiles.editForm.name,
      languages: this.props.profiles.editForm.languages,
      skills: this.props.profiles.editForm.skills,
      time_zone: this.props.profiles.editForm.time_zone,
      gender: this.props.profiles.editForm.gender,
      avatarUrl: this.props.profiles.editForm.avatarUrl,
      location: this.props.profiles.editForm.location,
      about: this.props.profiles.editForm.about,
      twitter: this.props.profiles.editForm.twitter,
      facebook: this.props.profiles.editForm.facebook,
      link: this.props.profiles.editForm.link,
      linkedin: this.props.profiles.editForm.linkedin,
      codepen: this.props.profiles.editForm.codepen,
    };
    console.log('form submit body:')
    console.log(body);

    // write data to db
    this.props.api.modifyProfile(this.props.appState.authToken, this.props.appState.userId, body);

    // redirect to profile card if successful
    this.props.history.push(`/viewprofile/${this.props.appState.userId}`);

  }

  onChange(id, newValue) {
  // handle autosuggest selection
    this.props.actions.setFormField(id, newValue);
  }

  render() {
    let langDisp;
    let skillsDisp;
    let ghProfile;
    let name;
    let avatarUrl;
    const formError = this.props.profiles.editForm.errMsg ? 'error' : 'hidden';
    const msgClass = this.props.profiles.saveError ? 'error' : 'hidden';

    // seed values for autosuggest fields
    const languageList = languages.map(i => (<option key={i}>{i}</option>));
    const skillsList = skills.map(i => (<option key={i}>{i}</option>));

    // render timezone select
    const tzList = timezones.map(i => (
      <option key={i[1]} value={`UTC ${i[0]}`}>{`(UTC ${i[0]}) ${i[1]}`}</option>
      ));

    // render arrays of skills and languages for tag lists
    if (this.props.profiles.editForm.skills && this.props.profiles.editForm.languages) {
       skillsDisp = this.props.profiles.editForm.skills.join(', ');
       langDisp = this.props.profiles.editForm.languages.join(', ');
    }

    return (
      <div className="container profile" id="profile-form">
        <div className="profile__body">
          <div className="form__header">Update Profile: {this.props.profiles.userProfile.username}</div>
          <div className="profile__column-wrap">
          {this.state.pageOne &&
            <div>
            <div className="form__input-group">
              <label htmlFor="ghUserName" className="form__label">GitHub User Name
              </label>
              <input
                className="form__input"
                type="text"
                id="ghUserName"
                name="ghUserName"
                value={this.props.profiles.editForm.ghUserName}
                onChange={e => this.handleInput(e)}
                onBlur={(e) => this.checkGHProfile(e)}
                placeholder="GitHub User Name"
              />
            </div>
            {this.state.showFields &&
              <div>
                <div className="form__input-group">
                  <label htmlFor="name" className="form__label">Full name
                  </label>
                  <input
                    className="form__input"
                    type="text"
                    id="name"
                    name="name"
                    value={this.props.profiles.editForm.name}
                    onChange={e => this.handleInput(e)}
                    placeholder="Full name"
                  />
                </div>
                <div className="form__input-group">
                  <label htmlFor="location" className="form__label">Location
                  </label>
                  <input
                    className="form__input"
                    type="text"
                    id="location"
                    name="location"
                    value={this.props.profiles.editForm.location}
                    onChange={e => this.handleInput(e)}
                    placeholder="Location"
                  />
                </div>
                <div className="form__input-group">
                  <label htmlFor="name" className="form__label">Link to profile image
                  </label>
                  <input
                    className="form__input"
                    type="text"
                    id="avatarUrl"
                    name="avatarUrl"
                    value={this.props.profiles.editForm.avatarUrl}
                    onChange={e => this.handleInput(e)}
                    placeholder="Paste URL to profile image"
                  />
                </div>
              </div>
            }
            <div className="form__input-group">
              <label htmlFor="language" className="form__label">Languages you speak fluently
              </label>
            <div className="skill-value__wrapper">
                {this.props.profiles.editForm.languages && this.props.profiles.editForm.languages.map(lang => (
                  <span className="skill-value" key={lang}>
                    <span className="skill-value__icon" aria-hidden="true">
                      <span
                        className="language"
                        id={lang}
                        role="button"
                        tabIndex="0"
                        onClick={e => this.removeLanguage(e)}
                        onKeyDown={e => this.handleKeyDownRemove(e)}
                      >
                         &times;
                        </span>
                    </span>
                    <span className="skill-value__label" role="option" aria-selected="true">
                      {lang}
                      <span className="skill-aria-only">&nbsp;</span>
                    </span>
                  </span>
                 ))}
              </div>
              <InputAutosuggest
                id="language"
                name="language"
                placeholder="Add Languages"
                onChange={this.onChange}
                list={languages}
                onKeyPress={(e) => this.handleKeyPressAdd(e)}
                value={this.props.profiles.editForm.language}
                addTag={this.addLanguage}
                removeTag={this.removeLanguage}
                ref={instance => { this.languageInput = instance; }}
              />
            </div>
            <div className="form__input-group">
              <label className="form__label" htmlFor="skills">Skills</label>
              <div className="skill-value__wrapper">
              {this.props.profiles.editForm.skills && this.props.profiles.editForm.skills.map(skill => (
                <span className="skill-value" key={skill}>
                  <span className="skill-value__icon" aria-hidden="true">
                    <span
                      className="skill"
                      id={skill}
                      role="button"
                      tabIndex="0"
                      onClick={e => this.removeSkill(e)}
                      onKeyDown={e => this.handleKeyDownRemove(e)}
                    >
                       &times;
                    </span>
                  </span>
                  <span className="skill-value__label" role="option" aria-selected="true">
                    {skill}
                    <span className="skill-aria-only">&nbsp;</span>
                  </span>
                </span>
               ))}
              </div>
              <InputAutosuggest
                id="skill"
                name="skill"
                placeholder="Add Skills"
                onChange={this.onChange}
                list={skills}
                onKeyPress={(e) => this.handleKeyPressAdd(e)}
                value={this.props.profiles.editForm.skill}
                addTag={this.addSkill}
                removeTag={this.removeSkill}
                ref={instance => { this.skillInput = instance; }}
              />
            </div>
            <div className="form__input-group">
              <label htmlFor="timezone" className="form__label">Time Zone</label>
              <select
                className="form__input form__input--select"
                id="time_zone"
                name="time_zone"
                value={this.props.profiles.editForm.time_zone || 'Choose your time zone'}
                onChange={e => this.handleInput(e)}
              >
                <option disabled>Choose your time zone</option>
                {tzList}
              </select>
            </div>
            <div className="form__input-group" >
             <RadioGroup
              title={'Gender'}
              setName={'gender'}
              type={'radio'}
              controlFunc={this.handleRadioChange}
              options={['Male', 'Female', 'Other']}
              selectedOptions={this.props.profiles.editForm.gender} />
            </div>
            <div className="form__input-group">
              <label htmlFor="about" className="form__label">About
              </label>
              <textarea className="form__input form__input--textarea" id="about" name="about" value={this.props.profiles.editForm.about} onChange={e => this.handleTextAreaInput(e)} placeholder="Introduce yourself" ref={(input) => { this.textInput = input; }} rows="3"/>
            </div>
            </div>
          }
          {!this.state.pageOne &&
            <SocMedia
              handleInput={this.handleInput}
              profiles={this.props.profiles}
            /> }
          </div>
          <div className="form__input-group">
            <div className={formError}>{this.props.profiles.editForm.errMsg}</div>
          </div>
          {!this.state.pageOne &&
            <button
              className="pageBack pageNav"
              onClick={()=>this.togglePage()}
              >
              <i className="fa fa-chevron-left pageBack__icon" aria-hidden="true" />
            </button>
          }
          {!this.state.pageOne &&
          <div className="form__input-group">
          <div className="form__button-wrap">
            <button className="form__button pointer" id="btn-edit" onClick={() => this.handleSubmit()}>
            {this.props.profiles.savingProfile ? 'Saving...' : 'Save'}</button>
          </div>
        </div>}
        {this.state.pageOne &&
            <button
              className="pageFwd pageNav"
              onClick={()=>this.togglePage()}
              >
              <i className="fa fa-chevron-right pageBack__icon" aria-hidden="true" />
            </button>
          }
        <div className="form__input-group">
            <div className={msgClass}>
            {this.props.profiles.saveError &&
              this.props.profiles.saveError.message }
            </div>
          </div>
        </div>
        </div>
    );
  }
}

const mapStateToProps = state => ({
  appState: state.appState,
  profiles: state.profiles,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
