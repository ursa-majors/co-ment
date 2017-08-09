import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';

import InputAutosuggest from './InputAutosuggest';
import * as Actions from '../store/actions';
import {languages, skills, timezones } from '../utils';

let name;
let avatarUrl;

class Profile extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      profile: {
        skill: '',
        language: '',
        skills: this.props.appState.profile.certs || [],
        gender: this.props.appState.profile.gender || '',
        languages: this.props.appState.profile.languages || [],
        time_zone: this.props.appState.profile.time_zone || 'Choose your timezone',
        name: '',
        ghUserName: this.props.appState.profile.ghUserName || '',
        avatarUrl: '',
      },
      suggestions: [],
      value: '',
    };

    this.handleInput = this.handleInput.bind(this);
    this.onChange = this.onChange.bind(this);
    this.addTag = this.addTag.bind(this);
    this.removeTag = this.removeTag.bind(this);

  }

  componentWillMount() {
    const profile = Object.assign({}, this.state.profile);
    if (this.props.appState.profile.ghProfile) {
      profile.name = this.props.appState.profile.ghProfile.name;
      profile.avatarUrl = this.props.appState.profile.ghProfile.avatar_url;
      this.setState({ profile }, () => {
      });
    }
  }

  getProfile() {
    axios.get(`https://co-ment.glitch.me/api/profile/${this.props.appState.profile._id}`, {
      headers: {
        Authorization: `Bearer ${this.props.appState.authToken}`,
      },
    })
    .then((response) => {
      this.props.actions.updateProfile(response.data.user, () => {
      });
      this.setState({
        profile: {
          skill: '',
          language: '',
          skills: this.props.appState.profile.certs || [],
          gender: this.props.appState.profile.gender || '',
          languages: this.props.appState.profile.languages || [],
          time_zone: this.props.appState.profile.time_zone || 'Choose your timezone',
          name: this.props.appState.profile.ghProfile.name ? this.props.appState.profile.ghProfile.name : '',
          ghUserName: this.props.appState.profile.ghUserName || '',
          avatarUrl: this.props.appState.profile.ghProfile.avatar_url ? this.props.appState.profile.ghProfile.avatar_url : '',
        },
      }, () => {
      });
      this.props.history.push('/posts');
    })
    .catch((error) => {
      console.log('profile error:', error);
    });
  }

  handleSubmit() {
    if (this.state.skill !== '') {
      this.addTag('skill');
    }
    if (this.state.language !== '') {
      this.addTag('language');
    }

    this.props.actions.updateProfile(this.state.profile);

    axios.defaults.baseURL = 'https://co-ment.glitch.me';
    axios.defaults.headers.common.Authorization = `Bearer ${this.props.appState.authToken}`;

    axios.put(`/api/profile/${this.props.appState.profile._id}`,
      {
        languages: this.state.profile.languages,
        certs: this.state.profile.skills,
        time_zone: this.state.profile.time_zone,
        ghUserName: this.state.profile.ghUserName,
      })
    .then((response) => {
      this.props.actions.updateProfile(response.data.user, () => {
        this.setState({
          profile: {
            skill: '',
            language: '',
            skills: this.props.appState.profile.skills,
            gender: this.props.appState.profile.gender || '',
            languages: this.props.appState.profile.languages || '',
            time_zone: this.props.appState.profile.time_zone || 'Choose your timezone',
            name: this.props.appState.profile.ghProfile.name || '',
            ghUserName: this.props.appState.profile.ghUserName || '',
            avatarUrl: this.props.appState.profile.ghProfile.avatar_url || '',
          },
        }, () => {
        });
      });
    })
     .catch((error) => {
       console.log(error);
     });
  }

  handleInput(e) {
    const profile = Object.assign({}, this.state.profile);
    profile[e.target.name] = e.target.value;
    this.setState({ profile }, () => {
    });
  }


// comma or enter or tab in skill field triggers addTag
  handleKeyPressAdd(e) {
    if (e.charCode === 44 || e.which === 44 || e.charCode === 13 || e.which === 13 || e.charCode === 9 || e.which === 9) {
      e.preventDefault();
      this.addTag(e.target.id);
      const profile = Object.assign({}, this.state.profile);
      profile.skill = '';
      profile.language = '';
      this.setState({ profile }, () => {
      });
    }
  }

