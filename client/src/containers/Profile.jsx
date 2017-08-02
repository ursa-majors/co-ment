import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import * as Actions from '../store/actions';

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

  render() {
    return (
      <div className="container form">
        <div className="form__body">
          <div className="form__header">{this.props.appState.profile.username}&apos;s Profile</div>
          <div className="form__input-group">
            <label htmlFor="language">Preferred Language:
              <input className="form__input" type="text" id="language" value={this.props.appState.profile.pref_lang} onChange={event => this.handleChange(event)} />
            </label>
          </div>
          <div className="form__input-group">
            <label htmlFor="certs">Certifications:
              <input className="form__input" type="text" id="certs" value={this.props.appState.profile.certs} onChange={event => this.handleChange(event)} />
            </label>
          </div>
          <div className="form__input-group">
            <label htmlFor="timezone">Time Zone:
              <input className="form__input" type="text" id="timezone" value={this.props.appState.profile.time_zone} onChange={event => this.handleChange(event)} />
            </label>
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
