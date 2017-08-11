import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../store/actions/profileActions';
import * as apiActions from '../store/actions/apiActions';

import InputAutosuggest from './InputAutosuggest';
import {languages, skills, timezones } from '../utils';

class Profile extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      suggestions: [],
      value: '',
    };

    this.onChange = this.onChange.bind(this);
    this.addLanguage = this.addLanguage.bind(this);
    this.addSkill = this.addSkill.bind(this);
    this.removeLanguage = this.removeLanguage.bind(this);
    this.removeSkill = this.removeSkill.bind(this);
  }

  // componentWillMount() {
  //   const profile = Object.assign({}, this.state.profile);
  //   if (this.props.appState.profile.ghProfile) {
  //     profile.name = this.props.appState.profile.ghProfile.name;
  //     if (!this.props.appState.profile.avatarUrl) {
  //       profile.avatarUrl = this.props.appState.profile.ghProfile.avatar_url;
  //     }
  //     if (!this.props.appState.profile.name) {
  //       profile.name = this.props.appState.profile.ghProfile.name;
  //     }
  //     this.setState({ profile }, () => {
  //     });
  //   }
  // }
  //
  componentDidMount() {
  if (this.props.match.params.id) {
    // copy the current profile properties into the editable object
    this.props.actions.setEditProfile(this.props.profiles.currentProfile);
  }
}

  // Add Tags on Comma or Enter
  handleKeyPressAdd(e) {
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

  handleInput(e) {
    this.props.actions.setFormField(e.target.name, e.target.value);
  }

  handleSelectChange(e) {
    this.props.actions.setFormField('gender', e.target.value);
  }

  addLanguage() {
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
    const newSkill = this.props.profiles.editForm.skill;
    for (let i = 0; i < this.props.profiles.editForm.skills.length; i ++ ) {
      if (this.props.profiles.editForm.skills[i] === newSkill) {
        this.props.actions.setFormField('skill', '');
        return;
      }
    }
    console.log(`sending ${newSkill} to actions.addSkill`);
    this.props.actions.addSkill(newSkill);
  }

  handleKeyPressRemove(e) {
    if (e.charCode === 13 || e.which === 13 || e.charCode === 8 || e.which === 8) {
      const type = e.target.className;
      console.log(`remove ${type} via keypress`);
      if (type === 'language') {
        this.removeLanguage(e);
      } else if (type === 'skill') {
        this.removeSkill(e);
      }
    }
  }

 removeLanguage(e) {
  const newArray = this.props.profiles.editForm.languages;
  for (let i = 0; i < this.props.profiles.editForm.languages.length; i ++ ) {
    if (this.props.profiles.editForm.languages[i] === e.target.id) {
      this.props.actions.removeLanguage(i);
      break;
    }
  }
}

removeSkill(e) {
  const newArray = this.props.profiles.editForm.skills;
  for (let i = 0; i < this.props.profiles.editForm.skills.length; i ++ ) {
    if (this.props.profiles.editForm.skills[i] === e.target.id) {
      this.props.actions.removeSkill(i);
      break;
    }
  }
}

  validateInputs() {
    let msg = '';
    if (this.props.profiles.editForm.name === '') {
      msg = 'Name is required.  ';
    }
    if (this.props.profiles.editForm.time_zone === 'Choose your time zone' || this.props.profiles.editForm.time_zone === '') {
      msg = 'Time zone is required.  ';
    }
    if (this.props.profiles.editForm.skills.length === 0) {
      msg += 'At least one skill is required. ';
    }
    if (this.props.profiles.editForm.languages.length === 0) {
        msg += 'At least one language is required. ';
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
    };

    if (this.props.profiles.editForm.update) {
      this.props.api.modifyProfile(this.props.appState.authToken, this.props.match.params.id, body);
    } else {
      this.props.api.addProfile(this.props.appState.authToken, body);
    }

    // this.props.history.push('/posts');
  }

  ////// autosuggest functions ///////

   onChange(id, newValue) {
    this.props.actions.setFormField(id, newValue);
  }

  render() {
    const languageList = languages.map(i => (<option key={i}>{i}</option>));
    const skillsList = skills.map(i => (<option key={i}>{i}</option>));
    const tzList = timezones.map(i => (
      <option key={i[1]} value={`UTC ${i[0]}`}>{`(UTC ${i[0]}) ${i[1]}`}</option>
      ));
    if (this.props.appState.profile.skills && this.props.appState.profile.languages) {
      const skillsDisp = this.props.appState.profile.skills.join(', ');
      const langDisp = this.props.appState.profile.languages.join(', ');
    }


    return (
      <div className="container profile">
        <div className="preview">
          <div className="preview__image-wrap">
            {this.props.profiles.editForm.avatarUrl ?
              <img className="preview__image" src={this.props.appState.profile.avatarUrl} alt={this.props.appState.profile.username} /> :
              <i className="fa fa-user-circle fa-5x preview__icon" aria-hidden="true" />
          }
          </div>
          <div className="preview__text-wrap">
            <div className="preview__username">{this.props.appState.profile.username}</div>
            <div className="preview__text">{this.props.appState.profile.name}</div>
            <div className="preview__text">
              <span className="preview__text--bold">Languages: &nbsp;</span>
              {/*langDisp*/}
            </div>
            <div className="preview__text">
              <span className="preview__text--bold">Time zone: &nbsp;</span>
              {this.props.appState.profile.time_zone}
            </div>
            <div className="preview__text">
              <span className="preview__text--bold">Gender: &nbsp;</span>
              {this.props.appState.profile.gender}
            </div>
            <div className="preview__text">
              <span className="preview__text--bold">Skills: &nbsp;</span>
              <ul className="preview__skill-list">{/*skillsDisp*/}</ul>
            </div>
          </div>
        </div>
        <div className="form__body">
          <div className="form__header">Update Profile</div>
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
              placeholder="GitHub User Name"
            />
          </div>
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
                      onKeyPress={e => this.handleKeyPressRemove(e)}
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
                    onKeyPress={e => this.handleKeyPressRemove(e)}
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
          <div className="form__input-group" onChange={(e) => this.handleSelectChange(e)}>
            <label htmlFor="gender" className="form__label">Gender</label>
            <div className="form__input--radio-group">
              <input className="form__input--radio" type="radio" name="gender" value="Male" />
              <span className="form__input--radio-label">Male</span>
              <input className="form__input--radio" type="radio" name="gender" value="Female" />
              <span className="form__input--radio-label">Female</span>
              <input className="form__input--radio" type="radio" name="gender" value="Other" />
              <span className="form__input--radio-label">Other</span>
            </div>
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
              placeholder="Paste URL here"
            />
          </div>
          <div className="form__input-group">
            <div className={`form__error ${this.props.profiles.editForm.hideErr}`}>{this.props.profiles.editForm.errMsg}</div>
          </div>
          <div className="form__input-group">
          <div className="form__button-wrap">
            <button className="form__button pointer" id="btn-edit" onClick={() => this.handleSubmit()}>Save</button>
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
