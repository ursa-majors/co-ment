import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';

import * as Actions from '../store/actions';
import { languages, skills, timezones } from '../utils';

class Profile extends React.Component {

  constructor(props) {
     super(props);
     this.state = {
      profile: {
          skill: '',
          skills: props.appState.profile.skills || [],
          gender: props.appState.profile.gender || '',
          pref_lang: props.appState.profile.pref_lang || '',
          time_zone: props.appState.profile.time_zone || 'Choose your timezone',
          firstName: props.appState.profile.firstName || '',
          lastName: props.appState.profile.lastName || '',
          ghUserName: props.appState.profile.ghUserName || '',
          avatarUrl: props.appState.profile.avatarUrl || '',
        }
      }
    }

    componentDidMount(){

    }

  getProfile() {
    axios.get(`https://co-ment.glitch.me/api/profile/${this.props.appState.profile._id}`, {
      headers: {
        Authorization: `Bearer ${this.props.appState.authToken}`,
      },
    })
    .then((response) => {
       this.props.actions.updateProfile([response.data]);
       this.setState({
         firstName: props.appState.profile.firstName || '',
         lastName: props.appState.profile.lastName || '',
         ghUserName: props.appState.profile.ghUserName || '',
         avatarUrl: props.appState.profile.avatarUrl || '',
         skills: props.appState.profile.skills || [],
         skill: '',
         gender: props.appState.profile.gender || '',
         pref_lang: props.appState.profile.pref_lang || '',
         time_zone: props.appState.profile.time_zone || 'Choose your timezone',
       });
       this.props.history.push('/posts');
     })
    .catch((error) => {
      console.log('profile error:', error);
    });
  }

  handleSubmit() {

    if (this.state.skill !== '') {
       this.addSkill();
     }

    axios.defaults.baseURL = 'https://co-ment.glitch.me';
    axios.defaults.headers.common['Authorization'] = `Bearer ${this.props.appState.authToken}`;

    axios.post(`/api/profile/${this.props.appState.profile._id}`,
      {
        pref_lang: this.props.appState.profile.pref_lang,
        certs: this.props.appState.profile.certs,
        time_zone: this.props.appState.profile.time_zone,
      })
    .then((response) => {
       this.props.actions.updateProfile([response.data]);
       this.setState({
         firstName: props.appState.profile.firstName || '',
         lastName: props.appState.profile.lastName || '',
         ghUserName: props.appState.profile.ghUserName || '',
         avatarUrl: props.appState.profile.avatarUrl || '',
         skills: props.appState.profile.skills || [],
         skill: '',
         gender: props.appState.profile.gender || '',
         pref_lang: props.appState.profile.pref_lang || '',
         time_zone: props.appState.profile.time_zone || 'Choose your timezone',
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
      // console.log(this.state.profile);
    });
    }

// comma or enter in skill field triggers addSkill
  handleKeyPressAdd(e) {
    if(e.charCode === 44 || e.which === 44 || e.charCode === 13 || e.which === 13) {
      e.preventDefault();
      this.addSkill();
         }
    }

// enter triggers removeSkill on icon/button focus
  handleKeyPressRemove(e) {
if(e.charCode === 13 || e.which === 13) {
  this.removeSkill(e);
     }
}

  addSkill() {
    const profile = { ...this.state.profile }
    const newSkill = profile.skill;
    if (newSkill !== '') {
    for (let i=0; i<profile.skills.length; i++ ) {
      if (profile.skills[i] === newSkill) {
        profile.skill = '';
        this.setState({ profile }, () => {
          // console.log(this.state.profile);
        });
        return;
       }
     }
     profile.skill = '';
     profile.skills = profile.skills.concat(newSkill);
     this.setState({ profile }, ()=> {
          // console.log(this.state.profile);
    });
   }
   }

   removeSkill(e) {
    console.log('remove');
      const profile = { ...this.state.profile }
      let newSkills = profile.skills;
      for (let i = 0; i < profile.skills.length; i++ ) {
       if (profile.skills[i] === e.target.id) {
         newSkills.splice(i, 1);
         profile.skills = newSkills;
         this.setState({ profile });
         break;
       }
     }
   }

  render() {
    const languageList = languages.map(i => (<option key={i}>{i}</option>));
    const skillsList = skills.map(i => (<option key={i}>{i}</option>));
    const tzList = timezones.map(i => (
      <option key={i[1]}>{`(UTC ${i[0]}) ${i[1]}`}</option>
      ));

    return (
      <div className="container form">
        <div className="form__body">
          <div className="form__header">{this.props.appState.profile.username && this.props.appState.profile.username}&apos;s Profile</div>
          <div className="form__input-group">
            <label htmlFor="language" className="sr-only">Preferred Language
            </label>
            <input
              className="form__input"
              list="languageList"
              type="text"
              id="pref_lang"
              name="pref_lang"
              value={this.state.profile.pref_lang}
              onChange={e => this.handleInput(e)}
              placeholder="Preferred language"
            />
            <datalist id="languageList">
              {languageList}
            </datalist>
          </div>

          <div className="form__input-group">
          <label className="sr-only" htmlFor="skills">Skills</label>
          </div>
           <div className="skill-value__wrapper">
             {this.state.profile.skills.map((skill) => {
               return (
                <span className="skill-value" key={skill}>
                  <span className="skill-value__icon" aria-hidden="true">
                    <span
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
               );
             })}
          </div>
          <input
            className="form__input"
            list="skillsList"
            type="text"
            id="skill"
            name="skill"
            value={this.state.profile.skill}
            onChange={e => this.handleInput(e)}
            onKeyPress={e => this.handleKeyPressAdd(e)}
            placeholder="Skills, separated by commas"
          />
          <datalist id="skillsList">
          {skillsList}
          </datalist>
          <div className="form__input-group">
            <label htmlFor="timezone" className="sr-only">Time Zone:</label>
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
        </div>
        <div className="form__input-group">
          <div className="form__button-wrap">
            <button className="form__button pointer" id="btn-edit" onClick={() => this.handleSubmit()}>Save</button>
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
