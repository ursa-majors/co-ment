import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';

import * as Actions from '../store/actions';
import { languages, skills, timezones } from '../utils';

class Profile extends React.Component {

  refreshProfile() {
    axios.get(`https://co-ment.glitch.me/api/profile/${this.props.appState.profile._id}`, {
      headers: {
        Authorization: `Bearer ${this.props.appState.authToken}`,
      },
    })
    .then((response) => {
      this.props.actions.updateProfile(response.data);
    })
    .catch((error) => {
      console.log('profile error:', error);
    });
  }

  handleSave() {
    // call the save profile action
  }

  handleInput(e) {
    switch (e.target.id) {
      case 'language':
        this.props.actions.setProfileLanguage(e.target.value);
        break;
      case 'skills':
        this.props.actions.setProfileSkills(e.target.value);
        break;
      case 'timezone':
        this.props.actions.setProfileTimezone(e.target.value);
        break;
      default:
        break;
    }
  }

  render() {
    const languageList = languages.map(i => (<option key={i}>{i}</option>));
    const skillsList = skills.map(i => (<option key={i}>{i}</option>));
    const tzList = timezones.map(i => (
      i[0] === '+0' ? <option key={i[1]} selected>{`(UTC ${i[0]}) ${i[1]}`}</option> :
      <option key={i[1]}>{`(UTC ${i[0]}) ${i[1]}`}</option>
      ));

    return (
      <div className="container form">
        <div className="form__body">
          <div className="form__header">{this.props.appState.profile.username}&apos;s Profile</div>
          <div className="form__input-group">
            <label htmlFor="language" className="sr-only">Preferred Language
            </label>
            <input
              className="form__input awesomplete"
              list="languageList"
              type="text"
              id="language"
              value={this.props.appState.profile.pref_lang}
              onChange={e => this.handleInput(e)}
              placeholder="Preferred language"
            />
            <datalist id="languageList">
              {languageList}
            </datalist>
          </div>
          <div className="form__input-group">
            <label htmlFor="certs" className="sr-only">Skills</label>
            <input
              className="form__input awesomplete"
              list="skillsList"
              type="text"
              id="skills"
              value={this.props.appState.profile.certs}
              onChange={e => this.handleInput(e)}
              placeholder="Skills (separate with commas)"
            />
            <datalist id="skillsList">
              {skillsList}
            </datalist>

          </div>
          <div className="form__input-group">
            <label htmlFor="timezone" className="sr-only">Time Zone:</label>
            <select
              className="form__input"
              id="timezone"
              value={this.props.appState.profile.time_zone}
              onChange={e => this.handleInput(e)}
            >
              {tzList}
            </select>
          </div>
        </div>
        <div className="form__input-group">
          <div className="form__button-wrap">
            <button className="splash__button pointer" id="btn-edit" onClick={() => this.handleSave()}>&nbsp;&nbsp;&nbsp;Save&nbsp;&nbsp;&nbsp;</button>
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
