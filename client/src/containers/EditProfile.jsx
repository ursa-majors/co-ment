import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../store/actions/profileActions';
import * as apiActions from '../store/actions/apiActions';

import InputAutosuggest from './InputAutosuggest';
import RadioGroup from './RadioGroup';
import Spinner from '../containers/Spinner';
import ModalSm from '../containers/ModalSm';
import { languages, skills, timezones } from '../utils';
import parseSKill from '../utils/skillsparser';

class EditProfile extends React.Component {

  static adjustTextArea(target) {
    // expand input height to fit content without scrollbar
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
      page: 1,
    };

    this.onChange = this.onChange.bind(this);
    this.addLanguage = this.addLanguage.bind(this);
    this.addSkill = this.addSkill.bind(this);
    this.removeLanguage = this.removeLanguage.bind(this);
    this.removeSkill = this.removeSkill.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  componentWillMount() {
    // copy the current profile properties into the editable object
    this.props.actions.setEditProfile(this.props.profiles.userProfile);
    // show error messages for users that are not validated yet.
    if (!this.props.profiles.userProfile.validated) {
      const msg = 'You need to validate your account before you can access this resource. Check your inbox for a validation email.';
      this.props.actions.setFormField('errMsg', msg);
      this.props.actions.setFormField('hideErr', '');
    }
  }

  togglePage(direction) {
    // navigate between form pages
    const newState = { ...this.state }
    if (direction === 'fwd') {
      newState.page = this.state.page + 1;
    } else {
      newState.page = this.state.page - 1;
    }
    this.setState({ ...newState }, () => {
      if (this.state.page === 2) {
        EditProfile.adjustTextArea(this.textInput);
      }
    });
  }

  handleInput = (e) => {
    // // send form field values to editForm object
    this.props.actions.setFormField(e.target.name, e.target.value);
  }

  handleTextAreaInput(e) {
    // limit length to 620 characters
     if (e.target.value.length > 620) {
      return null;
    } else {
      // handle input
      this.props.actions.setFormField(e.target.name, e.target.value);
      // expand textarea height to match content
      EditProfile.adjustTextArea(e.target);
    }
  }

