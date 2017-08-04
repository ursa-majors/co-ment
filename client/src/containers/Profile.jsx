import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';

import * as Actions from '../store/actions';
import { languages, skills, timezones } from '../utils';

let name;
let avatarUrl;

class Profile extends React.Component {

  constructor(props) {
     super(props);

     this.state = {
      profile: {
          skill: '',
          skills: this.props.appState.profile.certs || [],
          gender: this.props.appState.profile.gender || '',
          pref_lang: this.props.appState.profile.pref_lang || '',
          time_zone: this.props.appState.profile.time_zone || 'Choose your timezone',
          name: '',
          ghUserName: this.props.appState.profile.ghUserName || '',
          avatarUrl: '',
        }
      }
    }

  componentWillMount(){
    const profile = Object.assign({}, this.state.profile);
    if (this.props.appState.profile.ghProfile) {
    profile.name = this.props.appState.profile.ghProfile.name;
    profile.avatarUrl = this.props.appState.profile.ghProfile.avatar_url;
    this.setState({profile}, ()=>{
      console.log('38',this.state.profile.skills);
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
      console.log('39',this.props.appState);
       this.props.actions.updateProfile(response.data.user, () => {
        console.log('41',this.props.appState);
       });
       this.setState({
        profile: {
          skill: '',
          skills: this.props.appState.profile.certs || [],
          gender: this.props.appState.profile.gender || '',
          pref_lang: this.props.appState.profile.pref_lang || '',
          time_zone: this.props.appState.profile.time_zone || 'Choose your timezone',
          name: this.props.appState.profile.ghProfile.name ? this.props.appState.profile.ghProfile.name : '',
          ghUserName: this.props.appState.profile.ghUserName || '',
          avatarUrl: this.props.appState.profile.ghProfile.avatar_url ? this.props.appState.profile.ghProfile.avatar_url : '',
       }
       }, ()=> {
        console.log(this.state.profile)
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
     console.log('70', this.state.profile);
    this.props.actions.updateProfile(this.state.profile, () => {
      console.log('72', this.props.appState.profile);
    });

    axios.defaults.baseURL = 'https://co-ment.glitch.me';
    axios.defaults.headers.common['Authorization'] = `Bearer ${this.props.appState.authToken}`;
    console.log('77', this.state.profile);

    axios.put(`/api/profile/${this.props.appState.profile._id}`,
      {
        pref_lang: this.state.profile.pref_lang,
        certs: this.state.profile.skills,
        time_zone: this.state.profile.time_zone,
        ghUserName: this.state.profile.ghUserName,
      })
    .then((response) => {
      console.log(response.data);
       this.props.actions.updateProfile(response.data.user);
       this.setState({
        profile: {
          skill: '',
          skills: this.props.appState.profile.skills || [],
          gender: this.props.appState.profile.gender || '',
          pref_lang: this.props.appState.profile.pref_lang || '',
          time_zone: this.props.appState.profile.time_zone || 'Choose your timezone',
          name: this.props.appState.profile.ghProfile.name || '',
          ghUserName: this.props.appState.profile.ghUserName || '',
          avatarUrl: this.props.appState.profile.ghProfile.avatar_url || '',
       }
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
    const skillsDisp = this.state.profile.skills.map(i => (
      <li key={i}>{i}, </li>) );

    return (
      <div className="container form">
        <div className="preview">
          <div className="preview__image-wrap">
          {this.state.profile.avatarUrl ?
            <img className="preview__image" src={this.state.profile.avatarUrl} alt={this.state.profile.username}/> :
            <i className="fa fa-user-circle fa-5x preview__icon" aria-hidden="true"></i>
          }
          </div>
          <div className="preview__text-wrap">
            <div className="preview__username">{this.props.appState.profile.username}</div>
            <div className="preview__text">{this.state.profile.name}</div>
            <div className="preview__text">Language: {this.state.profile.pref_lang}</div>
            <div className="preview__text">Skills:
              <ul>{skillsDisp}</ul>
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
            <label htmlFor="language" className="form__label">Preferred Language
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
          <label className="form__label" htmlFor="skills">Skills</label>
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
            placeholder="Add skills"
          />
          <datalist id="skillsList">
          {skillsList}
          </datalist>
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