// enter or delete triggers removeTag on icon/button focus
  handleKeyPressRemove(e) {
    if (e.charCode === 13 || e.which === 13 || e.charCode === 8 || e.which === 8) {
      this.removeTag(e);
    }
  }

  addTag(type) {
    const profile = { ...this.state.profile };
    const newTag = profile[type];
    const list = `${type}s`;
    const inputRef = `${type}Input`;
    if (newTag !== '') {
      for (let i = 0; i < profile[list].length; i++) {
        if (profile[list][i] === newTag) {
          profile[type] = '';
          this.setState({ profile }, () => {
          });
          return;
        }
      }
      profile[list] = profile[list].concat(newTag);
      this.setState({ profile }, () => {
        // console.log(this.state.profile[type]);
      });
    }
    this[inputRef].onSuggestionSelected();
    profile[type] = '';
    this.setState({ profile }, () => {
        // console.log(this.state.profile[type]);
      });
  }

  removeTag(e) {
    const profile = { ...this.state.profile };
    const list = `${e.target.classList[0]}s`
    const newTags = profile[list];
    for (let i = 0; i < profile[list].length; i++) {
      if (profile[list][i] === e.target.id) {
        newTags.splice(i, 1);
        profile[list] = newTags;
        this.setState({ profile });
        break;
      }
    }
  }

  ////// autosuggest functions ///////

   onChange(id, newValue) {
    const profile = Object.assign({}, this.state.profile);
    profile[id] = newValue;
    this.setState({ profile }, () => {
      // console.log('186', this.state.profile[id]);
    });
  }

  render() {
    const languageList = languages.map(i => (<option key={i}>{i}</option>));
    const skillsList = skills.map(i => (<option key={i}>{i}</option>));
    const tzList = timezones.map(i => (
      <option key={i[1]} value={`UTC ${i[0]}`}>{`(UTC ${i[0]}) ${i[1]}`}</option>
      ));
    const skillsDisp = this.state.profile.skills.map(i => (
      <li className="preview__skill-item" key={i}>{i}, </li>));
    const langDisp = this.state.profile.languages.map(i => (
      <li className="preview__skill-item" key={i}>{i}, </li>));


    return (
      <div className="container">
        <div className="preview">
          <div className="preview__image-wrap">
            {this.state.profile.avatarUrl ?
              <img className="preview__image" src={this.state.profile.avatarUrl} alt={this.state.profile.username} /> :
              <i className="fa fa-user-circle fa-5x preview__icon" aria-hidden="true" />
          }
          </div>
          <div className="preview__text-wrap">
            <div className="preview__username">{this.props.appState.profile.username}</div>
            <div className="preview__text">{this.state.profile.name}</div>
            <div className="preview__text">
              <span className="preview__text--bold">Languages: &nbsp;</span>
              {langDisp}
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
              value={this.state.profile.ghUserName}
              onChange={e => this.handleInput(e)}
              placeholder="GitHub User Name"
            />
          </div>
          <div className="form__input-group">
            <label htmlFor="language" className="form__label">Languages you speak fluently
            </label>
          <div className="skill-value__wrapper">
              {this.state.profile.languages.map(lang => (
                <span className="skill-value" key={lang}>
                  <span className="skill-value__icon" aria-hidden="true">
                    <span
                      className="language"
                      id={lang}
                      role="button"
                      tabIndex="0"
                      onClick={this.removeTag}
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
              value={this.state.profile.language}
              addTag={this.addTag}
              removeTag={this.removeTag}
              ref={instance => { this.languageInput = instance; }}
            />
          </div>
          <div className="form__input-group">
            <label className="form__label" htmlFor="skills">Skills</label>
            <div className="skill-value__wrapper">
            {this.state.profile.skills.map(skill => (
              <span className="skill-value" key={skill}>
                <span className="skill-value__icon" aria-hidden="true">
                  <span
                    className="skill"
                    id={skill}
                    role="button"
                    tabIndex="0"
                    onClick={e => this.removeTag(e)}
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
              onKeyPress={e => this.handleKeyPressAdd(e)}
              value={this.state.skill}
              addTag={this.addTag}
              removeTag={this.removeTag}
              ref={instance => { this.skillInput = instance; }}
            />
          </div>
          <div className="form__input-group">
            <label htmlFor="timezone" className="form__label">Time Zone</label>
            <select
              className="form__input form__input--select"
              id="time_zone"
              name="time_zone"
              value={this.state.profile.time_zone}
              onChange={e => this.handleInput(e)}
            >
              <option disabled>Choose your timezone</option>
              {tzList}
            </select>
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
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