  handleRadioChange(e) {
    // handle radio group value change
    this.props.actions.setFormField('gender', e.target.value);
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
    if (e.keyCode === 13 || e.which === 13 || e.keyCode === 8 || e.which === 8) {
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
    for (let i = 0; i < this.props.profiles.editForm.languages.length; i += 1) {
      if (this.props.profiles.editForm.languages[i] === e.target.id) {
        this.props.actions.removeLanguage(i);
        break;
      }
    }
  }

  removeSkill(e) {
    // remove skill from array
    for (let i = 0; i < this.props.profiles.editForm.skills.length; i += 1) {
      if (this.props.profiles.editForm.skills[i] === e.target.id) {
        this.props.actions.removeSkill(i);
        break;
      }
    }
  }

  validateInputs() {
    let msg = '';
    if (!this.props.profiles.userProfile.validated) {
      msg = 'You need to validate your account before you can access this resource. Check your inbox for a validation email.';
    }
    if (this.props.profiles.editForm.name === '') {
      msg += 'Name is required.  ';
    }
    if (this.props.profiles.editForm.email === '') {
      msg += 'Email is required.  ';
    }
    if (this.props.profiles.editForm.time_zone === 'Choose your time zone' || this.props.profiles.editForm.time_zone === '') {
      msg += 'Time zone is required.  ';
    }
    if (this.props.profiles.editForm.skills.length === 0) {
      msg += 'At least one skill is required.  ';
    }
    if (this.props.profiles.editForm.languages.length === 0) {
      msg += 'At least one language is required.  ';
    }

    // use html5 validation to check for valid urls in social media fields
    if (this.props.profiles.editForm.github && document.getElementById('github').checkValidity() === false) {
      msg += 'Github URL is invalid.  ';
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
    if (this.props.profiles.editForm.avatarUrl === '') {
      this.props.actions.setFormField('avatarUrl', 'https://cdn.glitch.com/4965fcd8-26e0-4a69-a667-bb075062e086%2Fandroid-chrome-384x384.png?1504907183396')
      msg += 'Avatar URL is required. Click save again to use our default.';
    }
    if (msg.length > 0) {
      this.props.actions.setFormField( 'errMsg', msg);
      this.props.actions.setFormField( 'hideErr', '');
      return false;
    }
    return true;
  }

  resendEmail = () => {
    this.props.api.resendAcctValidation(this.props.appState.authToken);
  }

  handleSubmit() {
    // clear previous errors
    this.props.actions.setFormField('hideErr', 'hidden');
    this.props.actions.setFormField('errMsg', '');

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
      email: this.props.profiles.editForm.email,
      name: this.props.profiles.editForm.name,
      languages: this.props.profiles.editForm.languages,
      skills: this.props.profiles.editForm.skills,
      time_zone: this.props.profiles.editForm.time_zone,
      gender: this.props.profiles.editForm.gender,
      avatarUrl: this.props.profiles.editForm.avatarUrl,
      location: this.props.profiles.editForm.location,
      about: this.props.profiles.editForm.about,
      github: this.props.profiles.editForm.github,
      twitter: this.props.profiles.editForm.twitter,
      facebook: this.props.profiles.editForm.facebook,
      link: this.props.profiles.editForm.link,
      linkedin: this.props.profiles.editForm.linkedin,
      codepen: this.props.profiles.editForm.codepen,
    };
    console.log('form submit body:')
    console.log(body);

    // write data to db
    this.props.api.modifyProfile(this.props.appState.authToken, this.props.appState.userId, body)
      .then(result => {
        // redirect to profile card if successful
        if (result.type === 'MODIFY_PROFILE_SUCCESS') {
          this.props.history.push(`/viewprofile/${this.props.appState.userId}`);
        }
      })
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
      <Spinner cssClass={this.props.profiles.updProfileSpinnerClass} />
        <ModalSm
          modalClass={this.props.profiles.updProfileModal.class}
          modalText={this.props.profiles.updProfileModal.text}
          modalType={this.props.profiles.updProfileModal.type}
          modalTitle={this.props.profiles.updProfileModal.title}
          dismiss={
            () => {
              this.props.actions.setUpdProfileModal({
                type: '',
                text: '',
                title: '',
                class: 'modal__hide',
              });
            }
          }
        />
        <div className="profile__body">
          <div className="form__header">
            {this.props.appState.windowSize.mobile ? '' : 'Update Profile: '}
            {this.props.profiles.userProfile.username}
          </div>
          <div className="profile__column-wrap">
          {this.state.page === 1 &&
            <div className="profile__pageOne">
              <div className="profile__column-L">
                <div className="form__input-group">
                  <label htmlFor="email" className="form__label">Email
                  </label>
                  <input
                    className="form__input"
                    type="email"
                    placeholder="Email"
                    id="email"
                    name="email"
                    value={this.props.profiles.editForm.email || ''}
                    onChange={e => this.handleInput(e)} required />
                </div>
                <div className="form__input-group">
                  <label htmlFor="name" className="form__label">Full name
                  </label>
                  <input
                    className="form__input"
                    type="text"
                    id="name"
                    name="name"
                    value={this.props.profiles.editForm.name || ''}
                    onChange={e => this.handleInput(e)}
                    placeholder="Full name"
                  />
                </div>
                <div className="form__input-group" >
                  <RadioGroup
                    title={'Gender'}
                    setName={'gender'}
                    type={'radio'}
                    controlFunc={this.handleRadioChange}
                    options={['Male', 'Female', 'Other']}
                    selectedOptions={this.props.profiles.editForm.gender}
                  />
                </div>
              </div>
              <div className="profile__column-R">
                <div className="form__input-group">
                  <label htmlFor="location" className="form__label">Location
                  </label>
                  <input
                    className="form__input"
                    type="text"
                    id="location"
                    name="location"
                    value={this.props.profiles.editForm.location || ''}
                    onChange={e => this.handleInput(e)}
                    placeholder="Location"
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
                <div className="form__input-group">
                  <label htmlFor="name" className="form__label">Link to profile image
                  </label>
                  <input
                    className="form__input"
                    type="text"
                    id="avatarUrl"
                    name="avatarUrl"
                    value={this.props.profiles.editForm.avatarUrl || ''}
                    onChange={e => this.handleInput(e)}
                    placeholder="http://... "
                  />
                </div>
              </div>
            </div>
            }
            {this.state.page === 2 &&
            <div className="profile__pageTwo">
              <div className="profile__column-L">
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
                    onKeyPress={e => this.handleKeyPressAdd(e)}
                    value={this.props.profiles.editForm.language}
                    addTag={this.addLanguage}
                    removeTag={this.removeLanguage}
                    ref={instance => { this.languageInput = instance; }}
                  />
                </div>
                <div className="form__input-group">
                  <label htmlFor="about" className="form__label">About
                  </label>
                  <textarea
                    className="form__input form__input--textarea"
                    id="about"
                    name="about"
                    value={this.props.profiles.editForm.about}
                    onChange={e => this.handleTextAreaInput(e)}
                    placeholder="Introduce yourself"
                    ref={(input) => { this.textInput = input; }}
                    rows="3"
                  />
                </div>
              </div>
              <div className="profile__column-R">
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
                    onKeyPress={e => this.handleKeyPressAdd(e)}
                    value={this.props.profiles.editForm.skill}
                    addTag={this.addSkill}
                    removeTag={this.removeSkill}
                    ref={instance => { this.skillInput = instance; }}
                  />
                </div>
              </div>
            </div> }
          {this.state.page === 3 &&
            <div className="profile__pageThree">
              <div className="profile__column-L">
                <div className="form__input-group">
                  <label htmlFor="location" className="form__label">GitHub
                  </label>
                  <input
                    className="form__input"
                    type="url"
                    pattern="https?://.+"
                    id="github"
                    name="github"
                    value={this.props.profiles.editForm.github}
                    onChange={e => this.handleInput(e)}
                    placeholder="GitHub URL"
                  />
                </div>
                <div className="form__input-group">
                  <label htmlFor="location" className="form__label">Twitter
                  </label>
                  <input
                    className="form__input"
                    type="url"
                    pattern="https?://.+"
                    id="twitter"
                    name="twitter"
                    value={this.props.profiles.editForm.twitter}
                    onChange={e => this.handleInput(e)}
                    placeholder="Twitter URL"
                  />
                </div>
                <div className="form__input-group">
                  <label htmlFor="location" className="form__label">Facebook
                  </label>
                  <input
                    className="form__input"
                    type="url"
                    pattern="https?://.+"
                    id="facebook"
                    name="facebook"
                    value={this.props.profiles.editForm.facebook}
                    onChange={e => this.handleInput(e)}
                    placeholder="Facebook URL"
                  />
                </div>
              </div>
              <div className="profile__column-R">
                <div className="form__input-group">
                  <label htmlFor="location" className="form__label">LinkedIn
                  </label>
                  <input
                    className="form__input"
                    type="url"
                    pattern="https?://.+"
                    id="linkedin"
                    name="linkedin"
                    value={this.props.profiles.editForm.linkedin}
                    onChange={e => this.handleInput(e)}
                    placeholder="LinkedIn URL"
                  />
                </div>
                <div className="form__input-group">
                  <label htmlFor="location" className="form__label">CodePen
                  </label>
                  <input
                    className="form__input"
                    type="url"
                    pattern="https?://.+"
                    id="codepen"
                    name="codepen"
                    value={this.props.profiles.editForm.codepen}
                    onChange={e => this.handleInput(e)}
                    placeholder="CodePen URL"
                  />
                </div>
                <div className="form__input-group">
                  <label htmlFor="location" className="form__label">Portfolio link
                  </label>
                  <input
                    className="form__input"
                    type="url"
                    pattern="https?://.+"
                    id="link"
                    name="link"
                    value={this.props.profiles.editForm.link}
                    onChange={e => this.handleInput(e)}
                    placeholder="Portfolio URL"
                  />
                </div>
              </div>
            </div>
            }
          </div>
          <div className="form__input-group">
            <div className={formError}>
              {this.props.profiles.editForm.errMsg}
            </div>
          </div>
          {this.state.page > 1 && this.props.profiles.userProfile.validated &&
            <button
              className="pageBack pageNav"
              onClick={()=>this.togglePage('back')}
            >
              <i className="fa fa-chevron-left pageBack__icon" aria-hidden="true" />
            </button>
          }

          <div className="form__input-group">
            <div className="form__button-wrap">
              {
                this.props.profiles.userProfile.validated  && this.state.page === 3 ?
                  (
                    <button className="form__button pointer" id="btn-edit" onClick={() => this.handleSubmit()}>
                      {this.props.profiles.savingProfile ? 'Saving...' : 'Save'}
                    </button>
                  )
                  : !this.props.profiles.userProfile.validated ?
                  (
                    <button className="form__button pointer" id="btn-edit" onClick={() => this.resendEmail()}>
                      Resend Acct Validation
                    </button>
                  )
                  : ('')
              }
            </div>
          </div>
          {this.state.page < 3 && this.props.profiles.userProfile.validated &&
            <button
              className="pageFwd pageNav"
              onClick={() => this.togglePage('fwd')}
            >
              <i className="fa fa-chevron-right pageBack__icon" aria-hidden="true" />
            </button>
          }
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

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
